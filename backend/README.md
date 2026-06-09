# More Space — Backend (Supabase)

A production-style backend for the More Space real-estate site: **property
listings, enquiry capture, an AI chatbot, a lead/CRM pipeline, and voice-call
hooks** for ElevenLabs auto-calling.

- **Database:** Supabase Postgres (project `aszxypvnndlzzdmzwkrr`, region `ap-south-1`)
- **APIs:** Supabase Edge Functions (Deno) + PostgREST
- **AI:** OpenRouter (provider-agnostic via `OPENROUTER_MODEL`)
- **Voice:** ElevenLabs Conversational AI (wired, switch on with keys)

> This whole backend was provisioned live. The SQL in `supabase/migrations/`
> is the source of truth and has already been applied.

---

## Data model

| Table | Purpose |
|---|---|
| `properties` | Listing catalogue (14 featured + 4 upcoming, seeded) |
| `contacts` | People (deduped on phone/email) |
| `leads` | CRM opportunity / pipeline card (stage, temperature, score, owner) |
| `enquiries` | Raw inbound captures (form, chatbot, whatsapp…) |
| `activities` | Lead timeline (notes, calls, status changes) |
| `tasks` | Follow-ups (ClickUp-style: status, priority, due, assignee) |
| `chat_conversations` / `chat_messages` | AI chat transcripts |
| `call_logs` | ElevenLabs call records (status, transcript, summary, recording) |
| `profiles` | CRM team members (linked to `auth.users`) |
| `lead_pipeline_summary` (view) | Counts + potential value by stage |

**Pipeline stages:** `new → contacted → qualified → visit_scheduled → negotiation → won / lost`

**Security:** RLS on every table. The public site only ever **reads published
properties** and **writes through Edge Functions** (service-role, server-side).
All CRM tables are restricted to authenticated **staff** (`is_staff()` checks an
active `profiles` row). New `auth.users` auto-get a profile via a trigger.

---

## Edge Functions (live endpoints)

Base: `https://aszxypvnndlzzdmzwkrr.supabase.co/functions/v1`

| Function | Auth | What it does |
|---|---|---|
| `POST /enquiry` | public | Validates + de-dupes, upserts contact, creates/links a lead, logs an activity. Honeypot-protected. |
| `POST /chat` | public | "Spacey" assistant grounded in live `properties`; persists the conversation; captures a lead if a phone is shared. Uses OpenRouter; graceful WhatsApp fallback if no key. |
| `POST /voice-webhook` | secret | ElevenLabs post-call receiver → upserts `call_logs` + a `call` activity. Guard with `ELEVENLABS_WEBHOOK_SECRET`. |
| `POST /voice-initiate` | admin secret | Queues + (with creds) places an ElevenLabs outbound AI call. Guard with `ADMIN_API_SECRET` (header `x-admin-secret`). |

### Examples

```bash
# Enquiry
curl -X POST "$BASE/functions/v1/enquiry" -H "apikey: <publishable>" -H "Content-Type: application/json" \
  -d '{"name":"Asha","phone":"+9199...","message":"3BHK in Kokapet under 2.5Cr","property_slug":"rajapushpa-pristinia","source":"website_form"}'

# Chat
curl -X POST "$BASE/functions/v1/chat" -H "apikey: <publishable>" -H "Content-Type: application/json" \
  -d '{"message":"What is the possession for Aparna Zenon?","session_id":"web-123"}'
```

---

## Turn on the AI chatbot (OpenRouter)

1. **Rotate** your OpenRouter key (the one shared earlier is exposed) → https://openrouter.ai/keys
2. Set it as a function secret:
   - Dashboard → **Project Settings → Edge Functions → Secrets**, add `OPENROUTER_API_KEY` (and optionally `OPENROUTER_MODEL`), **or**
   - `supabase secrets set OPENROUTER_API_KEY=sk-or-... OPENROUTER_MODEL=openai/gpt-4o-mini`
3. Done — `/chat` now returns live AI answers. (No redeploy needed.)

## Turn on ElevenLabs auto-calling (later)

1. Set `ELEVENLABS_API_KEY`, `ELEVENLABS_AGENT_ID`, `ELEVENLABS_PHONE_NUMBER_ID`, `ELEVENLABS_WEBHOOK_SECRET`, `ADMIN_API_SECRET`.
2. Point your ElevenLabs agent's **post-call webhook** at `…/functions/v1/voice-webhook` (send the secret as `x-webhook-secret`).
3. Trigger a call from your CRM/n8n: `POST …/functions/v1/voice-initiate` with `x-admin-secret` and `{ "lead_id": "..." }`.

## Add your first CRM admin

Create a user (Dashboard → **Authentication → Users**, or your sign-in flow).
A `profiles` row is created automatically (`role` defaults to `agent`; promote to
`admin` in the table editor). That user can then read/write all CRM tables.

## Local development

```bash
supabase link --project-ref aszxypvnndlzzdmzwkrr
supabase db reset          # re-applies supabase/migrations/* locally
supabase functions serve   # run functions locally
```

See `.env.example` for all secrets.
