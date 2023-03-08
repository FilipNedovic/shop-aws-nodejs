import AWS from "aws-sdk";

const db = new AWS.DynamoDB.DocumentClient();
const crypto = require("crypto");
const TableName = process.env.TABLE_NAME;

class ProductService {
  async getProductsList() {
    const products = await db.scan({ TableName }).promise();

    return products;
  }

  async getProductById(productId) {
    const product = await db
      .query({
        TableName,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: { ":id": productId },
      })
      .promise();

    return product;
  }

  async createProduct(product) {
    await db
      .put({
        TableName,
        Item: {
          id: crypto.randomUUID(),
          title: product.title,
          description: product.description,
          price: product.price,
        },
      })
      .promise();

    return product;
  }
}

export const productService = new ProductService();
