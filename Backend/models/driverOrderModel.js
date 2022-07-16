const mongoose = require('mongoose')

const driverOrderSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      validate: {
        validator: value => value.role === 'admin' || 'driver',
        message: props => `${props} is not allowed to perform this action`
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

const DriverOrder = mongoose.model('DriverOrder', driverOrderSchema)

module.exports = { DriverOrder }
