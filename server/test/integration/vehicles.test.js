const request = require('supertest');
const mongoose = require('mongoose');
const { setupTestApp, teardownTestApp } = require('./setupTestApp');
const { clearDatabase } = require('./dbUtils');

describe('Vehicles API', () => {
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

  const createVehicle = (overrides = {}) => {
    const payload = {
      make: 'Toyota',
      model: 'Corolla',
      year: 2020,
      plateNumber: `PLT${new mongoose.Types.ObjectId().toHexString().slice(0, 5)}`,
      ...overrides,
    };
    return request(app).post('/api/vehicles').send(payload);
  };

  it('creates and lists vehicles with filters applied', async () => {
    const createRes = await createVehicle();
    expect(createRes.status).toBe(201);

    const listRes = await request(app).get('/api/vehicles').query({ make: 'toy' });
    expect(listRes.status).toBe(200);
    expect(listRes.body.data).toHaveLength(1);
  });

  it('updates and deletes a vehicle', async () => {
    const createRes = await createVehicle();
    const vehicleId = createRes.body._id;

    const updateRes = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .send({ make: 'Honda', model: 'Civic', year: 2022, plateNumber: createRes.body.plateNumber });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.make).toBe('Honda');

    const deleteRes = await request(app).delete(`/api/vehicles/${vehicleId}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toMatch(/deleted/i);
  });
});
