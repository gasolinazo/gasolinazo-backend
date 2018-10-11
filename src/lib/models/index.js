const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
});

const modelFactory = require('./model-factory');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports = {
  stations: modelFactory(process.env.DYNAMODB_TABLE, dynamodb),
};
