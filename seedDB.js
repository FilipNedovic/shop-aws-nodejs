require("dotenv").config();

const {
  DynamoDBClient,
  BatchWriteItemCommand,
} = require("@aws-sdk/client-dynamodb");
const attr = require("dynamodb-data-types").AttributeValue;
const dbclient = new DynamoDBClient({ region: process.env.REGION });
const fs = require("fs");

const insertToDynamoTable = async function (json) {
  try {
    let dynamoDBRecords = getDynamoDBRecords(json);
    var batches = [];

    while (dynamoDBRecords.length) {
      batches.push(dynamoDBRecords.splice(0, 25));
    }

    await callDynamoDBInsert(batches);
  } catch (error) {
    console.error(error);
    return error;
  }
};

const callDynamoDBInsert = async function (batches) {
  return Promise.all(
    batches.map(async (batch) => {
      requestItems = {};
      requestItems[process.env.PRODUCTS_TABLE] = batch;

      let params = {
        RequestItems: requestItems,
      };

      await dbclient.send(new BatchWriteItemCommand(params));
    })
  );
};

const getDynamoDBRecords = function (data) {
  let dynamoDBRecords = data.map((entity) => {
    entity = attr.wrap(entity);
    let dynamoRecord = Object.assign({ PutRequest: { Item: entity } });

    return dynamoRecord;
  });

  return dynamoDBRecords;
};

const run = async () => {
  let products = JSON.parse(
    fs.readFileSync("product-service/mocks/products.json")
  );
  let stocks = JSON.parse(fs.readFileSync("product-service/mocks/stocks.json"));

  products.map((product) => {
    stocks.filter((stock) => {
      stock.id === product.id ? (product.count = stock.count) : null;
    });
  });
  try {
    await insertToDynamoTable(products);
    console.log(`Successfully inserted items to ${process.env.PRODUCTS_TABLE}`);
  } catch (err) {
    console.error("Error", err);
  }
};

run();
