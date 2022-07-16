const mongoose = require('mongoose')

const mailTokenSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token : {
        type: String,
        required: true
    }
},{
    timestamps: true
})

const MailToken = mongoose.model('MailToken',mailTokenSchema)

module.exports = MailToken