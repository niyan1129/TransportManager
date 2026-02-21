const express = require('express');
const request = require('supertest');
const validateTripQuery = require('../../../src/middleware/validateTripQuery');

const buildApp = () => {
  const app = express();
  app.get('/trips', validateTripQuery, (req, res) => {
    res.status(200).json({
      filters: {
        startLocation: req.filters.startLocation ? req.filters.startLocation.toString() : null,
        endLocation: req.filters.endLocation ? req.filters.endLocation.toString() : null,
      },
    });
  });
  return app;
};

describe('validateTripQuery middleware', () => {
  it('converts start/end query params into regex filters', async () => {
    const app = buildApp();
    const response = await request(app)
      .get('/trips')
      .query({ startLocation: 'Bris', endLocation: 'Sydney' });

    expect(response.status).toBe(200);
    expect(response.body.filters).toEqual({
      startLocation: '/Bris/i',
      endLocation: '/Sydney/i',
    });
  });

  it('returns empty filters when no params provided', async () => {
    const app = buildApp();
    const response = await request(app).get('/trips');

    expect(response.status).toBe(200);
    expect(response.body.filters).toEqual({
      startLocation: null,
      endLocation: null,
    });
  });
});
