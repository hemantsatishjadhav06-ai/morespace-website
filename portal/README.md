# More Space — Backend Team Portal (Cost Sheet)

An internal, self-contained **cost-sheet generator** for the backend/sales team.
Pick a running project, adjust the rates, and produce a printable / exportable
cost sheet for a unit.

```
portal/
├── index.html      # UI (login gate + cost sheet tool)
├── cost-sheet.js   # login logic, project catalogue, cost-sheet math
└── README.md
```

## Run it

Open through a local server (needed so the login hashing / `crypto.subtle` runs
in a secure context):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000/portal/
```

## Login

| Username  | Password         |
|-----------|------------------|
| `backend` | `MoreSpace@2026` |

**Change this before sharing.** Edit `DEFAULT_LOGIN` (and optionally add
hashed accounts to `TEAM_ACCOUNTS`) in `cost-sheet.js`.

> ⚠️ **Security note:** this is a *lightweight client-side gate* to keep the
> tool out of casual view — it is **not** real authentication. Anyone who can
> read the JavaScript can read the credentials. `morespace-website` is a
> **public** repo, so treat this login as low-assurance. For genuine access
> control, do one of:
> - host the portal in a **private** repo, or behind **Netlify password
>   protection / SSO**, or
> - wire it to **Supabase Auth** — the backend already has `profiles` +
>   `auth.users` and `is_staff()` checks (see `backend/README.md`).

## What it does

- **14 running projects** pre-loaded (from `js/data.js`) with indicative
  ₹/sq ft base rates that auto-fill on selection — all fields stay editable.
- Full **Telangana-style breakdown**: Basic Sale Price, floor rise, PLC,
  amenities, car parking, other charges → agreement sub-total → GST →
  stamp duty & registration → corpus + maintenance → **Grand Total** (with
  an all-in ₹/sq ft figure).
- **Print / PDF** (browser print) and **Export CSV**.

All figures are indicative estimates for internal use — subject to developer
confirmation and prevailing government charges. Not a price quotation.

## Deploy to the `morespace-portal` Netlify site

The existing `morespace-portal.netlify.app` site (Netlify site ID
`99907531-6f06-43f7-aa29-3e30744c6d06`) was created outside GitHub. To serve
this tool from it, either:

1. **Link the Netlify site to this repo** (Netlify → Site → Build & deploy →
   link repository) with publish directory `.`, so the portal is served at
   `/portal/`; or
2. **Drag-and-drop** the `portal/` folder in the Netlify UI for a manual deploy.

This repo itself continues to auto-deploy to **GitHub Pages** via
`.github/workflows/deploy.yml`, so the portal is also reachable at
`…/portal/` on the Pages URL.
