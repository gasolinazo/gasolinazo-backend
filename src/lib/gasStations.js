const gasStations = require('../../data/gasolineras.json');
const models = require('../lib/models');

const cleanObject = (obj) => {
  const newObj = { ...obj };
  delete newObj._id; // eslint-disable-line no-underscore-dangle
  delete newObj.date_insert;
  Object.keys(newObj).forEach(key => !newObj[key] && delete newObj[key]);
  return newObj;
};

const loadGasStations = async (start = 0, end = gasStations.length) => {
  const updatedGasStations = gasStations.slice(start, end);
  const r = await Promise.all(
    updatedGasStations.map(async station => models.stations.createItem(cleanObject(station))),
  );
  return r;
};

module.exports = loadGasStations;
