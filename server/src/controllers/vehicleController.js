const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Vehicle = require("../models/vehicle");
const { generatePaginationLinks } = require("../utils/generatePaginationLinks");

// GET /api/vehicles

exports.getAllVehicles = asyncHandler(async (req, res) => {
  const filters = req.filters || {}; 

  let sortOption = {}; 
  if (req.query.sortField) {
    const field = req.query.sortField;
    const order = req.query.sortOrder === 'desc' ? -1 : 1;
    sortOption[field] = order;
  }

  const result = await Vehicle.paginate(filters, {
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


// GET /api/vehicles/:id
exports.getVehicleById = asyncHandler(async (req, res) => {
  const { id } = req.params;



  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    return res.sendStatus(204);
  }

  res.status(200).json(vehicle);
});

// POST /api/vehicles
exports.createVehicle = asyncHandler(async (req, res) => {
  const { make, model, year, driver, plateNumber } = req.body;

  if (!make || !model || !plateNumber) {
    return res.status(400).json({ message: "Missing required fields: 'make' , 'model' and 'plateNumber" });
  }

  if (plateNumber) {
    const existingVehicle = await Vehicle.findOne({ plateNumber });
    if (existingVehicle) {
      return res.status(409).json({ message: "Vehicle with this plate number already exists, please check the information you entered." });
    }
  }

  const newVehicle = await Vehicle.create({ make, model, year, driver, plateNumber });
  res.status(201).json(newVehicle);
});

// PUT /api/vehicles/:id
exports.updateVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { make, model, year, driver, plateNumber } = req.body;

  
  if (driver && !mongoose.Types.ObjectId.isValid(driver)) {
    return res.status(400).json({ message: "Driver ID format is invalid, it must be a 24-character hexadecimal string (MongoDB ObjectId)." });
  }

  if (!make || !model) {
    return res.status(400).json({ message: "Missing required fields: 'make' and 'model'" });
  }

  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    id,
    { make, model, year, driver, plateNumber },
    { new: true, runValidators: true }
  );

  if (!updatedVehicle) {
    return res.sendStatus(204);
  }

  res.status(200).json(updatedVehicle);
});

// DELETE /api/vehicles/:id
exports.deleteVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  

  const deletedVehicle = await Vehicle.findByIdAndDelete(id);
  if (!deletedVehicle) {
    return res.sendStatus(204);
  }

  res.status(200).json({ message: "Vehicle deleted" });
});
