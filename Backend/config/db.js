const dotenv = require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Database connected successfully at: ${conn.connection.host}`.blue.underline)
    } catch (error) {
        console.log(`${error}`.red)
        process.exit(1)
    }
}

module.exports = connectDB