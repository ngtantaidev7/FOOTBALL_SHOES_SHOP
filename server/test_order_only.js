async function run() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZjE5Njc4YTM2ZDBiMmVlNDQ3OTIzNyIsImlhdCI6MTc3NzQ0MDc1OSwiZXhwIjoxNzc4MDQ1NTU5fQ.1VRGZAKcHDvMnaajfPbFq4y6360XflOu0fOj8p4R-lI';
  
  console.log('Fetching products...');
  let res = await fetch('https://football-shoes-shop.onrender.com/api/products');
  let data = await res.json();
  const product = data.data[0];
  const size = product.sizes[0].size;
  
  console.log('Placing order...');
  res = await fetch('https://football-shoes-shop.onrender.com/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      items: [{ product: product._id, size: size, quantity: 1 }],
      shippingInfo: {
        fullName: 'Test User',
        phone: '0123456789',
        email: 'testorder123@gmail.com',
        street: '123 Test St',
        ward: 'Test Ward',
        district: 'Test District',
        city: 'Test City'
      },
      paymentMethod: 'cod',
      note: ''
    })
  });
  console.log('Response:', res.status, await res.text());
}
run();
