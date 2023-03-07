import { productService } from "../../services/productService";

export const createProduct = async (event) => {
  const product = JSON.parse(event.body);

  await productService.createProduct(product);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(product),
  };
};
