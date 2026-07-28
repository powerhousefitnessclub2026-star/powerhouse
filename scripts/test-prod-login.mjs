import http from 'https';

function testProdAuth(username, password) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ username, password });
    const req = http.request({
      hostname: 'powerhousefitnessclub.vercel.app',
      path: '/api/admin/auth',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('Testing Production Vercel Auth Endpoint...');
  const resDefault = await testProdAuth('powerhouse', 'powerhousegym');
  console.log('Production Default Login Status:', resDefault.status, 'Body:', resDefault.body);
  const resWrong = await testProdAuth('powerhouse', 'invalidpass999');
  console.log('Production Wrong Login Status:', resWrong.status, 'Body:', resWrong.body);
}

run();
