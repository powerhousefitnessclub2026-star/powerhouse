/**
 * Fixes the stale GYM_INFO.tagline in the production MongoDB via the Vercel API.
 * Login → get auth cookie → PATCH GYM_INFO.tagline via /api/admin/data POST
 */
import https from 'https';

const BASE = 'powerhousefitnessclub.vercel.app';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: BASE,
      port: 443,
      path,
      method: options.method || 'GET',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
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

async function run() {
  console.log('Step 1: Login to admin via production API...');
  const loginPayload = JSON.stringify({ username: 'powerhouse', password: 'powerhousegym' });
  const loginRes = await request('/api/admin/auth', {
    method: 'POST',
    headers: { 'Content-Length': Buffer.byteLength(loginPayload) },
    body: loginPayload,
  });

  console.log(`Login status: ${loginRes.status}`);
  if (loginRes.status !== 200) {
    console.error('Login failed:', loginRes.body);
    process.exit(1);
  }

  // Extract admin-token cookie
  const setCookieHeader = loginRes.headers['set-cookie'] || [];
  const tokenCookie = setCookieHeader.find(c => c.startsWith('admin-token='));
  if (!tokenCookie) {
    console.error('No admin-token cookie received. Cannot proceed.');
    process.exit(1);
  }
  const cookieValue = tokenCookie.split(';')[0]; // "admin-token=powerhouse-authenticated-session"
  console.log(`Got cookie: ${cookieValue}`);

  // Step 2: Fetch current data to get existing GYM_INFO
  console.log('\nStep 2: Fetching current GYM_INFO from /api/data...');
  const dataRes = await request('/api/data');
  const currentData = JSON.parse(dataRes.body);
  console.log(`Current tagline: "${currentData.GYM_INFO?.tagline}"`);

  // Step 3: Patch just the tagline via admin POST
  console.log('\nStep 3: Updating tagline in MongoDB via /api/admin/data...');
  const updatedGymInfo = { ...currentData.GYM_INFO, tagline: 'Premium Unisex Gym in Erode' };
  const patchPayload = JSON.stringify({ GYM_INFO: updatedGymInfo });

  const patchRes = await request('/api/admin/data', {
    method: 'POST',
    headers: {
      'Cookie': cookieValue,
      'Content-Length': Buffer.byteLength(patchPayload),
    },
    body: patchPayload,
  });

  console.log(`Patch status: ${patchRes.status}, body: ${patchRes.body}`);

  // Step 4: Verify
  console.log('\nStep 4: Verifying update...');
  const verifyRes = await request('/api/data?t=' + Date.now());
  const verified = JSON.parse(verifyRes.body);
  const newTagline = verified.GYM_INFO?.tagline;
  console.log(`New tagline: "${newTagline}"`);

  if (newTagline === 'Premium Unisex Gym in Erode') {
    console.log('\n✅ SUCCESS — tagline updated in MongoDB!');
  } else {
    console.log('\n❌ FAIL — tagline not updated. Got:', newTagline);
  }
}

run().catch(console.error);
