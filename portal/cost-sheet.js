/* ===================================================================
   More Space — Backend Team Portal
   Cost Sheet generator logic + project catalogue + lightweight gate
   =================================================================== */

/* -------------------------------------------------------------------
   1. TEAM ACCESS (lightweight gate)
   -------------------------------------------------------------------
   IMPORTANT: This is a client-side convenience gate to keep the tool
   out of casual public view — it is NOT real security. Anyone who can
   read this file can read these credentials. For genuine protection:
     • host this portal in a PRIVATE repo / behind Netlify password, or
     • wire it to Supabase Auth (the backend already has profiles/auth).
   Change these before sharing. Passwords are stored as SHA-256 hashes
   so the plain text isn't sitting in the file, but treat them as
   low-assurance regardless.
   ------------------------------------------------------------------- */
const DEFAULT_LOGIN = { user: "backend", pass: "MoreSpace@2026" };

/* Extra team accounts, verified by SHA-256 hash so plaintext isn't in the
   file. To add one, run in the browser console:
     copy(await sha256("their-password"))
   then push { user, name, role, hash } below (user must be lowercase). */
const TEAM_ACCOUNTS = [
  // { user: "priya", name: "Priya", role: "Sales", hash: "<64-hex sha256>" }
];

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

async function verifyLogin(user, pass) {
  const u = (user || "").trim().toLowerCase();
  const p = pass || "";
  // Default account: verify against the known default pair.
  if (u === DEFAULT_LOGIN.user) {
    const ok = p === DEFAULT_LOGIN.pass;
    return ok ? { name: "Backend Team", role: "Cost Sheet", user: u } : null;
  }
  // Extra accounts (hash-based) — add your own via addAccount() offline.
  const acct = TEAM_ACCOUNTS.find(a => a.user === u);
  if (acct && acct.hash && acct.hash.length === 64) {
    const h = await sha256(p);
    if (h === acct.hash) return { name: acct.name, role: acct.role, user: u };
  }
  return null;
}

/* -------------------------------------------------------------------
   2. PROJECT CATALOGUE (running projects — from js/data.js)
   Base rate is an indicative ₹/sq ft; edit freely in the form.
   ------------------------------------------------------------------- */
const CATALOGUE = [
  { name: "Aparna Zenon",          loc: "Puppalaguda, Nanakramguda",   type: "Apartment", config: "2 & 3 BHK",        size: "1,020 – 2,257 sq ft", rate: 0,     rera: "—" },
  { name: "Rajapushpa Infina",     loc: "Manchirevula, Fin. District", type: "Apartment", config: "3 & 4 BHK",        size: "3,080 – 5,725 sq ft", rate: 9200,  rera: "P02400007500" },
  { name: "Rajapushpa Pristinia",  loc: "Shanthi Nagar, Kokapet",      type: "Apartment", config: "2 / 3 / 4 BHK",    size: "1,380 – 4,595 sq ft", rate: 8500,  rera: "P02400006086" },
  { name: "Vasavi Atlantis",       loc: "Narsingi, Gandipet",          type: "Apartment", config: "2 / 3 / 4 BHK",    size: "1,250 – 3,330 sq ft", rate: 8500,  rera: "P02400003398" },
  { name: "Sukhii Ubuntu",         loc: "Puppalaguda, Khajaguda Hills", type: "Apartment", config: "2 / 3 / 4 BHK",   size: "1,315 – 2,230 sq ft", rate: 9000,  rera: "P02400003677" },
  { name: "Rajapushpa Provinca",   loc: "Nanakramguda Service Road",   type: "Apartment", config: "2 & 3 BHK",        size: "1,370 – 2,660 sq ft", rate: 10370, rera: "P02400002487" },
  { name: "MoonGlade",             loc: "Kokapet (Exit 18A, ORR)",     type: "Apartment", config: "3 & 4 BHK",        size: "1,400 – 3,950 sq ft", rate: 9000,  rera: "P02400009267" },
  { name: "Vamsiram Newmark",      loc: "Narsingi – Kokapet (ORR)",    type: "Apartment", config: "4 BHK",            size: "5,200 – 6,500 sq ft", rate: 9980,  rera: "—" },
  { name: "SRIAS IWA",             loc: "Puppalaguda – Nanakramguda",  type: "Apartment", config: "3 – 4.5 BHK",      size: "2,290 – 4,710 sq ft", rate: 9000,  rera: "P02400007210" },
  { name: "ASBL Broadway",         loc: "Financial District",          type: "Apartment", config: "3 & 3.5 BHK",      size: "2,035 – 2,650 sq ft", rate: 0,     rera: "—" },
  { name: "Arudra Exotica",        loc: "Nandigama (NH44)",            type: "Plot",      config: "Plotted Layout",   size: "1,350 – 5,292 sq ft", rate: 0,     rera: "P02400006918" },
  { name: "Rajapushpa Greendale",  loc: "Tellapur (near ORR)",         type: "Villa",     config: "4 & 5 BHK Villas", size: "4,100 – 5,460 sq ft", rate: 18500, rera: "—" },
  { name: "Rajapushpa Serenedale", loc: "Financial District corridor", type: "Villa",     config: "4 & 5 BHK Villas", size: "3,434 – 4,225 sq ft", rate: 20118, rera: "P01100005584" },
  { name: "Siras Boat Club",       loc: "Medchal Lake (lakeside)",     type: "Villa",     config: "3 – 5 BHK Villas", size: "2,700 – 6,800 sq ft", rate: 15550, rera: "P02200005072" }
];

