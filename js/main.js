/* ===================================================================
   More Space — App logic
   Header/footer injection · nav · filtering · reveal · contact form
   =================================================================== */

/* Mark JS active immediately so reveal animations only apply with JS (no-JS = content visible) */
document.documentElement.classList.add('has-js');

/* ---------- Icon set ---------- */
const I = {
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.512 5.26l-.999 3.648 3.477-.957zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>',
  li: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.3 19.5h2.04L6.49 3.24H4.31L17.6 20.65z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>',
  trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M17 7h4v4"/></svg>',
  building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M5 12H1M23 12h-4M5 5l2.5 2.5M16.5 16.5 19 19M19 5l-2.5 2.5M7.5 16.5 5 19"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>'
};

const wa = (msg) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg || "Hi More Space, I'd like to know more about your projects.")}`;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

/* ---------- Backend (Supabase) ----------
   The publishable key below is a PUBLIC key, safe to ship in the browser.
   Swap these two values if you move to your own project / rotate keys. */
const API = {
  url: "https://aszxypvnndlzzdmzwkrr.supabase.co",
  key: "sb_publishable_VywXCKPvxn5SLRehohV8dQ_9wOO9FkA",
  fn(name) { return `${this.url}/functions/v1/${name}`; },
  rest(path) { return `${this.url}/rest/v1/${path}`; },
  headers() { return { "Content-Type": "application/json", apikey: this.key, Authorization: `Bearer ${this.key}` }; },
  get enabled() { return /^https:\/\/[a-z0-9]+\.supabase\.co$/.test(this.url) && this.key.length > 20; },
};

async function submitEnquiry(payload) {
  const r = await fetch(API.fn("enquiry"), { method: "POST", headers: API.headers(), body: JSON.stringify(payload) });
  if (!r.ok) throw new Error("enquiry_failed");
  return r.json();
}

let CHAT_SESSION = (self.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Math.random()).slice(2);
const CHAT_HISTORY = [];
async function sendChat(message, extra = {}) {
  const r = await fetch(API.fn("chat"), {
    method: "POST", headers: API.headers(),
    body: JSON.stringify({ message, session_id: CHAT_SESSION, history: CHAT_HISTORY.slice(-8), page_url: location.href, ...extra }),
  });
  return r.json();
}

async function fetchProperties() {
  try {
    const r = await fetch(API.rest("properties?select=*&status=eq.published&order=display_order.asc"), { headers: API.headers() });
    if (!r.ok) return null;
    const rows = await r.json();
    return Array.isArray(rows) && rows.length ? rows.map(mapDbProperty) : null;
  } catch { return null; }
}
function mapDbProperty(row) {
  const stageLabel = row.is_upcoming ? "Pre-launch"
    : ({ ongoing: "Ongoing", landlord_share: "Landlord Share", resale: "Resale", ready: "Ready", prelaunch: "Pre-launch", investor: "Investor" }[row.stage] || row.stage);
  return {
    slug: row.slug, name: row.name,
    type: row.type === "apartment" ? "apartments" : row.type === "villa" ? "villas" : "plots",
    status: stageLabel, location: row.location, config: row.config, size: row.size_range,
    price: row.price_label || "On request",
    priceNote: row.price_per_sqft ? `≈ ₹${row.price_per_sqft}/sq ft` : (row.config || ""),
    possession: row.possession, towers: row.scale, rera: row.rera,
    image_url: row.image_url, highlights: row.highlights || [], is_upcoming: row.is_upcoming,
  };
}
const getProjects = () => (window.__DB_PROJECTS && window.__DB_PROJECTS.length) ? window.__DB_PROJECTS : PROJECTS;

/* ---------- Header ---------- */
function buildHeader() {
  const mount = $('#site-header'); if (!mount) return;
  const page = document.body.dataset.page || '';
  const cur = (p) => page === p ? ' aria-current="page"' : '';
  mount.outerHTML = `
  <header class="site-header" id="siteHeader">
    <div class="container">
      <a class="brand" href="index.html" aria-label="More Space home">
        <img src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=120,fit=crop,q=95/AMq19Z68OEtq90DG/untitled-design-A85V2Gln5jFKZkow.png" alt="More Space logo">
        <span>more<b>space</b></span>
      </a>
      <nav class="nav" aria-label="Primary">
        <ul class="nav-links" id="navLinks">
          <li><a class="navlink" href="index.html"${cur('home')}>Home</a></li>
          <li><a class="navlink" href="projects.html"${cur('projects')}>Projects</a></li>
          <li class="has-menu">
            <a class="navlink" href="upcoming.html"${cur('upcoming')}>Upcoming
              <svg class="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </a>
            <div class="submenu">
              ${UPCOMING.map(u => `<a href="${u.page}"><span class="dot"></span><span>${u.name}<small>${u.zone}</small></span></a>`).join('')}
            </div>
          </li>
          <li><a class="navlink" href="about.html"${cur('about')}>About</a></li>
          <li><a class="navlink" href="contact.html"${cur('contact')}>Contact</a></li>
          <li><a class="btn btn-primary btn-sm" href="contact.html">Book a Consultation</a></li>
        </ul>
        <div class="nav-cta">
          <a class="btn btn-ghost btn-sm" href="tel:${SITE.phoneRaw}">${I.phone}<span>Call</span></a>
          <a class="btn btn-ghost btn-sm" href="portal/index.html" rel="nofollow" title="Backend team login" aria-label="Team login">${I.key}<span>Login</span></a>
          <a class="btn btn-primary btn-sm" href="contact.html">Enquire</a>
          <button class="burger" id="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
        </div>
      </nav>
    </div>
  </header>`;

  const header = $('#siteHeader');
  const solid = () => header.classList.toggle('is-solid', window.scrollY > 24 || document.body.classList.contains('subpage'));
  solid(); window.addEventListener('scroll', solid, { passive: true });

  const burger = $('#burger');
  burger.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('#navLinks a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('nav-open')));
}

/* ---------- Footer ---------- */
function buildFooter() {
  const mount = $('#site-footer'); if (!mount) return;
  const s = SITE.socials;
  mount.outerHTML = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="brand" href="index.html"><span>more<b>space</b></span></a>
          <p>Helping you find your perfect property in Hyderabad — with transparency, trust and market insight. More value, more opportunities, more success in every square foot.</p>
          <div class="socials">
            <a href="${s.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.fb}</a>
            <a href="${s.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.ig}</a>
            <a href="${s.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${I.li}</a>
            <a href="${s.twitter}" target="_blank" rel="noopener" aria-label="X">${I.x}</a>
          </div>
        </div>
        <div>
          <h4>Explore</h4>
          <nav class="fmenu" aria-label="Footer">
            <a href="index.html">Home</a>
            <a href="projects.html">Featured Projects</a>
            <a href="upcoming.html">Upcoming Launches</a>
            <a href="about.html">About Us</a>
            <a href="contact.html">Contact</a>
          </nav>
        </div>
        <div>
          <h4>Upcoming</h4>
          <nav class="fmenu" aria-label="Upcoming projects">
            ${UPCOMING.map(u => `<a href="${u.page}">${u.name}</a>`).join('')}
          </nav>
        </div>
        <div>
          <h4>Get in touch</h4>
          <div class="fcontact">
            <a href="tel:${SITE.phoneRaw}">${I.phone}<span>${SITE.phone}</span></a>
            <a href="mailto:${SITE.email}">${I.mail}<span>${SITE.email}</span></a>
            <span>${I.pin}<span>${SITE.address}</span></span>
            <span>${I.clock}<span>${SITE.hours}</span></span>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© <span id="yr"></span> More Space. All rights reserved.</p>
        <div class="fb-links">
          <a href="contact.html">Privacy</a>
          <a href="contact.html">Disclaimer</a>
          <a href="${wa('Hi More Space!')}" target="_blank" rel="noopener">WhatsApp</a>
          <a href="portal/index.html" rel="nofollow">Team Login</a>
        </div>
      </div>
    </div>
  </footer>`;
  const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
}

