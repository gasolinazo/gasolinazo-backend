const prices = require('./retrievePrices');

async function test() {
  const r = await prices();
  console.log(r);
}

test();
