/**
 * POWER HOUSE FITNESS CLUB — Full Automated Audit
 * Tests production: https://powerhousefitnessclub.vercel.app
 */

import https from 'https';
import http from 'http';

const BASE = 'https://powerhousefitnessclub.vercel.app';
let passed = 0, failed = 0, warnings = 0;
const bugs = [];

// ─── HTTP Helper ────────────────────────────────────────────────────────────
function request(urlStr, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const lib = url.protocol === 'https:' ? https : http;
    const reqOptions = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'PowerhouseAuditBot/1.0',
        ...(options.headers || {}),
      },
    };

    const req = lib.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () =>
        resolve({ status: res.statusCode, headers: res.headers, body })
      );
    });

    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

function parseJson(body) {
  try { return JSON.parse(body); } catch { return null; }
}

// ─── Test Runner ─────────────────────────────────────────────────────────────
function test(name, pass, detail = '', severity = 'BUG') {
  if (pass) {
    console.log(`  ✅ PASS  ${name}`);
    passed++;
  } else {
    const icon = severity === 'WARN' ? '⚠️ ' : '❌';
    console.log(`  ${icon} ${severity}  ${name}${detail ? ' — ' + detail : ''}`);
    bugs.push({ severity, name, detail });
    severity === 'WARN' ? warnings++ : failed++;
  }
}

function warn(name, pass, detail = '') { return test(name, pass, detail, 'WARN'); }

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n╔══════════════════════════════════════════════════════╗');
console.log('║   POWER HOUSE FITNESS CLUB — FULL AUTOMATED AUDIT   ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

// ─── 1. HOMEPAGE & SEO ───────────────────────────────────────────────────────
console.log('━━━ 1. HOMEPAGE & SEO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
try {
  const home = await request(BASE + '/');
  test('Homepage reachable (200)', home.status === 200, `Got ${home.status}`);
  test('Content-Type is HTML', (home.headers['content-type'] || '').includes('text/html'));
  test('<title> tag present', home.body.includes('<title>'));
  test('Title not empty/dangling pipe', !home.body.match(/<title>[^<]*\|\s*<\/title>/));
  test('Meta description present', home.body.includes('name="description"'));

  const descMatch = home.body.match(/name="description"\s+content="([^"]+)"/);
  const descLen = descMatch ? descMatch[1].length : 0;
  warn('Meta description ≤ 160 chars', descLen <= 160, `${descLen} chars`);

  test('Canonical tag present', home.body.includes('rel="canonical"'));
  test('OG title present', home.body.includes('og:title'));
  test('OG description present', home.body.includes('og:description'));
  test('Schema.org JSON-LD present', home.body.includes('application/ld+json'));
  test('Viewport meta tag present', home.body.includes('name="viewport"'));
  test('H1 tag present', home.body.includes('<h1'));
  test('HTTPS used', BASE.startsWith('https://'));

  // Security headers
  warn('X-Content-Type-Options header', !!home.headers['x-content-type-options']);
  warn('X-Frame-Options or CSP header', !!(home.headers['x-frame-options'] || home.headers['content-security-policy']));
} catch (e) {
  test('Homepage reachable', false, e.message);
}

// ─── 2. SEO FILES ───────────────────────────────────────────────────────────
console.log('\n━━━ 2. SEO FILES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
try {
  const sitemap = await request(BASE + '/sitemap.xml');
  test('sitemap.xml reachable (200)', sitemap.status === 200, `Got ${sitemap.status}`);
  test('sitemap.xml is valid XML', sitemap.body.includes('<?xml') && sitemap.body.includes('<urlset'));
  test('sitemap.xml contains homepage URL', sitemap.body.includes('powerhousefitnessclub.vercel.app'));
  test('sitemap.xml Content-Type is XML', (sitemap.headers['content-type'] || '').includes('xml'));
} catch (e) {
  test('sitemap.xml', false, e.message);
}

try {
  const robots = await request(BASE + '/robots.txt');
  test('robots.txt reachable (200)', robots.status === 200, `Got ${robots.status}`);
  test('robots.txt contains Sitemap directive', robots.body.includes('Sitemap:'));
  test('robots.txt blocks /admin/', robots.body.includes('Disallow: /admin'));
  test('robots.txt blocks /api/', robots.body.includes('Disallow: /api/'));
  test('robots.txt allows / (public crawl)', robots.body.includes('Allow: /'));
} catch (e) {
  test('robots.txt', false, e.message);
}

// ─── 3. WWW REDIRECT ─────────────────────────────────────────────────────────
console.log('\n━━━ 3. WWW CANONICALIZATION ━━━━━━━━━━━━━━━━━━━━━━━━━━');
// Note: Vercel handles www subdomain only if configured in project settings
// We test non-www directly (canonical)
try {
  const canonical = await request(BASE + '/');
  test('Non-www canonical responds 200', canonical.status === 200);
} catch(e) {
  test('Canonical URL', false, e.message);
}

// ─── 4. ADMIN SECURITY ───────────────────────────────────────────────────────
console.log('\n━━━ 4. ADMIN SECURITY TESTS ━━━━━━━━━━━━━━━━━━━━━━━━━━');
try {
  // Unauthenticated /admin must redirect
  const adminNoAuth = await request(BASE + '/admin');
  test('/admin redirects without auth (3xx)', adminNoAuth.status >= 300 && adminNoAuth.status < 400, `Got ${adminNoAuth.status}`);

  // API protected without auth
  const apiNoAuth = await request(BASE + '/api/admin/data');
  test('/api/admin/data reachable publicly (data endpoint is open for SSR)', apiNoAuth.status === 200, `Got ${apiNoAuth.status}`);

  // Upload must be protected
  const uploadNoAuth = await request(BASE + '/api/admin/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  test('/api/admin/upload blocked without auth (401)', uploadNoAuth.status === 401, `Got ${uploadNoAuth.status}`);

  // Wrong credentials must return 401
  const wrongCredsBody = JSON.stringify({ username: 'hacker@evil.com', password: 'wrongpass' });
  const wrongCreds = await request(BASE + '/api/admin/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(wrongCredsBody) },
    body: wrongCredsBody,
  });
  test('Wrong credentials returns 401', wrongCreds.status === 401, `Got ${wrongCreds.status}`);

  // Empty credentials must return 400
  const emptyCredsBody = JSON.stringify({ username: '', password: '' });
  const emptyCreds = await request(BASE + '/api/admin/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(emptyCredsBody) },
    body: emptyCredsBody,
  });
  test('Empty credentials returns 400', emptyCreds.status === 400, `Got ${emptyCreds.status}`);

  // SQL/NoSQL injection attempt
  const injectionBody = JSON.stringify({ username: { $gt: '' }, password: { $gt: '' } });
  const injection = await request(BASE + '/api/admin/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(injectionBody) },
    body: injectionBody,
  });
  test('NoSQL injection attempt blocked (not 200)', injection.status !== 200, `Got ${injection.status}`);

  // Check-auth without cookie
  const checkAuthNoToken = await request(BASE + '/api/admin/check-auth');
  const checkBody = parseJson(checkAuthNoToken.body);
  test('/api/admin/check-auth returns authenticated:false without token',
    checkAuthNoToken.status === 200 && checkBody?.authenticated === false,
    `Got ${checkAuthNoToken.status} body=${checkAuthNoToken.body.slice(0, 80)}`
  );
} catch (e) {
  test('Admin security', false, e.message);
}

