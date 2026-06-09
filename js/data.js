/* ===================================================================
   More Space — Site data (single source of truth)
   All project facts + imagery preserved from morespace.ai
   =================================================================== */

const SITE = {
  name: "More Space",
  tagline: "Premium high-rise & luxury real estate, Hyderabad",
  phone: "+91 70751 68306",
  phoneRaw: "917075168306",
  phoneAlt: "+91 73965 06318",
  whatsapp: "917075168306",
  email: "info@morespace.com",
  experience: "5+ Years",
  address: "3rd & 4th Floor, Neopolis Infra, Isha Nest, Prashanthi Hills, Plot No 10, Gachibowli, Khajaguda, Hyderabad, Telangana 500032",
  hours: "9:30 AM – 7:30 PM (Mon–Sun)",
  socials: {
    facebook: "https://www.facebook.com/61577172604485",
    instagram: "https://www.instagram.com/morespacehyd/",
    linkedin: "https://www.linkedin.com/in/morespaceai-digital-66a93a374/",
    twitter: "https://x.com/morespaceai"
  }
};

/* Image helper — same Zyro CDN assets used on the live site */
const IMG = (id, w = 900, h = 680) =>
  `https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=${w},h=${h},fit=crop/AMq19Z68OEtq90DG/${id}`;

const HERO_VIDEO = "https://videos.pexels.com/video-files/2325093/2325093-hd_1920_1080_25fps.mp4";

