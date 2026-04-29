async function run() {
  try {
    const res = await fetch('https://football-shoes-shop.onrender.com/api/health');
    console.log(res.status, await res.text());
  } catch (e) {
    console.error(e);
  }
}
run();
