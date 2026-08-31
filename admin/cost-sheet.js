/* ===================================================================
   More Space — Backend Team Portal
   Cost Sheet generator logic + project catalogue + lightweight gate

   The cost-sheet format & default rates mirror the team's reference
   sheet (MoonGlade sample): Basic Price, Floor Rise (from 6th floor),
   East-facing / Corner / View-premium charges, Car Parking, Amenities,
   Clubhouse, Legal & Documentation -> Total Sale Consideration; then
   W.E.G.I, Corpus, 24-month Maintenance + 18% GST on AMC -> Net Total.
   =================================================================== */

/* -------------------------------------------------------------------
   1. TEAM ACCESS (lightweight gate)
   -------------------------------------------------------------------
   IMPORTANT: client-side convenience gate, NOT real security. Anyone who
   can read this file can read these credentials. For genuine protection:
     • host this portal in a PRIVATE repo / behind Netlify password, or
     • wire it to Supabase Auth (the backend already has profiles/auth).
   Change DEFAULT_LOGIN before sharing.
   ------------------------------------------------------------------- */
/* -------------------------------------------------------------------
   0. BRAND / LETTERHEAD (shown on screen + printed cost sheet)
   Swap `logo` for a specific developer/builder logo if needed; the
   wordmark text is used automatically if the image can't load.
   ------------------------------------------------------------------- */
const BRAND = {
  name: "More Space",
  logo: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=280,fit=crop,q=95/AMq19Z68OEtq90DG/untitled-design-A85V2Gln5jFKZkow.png",
  website: "www.morespace.ai",
  websiteUrl: "https://morespace.ai",
  phone: "+91 70751 68306",
  email: "info@morespace.com",
  address: "Neopolis Infra, Prashanthi Hills, Gachibowli, Hyderabad 500032"
};

/* Team accounts, verified by SHA-256 hash so no plaintext password sits in
   this file. Two logins are provisioned:
       backend / MoreSpace@2026   (Backend Team)
       sales   / Sales@2026       (Sales Team)
   To change one, run in the browser console:  copy(await sha256("newpass"))
   and replace the matching `hash` below (usernames must be lowercase). */
const TEAM_ACCOUNTS = [
  { user: "backend", name: "Backend Team", role: "Cost Sheet", hash: "aeae8cef432e0dd99731d1bfab7b6cdbdfe152ddbc36f2db84876587abf0e201" },
  { user: "sales",   name: "Sales Team",   role: "Cost Sheet", hash: "65f478a5738e3437839f9767c0600050ffd4429f1cb521d76f22351124813020" }
];

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

async function verifyLogin(user, pass) {
  const u = (user || "").trim().toLowerCase();
  const acct = TEAM_ACCOUNTS.find(a => a.user === u);
  if (acct && acct.hash.length === 64 && (await sha256(pass || "")) === acct.hash) {
    return { name: acct.name, role: acct.role, user: u };
  }
  return null;
}

/* -------------------------------------------------------------------
   2. PROJECT CATALOGUE (running projects — from js/data.js)
   `rate` is an indicative ₹/sq ft basic price; edit freely in the form.
   ------------------------------------------------------------------- */
