import http from 'http';

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body,
        });
      });
    });

    req.on('error', err => reject(err));

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function testImmediateRedirect() {
  console.log('--- TESTING IMMEDIATE POST-LOGIN REDIRECT FLOW ---');

  // 1. Send Login Request
  const payload = JSON.stringify({ username: 'akalyakrish14@gmail.com', password: 'powerhousegym' });
  const authRes = await makeRequest('/api/admin/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'Cookie': 'admin-allowed-session=true'
    },
    body: payload,
  });

  console.log(`1. POST /api/admin/auth Status: ${authRes.statusCode}`);
  const setCookie = authRes.headers['set-cookie'];
  const tokenCookie = setCookie ? setCookie.find(c => c.startsWith('admin-token=')) : null;
  const cookieHeader = tokenCookie ? `${tokenCookie.split(';')[0]}; admin-allowed-session=true` : 'admin-allowed-session=true';

  console.log(`   Cookies to pass to /admin: "${cookieHeader}"`);

  // 2. Check Auth Endpoint Immediately
  const checkRes = await makeRequest('/api/admin/check-auth', {
    headers: { 'Cookie': cookieHeader }
  });
  console.log(`2. GET /api/admin/check-auth Status: ${checkRes.statusCode}, Body: ${checkRes.body}`);

  // 3. Check /admin Route Immediately
  const adminRes = await makeRequest('/admin', {
    headers: { 'Cookie': cookieHeader }
  });
  console.log(`3. GET /admin Status: ${adminRes.statusCode}`);

  if (adminRes.statusCode === 200) {
    console.log('SUCCESS: /admin is immediately accessible with HTTP 200!');
  } else {
    console.log(`FAIL: /admin returned ${adminRes.statusCode}, Location: ${adminRes.headers.location}`);
  }
}

testImmediateRedirect();
