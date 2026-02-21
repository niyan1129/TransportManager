const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");
const validateObjectId = require("../middleware/validateObjectId");
const validatePagination = require("../middleware/validatePagination");
const validateVehicleQuery = require("../middleware/validateVehicleQuery");

router.delete("/", (req, res) => {
    return res.status(400).json({ message: "Vehicle ID is required" });
    });

router.put("/", (req, res) => {
    return res.status(400).json({ message: "Vehicle ID is required" });
    });

router.route("/")
    .get(validatePagination, validateVehicleQuery, vehicleController.getAllVehicles)
    .post(vehicleController.createVehicle);



    
router.route("/:id")
    .get(validateObjectId(), vehicleController.getVehicleById)
    .put(validateObjectId(), vehicleController.updateVehicle)
    .delete(validateObjectId(), vehicleController.deleteVehicle);


    

module.exports = router;
