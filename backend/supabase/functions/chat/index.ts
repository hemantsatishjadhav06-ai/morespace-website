// ============================================================================
// Edge Function: chat
// Public AI assistant ("Spacey"). Grounded in the live properties table,
// answers buyer questions, captures leads, persists the conversation.
// Calls OpenRouter (set OPENROUTER_API_KEY as a Supabase secret).
// Falls back to a friendly WhatsApp hand-off if no key / provider error.
// verify_jwt = false (public).
// ============================================================================
import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

const WA = "+91 70751 68306";
const FALLBACK =
  `Thanks for reaching out to More Space! Our AI assistant isn't fully switched on yet — ` +
  `but our team can help right away on WhatsApp (${WA}). Tell me your budget and preferred area and I'll pass it along.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }

  const message = (body.message ?? "").toString().trim().slice(0, 2000);
  if (!message) return json({ error: "message is required" }, 422);
  const sessionId   = (body.session_id ?? crypto.randomUUID()).toString().slice(0, 80);
  const pageUrl     = (body.page_url ?? "").toString().slice(0, 500) || null;
  const visitorName = (body.visitor_name ?? "").toString().trim().slice(0, 120) || null;
  const visitorPhone= (body.visitor_phone ?? "").toString().trim().slice(0, 30) || null;
  const history     = Array.isArray(body.history) ? (body.history as unknown[]).slice(-8) : [];

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // Find or create conversation
  let convId: string | null = null;
  const { data: conv } = await supabase.from("chat_conversations").select("id").eq("session_id", sessionId).maybeSingle();
  if (conv) convId = conv.id;
  else {
    const { data: c } = await supabase.from("chat_conversations")
      .insert({ session_id: sessionId, page_url: pageUrl, visitor_name: visitorName, visitor_phone: visitorPhone })
      .select("id").single();
    convId = c?.id ?? null;
  }
  if (convId) await supabase.from("chat_messages").insert({ conversation_id: convId, role: "user", content: message });

  // Ground the model in live inventory
  const { data: props } = await supabase.from("properties")
    .select("name,type,stage,location,config,size_range,price_label,possession,rera,is_upcoming,highlights")
    .eq("status", "published").order("display_order");
  const catalog = (props ?? []).map((p: Record<string, unknown>) => {
    const tag = p.is_upcoming ? "upcoming/pre-launch" : p.stage;
    const hi = Array.isArray(p.highlights) ? (p.highlights as string[]).join("; ") : "";
    return `• ${p.name} [${p.type}, ${tag}] — ${p.location}; ${p.config}; ${p.size_range}; ${p.price_label}; possession ${p.possession}${p.rera ? `; RERA ${p.rera}` : ""}. ${hi}`;
  }).join("\n");

  const system = [
    'You are "Spacey", the warm, sharp assistant for More Space — a premium real-estate advisory in Hyderabad, India.',
    "Rules:",
    "- Use ONLY the PROPERTIES list for specifics (price, size, config, location, possession, RERA). Never invent projects, prices or RERA numbers.",
    "- If asked about something not listed, say you'll connect them with an advisor and offer WhatsApp " + WA + ".",
    "- Be concise and friendly (2-5 sentences). Use Rupee (₹) and Indian formats (Cr, Lakh, sq ft).",
    "- Naturally capture the visitor's name, phone and budget so the team can help. Don't be pushy.",
    "- For site visits or booking, point to WhatsApp " + WA + " or the Contact page.",
    "- You can help with buying, investment, landlord-share and pre-launch options.",
    "",
    "PROPERTIES:",
    catalog,
  ].join("\n");

  const key = Deno.env.get("OPENROUTER_API_KEY");
  const model = Deno.env.get("OPENROUTER_MODEL") ?? "openai/gpt-4o-mini";
  let reply = FALLBACK;
  let aiOk = false;

  if (key) {
    try {
      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://morespace.ai",
          "X-Title": "More Space Assistant",
        },
        body: JSON.stringify({
          model, temperature: 0.4, max_tokens: 450,
          messages: [{ role: "system", content: system }, ...history, { role: "user", content: message }],
        }),
      });
      const data = await r.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) { reply = String(content).trim(); aiOk = true; }
    } catch (_e) { /* keep fallback */ }
  }

  if (convId) await supabase.from("chat_messages")
    .insert({ conversation_id: convId, role: "assistant", content: reply, model: aiOk ? model : "fallback" });

  // Lead capture when the visitor shares a phone number
  if (visitorPhone) {
    const { data: existing } = await supabase.from("contacts").select("id").eq("phone", visitorPhone).maybeSingle();
    let contactId = existing?.id ?? null;
    if (!contactId) {
      const { data: c } = await supabase.from("contacts")
        .insert({ full_name: visitorName, phone: visitorPhone, whatsapp: visitorPhone, source: "chatbot" }).select("id").single();
      contactId = c?.id ?? null;
    }
    if (contactId) {
      const { data: openLead } = await supabase.from("leads").select("id")
        .eq("contact_id", contactId).not("stage", "in", "(won,lost)").limit(1).maybeSingle();
      let leadId = openLead?.id ?? null;
      if (!leadId) {
        const { data: lead } = await supabase.from("leads")
          .insert({ contact_id: contactId, title: `Chatbot — ${visitorName ?? visitorPhone}`, source: "chatbot", stage: "new", temperature: "warm" })
          .select("id").single();
        leadId = lead?.id ?? null;
      }
      if (leadId && convId) await supabase.from("chat_conversations").update({ lead_id: leadId, contact_id: contactId }).eq("id", convId);
    }
  }

  return json({ ok: true, reply, conversation_id: convId, ai: aiOk });
});