const CATALOGUE = [
  { name: "Aparna Zenon",          loc: "Puppalaguda, Nanakramguda",   type: "Apartment", config: "2 & 3 BHK",        size: "1,020 – 2,257 sq ft", rate: 0,     rera: "—" },
  { name: "Rajapushpa Infina",     loc: "Manchirevula, Fin. District", type: "Apartment", config: "3 & 4 BHK",        size: "3,080 – 5,725 sq ft", rate: 9200,  rera: "P02400007500" },
  { name: "Rajapushpa Pristinia",  loc: "Shanthi Nagar, Kokapet",      type: "Apartment", config: "2 / 3 / 4 BHK",    size: "1,380 – 4,595 sq ft", rate: 8500,  rera: "P02400006086" },
  { name: "Vasavi Atlantis",       loc: "Narsingi, Gandipet",          type: "Apartment", config: "2 / 3 / 4 BHK",    size: "1,250 – 3,330 sq ft", rate: 8500,  rera: "P02400003398" },
  { name: "Sukhii Ubuntu",         loc: "Puppalaguda, Khajaguda Hills", type: "Apartment", config: "2 / 3 / 4 BHK",   size: "1,315 – 2,230 sq ft", rate: 9000,  rera: "P02400003677" },
  { name: "Rajapushpa Provinca",   loc: "Nanakramguda Service Road",   type: "Apartment", config: "2 & 3 BHK",        size: "1,370 – 2,660 sq ft", rate: 10370, rera: "P02400002487" },
  { name: "MoonGlade",             loc: "Kokapet (Exit 18A, ORR)",     type: "Apartment", config: "3 & 4 BHK",        size: "1,400 – 3,950 sq ft", rate: 6800,  rera: "P02400009267" },
  { name: "Vamsiram Newmark",      loc: "Narsingi – Kokapet (ORR)",    type: "Apartment", config: "4 BHK",            size: "5,200 – 6,500 sq ft", rate: 9980,  rera: "—" },
  { name: "SRIAS IWA",             loc: "Puppalaguda – Nanakramguda",  type: "Apartment", config: "3 – 4.5 BHK",      size: "2,290 – 4,710 sq ft", rate: 9000,  rera: "P02400007210" },
  { name: "ASBL Broadway",         loc: "Financial District",          type: "Apartment", config: "3 & 3.5 BHK",      size: "2,035 – 2,650 sq ft", rate: 0,     rera: "—" },
  { name: "Arudra Exotica",        loc: "Nandigama (NH44)",            type: "Plot",      config: "Plotted Layout",   size: "1,350 – 5,292 sq ft", rate: 0,     rera: "P02400006918" },
  { name: "Rajapushpa Greendale",  loc: "Tellapur (near ORR)",         type: "Villa",     config: "4 & 5 BHK Villas", size: "4,100 – 5,460 sq ft", rate: 18500, rera: "—" },
  { name: "Rajapushpa Serenedale", loc: "Financial District corridor", type: "Villa",     config: "4 & 5 BHK Villas", size: "3,434 – 4,225 sq ft", rate: 20118, rera: "P01100005584" },
  { name: "Siras Boat Club",       loc: "Medchal Lake (lakeside)",     type: "Villa",     config: "3 – 5 BHK Villas", size: "2,700 – 6,800 sq ft", rate: 15550, rera: "P02200005072" }
];

/* Default charge rates from the reference sheet */
const DEFAULTS = {
  floorRiseRate: 20,   // ₹/sq ft per floor
  floorRiseFrom: 6,    // applicable from this floor onwards
  eastRate: 50,        // ₹/sq ft
  cornerRate: 50,      // ₹/sq ft
  viewRate: 50,        // ₹/sq ft
  parkingRate: 300000, // per extra car park (1 free by default)
  amenitiesRate: 350,  // ₹/sq ft
  clubhouse: 300000,   // lump sum
  legalDoc: 30000,     // flat (incl. 18% GST)
  wegiRate: 150,       // ₹/sq ft (possession time)
  corpusRate: 50,      // ₹/sq ft (possession time)
  maintMonths: 24,     // maintenance advance
  maintPerMonth: 4,    // ₹/sq ft per month  (24 × 4 = 96/sq ft)
  amcGstPct: 18        // GST on AMC
};

/* -------------------------------------------------------------------
   3. COST SHEET MATH  (mirrors the reference sheet exactly)
   ------------------------------------------------------------------- */
