module.exports.get = (event, context, callback) => {
  const ZIPCode = event.pathParameters.zipcode;
  const response = {
    statusCode: 200,
    body: JSON.stringify({ response: `Your ZIP Code: ${ZIPCode}` }),
  };
  callback(null, response);
};