// ─── 5. REVIEWS API ──────────────────────────────────────────────────────────
console.log('\n━━━ 5. REVIEWS API ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
try {
  // Valid review submission
  const validReview = JSON.stringify({
    id: `audit-test-${Date.now()}`,
    name: 'Audit Test User',
    role: 'Verified Member',
    rating: 5,
    comment: 'Automated audit test review — please delete.',
    achievement: 'General Fitness',
    avatar: '',
    status: 'pending',
  });
  const reviewRes = await request(BASE + '/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(validReview) },
    body: validReview,
  });
  test('POST /api/reviews returns 200 for valid data', reviewRes.status === 200, `Got ${reviewRes.status} — ${reviewRes.body.slice(0, 100)}`);

  // Invalid review (missing name)
  const badReview = JSON.stringify({ comment: 'No name review' });
  const badRes = await request(BASE + '/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(badReview) },
    body: badReview,
  });
  test('POST /api/reviews returns 400 for missing name', badRes.status === 400, `Got ${badRes.status}`);

  // Empty body
  const emptyBody = '{}';
  const emptyRes = await request(BASE + '/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(emptyBody) },
    body: emptyBody,
  });
  test('POST /api/reviews returns 400 for empty body', emptyRes.status === 400, `Got ${emptyRes.status}`);

  // XSS attempt in review
  const xssReview = JSON.stringify({
    id: `xss-${Date.now()}`,
    name: '<script>alert(1)</script>',
    comment: '<img src=x onerror=alert(1)>',
    rating: 5,
    achievement: 'General Fitness',
  });
  const xssRes = await request(BASE + '/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(xssReview) },
    body: xssReview,
  });
  warn('XSS payload in review name/comment is rejected or sanitized',
    xssRes.status !== 200 || parseJson(xssRes.body)?.success !== true,
    `Got ${xssRes.status} — XSS data accepted into DB (React will escape on render)`
  );

  // Rate limit check (5 rapid requests)
  let rateLimitTriggered = false;
  for (let i = 0; i < 5; i++) {
    const r = JSON.stringify({ id: `rl-${i}`, name: `RateTest${i}`, comment: 'rate limit test', rating: 5, achievement: 'General Fitness' });
    const resp = await request(BASE + '/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(r) },
      body: r,
    });
    if (resp.status === 429) { rateLimitTriggered = true; break; }
  }
  warn('Rate limiting on /api/reviews (429 on rapid requests)', rateLimitTriggered,
    'No rate limiting detected — spam reviews possible'
  );

} catch (e) {
  test('Reviews API', false, e.message);
}

