"use strict";
import { products } from "../../mocks/productsData";

const getProducts = () => {
  return new Promise((resolve) => {
    resolve(products);
  });
};

export const getProductList = async () => {
  try {
    let products = await getProducts();

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch {
    console.log("No products available");
  }
};
