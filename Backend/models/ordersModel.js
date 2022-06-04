const mongoose = require('mongoose')
//const { createDriverOrder } = require('../controllers/driverOrderController')
//const productsSchema = require('../models/productsModel')
//const addressSchema = require('../models/addressModel')
const User = require('../models/userModel')
const { Profile } = require('../models/profileModel')
const { DriverOrder } = require('./driverOrderModel')

const addressSchema = new mongoose.Schema({
  zipCode: String,
  streetName: String,
  localGovernment: String,
  city: String,
  state: String,
  country: String
})

const productsSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productNumber: { type: String, required: true },
  productImage: { type: String, required: true },
  productType: { type: String, required: true },
  price: { type: String, required: true },
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
    orderNumber: String,
    product: [productsSchema],
    pickupAddress: addressSchema,
    userOrder: String,
    billingAddress: addressSchema,
    deliveryAddress: addressSchema,
    status: {
      type: String,
      required: true,
      default: 'created',
      enum: ['created', 'dispatched', 'in-transit', 'delivered']
    },
    matchedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

ordersSchema.methods.order2Driver = async function(){
  try {
    const drivers = await User.find({ role: 'driver' })
    let orderDriver
    let driverStreet
    let driverAddress = new Map()
    //get the address of every driver, this is rudimentary code
    for (const driver of drivers) {
      const driverProfile = await Profile.findOne(driver.user)
      //console.log(driverProfile)
      driverStreet = driverProfile.address.streetName
      driverAddress.set(driverStreet, driverProfile.user)
    }
    if(driverAddress.has(this.deliveryAddress.streetName)){
      orderDriver = driverAddress.get(this.deliveryAddress.streetName)
      this.matchedDriver = orderDriver
    }else{
      this.matchedDriver = null
    }
  } catch (error) {
    console.log(error.message)
  }
}

// ordersSchema.post('save',async function (params) {
  
// })

const Orders = mongoose.model('Orders', ordersSchema)

module.exports = {
  Orders,
}
