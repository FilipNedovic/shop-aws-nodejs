import { products } from "../mocks/productsData";
import AWS from "aws-sdk";

const db = new AWS.DynamoDB.DocumentClient();
const crypto = require("crypto");
const TableName = process.env.TABLE_NAME;

class ProductService {
  async getProductsList() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(products), 1000);
    });
  }

  async getProductById(productId) {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(products.find(({ id }) => id === productId)),
        150
      );
    });
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
