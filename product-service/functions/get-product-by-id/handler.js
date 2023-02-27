"use strict";
import { products } from "../../mocks/productsData.js";

const getProduct = (productId) => {
  return new Promise((resolve) => {
    resolve(products.find((product) => product.id === productId));
  });
};

export const getProductById = async (event) => {
  try {
    const { productId } = event.pathParameters;
    let product = await getProduct(productId);

    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch {
    console.error("Product not found");
  }
};
