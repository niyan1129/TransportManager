const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");
const validateObjectId = require("../middleware/validateObjectId");
const validatePagination = require("../middleware/validatePagination");
const validateTripQuery = require("../middleware/validateTripQuery");

router.delete("/", (req, res) => {
    return res.status(400).json({ message: "Trip ID is required" });
    });

router.put("/", (req, res) => {
    return res.status(400).json({ message: "Trip ID is required" });
    });

router.route("/")
    .get(validatePagination, validateTripQuery, tripController.getAllTrips)
    .post(tripController.createTrip);



router.route("/:id")
    .get(validateObjectId(), tripController.getTripById)
    .put(validateObjectId(), tripController.updateTrip)
    .delete(validateObjectId(), tripController.deleteTrip);



module.exports = router;
