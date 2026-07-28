import https from 'https';

const BASE_URL = 'powerhousefitnessclub.vercel.app';

function httpsPost(path, payload, cookieHeader = '') {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = https.request({
      hostname: BASE_URL,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        ...(cookieHeader ? { 'Cookie': cookieHeader } : {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function httpsGet(path, cookieHeader = '') {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: BASE_URL,
      path,
      method: 'GET',
      headers: {
        ...(cookieHeader ? { 'Cookie': cookieHeader } : {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    });
    req.on('error', reject);
    req.end();
  });
}

const REORDERED_SERVICES = [
  {
    id: 'strength-training', number: '01', title: 'Strength Training',
    description: 'Structured resistance training programs designed to facilitate healthy weight gain (hypertrophy) and effective weight loss (fat reduction) based on individual fitness goals.',
    iconName: 'BicepsFlexed',
    highlights: ['Weight Gain', 'Weight Loss', 'Body Recomposition', 'Goal-Based Routine']
  },
  {
    id: 'cardio', number: '02', title: 'Cardio Suite',
    description: 'Stamina-building aerobic zone featuring interactive consoles and heart-rate monitoring.',
    iconName: 'HeartPulse',
    highlights: ['Curved Treadmills', 'Spin Bikes', 'Rowing Ergometers', 'Interactive Displays']
  },
  {
    id: 'lifestyle-change', number: '03', title: 'Personal Training',
    description: 'One-on-one dedicated coaching tailored exclusively to your body type, fitness level, and goals, combining custom workout programming with nutrition mapping for rapid results.',
    iconName: 'Sparkles',
    highlights: ['1-on-1 Dedicated Coaching', 'Custom Workout Mapping', 'Nutrition & Diet Guidance', 'Form & Technique Refinement']
  },
  {
    id: 'powerlifting', number: '04', title: 'Powerlifting',
    description: 'Expert-coached competitive powerlifting program covering Squat, Bench Press, and Deadlift. Train under a National Powerlifting Champion and compete at district, state, and national levels.',
    iconName: 'Dumbbell',
    highlights: ['Squat, Bench & Deadlift', 'Competition Coaching', 'National Champion Trainer', 'Progressive Overload Plans']
  },
  {
    id: 'weight-training', number: '05', title: 'PCOS / PCOD Fitness Support',
    description: 'Specialized exercise programming and lifestyle guidance tailored to manage PCOS/PCOD symptoms, improve insulin sensitivity, regulate hormones, and support weight management.',
    iconName: 'HeartPulse',
    highlights: ['Hormonal Regulation', 'Insulin Sensitivity', 'Low-Stress Strength', 'Lifestyle Coaching']
  },
  {
    id: 'crossfit', number: '06', title: 'CrossFit',
    description: 'High-intensity functional movements designed to push human endurance, power, and agility.',
    iconName: 'Zap',
    highlights: ['Functional Movements', 'Olympic Lifts', 'Community WODs', 'Endurance Rigs']
  },
  {
    id: 'hiit', number: '07', title: 'HIIT',
    description: 'Rapid, explosive workout intervals optimized to torch fat while preserving lean muscle mass.',
    iconName: 'Flame',
    highlights: ['Max Caloric Burn', 'Metabolic Rate Boost', 'Heart Rate Zones', 'Group Motivation']
  }
];

async function run() {
  try {
    // Step 1: Login to get session cookie
    console.log('Step 1: Logging in to production admin...');
    const loginRes = await httpsPost('/api/admin/auth', { username: 'powerhousegym', password: 'Powerhouse' });
    console.log('Login status:', loginRes.status);

    const setCookie = loginRes.headers['set-cookie'];
    if (!setCookie) {
      console.error('Login failed - no cookie returned. Body:', loginRes.body);
      return;
    }
    const cookieHeader = setCookie.map(c => c.split(';')[0]).join('; ');
    console.log('Got session cookie!');

    // Step 2: Save reordered services directly
    console.log('\nStep 2: Pushing reordered services to DB...');
    console.log('New order:', REORDERED_SERVICES.map(s => `${s.number}. ${s.title}`).join(', '));
    const saveRes = await httpsPost('/api/admin/data', { SERVICES: REORDERED_SERVICES }, cookieHeader);
    console.log('Save status:', saveRes.status, 'Body:', saveRes.body);

    if (saveRes.status === 200) {
      console.log('\n✅ SUCCESS! Services reordered on live website!');
      console.log('04. Powerlifting is now at position 4.');
    } else {
      console.error('❌ Failed to save. Response:', saveRes.body);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

run();
