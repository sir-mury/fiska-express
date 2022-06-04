const express = require('express')
const router = express.Router()
const { getVehicle,
    getVehicles,
    deleteVehicle,
    updateVehicle,
    createVehicle} = require("../controllers/vehiclesController")

//Get Vehicles list and create a vehicle entry
router.route("/").get(getVehicles).post(createVehicle)

//Update a vehicle, get 1 vehicle and delete a vehicle
router.route("/:id").get(getVehicle).delete(deleteVehicle).put(updateVehicle)

module.exports = router