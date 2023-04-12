"use strict";

export const basicAuthorizer = async (event) => {
  const { authorizationToken } = event;
  const decodedToken = JSON.parse(
    Buffer.from(authorizationToken.split(".")[1], "base64").toString()
  );

  const username = Object.keys(decodedToken).toString();
  const password = Object.values(decodedToken).toString();

  const envPassword = process.env[username];
  const effect = !envPassword || envPassword !== password ? "Deny" : "Allow";

  try {
    const policy = generatePolicy(authorizationToken, event.methodArn, effect);

    return policy;
  } catch (error) {
    console.error("Error in basicAuthorizer: ", error);
  }
};

export const generatePolicy = (principalId, resourceArn, effect = "Deny") => {
  return {
    principalId: principalId,
    policyDocument: {
      Version: "2008-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resourceArn,
        },
      ],
    },
  };
};
