async function testLogin(username, password) {
  try {
    const res = await fetch('http://localhost:3000/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const status = res.status;
    const data = await res.json();
    const setCookieHeader = res.headers.get('set-cookie');

    console.log(`TEST username="${username}", password="${password}" => Status: ${status}, Body:`, data, `Set-Cookie:`, setCookieHeader ? 'YES' : 'NO');
    return { status, data, setCookieHeader };
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

async function run() {
  console.log('--- TESTING ADMIN AUTH API ---');
  await testLogin('powerhouse', 'powerhousegym');
  await testLogin('powerhousefitnessclub2026@gmail.com', 'powerhousegym');
  await testLogin('akalyakrish14@gmail.com', 'powerhousegym');
  await testLogin('wronguser', 'powerhousegym');
  await testLogin('powerhouse', 'wrongpass');
}

run();
