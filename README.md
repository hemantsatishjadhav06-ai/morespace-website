# More Space — Real Estate Website (Rebuilt)

A redesigned, multi-page static website for **More Space**, a premium real-estate
marketing firm in Hyderabad. This is a structural + UI/UX rebuild of
[morespace.ai](https://morespace.ai/): **same brand colours, same content and
imagery — completely new structure and experience.**

No build tools, no frameworks. Just HTML, CSS and vanilla JS — ready to drop on
GitHub Pages, Netlify, or any static host.

---

## ✨ What changed vs. the original

| Area | Original (morespace.ai) | This rebuild |
|---|---|---|
| URLs | Broken-looking slugs (`/httpsmorespaceailuxury-...`) | Clean, readable filenames |
| Projects page | One long wall of text, duplicated entries | Filterable card grid (Apartments / Villas / Plots) |
| Upcoming page | Nearly empty (4 bare links) | Visual hub + 4 full detail pages |
| Navigation | Inconsistent, flat | Sticky header, dropdown, mobile menu, consistent footer |
| Structure | Single-builder template | DRY component model (one header/footer for all pages) |
| Mobile | Basic | Fully responsive, hamburger nav, reflowed grids |
| Calls to action | Sparse | WhatsApp + call wired on every project & card |

The **colour palette and fonts are preserved exactly** from the live site.

## 🎨 Brand palette (unchanged)

| Token | Hex | Use |
|---|---|---|
| Indigo | `#2D236D` | Primary brand |
| Blue | `#0300C7` | Accent, headings, links |
| Charcoal | `#1D1E20` | Body text |
| Green | `#009100` | Prices & WhatsApp CTAs |
| White | `#FFFFFF` | Surfaces |

**Fonts:** Outfit (display) + DM Sans (body) — both from Google Fonts.

## 📁 Structure

```
morespace-site/
├── index.html                  # Home
├── projects.html               # Featured portfolio (filterable grid)
├── upcoming.html               # Upcoming / pre-launch hub
├── neopolis.html               # Upcoming detail
├── manchirevula-narsingi.html  # Upcoming detail
├── kukatpally.html             # Upcoming detail (Soul of Earth)
├── rajendra-nagar.html         # Upcoming detail (2 projects)
├── about.html                  # About us
├── contact.html                # Contact form + map
├── css/
│   └── styles.css              # Full design system
├── js/
│   ├── data.js                 # All project content (single source of truth)
│   └── main.js                 # Header/footer, filtering, animations, form
├── assets/                     # (reserved for local assets)
└── README.md
```

Project content lives in **`js/data.js`** — edit one file to add, remove or update
a project and every page updates automatically.

## ⚙️ Backend (Supabase + AI) — already live

This repo now ships with a full backend in `backend/` (see `backend/README.md`):

- **Postgres** schema for property listings, enquiries, a **lead/CRM pipeline**, AI chat, and call logs (`backend/supabase/migrations/`)
- **Edge Functions** (`backend/supabase/functions/`): `enquiry`, `chat` (AI, OpenRouter), `voice-webhook` + `voice-initiate` (ElevenLabs)
- The site is wired to it in `js/main.js` (`API` config): the contact form posts to `enquiry`, the **"Ask Spacey"** widget calls `chat`, and listings load live from the `properties` table (with the bundled `data.js` as offline fallback).

The Supabase URL + **publishable** key in `js/main.js` are public by design. To
switch the chatbot on, set `OPENROUTER_API_KEY` as a Supabase function secret
(see `backend/README.md`). Nothing secret is committed.

## 🚀 Run locally

Because pages share a header/footer via JS, open through a local server (not
`file://`) for everything to render:

```bash
# Python
python3 -m http.server 8000
# then visit http://localhost:8000

# or Node
npx serve .
```

## 🌐 Deploy to GitHub Pages

1. Create a repo and push these files:
   ```bash
   git init
   git add .
   git commit -m "More Space website rebuild"
   git branch -M main
   git remote add origin https://github.com/<you>/morespace-site.git
   git push -u origin main
   ```
2. In the repo: **Settings → Pages → Source: `main` / root**.
3. Your site goes live at `https://<you>.github.io/morespace-site/`.

> Tip: to serve at the domain root (e.g. a custom domain), add a `CNAME` file
> and point DNS to GitHub Pages.

## 📝 Notes

- Images are loaded from More Space's existing CDN so nothing is duplicated.
- The contact form has no backend — on submit it composes a WhatsApp message to
  the office number. Swap in Formspree/Getform or your own endpoint if you want
  email delivery.
- Phone, email, address, hours and project facts all come from the live site.

---

© More Space. Rebuilt as a static multi-page site.
