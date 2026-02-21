const request = require('supertest');
const mongoose = require('mongoose');
const { setupTestApp, teardownTestApp } = require('./setupTestApp');
const { clearDatabase } = require('./dbUtils');

describe('Trips API', () => {
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
      firstName: 'Driver',
      lastName: 'One',
      licenceNumber: `DRV${new mongoose.Types.ObjectId().toHexString().slice(0, 8)}`,
      ...overrides,
    };
    return request(app).post('/api/drivers').send(payload);
  };

  const createVehicle = (overrides = {}) => {
    const payload = {
      make: 'Tesla',
      model: 'Model 3',
      year: 2024,
      plateNumber: `TRP${new mongoose.Types.ObjectId().toHexString().slice(0, 5)}`,
      ...overrides,
    };
    return request(app).post('/api/vehicles').send(payload);
  };

  const buildTripPayload = async () => {
    const driverRes = await createDriver();
    const vehicleRes = await createVehicle();
    const startTime = new Date('2025-01-01T10:00:00.000Z');
    const endTime = new Date('2025-01-01T12:00:00.000Z');
    return {
      payload: {
        driver: driverRes.body._id,
        vehicle: vehicleRes.body._id,
        startLocation: 'Brisbane',
        endLocation: 'Sydney',
        startTime,
        endTime,
      },
      driver: driverRes.body,
      vehicle: vehicleRes.body,
    };
  };

  it('creates and lists trips with populated references', async () => {
    const { payload, driver, vehicle } = await buildTripPayload();
    const createRes = await request(app).post('/api/trips').send(payload);
    expect(createRes.status).toBe(201);

    const listRes = await request(app).get('/api/trips').query({ limit: 5, page: 1 });
    expect(listRes.status).toBe(200);
    expect(listRes.body.data).toHaveLength(1);
    expect(listRes.body.data[0].driver.firstName).toBe(driver.firstName);
    expect(listRes.body.data[0].vehicle.plateNumber).toBe(vehicle.plateNumber);
  });

  it('retrieves, updates, and deletes a trip', async () => {
    const { payload } = await buildTripPayload();
    const createRes = await request(app).post('/api/trips').send(payload);
    const tripId = createRes.body._id;

    const fetchRes = await request(app).get(`/api/trips/${tripId}`);
    expect(fetchRes.status).toBe(200);

    const updateRes = await request(app)
      .put(`/api/trips/${tripId}`)
      .send({ ...payload, startLocation: 'Gold Coast' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.startLocation).toBe('Gold Coast');

    const deleteRes = await request(app).delete(`/api/trips/${tripId}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toMatch(/deleted/i);
  });

  it('returns validation error for invalid trip id', async () => {
    const res = await request(app).get('/api/trips/invalid-id');
    expect(res.status).toBe(400);
  });
});
