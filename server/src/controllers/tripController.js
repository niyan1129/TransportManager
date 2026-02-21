const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Trip = require("../models/trip");
const { generatePaginationLinks } = require("../utils/generatePaginationLinks");

// GET all trips

// Trip Controller - getAllTrips

exports.getAllTrips = asyncHandler(async (req, res) => {
  const filters = req.filters || {};

  // sorting
  let sortOption = {};
  if (req.query.sortField) {
    const field = req.query.sortField;
    const order = req.query.sortOrder === 'desc' ? -1 : 1;
    sortOption[field] = order;
  }

  const result = await Trip.paginate(filters, {
    page: req.pagination.page,
    limit: req.pagination.limit,
    populate: [
      { path: "driver" },
      { path: "vehicle" }
    ],
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



// GET trip by ID
exports.getTripById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid trip ID format. Must be 24-char hex string." });
  }

  const trip = await Trip.findById(id);
  if (!trip) {
    return res.sendStatus(204);
  }

  res.status(200).json(trip);
});

// POST create trip
exports.createTrip = asyncHandler(async (req, res) => {
  const { driver, vehicle, startLocation, endLocation, startTime, endTime } = req.body;

  if (!driver || !vehicle) {
    return res.status(400).json({ message: "Missing required fields: 'driver' and 'vehicle'" });
  }

  if (!mongoose.Types.ObjectId.isValid(driver) || !mongoose.Types.ObjectId.isValid(vehicle)) {
    return res.status(400).json({ message: "Driver ID or Vehicle ID format is invalid, it must be a 24-character hexadecimal string (MongoDB ObjectId)" });
  }

  // repeat check trip
  const existingTrip = await Trip.findOne({
    driver,
    vehicle,
    startLocation,
    endLocation,
    startTime,
    endTime
  });

  if (existingTrip) {
    return res.status(409).json({
      message: "A similar trip already exists. Please check the details."
    });
  }

  const newTrip = await Trip.create({
    driver,
    vehicle,
    startLocation,
    endLocation,
    startTime,
    endTime,
  });

  res.status(201).json(newTrip);
});

// PUT update trip
exports.updateTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { driver, vehicle, startLocation, endLocation, startTime, endTime } = req.body;


  if (!driver || !vehicle) {
    return res.status(400).json({ message: "Missing required fields: 'driver' and 'vehicle'" });
  }

  if (!mongoose.Types.ObjectId.isValid(driver) || !mongoose.Types.ObjectId.isValid(vehicle)) {
    return res.status(400).json({ message: "Driver ID or Vehicle ID format is invalid" });
  }

  const updatedTrip = await Trip.findByIdAndUpdate(
    id,
    { driver, vehicle, startLocation, endLocation, startTime, endTime },
    { new: true, runValidators: true }
  );

  if (!updatedTrip) {
    return res.sendStatus(204);
  }

  res.status(200).json(updatedTrip);
});

// DELETE trip
exports.deleteTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;

  

  const deletedTrip = await Trip.findByIdAndDelete(id);
  if (!deletedTrip) {
    return res.sendStatus(204);
  }

  res.status(200).json({message:"Trip deleted"});
});
