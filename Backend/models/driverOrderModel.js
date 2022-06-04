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
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Orders'
      }
    ],
    status: {
        type: String,
        required: true,
        default: 'created',
        enum: ['created','dispatched','in-transit','delivered','completed']
    }
  },
  {
    timestamps: true
  }
)

const DriverOrder = mongoose.model('DriverOrder', driverOrderSchema)

module.exports = {DriverOrder}
