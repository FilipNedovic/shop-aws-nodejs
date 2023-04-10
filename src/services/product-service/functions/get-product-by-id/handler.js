"use strict";
import { productService } from "../../productService";

export const getProductById = async (event) => {
  const { productId } = event.pathParameters;
  const product = await productService.getProductById(productId);
  const response = product
    ? {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(product),
      }
    : {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: "Product not found",
      };

  return response;
};
