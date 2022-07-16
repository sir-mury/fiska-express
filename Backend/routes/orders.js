//orders route
const express = require('express')
const router = express.Router()

//import the orders controller
const {
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  createOrder,
  retryMatchingOrder2Driver
} = require('../controllers/ordersController')

const { isLoggedIn } = require('../middlewares/authMiddleware')

//import order model
const Orders = require('../models/ordersModel')

//import order permissions
const {
  canCreateOrders,
  canViewOrder,
  canDeleteOrders
} = require('../permissions/orders')

//get orders and create orders
router
  .route('/')
  .get(isLoggedIn, getOrders)
  .post(isLoggedIn, authCreateOrder, createOrder)

//update an order, get order details and delete an order
router
  .route('/:id')
  .get(authViewSingleOrder, isLoggedIn, getOrder)
  .put(isLoggedIn, authCreateOrder, updateOrder)
  .delete(isLoggedIn, authDeleteOrder, deleteOrder)

//retry matching an order to driver
router.put('/retry/:id', isLoggedIn, authCreateOrder, retryMatchingOrder2Driver)

//middleware to determine who can create orders
function authCreateOrder (req, res, next) {
  if (!canCreateOrders(req.user)) {
    res
      .status(401)
      .json({
        message: 'Not Allowed, You are not authorized to perform this action'
      })
  } else {
    next()
  }
}

//middleware to determine who can delete an order
function authDeleteOrder (req, res, next) {
  if (!canDeleteOrders(req.user)) {
    res.status(401).json({ message: 'Not Allowed' })
  } else {
    next()
  }
}

//middleware to get a single order detail
async function authViewSingleOrder (req, res, next) {
  const order = await Orders.findById(`${req.params.id}`)
  if (!canViewOrder(req.user, order)) {
    res.status(401).json({ message: 'Not Allowed' })
  } else {
    next()
  }
}

module.exports = router
