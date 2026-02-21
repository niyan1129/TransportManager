const { query, matchedData, validationResult } = require("express-validator");

const validateVehicleQuery = [
  query("make").optional().isString().withMessage("make must be string").trim(),
  query("model").optional().isString().withMessage("model must be string").trim(),
  query("year").optional().isInt().withMessage("year must be integer").toInt(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = matchedData(req, { locations: ["query"] });
    req.filters = {};

    if (data.make) req.filters.make = new RegExp(data.make, "i");
    if (data.model) req.filters.model = new RegExp(data.model, "i");
    if (data.year) req.filters.year = data.year;

    next();
  }
];

module.exports = validateVehicleQuery;
