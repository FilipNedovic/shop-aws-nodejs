"use strict";

import { productService } from "../../services/productService";

export const catalogBatchProcess = async (event) => {
  let response = {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    messages: [],
  };

  const records = event.Records;

  records.map(async (record) => {
    const { body } = record;

    try {
      await productService.createProduct(JSON.parse(body));
      response.messages.push(JSON.parse(body));
    } catch (error) {
      console.error("Error creating product: ", error);
    }
  });

  return response;
};