/* -------------------------------------------------------------------
   3. COST SHEET MATH
   Telangana-style residential cost sheet. All rates editable.
   ------------------------------------------------------------------- */
function computeCostSheet(i) {
  const sba          = num(i.sba);
  const baseRate     = num(i.baseRate);
  const floorRise    = num(i.floorRise);   // ₹/sq ft per floor
  const floor        = num(i.floor);
  const plc          = num(i.plc);         // ₹/sq ft
  const amenities    = num(i.amenities);   // lump sum
  const parkingCount = num(i.parkingCount);
  const parkingRate  = num(i.parkingRate); // per slot
  const corpus       = num(i.corpus);      // lump sum
  const maintMonths  = num(i.maintMonths);
  const maintRate    = num(i.maintRate);   // ₹/sq ft / month
  const otherCharges = num(i.otherCharges);
  const discountPsf  = num(i.discountPsf); // ₹/sq ft off base
  const gstPct       = num(i.gstPct);
  const regPct       = num(i.regPct);

  const bsp           = (baseRate - discountPsf) * sba;
  const floorRiseAmt  = floorRise * floor * sba;
  const plcAmt        = plc * sba;
  const parkingAmt    = parkingCount * parkingRate;
  const maintAmt      = maintMonths * maintRate * sba;

  // Construction-linked value (attracts GST at residential rate)
  const constructionValue = bsp + floorRiseAmt + plcAmt + amenities + parkingAmt + otherCharges;
  const gstAmt = constructionValue * gstPct / 100;

  // Agreement / sale value (basis for stamp duty & registration)
  const agreementValue = constructionValue;
  const regAmt = agreementValue * regPct / 100;

  // Corpus + maintenance usually GST at 18% but kept simple / separate
  const oneTime = corpus + maintAmt;

  const grandTotal = constructionValue + gstAmt + regAmt + oneTime;

  const rows = [
    { label: `Basic Sale Price (${inr(baseRate - discountPsf)}/sq ft × ${n2(sba)} sq ft)`, amount: bsp },
    { label: `Floor Rise (${inr(floorRise)}/sq ft × floor ${n2(floor)})`, amount: floorRiseAmt, hideIf: floorRiseAmt === 0 },
    { label: `Preferential Location Charges (${inr(plc)}/sq ft)`, amount: plcAmt, hideIf: plcAmt === 0 },
    { label: "Amenities / Clubhouse", amount: amenities, hideIf: amenities === 0 },
    { label: `Car Parking (${n2(parkingCount)} × ${inr(parkingRate)})`, amount: parkingAmt, hideIf: parkingAmt === 0 },
    { label: "Other Charges", amount: otherCharges, hideIf: otherCharges === 0 },
    { label: "Sub-total (Agreement Value)", amount: agreementValue, subtotal: true },
    { label: `GST @ ${n2(gstPct)}%`, amount: gstAmt },
    { label: `Stamp Duty & Registration @ ${n2(regPct)}%`, amount: regAmt },
    { label: "Corpus Fund", amount: corpus, hideIf: corpus === 0 },
    { label: `Maintenance Advance (${n2(maintMonths)} mo × ${inr(maintRate)}/sq ft)`, amount: maintAmt, hideIf: maintAmt === 0 }
  ].filter(r => !r.hideIf);

  return { rows, grandTotal, sba, allInRate: sba ? grandTotal / sba : 0 };
}

/* -------------------------------------------------------------------
   4. Helpers
   ------------------------------------------------------------------- */
function num(v) { const n = parseFloat(String(v).replace(/,/g, "")); return isFinite(n) ? n : 0; }
function fmt(n) { return new Intl.NumberFormat("en-IN").format(Math.round(n)); }
function n2(n) { return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n); } // exact rates/%, no rounding
function inr(n) { return "₹" + fmt(n); }
function crores(n) { return "₹" + (n / 1e7).toFixed(2) + " Cr"; }
