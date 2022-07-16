const mongoose = require('mongoose')
const User = require('../models/userModel')
const {isMobilePhone,isEmail} = require('validator')

const addressSchema = new mongoose.Schema({
    zipCode: String,
    streetName: String,
    localGovernment: String,
    city: String,
    state: String,
    country: String
  })

const carrierSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    companyName : {
        type: String,
        required: true,
    },
    companyAddress: {
        type: addressSchema,
        required: true,
    },
    companyPhoneNumber: {
        type: String,
        required: true,
        validate: {
            validator: isMobilePhone,
            message: props => `${props} is not a valid phone number`
        }
    },
    companyEmail: {
        type: String,
        required: true,
        default: User.findById(this.user).select('email'),
        validate: {
            validator: isEmail,
            message: props => `${props} is not a valid Email`
        }
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
})

const Carrier = mongoose.model('Carrier',carrierSchema)

module.exports = {
    Carrier
}