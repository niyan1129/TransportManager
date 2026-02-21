const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driverController");
const validateObjectId = require("../middleware/validateObjectId");
const validatePaginate = require('../middleware/validatePagination');
const validateDriverQuery = require('../middleware/validateDriverQuery');

router.delete("/", (req, res) => {
    return res.status(400).json({ message: "Driver ID is required" });
  });
  
  router.put("/", (req, res) => {
    return res.status(400).json({ message: "Driver ID is required" });
  });
  
 
  router.get("/", validatePaginate, validateDriverQuery, driverController.getAllDrivers);
  router.post("/", driverController.createDriver);
  

  
  router.route("/:id")
    .get(validateObjectId(), driverController.getDriverById)
    .put(validateObjectId(), driverController.updateDriver)
    .delete(validateObjectId(), driverController.deleteDriver);


module.exports = router;