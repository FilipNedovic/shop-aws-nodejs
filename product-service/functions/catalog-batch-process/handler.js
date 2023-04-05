"use strict";
import { productService } from "../../services/productService";
import { snsClient } from "../../../import-service/libs/snsClient";

export const catalogBatchProcess = async (event) => {
  let response = {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    messages: [],
  };

  const { Records } = event;

  for (const record of Records) {
    const { body } = record;
    response.messages.push(JSON.parse(body));

    try {
      await productService.createProduct(JSON.parse(body));

      const params = {
        Subject: "Product Creation",
        Message: `Created product: ${JSON.stringify(body)}`,
        TopicArn: process.env.TOPIC_ARN,
      };

      snsClient.publish(params, (error, data) => {
        if (error) {
          console.error("Error in SNS send", error, error.stack);
          response.statusCode = 500;
        }
        console.log(
          `Message ${params.Message} sent to the topic ${params.TopicArn}`
        );
        console.log("MessageID is " + data.MessageId);
      });
    } catch (err) {
      console.error(err);
    }
  }

  return response;
};
