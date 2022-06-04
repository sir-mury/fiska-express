const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const Vehicle = require('../models/vehiclesModel')

// Get vehicles list
const getVehicles = asyncHandler(async (req, res) => {
  const vehicleList = await Vehicle.find()
  res.status(200).json({ message: vehicleList })
  //console.log(vehicleList)
})

//Get 1 vehicle
const getVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(`${req.params.id}`)
  if (!vehicle) {
    res.status(400)
    throw new Error('Vehicle does not exist')
  }
  res.json({ message: vehicle })
})

//Create Vehicle
const createVehicle = asyncHandler(async (req, res) => {
  let body = {
    type: req.body.type,
    number: req.body.number,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    condition: req.body.condition
  }

  if (!req.body.type) {
    res.status(400)
    throw new Error('Please enter a valid entry')
  }

  const vehicle = await Vehicle.create(body)
  res.json({ message: vehicle })
})

//Update vehicle details
const updateVehicle = asyncHandler(async (req, res) => {
  let convertVehicle = vehicle => {
    ;(vehicle.type = req.body.type),
      (vehicle.number = req.body.number),
      (vehicle.city = req.body.city),
      (vehicle.state = req.body.state),
      (vehicle.country = req.body.country),
      (vehicle.condition = req.body.condition)
  }

  if (!req.body) {
    res.status(400)
    throw new Error('Please write the update parameters')
  } else {
    const vehicle = await Vehicle.findById(req.params.id)
    convertVehicle(vehicle)
    await vehicle.save()
    res.status(200).json({ message: vehicle })
  }
})

//delete vehicle entry
const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(`${req.params.id}`)

  if(!vehicle){
    res.status(400)
    throw new Error('Vehicle does not exist')
  }
  await vehicle.remove()

  res.status(200).json({ message: `deleted vehicle ${req.params.id}` })
})

module.exports = {
  getVehicle,
  getVehicles,
  deleteVehicle,
  updateVehicle,
  createVehicle
}
