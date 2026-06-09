// ============================================================================
// Edge Function: voice-webhook   (ElevenLabs post-call receiver)
// Public webhook. ElevenLabs posts here after an AI call ends. We normalise
// the payload, upsert a call_logs row, and drop a "call" activity on the lead.
// Secure with ELEVENLABS_WEBHOOK_SECRET (sent as x-webhook-secret header).
// verify_jwt = false (webhook).
// ============================================================================
import { createClient } from "jsr:@supabase/supabase-js@2";

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });

const mapStatus = (s: string) => (({
  done: "completed", completed: "completed", success: "completed",
  failed: "failed", busy: "failed", error: "failed",
  "no-answer": "no_answer", no_answer: "no_answer",
  "in-progress": "in_progress", initiated: "ringing", ringing: "ringing",
} as Record<string, string>)[s] ?? "completed");

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const secret = Deno.env.get("ELEVENLABS_WEBHOOK_SECRET");
  if (secret) {
    const got = req.headers.get("x-webhook-secret") ?? req.headers.get("elevenlabs-signature") ?? "";
    if (got !== secret) return json({ error: "Unauthorized" }, 401);
  }

  let body: Record<string, any>;
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }

  const d = body.data ?? body;
  const meta = d.metadata ?? body.metadata ?? {};
  const providerCallId = (d.conversation_id ?? d.call_id ?? d.callId ?? body.conversation_id ?? "").toString() || null;
  const status = (d.status ?? body.status ?? "completed").toString();

  const tx = d.transcript ?? d.transcripts;
  const transcript = typeof tx === "string"
    ? tx
    : Array.isArray(tx)
      ? tx.map((t: any) => `${t.role ?? t.speaker ?? "spk"}: ${t.message ?? t.text ?? ""}`).join("\n")
      : null;
  const summary = d.analysis?.transcript_summary ?? d.summary ?? null;
  const durationSeconds = meta.call_duration_secs ?? d.duration_seconds ?? d.duration ?? null;
  const recordingUrl = d.recording_url ?? d.audio_url ?? null;
  const leadId = meta.lead_id ?? null;
  const contactId = meta.contact_id ?? null;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const patch = {
    status: mapStatus(status), transcript, summary,
    duration_seconds: durationSeconds, recording_url: recordingUrl,
    ended_at: new Date().toISOString(), meta: body,
  };

  let row: { id: string; lead_id: string | null } | null = null;
  if (providerCallId) {
    const { data: existing } = await supabase.from("call_logs").select("id").eq("provider_call_id", providerCallId).maybeSingle();
    if (existing) {
      const { data } = await supabase.from("call_logs").update(patch).eq("id", existing.id).select("id,lead_id").single();
      row = data;
    } else {
      const { data } = await supabase.from("call_logs")
        .insert({ provider: "elevenlabs", direction: "outbound", provider_call_id: providerCallId, lead_id: leadId, contact_id: contactId, ...patch })
        .select("id,lead_id").single();
      row = data;
    }
  } else {
    const { data } = await supabase.from("call_logs")
      .insert({ provider: "elevenlabs", direction: "outbound", lead_id: leadId, contact_id: contactId, ...patch })
      .select("id,lead_id").single();
    row = data;
  }

  if (row?.lead_id) {
    await supabase.from("activities").insert({
      lead_id: row.lead_id, contact_id: contactId, type: "call",
      title: `AI call ${mapStatus(status)}`,
      body: summary ?? (transcript ? transcript.slice(0, 600) : "Call completed"),
      meta: { provider_call_id: providerCallId, duration_seconds: durationSeconds, recording_url: recordingUrl },
    });
    // Nudge the lead forward on a successful conversation
    if (mapStatus(status) === "completed") {
      await supabase.from("leads").update({ last_activity_at: new Date().toISOString() }).eq("id", row.lead_id);
    }
  }

  return json({ ok: true, call_log_id: row?.id ?? null });
});
