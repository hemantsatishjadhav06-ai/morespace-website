'use strict';
/* Deploy ./site.zip (live mirror + approved blog overlay) to Netlify as one
   atomic ZIP deploy, then wait for it to go live. */
const https = require('https'), fs = require('fs');
const TOKEN = process.env.NETLIFY_TOKEN; if (!TOKEN) { console.error('NETLIFY_TOKEN not set'); process.exit(1); }
const SITE = process.env.NETLIFY_SITE_ID || '964e086b-1cf2-47f7-8b78-16909d268319';
function req(m, path, headers, body) { return new Promise((res, rej) => { const r = https.request({ method: m, hostname: 'api.netlify.com', path, headers: { Authorization: 'Bearer ' + TOKEN, ...headers } }, rs => { const c = []; rs.on('data', d => c.push(d)); rs.on('end', () => res({ code: rs.statusCode, text: Buffer.concat(c).toString('utf8') })); }); r.on('error', rej); if (body) r.write(body); r.end(); }); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const zip = fs.readFileSync('site.zip');
  console.log('zip bytes:', zip.length);
  const dep = await req('POST', `/api/v1/sites/${SITE}/deploys`, { 'Content-Type': 'application/zip', 'Content-Length': zip.length }, zip);
  if (dep.code >= 300) { console.error('deploy POST HTTP ' + dep.code + ': ' + dep.text.slice(0, 300)); process.exit(1); }
  const d = JSON.parse(dep.text);
  console.log('deploy id:', d.id, '| initial state:', d.state);
  let state = d.state;
  for (let i = 0; i < 90; i++) {
    await sleep(4000);
    const g = await req('GET', `/api/v1/sites/${SITE}/deploys/${d.id}`);
    if (g.code === 200) { const gd = JSON.parse(g.text); state = gd.state; if (['ready', 'current'].includes(state)) break; if (state === 'error') { console.error('deploy error:', gd.error_message); process.exit(1); } }
    if (i % 3 === 0) console.log('  ...', state);
  }
  console.log('FINAL', state);
  if (!['ready', 'current'].includes(state)) process.exit(1);
  console.log('DEPLOY_OK');
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
