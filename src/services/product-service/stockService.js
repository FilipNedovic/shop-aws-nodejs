import AWS from "aws-sdk";

const db = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.STOCKS_TABLE;

class StockService {
  async getStocksList() {
    const stocks = await db.scan({ TableName }).promise();

    return stocks;
  }

  async getStockById(stockId) {
    const stock = await db
      .query({
        TableName,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: { ":id": stockId },
      })
      .promise();

    return stock;
  }
}

export const stockService = new StockService();
