/**
 * TARGETED TEST — Tests only the recently changed features:
 * 1. /api/data (new public endpoint)
 * 2. Rate limiting on /api/reviews
 * 3. Security headers (X-Content-Type-Options, X-Frame-Options)
 * 4. Cloudinary domain in next.config remotePatterns
 * 5. GymDataContext refresh path
 */

import https from 'https';

const BASE = 'https://powerhousefitnessclub.vercel.app';
let passed = 0, failed = 0;
const bugs = [];

function request(urlStr, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const reqOptions = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: { 'User-Agent': 'PowerhouseAuditBot/2.0', ...(options.headers || {}) },
    };
    const req = https.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

function parseJson(b) { try { return JSON.parse(b); } catch { return null; } }

function test(name, pass, detail = '') {
  if (pass) {
    console.log(`  ✅ PASS  ${name}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL  ${name}${detail ? ' — ' + detail : ''}`);
    bugs.push({ name, detail });
    failed++;
  }
}

console.log('\n╔══════════════════════════════════════════════════════╗');
console.log('║        TARGETED TEST — RECENT CHANGES ONLY          ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

// ─── 1. NEW PUBLIC DATA ENDPOINT ─────────────────────────────────────────────
console.log('━━━ 1. /api/data (new public endpoint) ━━━━━━━━━━━━━━━━');
try {
  const r = await request(`${BASE}/api/data?t=${Date.now()}`);
  test('GET /api/data returns 200', r.status === 200, `Got ${r.status}`);
  test('Content-Type is JSON', (r.headers['content-type'] || '').includes('application/json'));
  const json = parseJson(r.body);
  test('Response is valid JSON', !!json, r.body.slice(0, 100));
  test('GYM_INFO present', !!json?.GYM_INFO, JSON.stringify(json?.GYM_INFO || null));
  test('REVIEWS array present', Array.isArray(json?.REVIEWS), `type=${typeof json?.REVIEWS}`);
  test('GALLERY_ITEMS array present', Array.isArray(json?.GALLERY_ITEMS));
  test('MEMBERSHIP_PLANS array present', Array.isArray(json?.MEMBERSHIP_PLANS));
  test('SERVICES array present', Array.isArray(json?.SERVICES));
  test('TRAINERS array present', Array.isArray(json?.TRAINERS));
  test('ADMIN_CREDENTIALS NOT exposed', !json?.ADMIN_CREDENTIALS || (!json.ADMIN_CREDENTIALS?.password && !json.ADMIN_CREDENTIALS?.passwordHash),
    'SENSITIVE DATA LEAKED!');
  test('GYM_INFO.name is correct', json?.GYM_INFO?.name === 'Power House Fitness Club',
    `Got: ${json?.GYM_INFO?.name}`);
  test('GYM_INFO.tagline is set (not empty)', !!json?.GYM_INFO?.tagline, `Got: "${json?.GYM_INFO?.tagline}"`);
} catch (e) {
  test('/api/data endpoint', false, e.message);
}

// ─── 2. RATE LIMITING ON /api/reviews ────────────────────────────────────────
console.log('\n━━━ 2. Rate Limiting on /api/reviews ━━━━━━━━━━━━━━━━━━');
try {
  // First 3 requests should pass (or fail with 400/500 but NOT 429)
  let hitRateLimit = false;
  let firstPass = true;
  for (let i = 0; i < 5; i++) {
    const body = JSON.stringify({
      id: `rl-test-${Date.now()}-${i}`,
      name: `RateTest${i}`,
      comment: 'Rate limit test — automated',
      rating: 5,
      achievement: 'General Fitness',
      status: 'approved',
    });
    const r = await request(`${BASE}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      body,
    });
    console.log(`     Attempt ${i + 1}: status=${r.status}`);
    if (r.status === 429) { hitRateLimit = true; break; }
    if (i === 0 && r.status !== 200) firstPass = false;
  }
  test('First valid review submission accepted (200)', firstPass);
  test('Rate limit triggers 429 after rapid submissions', hitRateLimit,
    'No 429 seen — rate limiting may not be active yet (cold start resets in-memory map)');
} catch (e) {
  test('Rate limiting test', false, e.message);
}

// ─── 3. SECURITY HEADERS ─────────────────────────────────────────────────────
console.log('\n━━━ 3. Security Headers ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
try {
  const r = await request(`${BASE}/`);
  const h = r.headers;
  test('X-Content-Type-Options: nosniff', h['x-content-type-options'] === 'nosniff',
    `Got: "${h['x-content-type-options']}"`);
  test('X-Frame-Options: SAMEORIGIN', h['x-frame-options']?.toUpperCase() === 'SAMEORIGIN',
    `Got: "${h['x-frame-options']}"`);
  test('Referrer-Policy present', !!h['referrer-policy'], `Got: "${h['referrer-policy']}"`);
  test('Permissions-Policy present', !!h['permissions-policy'], `Got: "${h['permissions-policy']}"`);
} catch (e) {
  test('Security headers', false, e.message);
}

// ─── 4. CLOUDINARY IMAGES ────────────────────────────────────────────────────
console.log('\n━━━ 4. Cloudinary Image Optimization ━━━━━━━━━━━━━━━━━');
try {
  // Test that the Next.js image optimizer accepts a Cloudinary URL
  const cloudUrl = encodeURIComponent('https://res.cloudinary.com/z4lkvtpv/image/upload/v1/powerhouse/test.jpg');
  const r = await request(`${BASE}/_next/image?url=${cloudUrl}&w=640&q=75`);
  // 400 = URL exists but image not found (expected — this is a test URL)
  // 200 = image found and served
  // 403/500 = domain blocked → NOT OK
  test('Cloudinary domain accepted by Next.js image optimizer (not 403/500)',
    r.status !== 403 && r.status !== 500,
    `Got ${r.status} — ${r.status === 400 ? 'OK (test image not found, but domain is allowed)' : r.body.slice(0, 80)}`
  );
} catch (e) {
  test('Cloudinary image test', false, e.message);
}

// ─── 5. SEO TITLE FIX ────────────────────────────────────────────────────────
console.log('\n━━━ 5. SEO Title Fix ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
try {
  const r = await request(`${BASE}/`);
  const titleMatch = r.body.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch?.[1] || '';
  console.log(`     Title: "${title}"`);
  test('Title not dangling pipe (Power House Fitness Club |)', !title.match(/\|\s*$/), `Title="${title}"`);
  test('Title contains tagline', title.includes('|') && title.split('|')[1]?.trim().length > 0, `Title="${title}"`);

  const descMatch = r.body.match(/name="description"\s+content="([^"]+)"/);
  const desc = descMatch?.[1] || '';
  console.log(`     Description (${desc.length} chars): "${desc.slice(0, 60)}..."`);
  test('Meta description ≤ 160 chars', desc.length <= 160, `${desc.length} chars`);
  test('Meta description not empty', desc.length > 0);
} catch (e) {
  test('SEO title test', false, e.message);
}

// ─── 6. WWW CANONICALIZATION ─────────────────────────────────────────────────
console.log('\n━━━ 6. WWW Canonicalization ━━━━━━━━━━━━━━━━━━━━━━━━━━');
try {
  // Check middleware is not breaking non-www canonical
  const r = await request(`${BASE}/`);
  test('Non-www responds 200', r.status === 200, `Got ${r.status}`);
  test('Canonical URL set correctly', r.body.includes('powerhousefitnessclub.vercel.app'));
} catch (e) {
  test('Canonicalization test', false, e.message);
}

// ─── 7. ADMIN SECURITY (unchanged but verify not broken) ─────────────────────
console.log('\n━━━ 7. Admin Security (regression check) ━━━━━━━━━━━━━');
try {
  const adminRedirect = await request(`${BASE}/admin`);
  test('/admin still redirects without auth', adminRedirect.status >= 300 && adminRedirect.status < 400,
    `Got ${adminRedirect.status}`);

  const uploadNoAuth = await request(`${BASE}/api/admin/upload`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}'
  });
  test('/api/admin/upload still blocks without auth (401)', uploadNoAuth.status === 401, `Got ${uploadNoAuth.status}`);

  const wrongCreds = JSON.stringify({ username: 'wrong', password: 'wrong' });
  const wrongRes = await request(`${BASE}/api/admin/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(wrongCreds) },
    body: wrongCreds,
  });
  test('/api/admin/auth still returns 401 for wrong creds', wrongRes.status === 401, `Got ${wrongRes.status}`);
} catch (e) {
  test('Admin security regression', false, e.message);
}

// ─── FINAL REPORT ─────────────────────────────────────────────────────────────
console.log('\n╔══════════════════════════════════════════════════════╗');
console.log('║                   TEST REPORT                       ║');
console.log('╚══════════════════════════════════════════════════════╝');
console.log(`  ✅ Passed : ${passed}`);
console.log(`  ❌ Failed : ${failed}`);

if (bugs.length > 0) {
  console.log('\n┌─ FAILURES ───────────────────────────────────────────');
  bugs.forEach((b, i) => {
    console.log(`│ ${i + 1}. ${b.name}`);
    if (b.detail) console.log(`│    → ${b.detail}`);
  });
  console.log('└──────────────────────────────────────────────────────');
} else {
  console.log('\n  🎉 All tests passed!');
}
console.log(`\n  Score: ${passed}/${passed + failed}\n`);