/* ---------- Floating WhatsApp ---------- */
function buildFab() {
  if ($('.fab-wa')) return;
  const a = document.createElement('a');
  a.className = 'fab-wa';
  a.href = wa(); a.target = '_blank'; a.rel = 'noopener';
  a.setAttribute('aria-label', 'Chat on WhatsApp');
  a.innerHTML = I.wa;
  document.body.appendChild(a);
}

/* ---------- Project card ---------- */
function projectCard(p) {
  const statusClass = p.status === 'Landlord Share' || p.status === 'Ongoing' ? 'is-ongoing'
    : (/Pre/i.test(p.status) ? 'is-prelaunch' : '');
  const msg = `Hi More Space, I'm interested in ${p.name} (${p.location}). Please share details.`;
  return `
  <article class="pcard reveal" data-type="${p.type}">
    <div class="pcard__media">
      <img loading="lazy" src="${p.image_url || IMG(p.img, 760, 580)}" alt="${p.name}">
      <span class="pcard__tag ${statusClass}">${p.status}</span>
    </div>
    <div class="pcard__body">
      <span class="pcard__loc">${I.pin}${p.location}</span>
      <h3>${p.name}</h3>
      <div class="pcard__specs">
        <div class="s"><span>Config</span><b>${p.config}</b></div>
        <div class="s"><span>Size</span><b>${p.size}</b></div>
        <div class="s"><span>Possession</span><b>${p.possession}</b></div>
        <div class="s"><span>Scale</span><b>${p.towers}</b></div>
      </div>
      <div class="pcard__foot">
        <div class="pcard__price"><span class="p">${p.price}</span><small>${p.priceNote}</small></div>
        <a class="btn btn-whatsapp btn-sm pcard__wa" href="${wa(msg)}" target="_blank" rel="noopener" aria-label="Enquire about ${p.name}">${I.wa}Enquire</a>
      </div>
    </div>
  </article>`;
}

