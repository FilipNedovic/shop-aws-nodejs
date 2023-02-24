"use strict";
import { products } from "./mocks/productsData.js";

export const getProductList = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(products),
  };
};

export const getProductsById = async (event) => {
  const { productId } = event.pathParameters;

  return {
    statusCode: 200,
    body: JSON.stringify(products.find((product) => product.id === productId)),
  };
};
