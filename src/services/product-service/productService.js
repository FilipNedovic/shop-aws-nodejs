import { dynamoDbDocumentClient } from "../../libs/dynamoDbClient";

const crypto = require("crypto");
const TableName = process.env.PRODUCTS_TABLE;

class ProductService {
  async getProductsList() {
    const response = await dynamoDbDocumentClient.scan({ TableName }).promise();

    return response.Items;
  }

  async getProductById(productId) {
    const product = await dynamoDbDocumentClient
      .query({
        TableName,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: { ":id": productId },
      })
      .promise();

    return product;
  }

  async createProduct(product) {
    const response = await dynamoDbDocumentClient
      .put({
        TableName,
        Item: {
          id: crypto.randomUUID(),
          title: product.title,
          description: product.description,
          price: product.price,
          count: product.count ? product.count : null,
        },
      })
      .promise();

    return response;
  }
}

export const productService = new ProductService();
