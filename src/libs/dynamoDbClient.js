import AWS from "aws-sdk";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dynamoDbClient = new DynamoDBClient({
  region: process.env.REGION,
});

const dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient();

export { dynamoDbClient, dynamoDbDocumentClient };
