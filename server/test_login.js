async function run() {
  console.log('Sending login...');
  try {
    const res = await fetch('https://football-shoes-shop.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testorder123@gmail.com', password: 'password123' })
    });
    console.log(res.status, await res.text());
  } catch (e) {
    console.error(e);
  }
}
run();
