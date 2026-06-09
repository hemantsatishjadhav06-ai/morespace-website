// ============================================================================
// Edge Function: enquiry
// Public endpoint. Captures a website/chat enquiry, upserts the contact,
// creates/links a CRM lead, logs a timeline activity. Uses the service role
// key (server-side) so the browser never touches the leads table directly.
// verify_jwt = false (public). Protected by honeypot + light validation.
// ============================================================================
import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

const SOURCES = ["website_form","chatbot","whatsapp","phone","walk_in","referral","portal","campaign"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }

  // Honeypot — bots fill hidden fields; accept silently so they think it worked.
  if (body.company || body.website_hp) return json({ ok: true });

  const str = (v: unknown, n: number) => (v ?? "").toString().trim().slice(0, n) || null;
  const name     = str(body.name, 120);
  const phone    = str(body.phone, 30);
  const email    = str(body.email, 160);
  const message  = str(body.message, 4000);
  const interest = str(body.interest, 160);
  const page_url = str(body.page_url, 500);
  const slug     = str(body.property_slug, 160);
  const source   = SOURCES.includes(String(body.source)) ? String(body.source) : "website_form";

  if (!phone && !email) return json({ error: "Phone or email is required" }, 422);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // Resolve property by slug (optional)
  let property: { id: string; name: string } | null = null;
  if (slug) {
    const { data } = await supabase.from("properties").select("id,name").eq("slug", slug).maybeSingle();
    property = data ?? null;
  }

  // Find or create contact (match on phone or email)
  let contactId: string | null = null;
  const orParts = [phone ? `phone.eq.${phone}` : null, email ? `email.eq.${email}` : null].filter(Boolean).join(",");
  const { data: existing } = await supabase.from("contacts").select("id").or(orParts).limit(1).maybeSingle();
  if (existing) {
    contactId = existing.id;
    await supabase.from("contacts").update({
      full_name: name ?? undefined, email: email ?? undefined, phone: phone ?? undefined, whatsapp: phone ?? undefined,
    }).eq("id", contactId);
  } else {
    const { data: created } = await supabase.from("contacts")
      .insert({ full_name: name, phone, email, whatsapp: phone, source }).select("id").single();
    contactId = created?.id ?? null;
  }

  // Find an open lead for this contact, else create one
  let leadId: string | null = null;
  if (contactId) {
    const { data: openLead } = await supabase.from("leads")
      .select("id,property_id").eq("contact_id", contactId)
      .not("stage", "in", "(won,lost)").order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (openLead) {
      leadId = openLead.id;
      if (property && !openLead.property_id) await supabase.from("leads").update({ property_id: property.id }).eq("id", leadId);
    } else {
      const title = property ? `${property.name} — ${name ?? phone ?? "Lead"}` : `Website enquiry — ${name ?? phone ?? "Lead"}`;
      const { data: lead } = await supabase.from("leads").insert({
        contact_id: contactId, property_id: property?.id ?? null, title, source,
        preferred_config: interest, stage: "new", temperature: "warm",
        next_action: "First call-back within 24h",
        next_action_at: new Date(Date.now() + 864e5).toISOString(),
      }).select("id").single();
      leadId = lead?.id ?? null;
    }
  }

  // Persist the raw enquiry
  const { data: enquiry, error: eErr } = await supabase.from("enquiries").insert({
    lead_id: leadId, contact_id: contactId, property_id: property?.id ?? null,
    name, phone, email, message, interest, source, page_url,
    meta: { ua: req.headers.get("user-agent") ?? null },
  }).select("id").single();
  if (eErr) return json({ error: eErr.message }, 500);

  // Timeline entry
  if (leadId) {
    await supabase.from("activities").insert({
      lead_id: leadId, contact_id: contactId, type: "note",
      title: "New enquiry received",
      body: message ?? `Enquiry via ${source}${property ? " for " + property.name : ""}`,
      meta: { source, property: property?.name ?? null },
    });
  }

  return json({ ok: true, enquiry_id: enquiry?.id ?? null, lead_id: leadId });
});
