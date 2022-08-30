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
const { DriverOrder } = require('../models/driverOrderModel')
const {
  canCreateDriverOrder,
  canAcceptDriverOrder,
  otherDriverOrderStuff
} = require('../permissions/driverOrder')

//TO DO: Sort out the permission for all these routes and then start working on maps integration

//get driver orders
router.get('/', isLoggedIn, getDriverOrders)

//get a single driver order
router.get('/:id', isLoggedIn,canAcceptDriverOrders, getDriverOrder)

//create a new driver order
router.post('/', isLoggedIn,canCreateDriverOrders, createDriverOrder)

//update driver order (status primarily)
router.put('/:id',isLoggedIn, canAcceptDriverOrders,updateDriverOrder)

//accept order by driver
router.put('/accept/:id',isLoggedIn,canAcceptDriverOrders, acceptDriverOrder)

function canCreateDriverOrders (req, res, next) {
  if (!canCreateDriverOrder(req.user)) {
    res
      .status(401)
      .json({ message: 'You are not authorized to make this request' })
  }
  next()
}

async function canAcceptDriverOrders (req, res, next) {
  try {
    const driverOrder = await DriverOrder.findById(req.params.id)
    if (!canAcceptDriverOrder(req.user,driverOrder)) {
        res
      .status(401)
      .json({ message: 'You are not authorized to make this request' })
    }
    next()
  } catch (error) {
    console.log(error)
  }
}

function otherDriverPermission(req,res,next){
    if(!otherDriverOrderStuff(req.user)){
        res
      .status(401)
      .json({ message: 'You are not authorized to make this request' })
    }
    next()
}

module.exports = router
