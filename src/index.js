const prices = require('./lib/retrievePrices');
const models = require('./lib/models');
const { loadGasStations, updateGasPrices } = require('./lib/gasStations');

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

async function updateGas() {
  const items = {
    24533:
    {
      regular: { amount: '99.99', lastUpdate: '2018-10-12 00:00:00' },
      premium: { amount: '21.59', lastUpdate: '2018-10-10 00:00:00' },
      diesel: { amount: '21', lastUpdate: '2018-10-10 00:00:00' },
    },
  };

  const r = await updateGasPrices(items);
  console.log(r);
}

// loadGas(0, 0);
// testAPICall();
// testDb();
updateGas();
