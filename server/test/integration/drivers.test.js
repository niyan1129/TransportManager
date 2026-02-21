const request = require('supertest');
const mongoose = require('mongoose');
const { setupTestApp, teardownTestApp } = require('./setupTestApp');
const { clearDatabase } = require('./dbUtils');

describe('Drivers API', () => {
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

  beforeEach(async () => {
    await clearDatabase();
  });

  const createDriver = (overrides = {}) => {
    const payload = {
      firstName: 'John',
      lastName: 'Doe',
      licenceNumber: new mongoose.Types.ObjectId().toHexString().slice(0, 8),
      ...overrides,
    };
    return request(app).post('/api/drivers').send(payload);
  };

  it('creates a driver and lists it with pagination metadata', async () => {
    const createRes = await createDriver();
    expect(createRes.status).toBe(201);

    const listRes = await request(app).get('/api/drivers').query({ limit: 5, page: 1 });
    expect(listRes.status).toBe(200);
    expect(listRes.body.data).toHaveLength(1);
    expect(listRes.headers).toHaveProperty('link');
  });

  it('retrieves, updates, and deletes a driver by id', async () => {
    const createRes = await createDriver({ licenceNumber: 'LIC56789' });
    const driverId = createRes.body._id;

    const fetchRes = await request(app).get(`/api/drivers/${driverId}`);
    expect(fetchRes.status).toBe(200);
    expect(fetchRes.body.licenceNumber).toBe('LIC56789');

    const updateRes = await request(app)
      .put(`/api/drivers/${driverId}`)
      .send({ firstName: 'Jane', lastName: 'Doe' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.firstName).toBe('Jane');

    const deleteRes = await request(app).delete(`/api/drivers/${driverId}`);
    expect(deleteRes.status).toBe(204);
  });

  it('returns validation error for invalid driver id', async () => {
    const res = await request(app).get('/api/drivers/invalid-id');
    expect(res.status).toBe(400);
  });
});
