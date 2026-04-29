async function testApi() {
  const email = `Test_api_${Date.now()}@test.com`; // Uppercase T
  
  try {
    let res = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test API', email: email, password: 'password123' })
    });
    let data = await res.json();
    console.log('Register OK:', data.success);
    
    // Login with uppercase
    let loginRes = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: 'password123' })
    });
    let loginData = await loginRes.json();
    console.log('Login OK with uppercase:', loginData.success);
    
    // Login with lowercase
    let loginRes2 = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.toLowerCase(), password: 'password123' })
    });
    let loginData2 = await loginRes2.json();
    console.log('Login OK with lowercase:', loginData2.success);
    
  } catch (err) {
    console.error('ERROR:', err.message);
  }
}
testApi();
