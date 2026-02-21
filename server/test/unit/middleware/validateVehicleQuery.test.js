const express = require('express');
const request = require('supertest');
const validateVehicleQuery = require('../../../src/middleware/validateVehicleQuery');

const buildApp = () => {
  const app = express();
  app.get('/vehicles', validateVehicleQuery, (req, res) => {
    res.status(200).json({
      filters: {
        make: req.filters.make ? req.filters.make.toString() : null,
        model: req.filters.model ? req.filters.model.toString() : null,
        year: req.filters.year ?? null,
      },
    });
  });
  return app;
};

describe('validateVehicleQuery middleware', () => {
  it('maps valid query params into regex/int filters', async () => {
    const app = buildApp();

    const response = await request(app)
      .get('/vehicles')
      .query({ make: 'Toy', model: 'Cor', year: 2020 });

    expect(response.status).toBe(200);
    expect(response.body.filters).toEqual({
      make: '/Toy/i',
      model: '/Cor/i',
      year: 2020,
    });
  });

  it('rejects invalid year input', async () => {
    const app = buildApp();

    const response = await request(app).get('/vehicles').query({ year: 'not-a-number' });

    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toBe('year must be integer');
  });
});
