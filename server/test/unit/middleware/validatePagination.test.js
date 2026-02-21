const express = require('express');
const request = require('supertest');
const paginationValidator = require('../../../src/middleware/validatePagination');

const buildApp = () => {
  const app = express();
  app.get('/items', paginationValidator, (req, res) => {
    res.status(200).json(req.pagination);
  });
  return app;
};

describe('validatePagination middleware', () => {
  it('injects default pagination values when query params are missing', async () => {
    const app = buildApp();

    const response = await request(app).get('/items');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ page: 1, limit: 10 });
  });

  it('returns 400 when invalid pagination values are provided', async () => {
    const app = buildApp();

    const response = await request(app).get('/items').query({ page: 0, limit: 50 });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: 'Page must be a number greater than 0' }),
        expect.objectContaining({ msg: 'Limit must be between 1 and 20' }),
      ]),
    );
  });
});
