async function testContactApi() {
  console.log('Sending test request to http://localhost:3000/api/contact ...');
  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Joel Test Lead',
        phone: '+91 9876543210',
        email: 'powerhousefitnessclub2026@gmail.com',
        gender: 'Male',
        age: 25,
        fitnessGoal: 'Muscle Gain',
        preferredTime: 'Morning (5:30 AM - 9:00 AM)',
        message: 'This is an automated test inquiry to verify Resend email delivery.',
      }),
    });

    const status = response.status;
    const json = await response.json();

    console.log('Response Status:', status);
    console.log('Response Body:', JSON.stringify(json, null, 2));
  } catch (err) {
    console.error('Fetch Error:', err);
  }
}

testContactApi();