/* ---------- Featured / current portfolio (Project page) ---------- */
const PROJECTS = [
  {
    name: "Aparna Zenon", type: "apartments", status: "Ongoing",
    location: "Puppalaguda, Nanakramguda",
    img: "aarka-brochure-6_compressed_page-0001-mk3J86D1w4I8129p.jpg",
    config: "2 & 3 BHK", size: "1,020 – 2,257 sq ft",
    price: "₹1.10 – 2.43 Cr", priceNote: "1/2/3 BHK",
    possession: "Jun 2026", acres: "30–36 acres", towers: "14 towers · 3,664 apts",
    rera: "—",
    highlights: ["Temperature-controlled pools, spa & sky amenities", "Themed gardens, EV charging, solar water heating", "2–7 km to Financial District, ~4 km Gachibowli"]
  },
  {
    name: "Rajapushpa Infina", type: "apartments", status: "Landlord Share",
    location: "Manchirevula, Financial District",
    img: "005-YBgblqNrWwflMn8m.jpg",
    config: "3 & 4 BHK", size: "3,080 – 5,725 sq ft",
    price: "₹2.83 – 5.27 Cr", priceNote: "≈ ₹9,200/sq ft",
    possession: "Nov–Dec 2028", acres: "12.96–14.6 acres", towers: "6 towers · up to 55 floors",
    rera: "P02400007500",
    highlights: ["Phase II pre-launch landlord-share units", "Pools, clubhouses, gyms, yoga & multipurpose halls", "~1,522 premium units"]
  },
  {
    name: "Rajapushpa Pristinia", type: "apartments", status: "Ongoing",
    location: "Shanthi Nagar, Kokapet",
    img: "screenshot-2025-06-26-185645-YleQ2lv89rigEr8y.jpg",
    config: "2 / 3 / 4 BHK", size: "1,380 – 4,595 sq ft",
    price: "₹1.17 – 4.04 Cr", priceNote: "≈ ₹8,500/sq ft",
    possession: "Mar 2028", acres: "12.1–12.6 acres", towers: "6 towers · 38–42 floors",
    rera: "P02400006086",
    highlights: ["60,000 sq ft clubhouse + 70,000 sq ft Elation Station", "~80% open spaces, ~1,782 apartments", "Near Neopolis SEZ & Financial District"]
  },
  {
    name: "Vasavi Atlantis", type: "apartments", status: "Ongoing",
    location: "Narsingi, Gandipet",
    img: "vasavi-atlantis-12_page-0001-YrDJ1ZXQPnsw8RQM.jpg",
    config: "2 / 3 / 4 BHK", size: "1,250 – 3,330 sq ft",
    price: "₹0.94 – 3.16 Cr", priceNote: "≈ ₹7,500–9,500/sq ft",
    possession: "Dec 2025", acres: "12 acres", towers: "8 towers · up to 45 floors",
    rera: "P02400003398",
    highlights: ["One of Hyderabad's tallest — Tower 7 ≈ 142 m", "50+ amenities, ~70% open space, sky villas to 6,500 sq ft", "ORR just 3 minutes away"]
  },
  {
    name: "Sukhii Ubuntu", type: "apartments", status: "Ongoing",
    location: "Puppalaguda, Khajaguda Hills",
    img: "screenshot-2025-06-26-165518-YKbl1x9PyNcvNxJ7.png",
    config: "2 / 3 / 4 BHK", size: "1,315 – 2,230 sq ft",
    price: "₹1.08 – 1.90 Cr", priceNote: "≈ ₹8,500–9,500/sq ft",
    possession: "Dec 2025", acres: "5.25 acres", towers: "3 towers · 36–37 floors",
    rera: "P02400003677",
    highlights: ["All corner units, rooftop-connected sky decks", "Two 5-star clubhouses, 70+ amenities, LEED Platinum", "Tower A ≈ 124.7 m — among Hyderabad's tallest"]
  },
  {
    name: "Rajapushpa Provinca", type: "apartments", status: "Ongoing",
    location: "Nanakramguda Service Road",
    img: "west-aerial-view-A1a5PJ1Wr6tjP8L7.jpg",
    config: "2 & 3 BHK", size: "1,370 – 2,660 sq ft",
    price: "₹1.09 – 2.21 Cr", priceNote: "≈ ₹10,370/sq ft",
    possession: "Jan 2027", acres: "23.75 acres", towers: "11 towers · G+39",
    rera: "P02400002487",
    highlights: ["Two clubhouses — Club Odyssey & Club Oasis (1.5 lakh sq ft)", "60 ft spacing between towers, EV charging, solar fencing", "~3,498 premium apartments"]
  },
  {
    name: "MoonGlade", type: "apartments", status: "Ongoing",
    location: "Kokapet (Exit 18A, ORR)",
    img: "elevation-b-moonglade-apartments-kokapet-dOqDa436DNF2zDXo.jpg",
    config: "3 & 4 BHK", size: "1,400 – 3,950 sq ft",
    price: "₹1.32 – 4.04 Cr", priceNote: "≈ ₹9,000/sq ft",
    possession: "2028", acres: "14 acres", towers: "7 towers · 40 floors",
    rera: "P02400009267",
    highlights: ["Clubhouse Starlight ≈ 1,35,000 sq ft", "Rooftop pools, mini theatre, library, business center", "5 min to ORR, ~15 min Raidurg Metro"]
  },
  {
    name: "Vamsiram Newmark", type: "apartments", status: "Ongoing",
    location: "Narsingi – Kokapet (ORR)",
    img: "vamsiram-newmark-property-image-AzGNjz1QVWsZMzWo.jpg",
    config: "4 BHK", size: "5,200 – 6,500 sq ft",
    price: "₹5.19 – 7.18 Cr", priceNote: "≈ ₹9,980/sq ft",
    possession: "Nov–Dec 2028", acres: "3.9–4.5 acres", towers: "2 towers · up to 51 floors",
    rera: "—",
    highlights: ["≈ 182.5 m — among Hyderabad's tallest residences", "Private lifts, maid's rooms, 12 ft floor-to-floor", "50,000 sq ft clubhouse, 80% open landscaping"]
  },
  {
    name: "SRIAS IWA", type: "apartments", status: "Ongoing",
    location: "Puppalaguda – Nanakramguda",
    img: "elevation-f-srias-iwa-sas-iwa-dOqDa4Xo9ku2wl22.jpg",
    config: "3 / 3.5 / 4 / 4.5 BHK", size: "2,290 – 4,710 sq ft",
    price: "₹2.06 – 4.24 Cr", priceNote: "≈ ₹9,000/sq ft",
    possession: "Sep 2028", acres: "6.5 acres", towers: "6 towers · ~909 units",
    rera: "P02400007210",
    highlights: ["Japanese-styled design by Nikken Sekkei", "70%+ open space, Khajaguda valley views", "Clubhouse, pool, sports courts, landscaped gardens"]
  },
  {
    name: "ASBL Broadway", type: "apartments", status: "Ongoing",
    location: "Financial District, Nanakramguda",
    img: "asbl-broadway-project-project-large-image1-1924-dOqDa4M35vTDV2Lo.jpg",
    config: "3 & 3.5 BHK", size: "2,035 – 2,650 sq ft",
    price: "On request", priceNote: "₹1,000 Cr booked pre-launch",
    possession: "Dec 2029", acres: "5.02 acres", towers: "3 towers · G+50",
    rera: "—",
    highlights: ["Manhattan-style design, 3-sided glass-rail balconies", "52,000 sq ft clubhouse + 55,000 sq ft urban corridor", "~75% open green space"]
  },
  {
    name: "Arudra Exotica", type: "plots", status: "Plots",
    location: "Nandigama, Western Hyderabad (NH44)",
    img: "download-YbNJnxVpkMiVXbPv.jpeg",
    config: "Plotted Layout", size: "1,350 – 5,292 sq ft",
    price: "On request", priceNote: "153 plotted units",
    possession: "Oct 2025", acres: "9.81 acres", towers: "Gated plotted community",
    rera: "P02400006918",
    highlights: ["24×7 water, STP, rainwater harvesting", "Internal roads, street lighting, power backup", "Emerging suburban connectivity on Nizamabad Road"]
  },
  {
    name: "Rajapushpa Greendale", type: "villas", status: "Villas",
    location: "Tellapur (near ORR)",
    img: "screenshot-2025-06-26-164819-ALpPBGzevwfzBDq8.png",
    config: "4 & 5 BHK Villas", size: "4,100 – 5,460 sq ft",
    price: "₹6 – 6.5 Cr", priceNote: "≈ ₹18,500/sq ft",
    possession: "Resale phase", acres: "42 acres", towers: "265 villas",
    rera: "—",
    highlights: ["35,000 sq ft clubhouse, resort-style ambiance", "50%+ open landscaped space, sky bridges, water bodies", "Landlord-share units, east & west facing"]
  },
  {
    name: "Rajapushpa Serenedale", type: "villas", status: "Villas",
    location: "Financial District corridor",
    img: "screenshot-2025-06-26-164624-YKbl1xprJLigJV3M.png",
    config: "4 & 5 BHK Villas", size: "3,434 – 4,225 sq ft",
    price: "₹4.81 – 8.50 Cr", priceNote: "≈ ₹20,118/sq ft",
    possession: "Dec 2027", acres: "28.67 acres", towers: "254 villas · ~48% open",
    rera: "P01100005584",
    highlights: ["32,000 sq ft clubhouse, spa, salon, guest suites", "Jogging paths, pet parks, amphitheatre, meditation decks", "10 min to Financial District & IT hubs"]
  },
  {
    name: "Siras Boat Club", type: "villas", status: "Villas",
    location: "Medchal Lake (lakeside)",
    img: "siras-the-boat-club-34_compressed_page-0001-AVLa3ZvOyEujkLg2.jpg",
    config: "3 – 5 BHK Villas", size: "2,700 – 6,800 sq ft",
    price: "₹4.2 – 10.5 Cr", priceNote: "≈ ₹15,550/sq ft",
    possession: "Aug 2028", acres: "25 acres", towers: "192 standalone villas",
    rera: "P02200005072",
    highlights: ["60,000 sq ft clubhouse, lakeside living", "Italian marble, private pools, home gyms, cinema rooms", "By SRIAS Life Spaces with FHD India & Clark Lloyd"]
  }
];

