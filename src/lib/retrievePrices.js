const request = require('request');
const { parseString } = require('xml2js');

const API_URL = 'https://publicacionexterna.azurewebsites.net/publicaciones/prices';
// Data format from Government API
// {
//   "$": {
//     "place_id": "11703"
//   },
//   "gas_price": [
//     {
//       "_": "20.08",
//       "$": {
//         "type": "regular",
//         "update_time": "2018-10-10 00:00:00"
//       }
//     },
//     {
//       "_": "21.53",
//       "$": {
//         "type": "premium",
//         "update_time": "2018-10-10 00:00:00"
//       }
//     }
//   ]
// }

const retrievePrices = () => new Promise((resolve, reject) => {
  request(API_URL, (error, response, body) => {
    if (error) {
      console.log(error);
      reject(error);
    }

    parseString(body, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      }

      const catalog = {};
      // eslint-disable-next-line
      result.places.place.map((place) => {
        if (place.gas_price) {
          const id = place.$.place_id;
          const reducer = (acum, price) => {
            const amount = price._;
            const { type } = price.$;
            const lastUpdate = price.$.update_time;
            // eslint-disable-next-line
            acum[type] = {
              amount,
              lastUpdate,
            };
            return acum;
          };
          const prices = place.gas_price.reduce(reducer, {});
          catalog[id] = prices;
        }
      });

      resolve(catalog);
    });
  });
});

module.exports = retrievePrices;
