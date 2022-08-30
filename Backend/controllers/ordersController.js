const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const { Orders } = require('../models/ordersModel')
const { scopedOrders } = require('../permissions/orders')
const { matchDrivers } = require('../utils/matchDriver')
const { Carrier } = require('../models/carrierModel')

//get all orders
const getOrders = asyncHandler(async (req, res) => {
  const orderList = await Orders.find().populate('user')
  res.status(200).json({
    message: scopedOrders(req.user, orderList)
  })
})

//get single order detail
const getOrder = asyncHandler(async (req, res) => {
  const order = await Orders.findById(`${req.params.id}`)
  if (!order) {
    res.status(400)
    throw new Error('Order does not exist')
  }
  res.status(200).json({ message: order })
})

// create an order
const createOrder = asyncHandler(async (req, res) => {
  const {
    user,
    orderNumber,
    product,
    price,
    orderType,
    recipient,
    pickupAddress,
    billingAddress,
    deliveryAddress,
    status
  } = req.body

  if (!product) {
    res.status(400)
    throw new Error('Please input the necessary details')
  }
  const order = await Orders.create({
    user: req.user.id,
    orderNumber,
    product,
    recipient,
    orderType,
    price,
    pickupAddress,
    billingAddress,
    deliveryAddress,
    status
  })

  let availableDrivers
  let availableCarriers

  if (order.orderType === 'driver') {
    availableDrivers = await matchDrivers(order)
    //console.log(availableDrivers)
  } else if (order.orderType === 'carrier') {
    availableCarriers = await Carrier.find().populate('user')
  }
  
  res
    .status(201)
    .json({
      message: order.id,
      availableDrivers,
      availableCarriers
    })
})

//retry matching order
const retryMatchingOrder2Driver = asyncHandler(async (req, res) => {
  const order = await Orders.findById(`${req.params.id}`)
  await order.order2Driver()
  await order.save()
  if (order.matchedDriver !== null) {
    res.status(200).json({ message: order.matchedDriver })
  } else {
    res
      .status(200)
      .json({
        message:
          'Unfortunately there are no drivers available to handle this order'
      })
  }
})

//update an order
const updateOrder = asyncHandler(async (req, res) => {
  const {
    user,
    orderNumber,
    product,
    recipient,
    billingAddress,
    deliveryAddress,
    pickupAddress,
    status
  } = req.body

  const convertOrder = order => {
    return (
      (order.user = req.user),
      (order.orderNumber = req.body.orderNumber),
      (order.product = req.body.product),
      (order.recipient = req.body.recipient),
      (order.billingAddress = req.body.billingAddress),
      (order.deliveryAddress = req.body.deliveryAddress),
      (order.status = req.body.status)
      (order.pickupAddress = req.body.pickupAddress)
    )
  }
  const order = await Orders.findById(req.params.id)
  convertOrder(order)
  await order.save()
  res.status(200).json({
    message: 'Successfully updated order',
    order: order
  })
})

// delete an order
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Orders.findById(`${req.params.id}`)

  if (!order) {
    res.status(400)
    throw new Error('Order does not exist')
  }
  await order.remove()

  res
    .status(200)
    .json({ message: `Successfully deleted order:${req.params.id}` })
})

module.exports = {
  getOrder,
  getOrders,
  updateOrder,
  createOrder,
  deleteOrder,
  retryMatchingOrder2Driver
}
