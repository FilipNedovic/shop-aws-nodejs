import AWS from "aws-sdk";

const s3Client = new AWS.S3({ region: process.env.REGION });

export { s3Client };
