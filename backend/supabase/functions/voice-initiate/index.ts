// ============================================================================
// Edge Function: voice-initiate   (trigger an ElevenLabs outbound AI call)
// Admin-guarded (x-admin-secret == ADMIN_API_SECRET). Creates a queued
// call_logs row; if ElevenLabs creds are configured it places the call,
// otherwise it just queues it (so your CRM / n8n can dispatch later).
// verify_jwt = false (guarded by ADMIN_API_SECRET instead).
//
// Env needed for live calling:
//   ADMIN_API_SECRET            – shared secret your CRM/n8n sends
//   ELEVENLABS_API_KEY          – xi-api-key
//   ELEVENLABS_AGENT_ID         – conversational agent id
//   ELEVENLABS_PHONE_NUMBER_ID  – the registered outbound number id
// ============================================================================
import { createClient } from "jsr:@supabase/supabase-js@2";

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const adminSecret = Deno.env.get("ADMIN_API_SECRET");
  if (!adminSecret || req.headers.get("x-admin-secret") !== adminSecret) {
    return json({ error: "Unauthorized" }, 401);
  }

  let body: Record<string, any>;
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }

  const leadId = body.lead_id ?? null;
  let toNumber = (body.to_number ?? "").toString().trim() || null;
  const contactId = body.contact_id ?? null;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // Resolve phone + contact from the lead if not supplied
  let resolvedContactId = contactId;
  if (!toNumber && leadId) {
    const { data: lead } = await supabase.from("leads").select("contact_id, contacts(phone)").eq("id", leadId).maybeSingle();
    toNumber = (lead as any)?.contacts?.phone ?? null;
    resolvedContactId = resolvedContactId ?? (lead as any)?.contact_id ?? null;
  }
  if (!toNumber) return json({ error: "No phone number to call" }, 422);

  // Queue the call log first (audit trail regardless of provider outcome)
  const { data: callLog } = await supabase.from("call_logs").insert({
    lead_id: leadId, contact_id: resolvedContactId, direction: "outbound",
    provider: "elevenlabs", status: "queued", to_number: toNumber,
    started_at: new Date().toISOString(),
    meta: { requested_by: "voice-initiate", note: body.note ?? null },
  }).select("id").single();

  const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
  const agentId = Deno.env.get("ELEVENLABS_AGENT_ID");
  const phoneNumberId = Deno.env.get("ELEVENLABS_PHONE_NUMBER_ID");

  // No creds yet → leave it queued for later dispatch.
  if (!apiKey || !agentId || !phoneNumberId) {
    return json({ ok: true, queued: true, call_log_id: callLog?.id ?? null,
      note: "Queued. Set ELEVENLABS_API_KEY / ELEVENLABS_AGENT_ID / ELEVENLABS_PHONE_NUMBER_ID to auto-dial." });
  }

  // Place the outbound call via ElevenLabs Conversational AI (Twilio outbound).
  try {
    const res = await fetch("https://api.elevenlabs.io/v1/convai/twilio/outbound-call", {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        agent_id: agentId,
        agent_phone_number_id: phoneNumberId,
        to_number: toNumber,
        conversation_initiation_client_data: {
          metadata: { lead_id: leadId, contact_id: resolvedContactId, call_log_id: callLog?.id ?? null },
        },
      }),
    });
    const data = await res.json().catch(() => ({}));
    const providerCallId = data.conversation_id ?? data.callSid ?? data.call_id ?? null;
    await supabase.from("call_logs").update({
      status: res.ok ? "ringing" : "failed",
      provider_call_id: providerCallId,
      meta: { provider_response: data },
    }).eq("id", callLog?.id);

    if (leadId) {
      await supabase.from("activities").insert({
        lead_id: leadId, contact_id: resolvedContactId, type: "call",
        title: res.ok ? "AI outbound call started" : "AI call failed to start",
        body: `Dialing ${toNumber}`, meta: { provider_call_id: providerCallId },
      });
    }
    return json({ ok: res.ok, call_log_id: callLog?.id ?? null, provider_call_id: providerCallId });
  } catch (e) {
    await supabase.from("call_logs").update({ status: "failed", meta: { error: String(e) } }).eq("id", callLog?.id);
    return json({ ok: false, call_log_id: callLog?.id ?? null, error: String(e) }, 502);
  }
});
