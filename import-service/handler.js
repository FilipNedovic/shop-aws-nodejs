"use strict";
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const csvParser = require("csv-parser");

const BUCKET_NAME = "shop-aws-nodejs";
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
          .on("data", (data) => {
            console.log("Data:\n", data);
          })
          .on("error", (error) => {
            console.error(`Error:\n`, error);
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
  } catch (error) {
    console.log("Error:\n", error);
  }
};
