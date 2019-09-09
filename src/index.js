const prices = require('./lib/retrievePrices');
const models = require('./lib/models');
const loadGasStations = require('./lib/gasStations');

async function testAPICall() {
  const r = await prices();
  console.log(r);
}

async function testDb() {
  const r = await models.stations.scan();
  console.log(r.length);
}

async function loadGas(start, end) {
  const r = await loadGasStations(start, end);
  console.log(r);
}

loadGas(0, 0);
testAPICall();
testDb();
