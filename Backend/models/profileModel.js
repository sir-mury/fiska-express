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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      validate: {
        validator: async(value)=>{
          try {
            const user = await User.findById(value)
            if(user.role !== carrier){
              return false
            }
            return true
          } catch (error) {
            console.log(error)
          }
        },
        message: props => `${props} is not a carrier`
      }
    },
    pricing: {
      type: Number
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
