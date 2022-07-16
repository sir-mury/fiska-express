const express = require('express')
const router = express.Router()

const {
  getCarrier,
  getDrivers,
  createCarrier,
  updateCarrier,
  deleteCarrier
} = require('../controllers/carrierController')

const { isLoggedIn } = require('../middlewares/authMiddleware')

router
  .route('/')
  .get(isLoggedIn, getCarrier)
  .get(isLoggedIn, getDrivers)
  .post(isLoggedIn, createCarrier)

router
  .route('/:id')
  .put(isLoggedIn, updateCarrier)
  .delete(isLoggedIn, deleteCarrier)

module.exports = router
