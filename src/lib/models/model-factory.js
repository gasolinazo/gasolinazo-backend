const util = require('util');
const uuidv4 = require('uuid/v4');
const helpers = require('./helpers.js');

function modelFactory(TableName, dynamodb, primaryKeyName = 'id') {
  const promisified = {
    batchGet: util.promisify(dynamodb.batchGet).bind(dynamodb),
    delete: util.promisify(dynamodb.delete).bind(dynamodb),
    get: util.promisify(dynamodb.get).bind(dynamodb),
    put: util.promisify(dynamodb.put).bind(dynamodb),
    scan: util.promisify(dynamodb.scan).bind(dynamodb),
    update: util.promisify(dynamodb.update).bind(dynamodb),
    query: util.promisify(dynamodb.query).bind(dynamodb),
  };

  async function batchGet(keys) {
    const params = {
      RequestItems: {
        [TableName]: {
          Keys: keys.map(key => ({ [primaryKeyName]: key })),
        },
      },
    };

    const data = await promisified.batchGet(params);

    return data.Responses[TableName];
  }

  async function getItem(key) {
    const params = {
      TableName,
      Key: { [primaryKeyName]: key },
    };

    const data = await promisified.get(params);

    return data.Item;
  }

  async function scan() {
    const params = {
      TableName,
    };

    const data = await promisified.scan(params);

    return data.Items;
  }

  async function createItem(item) {
    const params = {
      TableName,
      Item: {
        ...item,
        [primaryKeyName]: uuidv4(),
      },
    };

    await promisified.put(params);

    return params.Item;
  }

  async function updateItem(item) {
    const expressionKeys = Object.keys(item).filter(
      key => !(key === primaryKeyName),
    );

    const params = {
      TableName,
      ExpressionAttributeNames: helpers.generateExpressionAttributeNames(
        expressionKeys,
      ),
      ExpressionAttributeValues: helpers.generateExpressionAttributeValues(
        expressionKeys,
        item,
      ),
      Key: { [primaryKeyName]: item.id },
      UpdateExpression: helpers.generateUpdateExpression(expressionKeys, item),
      ReturnValues: 'ALL_NEW',
    };

    const data = await promisified.update(params);

    return data.Attributes;
  }

  async function deleteItem(item) {
    const params = {
      TableName,
      Key: item,
    };

    await promisified.delete(params);

    return params.Key;
  }

  /**
   * @param {string} indexName
   * @param {object} parameters
   */
  async function equalityQuery(indexName, parameters) {
    const queryExpression = helpers.getQueryExpression(parameters);

    const params = {
      TableName,
      IndexName: indexName,
      KeyConditionExpression: queryExpression.expression,
      ExpressionAttributeNames: queryExpression.attributes,
      ExpressionAttributeValues: queryExpression.values,
    };

    const data = await promisified.query(params);

    return data.Items;
  }

  return {
    batchGet,
    getItem,
    equalityQuery,
    scan,
    createItem,
    deleteItem,
    updateItem,
  };
}

module.exports = modelFactory;
