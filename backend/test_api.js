async function runTests() {
  const BASE = 'http://localhost:5000/api';
  console.log('--- Testing Auth Login ---');
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'meena@snsct.org', regNumber: '713524CS102' })
  });
  const loginData = await loginRes.json();
  console.log('Login status:', loginRes.status, 'User:', loginData.user?.name);
  const token = loginData.token;
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  console.log('\n--- Testing /auth/me ---');
  const meRes = await fetch(`${BASE}/auth/me`, { headers });
  console.log('Me:', await meRes.json());

  console.log('\n--- Testing /matches/my ---');
  const matchesRes = await fetch(`${BASE}/matches/my`, { headers });
  const matches = await matchesRes.json();
  console.log('Matches count:', matches.length);
  if (matches.length > 0) {
    const m = matches[0];
    console.log('Match ID:', m.id, 'Band:', m.band, 'Score:', m.score);

    console.log('\n--- Testing /matches/:id detail ---');
    const detailRes = await fetch(`${BASE}/matches/${m.id}`, { headers });
    const detail = await detailRes.json();
    console.log('Hidden question:', detail.hiddenQuestion);
    console.log('Options count:', detail.questionOptions?.length);
    console.log('Finder info present in detail?', Boolean(detail.finderName || detail.finderPhone));

    console.log('\n--- Testing wrong answer attempt ---');
    const wrongRes = await fetch(`${BASE}/matches/${m.id}/answer`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ answer: 'Wrong Decoy' })
    });
    const wrongData = await wrongRes.json();
    console.log('Wrong answer response:', wrongData);

    console.log('\n--- Testing correct answer attempt ---');
    const correctRes = await fetch(`${BASE}/matches/${m.id}/answer`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ answer: 'Green frog sticker' })
    });
    const correctData = await correctRes.json();
    console.log('Correct answer response:', correctData);

    console.log('\n--- Testing /matches/:id/contact (now unlocked) ---');
    const contactRes = await fetch(`${BASE}/matches/${m.id}/contact`, { headers });
    console.log('Contact info:', await contactRes.json());
  }

  console.log('\n--- Testing /lost/my ---');
  const lostRes = await fetch(`${BASE}/lost/my`, { headers });
  const lost = await lostRes.json();
  console.log('Lost posts count:', lost.length);

  console.log('\n--- Testing /notifications ---');
  const notifRes = await fetch(`${BASE}/notifications`, { headers });
  const notifs = await notifRes.json();
  console.log('Notifications count:', notifs.length);

  console.log('\nALL BACKEND API TESTS COMPLETED SUCCESSFULLY!');
}

runTests().catch(console.error);
