const request = require('supertest');
const { setupTestApp, teardownTestApp } = require('./setupTestApp');

describe('Health endpoint', () => {
  let app;
  let mongoServer;
  let serverPath;

  beforeAll(async () => {
    const setup = await setupTestApp();
    app = setup.app;
    mongoServer = setup.mongoServer;
    serverPath = setup.serverPath;
  });

  afterAll(async () => {
    await teardownTestApp(mongoServer, serverPath);
  });

  it('returns API working message', async () => {
    const res = await request(app).get('/api');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'API is working!' });
  });
});
