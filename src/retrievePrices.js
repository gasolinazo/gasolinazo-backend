const request = require('request');
var parseString = require('xml2js').parseString;

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

const retrievePrices = function retrievePrices() {
  return new Promise((resolve, reject) => {
    request(API_URL, function (error, response, body) {
      if (error) {
        console.log(error);
        reject(error);
      }

      parseString(body, function (err, result) {
        if (err) {
          console.log(err);
          reject(err);
        }

        const catalog = {};
        result.places.place.map(place => {
          if (place.gas_price) {
            const id = place.$.place_id;
            const reducer = (acum, price) => {
              const amount = price._;
              const type = price.$.type;
              const lastUpdate = price.$.update_time;
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
};

module.exports = retrievePrices;
