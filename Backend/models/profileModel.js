const mongoose = require('mongoose')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')

const addressSchema = new mongoose.Schema({
  zipCode: String,
  streetName: String,
  localGovernment: String,
  city: String,
  state: String,
  country: String,
  latitude: Number,
  longitude: Number,
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
      default: null,
      //required: true
    },
    lastName: {
      type: String,
      default: null,
      //required: true
    },
    phoneNumber: {
      type: String,
      default: null,
      //required: true
    },
    address: {
      type: addressSchema,
      default: null,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      //default: null,
      ref: 'Vehicle'
    },
    carrier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      //default: null,
      validate: {
        validator: async(value)=>{
          try {
            const user = await this.carrier.ref.findById(value)
            if(user.role !== "carrier"){
              return false
            }
            return true
          } catch (error) {
            console.log('error:',error)
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