// ─── 6. CONTACT API ──────────────────────────────────────────────────────────
console.log('\n━━━ 6. CONTACT API ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
try {
  // Missing required fields
  const badContact = JSON.stringify({ name: 'Test' });
  const badContactRes = await request(BASE + '/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(badContact) },
    body: badContact,
  });
  test('POST /api/contact returns 400 for missing fields', badContactRes.status === 400, `Got ${badContactRes.status}`);

  // Invalid email format
  const badEmail = JSON.stringify({ name: 'Test', phone: '9876543210', email: 'notanemail', gender: 'Male', age: 25, fitnessGoal: 'Cardio', preferredTime: 'Morning', message: 'test' });
  const badEmailRes = await request(BASE + '/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(badEmail) },
    body: badEmail,
  });
  test('POST /api/contact rejects invalid email (400)', badEmailRes.status === 400, `Got ${badEmailRes.status}`);

  // GET method should be 405 (method not allowed)
  const getContact = await request(BASE + '/api/contact');
  warn('GET /api/contact returns 405 Method Not Allowed', getContact.status === 405 || getContact.status === 404, `Got ${getContact.status}`);

} catch (e) {
  test('Contact API', false, e.message);
}

// ─── 7. DATA API ─────────────────────────────────────────────────────────────
console.log('\n━━━ 7. ADMIN DATA API ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
try {
  const data = await request(BASE + '/api/admin/data');
  test('GET /api/admin/data returns 200', data.status === 200, `Got ${data.status}`);
  const json = parseJson(data.body);
  test('Response is valid JSON', !!json);
  test('GYM_INFO present in response', !!json?.GYM_INFO);
  test('REVIEWS array present', Array.isArray(json?.REVIEWS));
  test('MEMBERSHIP_PLANS array present', Array.isArray(json?.MEMBERSHIP_PLANS));
  test('SERVICES array present', Array.isArray(json?.SERVICES));
  test('TRAINERS array present', Array.isArray(json?.TRAINERS));

  // Sensitive data not exposed
  test('ADMIN_CREDENTIALS not exposed in public data endpoint',
    !json?.ADMIN_CREDENTIALS || (!json.ADMIN_CREDENTIALS?.password && !json.ADMIN_CREDENTIALS?.passwordHash),
    'Admin credentials exposed in public API!'
  );
} catch (e) {
  test('Data API', false, e.message);
}

// ─── 8. ERROR PAGES ──────────────────────────────────────────────────────────
console.log('\n━━━ 8. ERROR HANDLING ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
try {
  const notFound = await request(BASE + '/this-page-does-not-exist-at-all-404xyz');
  test('404 page returns 404 status', notFound.status === 404, `Got ${notFound.status}`);
  test('404 page is HTML (not blank)', notFound.body.length > 100 && (notFound.headers['content-type'] || '').includes('text/html'));
} catch (e) {
  test('404 handling', false, e.message);
}

// ─── 9. PERFORMANCE / RESPONSE TIME ─────────────────────────────────────────
console.log('\n━━━ 9. RESPONSE TIME ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
try {
  const t0 = Date.now();
  await request(BASE + '/api/admin/data');
  const dbTime = Date.now() - t0;
  warn('API /data responds within 3000ms', dbTime < 3000, `${dbTime}ms (cold start possible)`);
  console.log(`     DB API response time: ${dbTime}ms`);

  const t1 = Date.now();
  await request(BASE + '/sitemap.xml');
  const sitemapTime = Date.now() - t1;
  warn('sitemap.xml responds within 1000ms', sitemapTime < 1000, `${sitemapTime}ms`);
  console.log(`     Sitemap response time: ${sitemapTime}ms`);
} catch (e) {
  warn('Response time test', false, e.message);
}

// ─── FINAL REPORT ────────────────────────────────────────────────────────────
console.log('\n╔══════════════════════════════════════════════════════╗');
console.log('║                   AUDIT REPORT                      ║');
console.log('╚══════════════════════════════════════════════════════╝');
console.log(`  ✅ Passed  : ${passed}`);
console.log(`  ⚠️  Warnings: ${warnings}`);
console.log(`  ❌ Bugs    : ${failed}`);

if (bugs.length > 0) {
  console.log('\n┌─ BUG REPORT ─────────────────────────────────────────');
  bugs.forEach((b, i) => {
    const icon = b.severity === 'WARN' ? '⚠️ ' : '❌';
    console.log(`│ ${i + 1}. [${b.severity}] ${b.name}`);
    if (b.detail) console.log(`│    → ${b.detail}`);
  });
  console.log('└──────────────────────────────────────────────────────');
}

console.log(`\n  Score: ${passed}/${passed + failed + warnings} tests passed\n`);
