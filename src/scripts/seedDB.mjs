import dotenv from "dotenv";
import { BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import AttributeValue from "dynamodb-data-types/lib/AttributeValue.js";
import { dynamoDbClient } from "../libs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const insertToDynamoTable = async function (json, table) {
  try {
    let dynamoDBRecords = getDynamoDBRecords(json);
    var batches = [];

    while (dynamoDBRecords.length) {
      batches.push(dynamoDBRecords.splice(0, 25));
    }

    await callDynamoDBInsert(batches, table);
  } catch (error) {
    console.error(error);
    return error;
  }
};

const callDynamoDBInsert = async function (batches, table) {
  return Promise.all(
    batches.map(async (batch) => {
      let requestItems = {};
      requestItems[table] = batch;

      let params = {
        RequestItems: requestItems,
      };

      await dynamoDbClient.send(new BatchWriteItemCommand(params));
    })
  );
};

const getDynamoDBRecords = function (data) {
  let dynamoDBRecords = data.map((entity) => {
    entity = AttributeValue.wrap(entity);
    let dynamoRecord = Object.assign({ PutRequest: { Item: entity } });

    return dynamoRecord;
  });

  return dynamoDBRecords;
};

const run = async () => {
  let products = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "mocks", "products.json"))
  );
  let stocks = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "mocks", "stocks.json"))
  );

  products.map((product) => {
    stocks.filter((stock) => {
      stock.product_id === product.id ? (product.count = stock.count) : null;
    });
  });
  try {
    await insertToDynamoTable(stocks, process.env.STOCKS_TABLE).then(() =>
      console.log(`Successfully inserted items to ${process.env.STOCKS_TABLE}`)
    );
    await insertToDynamoTable(products, process.env.PRODUCTS_TABLE).then(() =>
      console.log(
        `Successfully inserted items to ${process.env.PRODUCTS_TABLE}`
      )
    );
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};

run();
