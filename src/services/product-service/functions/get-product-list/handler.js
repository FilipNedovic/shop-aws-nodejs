"use strict";
import { productService } from "../../productService";

export const getProductList = async () => {
  const products = await productService.getProductsList();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(products),
  };
};
