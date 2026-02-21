const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Driver = require("../models/driver");
const { generatePaginationLinks } = require("../utils/generatePaginationLinks");

// GET all drivers
exports.getAllDrivers = asyncHandler(async (req, res, next) => {
  const filters = req.filters || {};

  // sort
  let sortOption = {}; 
  if (req.query.sortField) {
    const field = req.query.sortField;
    const order = req.query.sortOrder === 'desc' ? -1 : 1; 
    sortOption[field] = order;
  }

  // pagination
  const result = await Driver.paginate(filters, {
    page: req.pagination.page,
    limit: req.pagination.limit,
    sort: sortOption,   
  });

  const links = generatePaginationLinks(
    req.originalUrl,
    result.page,
    result.totalPages,
    result.limit
  );
  
  res.set('Link', links.linkHeader);

  res.status(200).json({
    data: result.docs,
    total: result.totalDocs,
    totalPages: result.totalPages,
    currentPage: result.page,
    next: links.next,
    prev: links.prev,
  });
});

// GET by id
exports.getDriverById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Driver ID is required, please insert driver's id." });
  }

  const driver = await Driver.findById(id);

  if (!driver) {
    return res.sendStatus(204);  // No Content
  }

  res.status(200).json(driver);
});

//POST
exports.createDriver = asyncHandler(async (req, res) => {
  const { firstName, lastName, licenceNumber } = req.body;

  if (!firstName || !lastName || !licenceNumber) {
    return res.status(400).json({message:"Missing required fields: firstName, lastName, licenceNumber, please enter the 3 information."});
  }

  const existingDriver = await Driver.findOne({ licenceNumber });
  if (existingDriver) {
    return res.status(409).json({message:"Driver already exists, please check the information you entered."});
  }

  const newDriver = await Driver.create({ firstName, lastName, licenceNumber });
  res.status(201).json(newDriver);
});

//Put
exports.updateDriver = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Driver ID is required, please insert driver's ID." });
  }

    const updatedDriver = await Driver.findByIdAndUpdate(
      id,
      { firstName, lastName },
      { new: true, runValidators: true }
    );

    if (!updatedDriver) {
      return res.sendStatus(204);  // No Content (not found)
    }

    res.status(200).json(updatedDriver);  // OK
  
};


//delete a driver
exports.deleteDriver = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // check ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid driver ID format. It must be a 24-character hex string."
    });
  }

  // delete
  const deleted = await Driver.findByIdAndDelete(id);
  if (!deleted) {
    // not found
    return res.status(404).json({ message: "Driver not found." });
  }

  // delete successfully
  return res.sendStatus(204);
});

