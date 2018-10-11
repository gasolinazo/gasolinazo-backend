const prices = require('./lib/retrievePrices');
const models = require('./lib/models');

async function testAPICall() {
  const r = await prices();
  console.log(r);
}

async function testDb() {
  const r = await models.stations.scan();
  console.log(r);
}

testAPICall();
testDb();
