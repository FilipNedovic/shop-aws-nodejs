import { productService } from "../../productService";

export const createProduct = async (event) => {
  const product = JSON.parse(event.body);
  await productService.createProduct(product);

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(product),
  };
};
