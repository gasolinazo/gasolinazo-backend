const request = require('request');
var parseString = require('xml2js').parseString;

const API_URL = 'https://publicacionexterna.azurewebsites.net/publicaciones/prices';

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
  request(API_URL, function (error, response, body) {
    if (error) {
      console.log('Error');
      return;
    }
    parseString(body, function (err, result) {
      const catalog = {};
      result.places.place.map(place => {
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

        if (place.gas_price) {
          const prices = place.gas_price.reduce(reducer, {});
          catalog[id] = prices;
        }

      });
      console.log(catalog);
      return catalog;
    });
  });
};





module.exports = retrievePrices;
