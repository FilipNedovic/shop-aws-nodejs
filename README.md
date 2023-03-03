# Serverless - AWS Node.js Typescript

This project has been generated using the `aws-nodejs` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

## Template features

### 3rd party libraries

- [serverless-esbuild](https://github.com/floydspace/serverless-esbuild)- plugin for zero-config JavaScript and TypeScript code bundling using promising fast & furious esbuild bundler and minifier
- [serverless-auto-swagger](https://github.com/completecoding/serverless-auto-swagger) - plugin allows you to automatically generate a swagger endpoint, describing your application endpoints. This is built from your existing serverless config and typescript definitions, reducing the duplication of work.
