// src/middleware/validateDriverQuery.js
const { query, validationResult, matchedData } = require('express-validator');

const validateDriverQuery = [
  query('firstName').optional().isString().trim(),
  query('licenceNumber').optional().isString().trim(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const raw = matchedData(req, { locations: ['query'] });
    const filters = {};

    if (raw.firstName) filters.firstName = new RegExp(raw.firstName, 'i');
    if (raw.licenceNumber) filters.licenceNumber = raw.licenceNumber;

    req.filters = filters;  //  now controller will receive usable filters
    next();
  }
];

module.exports = validateDriverQuery;