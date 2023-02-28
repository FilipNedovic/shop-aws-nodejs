"use strict";
import { productService } from "../../services/productService";

export const getProductById = async (event) => {
  const { productId } = event.pathParameters;
  const product = await productService.getProductById(productId);
  const response = product
    ? { statusCode: 200, body: JSON.stringify(product) }
    : { statusCode: 404, body: "Product not found" };

  return response;
};
