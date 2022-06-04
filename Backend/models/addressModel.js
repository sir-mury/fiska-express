const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema({
    zipCode: String,
    streetName: String,
    localGovernment: String,
    city : String,
    state: String,
    country: String,
})

module.exports = mongoose.model('Address',AddressSchema)