/* ---------- Renderers ---------- */
function renderFeatured() {
  const grid = $('#featuredGrid'); if (!grid) return;
  grid.innerHTML = getProjects().slice(0, 6).map(projectCard).join('');
  observeReveal();
}

function renderProjects() {
  const grid = $('#projectGrid'); if (!grid) return;
  const draw = (type) => {
    const all = getProjects();
    const list = type === 'all' ? all : all.filter(p => p.type === type);
    grid.innerHTML = list.length ? list.map(projectCard).join('') : '<p class="empty">No projects in this category yet.</p>';
    observeReveal();
  };
  draw('all');
  $$('.chip').forEach(chip => chip.addEventListener('click', () => {
    $$('.chip').forEach(c => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    draw(chip.dataset.filter);
  }));
}

function renderUpcomingCards() {
  const grid = $('#upcomingGrid'); if (!grid) return;
  grid.innerHTML = UPCOMING.map(u => `
    <a class="loc reveal" href="${u.page}">
      <img loading="lazy" src="${IMG(u.img, 760, 560)}" alt="${u.name}">
      <span class="arrow">${I.arrow}</span>
      <div class="loc__body">
        <span class="loc__kicker">${u.zone} · ${u.tag}</span>
        <h3>${u.name}</h3>
        <p>${u.blurb}</p>
      </div>
    </a>`).join('');
}

function renderServices() {
  const grid = $('#servicesGrid'); if (!grid) return;
  grid.innerHTML = SERVICES.map((s, i) => `
    <div class="feature reveal" data-d="${i + 1}">
      <div class="ic">${I[s.icon]}</div>
      <h3>${s.title}</h3>
      <p>${s.text}</p>
    </div>`).join('');
}

/* ---------- Reveal on scroll ---------- */
let revealObs;
function observeReveal() {
  if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(el => el.classList.add('in')); return; }
  if (!revealObs) {
    revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  }
  $$('.reveal:not(.in)').forEach(el => revealObs.observe(el));
}