/* ---------- Upcoming / pre-launch destinations ---------- */
const UPCOMING = [
  {
    slug: "neopolis", name: "Neopolis", zone: "Kokapet",
    page: "neopolis.html",
    img: "ssi_fortune-grande-_-facade-concept-19_page-0001-1-AoPJN11R1XUOkkM2.jpg",
    tag: "EOI Window Closing Soon",
    blurb: "12-acre ultra-luxury hanging apartments opposite CBIT — 3.5 & 4 BHK with Gandipet & Kokapet lake views.",
    price: "₹2.7 Cr onwards", config: "3.5 & 4 BHK · 2,850 – 3,850 sq ft", possession: "Pre-launch / EOI"
  },
  {
    slug: "manchirevula-narsingi", name: "Manchirevula / Narsingi", zone: "Near Kokapet",
    page: "manchirevula-narsingi.html",
    img: "screenshot-2025-06-07-144932-dOqDl22L3DIpkpWB.png",
    tag: "Invest in Land, Own a Flat",
    blurb: "25+ acre landmark high-rise beside ORR Exit 18A — 55+ floor towers with a land-backed investment model.",
    price: "₹6,500/sq ft (pre-launch)", config: "3 BHK · 1,800 / 2,200 / 2,800 sq ft", possession: "Pre-launch"
  },
  {
    slug: "kukatpally", name: "Soul of Earth", zone: "Kukatpally",
    page: "kukatpally.html",
    img: "513083668_10043339375761994_2646727081486807655_n-mjEGQWXJBJcoBoXy.jpg",
    tag: "Iconic Landmark",
    blurb: "25 acres, 11 towers and an 8-acre Central-Park-inspired courtyard — 3 & 4 BHK Vastu homes with 3 clubhouses.",
    price: "On request", config: "3 & 4 BHK · 1,690 – 4,600 sq ft", possession: "Pre-launch"
  },
  {
    slug: "rajendra-nagar", name: "Rajendra Nagar", zone: "Gaganpahad",
    page: "rajendra-nagar.html",
    img: "whatsapp-image-2025-05-09-at-12.30-AQEZ4MG0QvUWnzEg.jpg",
    tag: "Now Accepting EOI",
    blurb: "Two prelaunch gated communities — 8-acre (724 units) and 13-acre (9 towers, G+33) — minutes from PVNR Expressway.",
    price: "EOI from ₹6 L", config: "2 / 3 / 3.5 / 4 BHK · 1,300 – 4,100 sq ft", possession: "Pre-launch"
  }
];

/* ---------- Services (Home) ---------- */
const SERVICES = [
  { icon: "key", title: "Landlord Shares", text: "Early access to landlord-held units in under-construction & pre-launch phases — competitive rates with room to negotiate and strong ROI." },
  { icon: "trend", title: "Investor Flats", text: "Resale of units acquired by early-stage investors — attractive entry prices, appreciation upside and quicker deal execution." },
  { icon: "building", title: "Builder Inventory", text: "Select premium units marketed directly with reputed developers — preferred pricing, priority inventory and a streamlined purchase." }
];
