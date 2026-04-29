
async function run() {
  const email = 'testorder123@gmail.com';
  const password = 'password123';
  
  let res = await fetch('https://football-shoes-shop.onrender.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  let data = await res.json();
  const token = data.data.token;
  
  res = await fetch('https://football-shoes-shop.onrender.com/api/products');
  data = await res.json();
  const product = data.data[0];
  const size = product.sizes[0].size;
  
  res = await fetch('https://football-shoes-shop.onrender.com/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      items: [{
        product: product._id,
        size: size,
        quantity: 1
      }],
      shippingInfo: {
        fullName: 'Test User',
        phone: '0123456789',
        email: email,
        street: '123 Test St',
        ward: 'Test Ward',
        district: 'Test District',
        city: 'Test City'
      },
      paymentMethod: 'cod',
      note: ''
    })
  });
  
  const orderData = await res.json();
  console.log('Order Response:', res.status, JSON.stringify(orderData, null, 2));
}

run();
