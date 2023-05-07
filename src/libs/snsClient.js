import AWS from "aws-sdk";

const snsClient = new AWS.SNS({ region: process.env.REGION });

export { snsClient };
