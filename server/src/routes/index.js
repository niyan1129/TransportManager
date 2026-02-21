const express = require("express");
const router = express.Router();

const driverRoutes = require("./driverRoutes");
const vehicleRoutes = require("./vehicleRoutes");
const tripRoutes = require("./tripRoutes");

router.get("/", (req, res) => {
    res.json({ message: "API is working!" });
});

router.use("/drivers", driverRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/trips", tripRoutes);


module.exports = router; 