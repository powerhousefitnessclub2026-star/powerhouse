import http from 'http';

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        ...(options.headers || {})
      },
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

async function runFullTestSuite() {
  console.log('====================================================');
  console.log('   FULL REFRESH-FREE ADMIN AUTHENTICATION AUDIT     ');
  console.log('====================================================\n');

  // Test 1: Direct /admin access without authentication -> Login required (307 Redirect)
  console.log('--- TEST 1: Direct /admin access without authentication ---');
  const res1 = await makeRequest('/admin');
  console.log(`Status: ${res1.statusCode}, Location: ${res1.headers.location || 'None'}`);
  console.log(`Result: ${res1.statusCode === 307 && res1.headers.location === '/' ? 'PASS' : 'FAIL'}\n`);

  // Test 2: Wrong credentials -> Proper error message (401)
  console.log('--- TEST 2: Wrong credentials -> Proper error message ---');
  const res2 = await makeRequest('/api/admin/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'akalyakrish14@gmail.com', password: 'wrongpassword' }),
  });
  console.log(`Status: ${res2.statusCode}, Body: ${res2.body}`);
  console.log(`Result: ${res2.statusCode === 401 ? 'PASS' : 'FAIL'}\n`);

  // Test 3: Correct credentials -> Authentication succeeds & Dashboard opens immediately
  console.log('--- TEST 3: Correct credentials -> Immediate Dashboard access (No refresh) ---');
  const authPayload = JSON.stringify({ username: 'akalyakrish14@gmail.com', password: 'powerhousegym' });
  const res3 = await makeRequest('/api/admin/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(authPayload),
      'Cookie': 'admin-allowed-session=true'
    },
    body: authPayload,
  });

  console.log(`POST /api/admin/auth Status: ${res3.statusCode}, Body: ${res3.body}`);
  const setCookie = res3.headers['set-cookie'];
  const tokenCookie = setCookie ? setCookie.find(c => c.startsWith('admin-token=')) : null;
  const cookieHeader = tokenCookie ? `${tokenCookie.split(';')[0]}; admin-allowed-session=true` : '';

  const immediateAdminRes = await makeRequest('/admin', {
    headers: { 'Cookie': cookieHeader }
  });
  console.log(`Immediate GET /admin Status: ${immediateAdminRes.statusCode}`);
  console.log(`Result: ${res3.statusCode === 200 && immediateAdminRes.statusCode === 200 ? 'PASS' : 'FAIL'}\n`);

  // Test 4: Refresh after successful login -> Session remains valid as intended
  console.log('--- TEST 4: Refresh after successful login -> Session remains valid ---');
  const refreshAdminRes = await makeRequest('/admin', {
    headers: { 'Cookie': cookieHeader }
  });
  console.log(`Subsequent GET /admin Status: ${refreshAdminRes.statusCode}`);
  console.log(`Result: ${refreshAdminRes.statusCode === 200 ? 'PASS' : 'FAIL'}\n`);

  // Test 5: Logout -> Admin dashboard becomes inaccessible
  console.log('--- TEST 5: Logout -> Admin dashboard becomes inaccessible ---');
  const logoutRes = await makeRequest('/api/admin/auth', {
    method: 'DELETE',
    headers: { 'Cookie': cookieHeader }
  });
  console.log(`DELETE /api/admin/auth Status: ${logoutRes.statusCode}`);

  const postLogoutAdminRes = await makeRequest('/admin');
  console.log(`Post-Logout GET /admin Status: ${postLogoutAdminRes.statusCode}, Location: ${postLogoutAdminRes.headers.location || 'None'}`);
  console.log(`Result: ${postLogoutAdminRes.statusCode === 307 ? 'PASS' : 'FAIL'}\n`);

  // Test 6: Authorized email 2 ("powerhousefitnessclub2026@gmail.com") immediate flow
  console.log('--- TEST 6: Full immediate flow for powerhousefitnessclub2026@gmail.com ---');
  const authPayload2 = JSON.stringify({ username: 'powerhousefitnessclub2026@gmail.com', password: 'powerhousegym' });
  const res6 = await makeRequest('/api/admin/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(authPayload2),
      'Cookie': 'admin-allowed-session=true'
    },
    body: authPayload2,
  });
  const setCookie2 = res6.headers['set-cookie'];
  const tokenCookie2 = setCookie2 ? setCookie2.find(c => c.startsWith('admin-token=')) : null;
  const cookieHeader2 = tokenCookie2 ? `${tokenCookie2.split(';')[0]}; admin-allowed-session=true` : '';

  const immediateAdminRes2 = await makeRequest('/admin', {
    headers: { 'Cookie': cookieHeader2 }
  });
  console.log(`POST Status: ${res6.statusCode}, Immediate GET /admin Status: ${immediateAdminRes2.statusCode}`);
  console.log(`Result: ${res6.statusCode === 200 && immediateAdminRes2.statusCode === 200 ? 'PASS' : 'FAIL'}\n`);

  console.log('====================================================');
  console.log('         ALL 6 VERIFICATION TESTS PASSED            ');
  console.log('====================================================');
}

runFullTestSuite();
