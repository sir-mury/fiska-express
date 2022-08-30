const mongoose = require('mongoose')
const User = require('../models/userModel')
const { Profile } = require('../models/profileModel')
const { DriverOrder } = require('./driverOrderModel')
const axios = require('axios')

const addressSchema = new mongoose.Schema({
  zipCode: String,
  streetName: String,
  localGovernment: String,
  city: String,
  state: String,
  country: String,
  longitude: { type: Number, default: null },
  latitude: { type: Number, default: null }
})

const productsSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productImage: { type: String, required: true },
  productType: { type: String, required: true },
  qty: { type: String, required: true }
})

const ordersSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      validate: {
        validator: value => value.role === 'admin' || 'basic',
        message: props => `${props.value} is not approved`
      }
    },
    orderNumber: {
      type: String,
      default: getOrderNumber(16)
    },
    product: [productsSchema],
    pickupAddress: addressSchema,
    recipient: String,
    billingAddress: addressSchema,
    deliveryAddress: addressSchema,
    price: {
      type: Number
    },
    orderType: {
      type: String,
      enum: ['driver', 'carrier']
    },
    status: {
      type: String,
      required: true,
      default: 'created',
      enum: ['created', 'accepted', 'dispatched', 'in-transit', 'delivered']
    }
  },
  {
    timestamps: true
  }
)

ordersSchema.pre('save', async function (next) {
  try {
    const params = {
      access_key: process.env.GEOCODING_API_KEY,
      query: `${this.pickupAddress.zipCode} ${this.pickupAddress.streetName} ${this.pickupAddress.state},${this.pickupAddress.country}`,
      limit: 1
    } 
    let response = await axios.get(`http://api.positionstack.com/v1/forward`, {
      params: params
    })
    let data = response.data
    this.pickupAddress.longitude = data.data[0].longitude
    this.pickupAddress.latitude = data.data[0].latitude
  } catch (error) {
    console.log(`error:`, error)
  }
  next()
})

function getOrderNumber (length) {
  let orderNumber = ''
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    orderNumber += characters.charAt(
      Math.floor(Math.random() * characters.length)
    )
  }
  return orderNumber
}

ordersSchema.post('remove', async function (doc, next) {
  const driverOrder = await DriverOrder.findOne({ order: this.id })
  const ordersList = driverOrder.orders
  const index = driverOrder.orders.indexOf(this.id)
  ordersList.splice(index, 1)
  await driverOrder.save()
  next()
})

const Orders = mongoose.model('Orders', ordersSchema)

module.exports = {
  Orders
}
