const mongoose = require('mongoose')
const User = require('../models/userModel')

const driverorCarrierOrderSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      validate: {
        validator: async(value)=>{
          try {
            const user = await User.findById(value)
            if(user.role !== 'driver'){
              return false
            }
            return true
          } catch (error) {
            console.log(error)
          }
        },
        message: props => `${props.value} is not a driver`
      }
    },
    carrier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      validate: {
        validator: async(value)=>{
          try {
            const user = await User.findById(value)
            if(user.role !== "carrier"){
              return false
            }
            return true
          } catch (error) {
            console.log(error)
          }
        },
        message: props => `${props.value} is not a carrier`
      }
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Orders'
    },
    status: {
      type: String,
      required: true,
      default: 'created',
      enum: ['created', 'dispatched', 'in-transit', 'delivered', 'completed']
    },
    accepted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const DriverOrder = mongoose.model('DriverOrder', driverorCarrierOrderSchema)

module.exports = { DriverOrder }