function computeCostSheet(i) {
  const sba   = num(i.sba);
  const floor = num(i.floor);
  const isEast       = /east/i.test(i.facing || "");
  const corner       = i.cornerFlat === true || i.cornerFlat === "true" || i.cornerFlat === "yes";
  const viewPremium  = i.viewPremium === true || i.viewPremium === "true" || i.viewPremium === "yes";
  const amenitiesOn  = i.amenitiesOn === true || i.amenitiesOn === "true" || i.amenitiesOn === "yes";
  const clubhouseOn  = i.clubhouseOn === true || i.clubhouseOn === "true" || i.clubhouseOn === "yes";

  const basicRate     = num(i.basicRate);
  const floorRiseRate = num(i.floorRiseRate);
  const floorRiseFrom = num(i.floorRiseFrom) || 6;
  const eastRate      = num(i.eastRate);
  const cornerRate    = num(i.cornerRate);
  const viewRate      = num(i.viewRate);
  const extraParking  = num(i.extraParking);
  const parkingRate   = num(i.parkingRate);
  const amenitiesRate = num(i.amenitiesRate);
  const clubhouse     = num(i.clubhouse);
  const legalDoc      = num(i.legalDoc);
  const wegiRate      = num(i.wegiRate);
  const corpusRate    = num(i.corpusRate);
  const maintMonths   = num(i.maintMonths);
  const maintPerMonth = num(i.maintPerMonth);
  const amcGstPct     = num(i.amcGstPct);

  // Floor rise: rate/sft × floors above the free band (from Nth floor onwards)
  const floorsCharged   = Math.max(floor - (floorRiseFrom - 1), 0);
  const floorRisePerSft = floorRiseRate * floorsCharged;

  const basic     = basicRate * sba;
  const floorRise = floorRisePerSft * sba;
  const east      = isEast ? eastRate * sba : 0;
  const cornerAmt = corner ? cornerRate * sba : 0;
  const view      = viewPremium ? viewRate * sba : 0;
  const parking   = extraParking * parkingRate;
  const amenities = amenitiesOn ? amenitiesRate * sba : 0;
  const club      = clubhouseOn ? clubhouse : 0;

  // Main schedule — all rows always shown (matches the reference sheet)
  const mainRows = [
    { sno: 1, label: "Basic Price – Per Sq. Feet",                                              rate: basicRate,       amount: basic },
    { sno: 2, label: `Floor Rise Charges (₹${n2(floorRiseRate)}/sq ft/floor from ${ordinal(floorRiseFrom)} floor onwards)`, rate: floorRisePerSft, amount: floorRise },
    { sno: 3, label: `East Facing Charges (₹${n2(eastRate)}/sq ft)`,                             rate: eastRate,        amount: east },
    { sno: 4, label: `Corner Flat Charges (₹${n2(cornerRate)}/sq ft)`,                           rate: cornerRate,      amount: cornerAmt },
    { sno: 5, label: `View Premium Charges (₹${n2(viewRate)}/sq ft)`,                            rate: viewRate,        amount: view },
    { sno: 6, label: `Car Parking (1 free; extra @ ${inr(parkingRate)} × ${n2(extraParking)})`, rate: parkingRate,     amount: parking },
    { sno: 7, label: `Amenities (₹${n2(amenitiesRate)}/sq ft)`,                                  rate: amenitiesRate,   amount: amenities },
    { sno: 8, label: "Club House Amenities",                                                     rate: clubhouse,       amount: club },
    { sno: 9, label: "Legal & Documentation Charges (incl. 18% GST)",                            rate: legalDoc,        amount: legalDoc }
  ];

  const totalSale = basic + floorRise + east + cornerAmt + view + parking + amenities + club + legalDoc;

  // Possession-time charges
  const maintPerSft = maintMonths * maintPerMonth; // e.g. 24 × 4 = 96
  const wegi   = wegiRate * sba;
  const corpus = corpusRate * sba;
  const maint  = maintPerSft * sba;
  const amcGst = maint * amcGstPct / 100;

  const possessionRows = [
    { label: "W.E.G.I (Water, Electricity, Gas & Infrastructure)", rate: wegiRate,    amount: wegi },
    { label: "Corpus Fund",                                        rate: corpusRate,  amount: corpus },
    { label: `${n2(maintMonths)} Months Maintenance (₹${n2(maintPerMonth)}/sq ft/month)`, rate: maintPerSft, amount: maint },
    { label: `GST @ ${n2(amcGstPct)}% on AMC`,                     rate: null,        amount: amcGst }
  ];

  const netTotal = totalSale + wegi + corpus + maint + amcGst;

  return { mainRows, totalSale, possessionRows, netTotal, sba, allInRate: sba ? netTotal / sba : 0 };
}

/* -------------------------------------------------------------------
   4. Helpers
   ------------------------------------------------------------------- */
function num(v) { const n = parseFloat(String(v).replace(/,/g, "")); return isFinite(n) ? n : 0; }
function fmt(n) { return new Intl.NumberFormat("en-IN").format(Math.round(n)); }
function n2(n) { return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n); } // exact rates/%, no rounding
function inr(n) { return "₹" + fmt(n); }
function crores(n) { return "₹" + (n / 1e7).toFixed(2) + " Cr"; }
function ordinal(n) { const s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
