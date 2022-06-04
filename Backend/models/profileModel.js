const mongoose = require('mongoose')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')

const addressSchema = new mongoose.Schema({
  zipCode: String,
  streetName: String,
  localGovernment: String,
  city: String,
  state: String,
  country: String
})

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    address: {
      type: addressSchema
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle'
    },
    carrier: {
      type: String
    },
    userType: {
      type: String,
      required: true,
      enum: ['driver', 'customer']
    }
  },
  {
    timestamps: true
  }
)

const Profile = mongoose.model('Profile', profileSchema)

module.exports = {
  Profile
}
