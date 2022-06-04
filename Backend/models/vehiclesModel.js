const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema({
    type : {
        type: String
    },
    number : String,
    city: String,
    state: String,
    country: String,
    condition: Boolean,
})

module.exports =  mongoose.model('Vehicles',vehicleSchema)

