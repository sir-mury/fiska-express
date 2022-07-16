const express = require('express')
const router = express.Router()
const {
  getDriverOrder,
  getDriverOrders,
  updateDriverOrder,
  createDriverOrder,
  acceptDriverOrder
} = require('../controllers/driverOrderController')
const { isLoggedIn } = require('../middlewares/authMiddleware')

//TO DO: Sort out the permission for all these routes and then start working on maps integration

//get driver orders
router.get('/', isLoggedIn, getDriverOrders)

//get a single driver order
router.get('/:id', isLoggedIn, getDriverOrder)

//create a new driver order
router.post('/', isLoggedIn, createDriverOrder)

//update driver order (status primarily)
router.put('/:id', isLoggedIn, updateDriverOrder)

//accept order by driver
router.put('/accept/:id', isLoggedIn, acceptDriverOrder)

module.exports = router
