const path = require('path');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const waitForConnection = async () => {
  if (mongoose.connection.readyState === 1) return;
  await new Promise((resolve) => {
    mongoose.connection.once('open', resolve);
  });
};

async function setupTestApp() {
  const mongoServer = await MongoMemoryServer.create();
  process.env.mongodb_URI = mongoServer.getUri();
  process.env.NODE_ENV = 'test';

  const serverPath = path.resolve(__dirname, '../../server.js');
  delete require.cache[require.resolve(serverPath)];
  const app = require(serverPath);
  await waitForConnection();

  return { app, mongoServer, serverPath };
}

async function teardownTestApp(mongoServer, serverPath) {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
  if (serverPath) {
    try {
      delete require.cache[require.resolve(serverPath)];
    } catch {
      // ignore if module not cached
    }
  }
}

module.exports = {
  setupTestApp,
  teardownTestApp,
};
