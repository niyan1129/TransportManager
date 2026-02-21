const { query, matchedData, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;

const validateTripQuery = [
  
  query("startLocation").optional().isString().trim(),
  query("endLocation").optional().isString().trim(),


  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = matchedData(req, { locations: ["query"] });
    const filters = {}; // build a  filter

    if (data.startLocation) filters.startLocation = new RegExp(data.startLocation, "i");
    if (data.endLocation) filters.endLocation = new RegExp(data.endLocation, "i");


    req.filters = filters;
    next();
  }
];

module.exports = validateTripQuery;
