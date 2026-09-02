# More Space — Admin (Cost Sheet tool)

An internal, self-contained **cost-sheet generator** for the backend/sales team.
Pick a running project, adjust the rates, and produce a printable (A4) /
exportable cost sheet for a unit.

```
admin/
├── index.html      # UI (login gate + cost sheet tool)
├── cost-sheet.js   # login logic, project catalogue, cost-sheet math, brand
└── README.md
```

## Run it

Open through a local server (needed so the login hashing / `crypto.subtle` runs
in a secure context):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000/admin/
```

Live: **https://morespace.netlify.app/admin/**

## Logins

| Email                  | Password         | Role         |
|------------------------|------------------|--------------|
| `backend@morespace.ai` | `MoreSpace@2026` | Backend Team |
| `sales@morespace.ai`   | `Sales@2026`     | Sales Team   |

Passwords are stored as SHA-256 hashes in `TEAM_ACCOUNTS` (no plaintext in the
file). To change one, run `copy(await sha256("newpass"))` in the browser console
and replace the matching `hash`.

> ⚠️ **Security note:** this is a *lightweight client-side gate* to keep the
> tool out of casual view — it is **not** real authentication. The check runs in
> the browser, so a determined user could bypass it. `morespace-website` is a
> **public** repo and the site is public, so treat these logins as
> low-assurance. For genuine access control:
> - put the `/admin` path behind **Netlify password protection / Identity**, or
> - host it in a **private** repo, or
> - wire it to **Supabase Auth** — the backend already has `profiles` +
>   `auth.users` and `is_staff()` checks (see `backend/README.md`).

## What it does

- **14 running projects** pre-loaded (from `js/data.js`) with indicative
  ₹/sq ft basic rates that auto-fill on selection — all fields stay editable.
- **Reference-sheet format**: Basic Price, Floor Rise (from 6th floor), East
  Facing / Corner / View-premium charges, Car Parking (1 free + extras),
  Amenities, Clubhouse, Legal & Documentation → **Total Sale Consideration**;
  then W.E.G.I, Corpus, 24-month Maintenance + 18% GST on AMC →
  **Net Total Costing**.
- **Print / PDF** on a single **A4** page with a branded letterhead (logo +
  website) and a contact footer, plus **Export CSV**.

Brand details (logo, website, contact) are configurable via `BRAND` in
`cost-sheet.js`. All figures are indicative estimates for internal use —
subject to developer confirmation and prevailing government charges. Not a
price quotation.

## Where it's deployed

- **Netlify:** served at `/admin/` on **https://morespace.netlify.app** (manual
  drop deploy of the whole repo).
- **GitHub Pages:** also reachable at `…/admin/` via
  `.github/workflows/deploy.yml`.
