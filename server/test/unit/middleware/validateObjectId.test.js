const express = require('express');
const request = require('supertest');
const validateObjectId = require('../../../src/middleware/validateObjectId');

describe('validateObjectId middleware', () => {
  const app = express();
  app.get('/drivers/:id', validateObjectId(), (req, res) => {
    res.status(200).json({ id: req.params.id });
  });

  it('allows requests with a valid ObjectId', async () => {
    const validId = '507f191e810c19729de860ea';
    const response = await request(app).get(`/drivers/${validId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: validId });
  });

  it('rejects requests with an invalid ObjectId', async () => {
    const response = await request(app).get('/drivers/invalid-id');

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/Invalid id format/i);
  });
});
