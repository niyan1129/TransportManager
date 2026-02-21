const express = require('express');
const request = require('supertest');
const validateDriverQuery = require('../../../src/middleware/validateDriverQuery');

const buildApp = () => {
  const app = express();
  app.get('/drivers', validateDriverQuery, (req, res) => {
    res.status(200).json({
      filters: {
        firstName: req.filters.firstName ? req.filters.firstName.toString() : null,
        licenceNumber: req.filters.licenceNumber ?? null,
      },
    });
  });
  return app;
};

describe('validateDriverQuery middleware', () => {
  it('converts query params into filters with regex where appropriate', async () => {
    const app = buildApp();

    const response = await request(app)
      .get('/drivers')
      .query({ firstName: 'John', licenceNumber: 'ABC123' });

    expect(response.status).toBe(200);
    expect(response.body.filters).toEqual({
      firstName: '/John/i',
      licenceNumber: 'ABC123',
    });
  });

  it('returns empty filters when no params provided', async () => {
    const app = buildApp();
    const response = await request(app).get('/drivers');

    expect(response.status).toBe(200);
    expect(response.body.filters).toEqual({
      firstName: null,
      licenceNumber: null,
    });
  });
});
