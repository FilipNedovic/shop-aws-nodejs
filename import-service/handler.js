"use strict";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "./libs/sqsClient";

const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const csvParser = require("csv-parser");

const BUCKET_NAME = "shop-aws-nodejs";
const QUEUE_URL =
  "https://sqs.us-east-1.amazonaws.com/773707999966/catalogItemsQueue";
const response = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
};

export const importProductsFile = async (event) => {
  const {
    queryStringParameters: { name },
  } = event;

  let params = {
    Bucket: BUCKET_NAME,
    Key: `uploaded/${name}`,
    Expires: 3 * 60,
    ContentType: "text/csv",
  };

  try {
    response.statusCode = 200;
    response.body = s3.getSignedUrl("putObject", params);
  } catch (error) {
    console.error("Error:\n", error);
    response.statusCode = 400;

    return error;
  }

  return response;
};

export const importFileParser = async (event) => {
  let response;
  const { Records } = event;

  try {
    for (const record of Records) {
      const recordObjectName = record.s3.object.key;
      const params = {
        Bucket: BUCKET_NAME,
        Key: recordObjectName,
      };

      await new Promise((resolve, reject) => {
        const readStream = s3.getObject(params).createReadStream();
        readStream
          .pipe(csvParser())
          .on("data", async (data) => {
            const messageParams = {
              DelaySeconds: 0,
              MessageBody: JSON.stringify(data),
              QueueUrl: QUEUE_URL,
            };

            const messageData = await sqsClient.send(
              new SendMessageCommand(messageParams)
            );
            const bodyMessage = "message sent to SQS" + messageData.MessageId;
            response = {
              statusCode: 201,
              body: JSON.stringify(bodyMessage),
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
              },
            };
          })
          .on("error", (error) => {
            reject(error);
          })
          .on("end", async () => {
            await s3
              .copyObject({
                Bucket: BUCKET_NAME,
                CopySource: `${BUCKET_NAME}/${recordObjectName}`,
                Key: recordObjectName.replace("uploaded", "parsed"),
              })
              .promise();

            await s3
              .deleteObject({
                Bucket: BUCKET_NAME,
                Key: recordObjectName,
              })
              .promise();
            resolve();
          });
      });
    }

    return response;
  } catch (error) {
    console.log("Error:\n", error);
  }
};
