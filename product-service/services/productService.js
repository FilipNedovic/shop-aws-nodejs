import AWS from "aws-sdk";

const db = new AWS.DynamoDB.DocumentClient();
const crypto = require("crypto");
const TableName = process.env.PRODUCTS_TABLE;

class ProductService {
  async getProductsList() {
    const response = await db.scan({ TableName }).promise();

    return response.Items;
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
    const response = await db
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

    return response;
  }
}

export const productService = new ProductService();
