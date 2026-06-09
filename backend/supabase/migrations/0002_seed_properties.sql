-- ============================================================================
-- More Space — Seed: 14 featured projects + 4 upcoming destinations
-- Image URLs reuse the existing Zyro CDN assets (w=900,h=680)
-- ============================================================================
-- Convenience: CDN base = https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=900,h=680,fit=crop/AMq19Z68OEtq90DG/

insert into public.properties
(slug,name,type,stage,location,area_zone,config,size_range,size_min_sqft,size_max_sqft,price_label,price_min,price_max,price_per_sqft,possession,land_area,scale,rera,developer,highlights,image_url,is_featured,is_upcoming,display_order)
values
('aparna-zenon','Aparna Zenon','apartment','ongoing','Puppalaguda, Nanakramguda','Nanakramguda','2 & 3 BHK','1,020 – 2,257 sq ft',1020,2257,'₹1.10 – 2.43 Cr',11000000,24300000,null,'Jun 2026','30–36 acres','14 towers · 3,664 apts',null,'Aparna',
  array['Temperature-controlled pools, spa & sky amenities','Themed gardens, EV charging, solar water heating','2–7 km to Financial District, ~4 km Gachibowli'],
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=900,h=680,fit=crop/AMq19Z68OEtq90DG/aarka-brochure-6_compressed_page-0001-mk3J86D1w4I8129p.jpg',true,false,1),

('rajapushpa-infina','Rajapushpa Infina','apartment','landlord_share','Manchirevula, Financial District','Manchirevula','3 & 4 BHK','3,080 – 5,725 sq ft',3080,5725,'₹2.83 – 5.27 Cr',28300000,52700000,9200,'Nov–Dec 2028','12.96–14.6 acres','6 towers · up to 55 floors','P02400007500','Rajapushpa',
  array['Phase II pre-launch landlord-share units','Pools, clubhouses, gyms, yoga & multipurpose halls','~1,522 premium units'],
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=900,h=680,fit=crop/AMq19Z68OEtq90DG/005-YBgblqNrWwflMn8m.jpg',true,false,2),

('rajapushpa-pristinia','Rajapushpa Pristinia','apartment','ongoing','Shanthi Nagar, Kokapet','Kokapet','2 / 3 / 4 BHK','1,380 – 4,595 sq ft',1380,4595,'₹1.17 – 4.04 Cr',11700000,40400000,8500,'Mar 2028','12.1–12.6 acres','6 towers · 38–42 floors','P02400006086','Rajapushpa',
  array['60,000 sq ft clubhouse + 70,000 sq ft Elation Station','~80% open spaces, ~1,782 apartments','Near Neopolis SEZ & Financial District'],
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=900,h=680,fit=crop/AMq19Z68OEtq90DG/screenshot-2025-06-26-185645-YleQ2lv89rigEr8y.jpg',true,false,3),

('vasavi-atlantis','Vasavi Atlantis','apartment','ongoing','Narsingi, Gandipet','Narsingi','2 / 3 / 4 BHK','1,250 – 3,330 sq ft',1250,3330,'₹0.94 – 3.16 Cr',9400000,31600000,8500,'Dec 2025','12 acres','8 towers · up to 45 floors','P02400003398','Vasavi Group',
  array['One of Hyderabad''s tallest — Tower 7 ≈ 142 m','50+ amenities, ~70% open space, sky villas to 6,500 sq ft','ORR just 3 minutes away'],
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=900,h=680,fit=crop/AMq19Z68OEtq90DG/vasavi-atlantis-12_page-0001-YrDJ1ZXQPnsw8RQM.jpg',true,false,4),

('sukhii-ubuntu','Sukhii Ubuntu','apartment','ongoing','Puppalaguda, Khajaguda Hills','Puppalaguda','2 / 3 / 4 BHK','1,315 – 2,230 sq ft',1315,2230,'₹1.08 – 1.90 Cr',10800000,19000000,9000,'Dec 2025','5.25 acres','3 towers · 36–37 floors','P02400003677',null,
  array['All corner units, rooftop-connected sky decks','Two 5-star clubhouses, 70+ amenities, LEED Platinum','Tower A ≈ 124.7 m — among Hyderabad''s tallest'],
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=900,h=680,fit=crop/AMq19Z68OEtq90DG/screenshot-2025-06-26-165518-YKbl1x9PyNcvNxJ7.png',true,false,5),

('rajapushpa-provinca','Rajapushpa Provinca','apartment','ongoing','Nanakramguda Service Road','Nanakramguda','2 & 3 BHK','1,370 – 2,660 sq ft',1370,2660,'₹1.09 – 2.21 Cr',10900000,22100000,10370,'Jan 2027','23.75 acres','11 towers · G+39','P02400002487','Rajapushpa',
  array['Two clubhouses — Club Odyssey & Club Oasis (1.5 lakh sq ft)','60 ft spacing between towers, EV charging, solar fencing','~3,498 premium apartments'],
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=900,h=680,fit=crop/AMq19Z68OEtq90DG/west-aerial-view-A1a5PJ1Wr6tjP8L7.jpg',true,false,6),

('moonglade','MoonGlade','apartment','ongoing','Kokapet (Exit 18A, ORR)','Kokapet','3 & 4 BHK','1,400 – 3,950 sq ft',1400,3950,'₹1.32 – 4.04 Cr',13200000,40400000,9000,'2028','14 acres','7 towers · 40 floors','P02400009267','Ira & E Infra',
  array['Clubhouse Starlight ≈ 1,35,000 sq ft','Rooftop pools, mini theatre, library, business center','5 min to ORR, ~15 min Raidurg Metro'],
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=900,h=680,fit=crop/AMq19Z68OEtq90DG/elevation-b-moonglade-apartments-kokapet-dOqDa436DNF2zDXo.jpg',true,false,7),

('vamsiram-newmark','Vamsiram Newmark','apartment','ongoing','Narsingi – Kokapet (ORR)','Narsingi','4 BHK','5,200 – 6,500 sq ft',5200,6500,'₹5.19 – 7.18 Cr',51900000,71800000,9980,'Nov–Dec 2028','3.9–4.5 acres','2 towers · up to 51 floors',null,'Vamsiram × Newmark',
  array['≈ 182.5 m — among Hyderabad''s tallest residences','Private lifts, maid''s rooms, 12 ft floor-to-floor','50,000 sq ft clubhouse, 80% open landscaping'],
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=900,h=680,fit=crop/AMq19Z68OEtq90DG/vamsiram-newmark-property-image-AzGNjz1QVWsZMzWo.jpg',true,false,8),

('srias-iwa','SRIAS IWA','apartment','ongoing','Puppalaguda – Nanakramguda','Nanakramguda','3 / 3.5 / 4 / 4.5 BHK','2,290 – 4,710 sq ft',2290,4710,'₹2.06 – 4.24 Cr',20600000,42400000,9000,'Sep 2028','6.5 acres','6 towers · ~909 units','P02400007210','SRIAS Life Spaces',
  array['Japanese-styled design by Nikken Sekkei','70%+ open space, Khajaguda valley views','Clubhouse, pool, sports courts, landscaped gardens'],
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=900,h=680,fit=crop/AMq19Z68OEtq90DG/elevation-f-srias-iwa-sas-iwa-dOqDa4Xo9ku2wl22.jpg',true,false,9),

('asbl-broadway','ASBL Broadway','apartment','ongoing','Financial District, Nanakramguda','Financial District','3 & 3.5 BHK','2,035 – 2,650 sq ft',2035,2650,'On request',null,null,null,'Dec 2029','5.02 acres','3 towers · G+50',null,'ASBL',
  array['Manhattan-style design, 3-sided glass-rail balconies','52,000 sq ft clubhouse + 55,000 sq ft urban corridor','~75% open green space'],
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=900,h=680,fit=crop/AMq19Z68OEtq90DG/asbl-broadway-project-project-large-image1-1924-dOqDa4M35vTDV2Lo.jpg',true,false,10),

('arudra-exotica','Arudra Exotica','plot','ongoing','Nandigama, Western Hyderabad (NH44)','Nandigama','Plotted Layout','1,350 – 5,292 sq ft',1350,5292,'On request',null,null,null,'Oct 2025','9.81 acres','Gated plotted community','P02400006918','Arudra Infra',
  array['24×7 water, STP, rainwater harvesting','Internal roads, street lighting, power backup','Emerging suburban connectivity on Nizamabad Road'],
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=900,h=680,fit=crop/AMq19Z68OEtq90DG/download-YbNJnxVpkMiVXbPv.jpeg',true,false,11),

('rajapushpa-greendale','Rajapushpa Greendale','villa','resale','Tellapur (near ORR)','Tellapur','4 & 5 BHK Villas','4,100 – 5,460 sq ft',4100,5460,'₹6 – 6.5 Cr',60000000,65000000,18500,'Resale phase','42 acres','265 villas',null,'Rajapushpa',
  array['35,000 sq ft clubhouse, resort-style ambiance','50%+ open landscaped space, sky bridges, water bodies','Landlord-share units, east & west facing'],
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=900,h=680,fit=crop/AMq19Z68OEtq90DG/screenshot-2025-06-26-164819-ALpPBGzevwfzBDq8.png',true,false,12),

('rajapushpa-serenedale','Rajapushpa Serenedale','villa','ongoing','Financial District corridor','Financial District','4 & 5 BHK Villas','3,434 – 4,225 sq ft',3434,4225,'₹4.81 – 8.50 Cr',48100000,85000000,20118,'Dec 2027','28.67 acres','254 villas','P01100005584','Rajapushpa',
  array['32,000 sq ft clubhouse, spa, salon, guest suites','Jogging paths, pet parks, amphitheatre, meditation decks','10 min to Financial District & IT hubs'],
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=900,h=680,fit=crop/AMq19Z68OEtq90DG/screenshot-2025-06-26-164624-YKbl1xprJLigJV3M.png',true,false,13),

('siras-boat-club','Siras Boat Club','villa','ongoing','Medchal Lake (lakeside)','Medchal','3 – 5 BHK Villas','2,700 – 6,800 sq ft',2700,6800,'₹4.2 – 10.5 Cr',42000000,105000000,15550,'Aug 2028','25 acres','192 standalone villas','P02200005072','SRIAS Life Spaces',
  array['60,000 sq ft clubhouse, lakeside living','Italian marble, private pools, home gyms, cinema rooms','By SRIAS Life Spaces with FHD India & Clark Lloyd'],
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=900,h=680,fit=crop/AMq19Z68OEtq90DG/siras-the-boat-club-34_compressed_page-0001-AVLa3ZvOyEujkLg2.jpg',true,false,14),

-- ---------------- Upcoming / pre-launch ----------------
('neopolis','Neopolis (Ultra-Luxury)','apartment','prelaunch','Neopolis, Kokapet','Kokapet','3.5 & 4 BHK','2,850 – 3,850 sq ft',2850,3850,'₹2.7 Cr onwards',27000000,null,null,'EOI / Pre-launch','12 acres','6 towers · 45 floors',null,null,
  array['Hanging apartments open on all 4 sides','7.5-acre central park, 1 lakh sq ft clubhouse','Gandipet & Kokapet lake views, 75% open'],
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=900,h=680,fit=crop/AMq19Z68OEtq90DG/ssi_fortune-grande-_-facade-concept-19_page-0001-1-AoPJN11R1XUOkkM2.jpg',false,true,21),

('manchirevula-narsingi','Manchirevula / Narsingi High-Rise','apartment','prelaunch','Manchirevula / Narsingi, near Kokapet','Manchirevula','3 BHK','1,800 – 2,800 sq ft',1800,2800,'₹6,500/sq ft (pre-launch)',null,null,6500,'Pre-launch','25+ acres','55+ floor towers',null,null,
  array['Beside ORR Exit 18A, 55+ floor towers','Land-backed investment — flat tied to land share','₹6,500/sq ft all-inclusive pre-launch'],
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=900,h=680,fit=crop/AMq19Z68OEtq90DG/screenshot-2025-06-07-144932-dOqDl22L3DIpkpWB.png',false,true,22),

('kukatpally','Soul of Earth','apartment','prelaunch','Kukatpally','Kukatpally','3 & 4 BHK','1,690 – 4,600 sq ft',1690,4600,'On request',null,null,null,'Pre-launch','25 acres','11 towers',null,null,
  array['8-acre Central-Park-inspired courtyard','Three clubhouses — Happening 25','80% open spaces, Vastu-compliant homes'],
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=900,h=680,fit=crop/AMq19Z68OEtq90DG/513083668_10043339375761994_2646727081486807655_n-mjEGQWXJBJcoBoXy.jpg',false,true,23),

('rajendra-nagar','Rajendra Nagar Gated Community','apartment','prelaunch','Rajendra Nagar, Gaganpahad','Rajendra Nagar','2 / 3 / 4 BHK','1,300 – 4,100 sq ft',1300,4100,'EOI from ₹6 L',null,null,null,'Pre-launch','8 & 13 acres','Two communities · up to G+33',null,null,
  array['Two prelaunch gated communities (8 & 13 acres)','Rooftop infinity pool, 75,000 sq ft clubhouse','Minutes from PVNR Expressway & ORR'],
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=900,h=680,fit=crop/AMq19Z68OEtq90DG/whatsapp-image-2025-05-09-at-12.30-AQEZ4MG0QvUWnzEg.jpg',false,true,24);
