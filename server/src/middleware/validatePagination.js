// middleware/paginationValidator.js
const { query, matchedData, validationResult } = require('express-validator');

const paginationValidator = [
  //check page
  query('page')
    .optional()
    .isInt({ gt: 0 }).withMessage('Page must be a number greater than 0'),

  // page limit
  query('limit')
    .optional()
    .isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1 and 20'),

  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    
    const data = matchedData(req, { locations: ['query'] });

    
    req.pagination = {
      page: data.page || 1,
      limit: data.limit || 10
    };

    next();
  }
];

module.exports = paginationValidator;
