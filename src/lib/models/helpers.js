function generateUpdateExpression(expressionKeys, update) {
  const statements = expressionKeys.map((key) => {
    if (Array.isArray(update[key])) {
      return `#${key} = list_append(#${key}, :${key})`;
    }
    return `#${key} = :${key}`;
  });

  return `SET ${statements.join(', ')}`;
}

function generateExpressionAttributeNames(expressionKeys) {
  return expressionKeys.reduce(
    (acc, key) => ({
      ...acc,
      [`#${key}`]: key,
    }),
    {},
  );
}

function generateExpressionAttributeValues(expressionKeys, update) {
  return expressionKeys.reduce(
    (acc, key) => ({
      ...acc,
      [`:${key}`]: update[key],
    }),
    {},
  );
}

const getQueryExpression = function getQueryExpression(parameters) {
  const keys = Object.keys(parameters);
  const expression = [];
  const attributes = {};
  const values = {};

  keys.forEach((value, index) => {
    expression.push(`#attribute${index} = :value${index}`);
    attributes[`#attribute${index}`] = value;
    values[`:value${index}`] = parameters[value];
  });

  return {
    expression: expression.join(' and '),
    attributes,
    values,
  };
};

module.exports = {
  generateUpdateExpression,
  generateExpressionAttributeNames,
  generateExpressionAttributeValues,
  getQueryExpression,
};
