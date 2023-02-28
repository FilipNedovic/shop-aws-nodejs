"use strict";
import { productService } from "../../services/productService";

export const getProductList = async () => {
  const products = await productService.getProductsList();

  return {
    statusCode: 200,
    body: JSON.stringify(products),
  };
};
