import http from 'http';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
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
    req.end();
  });
}

async function run() {
  console.log('--- TESTING /sitemap.xml & /robots.txt ENDPOINTS ---');
  
  const sitemapRes = await makeRequest('/sitemap.xml');
  console.log(`\nGET /sitemap.xml Status: ${sitemapRes.statusCode}`);
  console.log(`Content-Type: ${sitemapRes.headers['content-type']}`);
  console.log(`Body Snippet:\n${sitemapRes.body.slice(0, 500)}`);

  const robotsRes = await makeRequest('/robots.txt');
  console.log(`\nGET /robots.txt Status: ${robotsRes.statusCode}`);
  console.log(`Content-Type: ${robotsRes.headers['content-type']}`);
  console.log(`Body Snippet:\n${robotsRes.body}`);
}

run();
