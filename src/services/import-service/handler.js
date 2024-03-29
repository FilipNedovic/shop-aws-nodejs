"use strict";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient, s3Client } from "../../libs";

const csvParser = require("csv-parser");

let response = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
};

export const importProductsFile = async (event) => {
  const {
    queryStringParameters: { name },
  } = event;

  try {
    response.statusCode = 200;
    response.body = s3Client.getSignedUrl("putObject", {
      Bucket: process.env.BUCKET_NAME,
      Key: `uploaded/${name}`,
      Expires: 3 * 60,
      ContentType: "text/csv",
    });
  } catch (error) {
    console.error("Error:\n", error);
    response.statusCode = 400;

    return error;
  }

  return response;
};

export const importFileParser = async (event) => {
  const { Records } = event;

  try {
    for (const record of Records) {
      const recordObjectName = record.s3.object.key;
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: recordObjectName,
      };

      await new Promise((resolve, reject) => {
        const readStream = s3Client.getObject(params).createReadStream();
        readStream
          .pipe(csvParser())
          .on("data", async (data) => {
            const messageParams = {
              DelaySeconds: 0,
              MessageBody: JSON.stringify(data),
              QueueUrl: process.env.QUEUE_URL,
            };

            const messageData = await sqsClient.send(
              new SendMessageCommand(messageParams)
            );
            const bodyMessage = "message sent to SQS" + messageData.MessageId;
            response.statusCode = 201;
            response.body = JSON.stringify(bodyMessage);
          })
          .on("error", (error) => {
            response.statusCode = 500;
            reject(error);
          })
          .on("end", async () => {
            await s3Client
              .copyObject({
                Bucket: process.env.BUCKET_NAME,
                CopySource: `${process.env.BUCKET_NAME}/${recordObjectName}`,
                Key: recordObjectName.replace("uploaded", "parsed"),
              })
              .promise();

            await s3Client
              .deleteObject({
                Bucket: process.env.BUCKET_NAME,
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

  return response;
};
