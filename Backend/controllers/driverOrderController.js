const { DriverOrder } = require('../models/driverOrderModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const { Orders } = require('../models/ordersModel')
const { Profile } = require('../models/profileModel')

const getDriverOrders = asyncHandler(async (req, res) => {
  const driverOrders = await DriverOrder.find({ driver: req.user }).populate(
    'driver',
    'orders'
  )
  res.status(200).json({
    message: driverOrders
  })
})

const getDriverOrder = asyncHandler(async (req, res) => {
  const driverOrder = await DriverOrder.findById(req.params.id).populate(
    'orders'
  )
  if (driverOrder === null) {
    res.status(400)
    throw new Error('Driver Order does not exist')
  }
  res.status(200).json({
    message: driverOrder
  })
})

const createDriverOrder = asyncHandler(async (req, res) => {
  const { driver } = req.body
  //get the order from the user that created it
  const order = await Orders.findOne({ user: req.user.id })

  if(req.body.driver === null){
    throw new Error('Please choose a driver')
  }
  //create the driver order
  const driverOrder = await DriverOrder.create({
    driver,
    order
  })

  res
    .status(201)
    .json({
      message:
        'Successfully created, please await acceptance from the chosen driver'
    })
})

const acceptDriverOrder = asyncHandler(async(req,res)=>{
  //get the driver order
  const driverOrder = await DriverOrder.findById(req.params.id)

  if (driverOrder === null) {
    res.status(400).json({ message: 'Driver Order does not exist' })
  }

  //update the accepted flag and then change status flag to accepted
  driverOrder.accepted = true
  await driverOrder.save()
  res.status(201).json({message: 'Order has been accepted by the driver,wait for pick up'})
})

const updateDriverOrder = asyncHandler(async (req, res) => {
  const { status } = req.body
  const driverOrder = await DriverOrder.findById(req.params.id).populate('order')
  if (driverOrder === null) {
    res.status(400).json({ message: 'Driver Order does not exist' })
  }
  driverOrder.status = status
  driverOrder.order.status = status
  // const driverOrderOrders = driverOrder.orders
  // driverOrderOrders.forEach(async e => {
  //   const order = await Orders.findById(e)
  //   order.status = status
  //   order.save()
  // })
  await driverOrder.save()

  res.status(200).json({ message: `Order Status: ${status}` })
})

module.exports = {
  createDriverOrder,
  updateDriverOrder,
  acceptDriverOrder,
  getDriverOrder,
  getDriverOrders
}
