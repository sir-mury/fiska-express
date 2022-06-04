const { DriverOrder } = require('../models/driverOrderModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const { Orders } = require('../models/ordersModel')
const { Profile } = require('../models/profileModel')

const createDriverOrder = asyncHandler(async (req, res) => {
  //get the order that has a matched driver
  const matchedOrder = await Orders.findOne({ matchedDriver: `${req.user.id}` })

  //check if driver order already exists
  const driverOrderExist = await DriverOrder.findOne({
    driver: `${req.user.id}`
  }).populate({
    path: 'orders',
    populate: { path: 'user' }
  })
  if (driverOrderExist !== null) {
    let checkorder = driverOrderExist.orders
    let orderId = []
    checkorder.forEach(e => {
      orderId.push(e.id)
    })
    if (!orderId.includes(matchedOrder.id)) {
      driverOrderExist.orders = [...driverOrderExist.orders, matchedOrder]
    }
    await driverOrderExist.save()
    res.status(201).json({
      message: `Driver order has successfully been updated and the assigned driver is ${req.user.id}`,
      driverOrder: driverOrderExist
    })
  } else {
    //create the driver order from the order and the matched driver
    const driverOrder = await DriverOrder.create({
      driver: req.user.id,
      orders: [matchedOrder]
    })
    res.status(201).json({
      message: `Driver order has successfully been created and the assigned driver is ${req.user.id}`,
      driverOrder: driverOrder
    })
    //console.log('matchedDriver:', matchedDriver)
  }
})

const updateDriverOrder = asyncHandler(async (req, res) => {
  const { status } = req.body
  const driverOrder = await DriverOrder.findById(`${req.params.id}`)
  if (driverOrder === null) {
    res.status(400).json({ message: 'Driver Order does not exist' })
  }
  driverOrder.status = status
  const driverOrderOrders = driverOrder.orders
  driverOrderOrders.forEach(async e => {
    const order = await Orders.findById(e)
    order.status = status
    order.save()
  })
  driverOrder.save()

  res.status(200).json({ message: `Order Status: ${status}` })
})

module.exports = {
  createDriverOrder,
  updateDriverOrder,
}
