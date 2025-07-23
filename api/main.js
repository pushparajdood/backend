// api/main.js  (must be committed)

const { createServer, proxy } = require('aws-serverless-express');
const compiled = require('../dist/apps/super-admin/main');

if (compiled.handler) {
  // If you exported a Lambda handler from your bundle, use it directly:
  module.exports = compiled.handler;
} else {
  // Otherwise, bootstrap once and proxy every request
  let cachedServer;
  async function bootstrap() {
    const app = await compiled.bootstrap(); // or however you boot Fastify
    await app.init();
    return createServer(app.getHttpAdapter().getInstance());
  }
  module.exports = async (req, res) => {
    cachedServer ||= await bootstrap();
    return proxy(cachedServer, req, res, 'PROMISE').promise;
  };
}