/* ---------- Contact form → backend enquiry (WhatsApp fallback) ---------- */
function initForm() {
  const form = $('#contactForm'); if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form).entries());
    const btn = form.querySelector('[type="submit"]');
    const orig = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    const payload = {
      name: d.name, phone: d.phone, email: d.email, message: d.message,
      interest: d.interest, source: 'website_form', page_url: location.href,
    };
    try {
      await submitEnquiry(payload);
      $('#formSuccess')?.classList.add('show');
      form.reset();
    } catch {
      // Backend unreachable → fall back to WhatsApp so no lead is ever lost
      const msg = `Hi More Space,%0A%0AName: ${d.name || ''}%0APhone: ${d.phone || ''}%0AEmail: ${d.email || ''}%0A%0A${d.message || ''}`;
      window.open(`https://wa.me/${SITE.whatsapp}?text=${msg}`, '_blank');
      $('#formSuccess')?.classList.add('show');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = orig || 'Submit enquiry'; }
    }
  });
}

/* ---------- AI chat widget ("Spacey") ---------- */
function buildChatWidget() {
  if ($('#ms-chat')) return;
  const el = document.createElement('div');
  el.id = 'ms-chat';
  el.innerHTML =
    `<button class="mschat-fab" id="mschatFab" aria-label="Chat with Spacey">${I.spark}<span>Ask Spacey</span></button>
     <div class="mschat-panel" id="mschatPanel" hidden>
       <div class="mschat-head"><div><b>Spacey</b><small>More Space assistant</small></div><button id="mschatClose" aria-label="Close chat">✕</button></div>
       <div class="mschat-body" id="mschatBody"></div>
       <form class="mschat-input" id="mschatForm"><input id="mschatText" placeholder="Ask about a project, price, area…" autocomplete="off" maxlength="500"><button type="submit" aria-label="Send">${I.arrow}</button></form>
     </div>`;
  document.body.appendChild(el);
  const panel = $('#mschatPanel'), body = $('#mschatBody');
  const add = (role, text) => { const m = document.createElement('div'); m.className = `mschat-msg ${role}`; m.textContent = text; body.appendChild(m); body.scrollTop = body.scrollHeight; return m; };
  $('#mschatFab').addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    if (!panel.hidden && !body.dataset.greeted) {
      body.dataset.greeted = '1';
      add('bot', "Hi! I'm Spacey 👋 Ask me about any More Space project — price, size, area or possession. What are you looking for?");
    }
  });
  $('#mschatClose').addEventListener('click', () => { panel.hidden = true; });
  $('#mschatForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = $('#mschatText'); const text = input.value.trim(); if (!text) return;
    add('me', text); input.value = '';
    CHAT_HISTORY.push({ role: 'user', content: text });
    const typing = add('bot', '…');
    try {
      const res = await sendChat(text);
      typing.textContent = res.reply || "Sorry, please try again.";
      if (res.reply) CHAT_HISTORY.push({ role: 'assistant', content: res.reply });
    } catch {
      typing.textContent = `I'm having trouble connecting — please WhatsApp us at ${SITE.phone}.`;
    }
  });
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  buildHeader();
  buildFooter();
  buildFab();
  buildChatWidget();
  renderServices();
  renderFeatured();
  renderProjects();
  renderUpcomingCards();
  initForm();
  observeReveal();

  // Progressive enhancement: pull live listings from Supabase; fall back to
  // the bundled data.js if the backend is unreachable (site always works).
  if (API.enabled && ($('#featuredGrid') || $('#projectGrid'))) {
    fetchProperties().then((rows) => {
      if (!rows) return;
      window.__DB_PROJECTS = rows.filter((r) => !r.is_upcoming);
      renderFeatured();
      renderProjects();
    });
  }
});
