const express = require('express')
const {errorHandler} = require('./middlewares/errorMiddleware')
const vehiclesRouter = require("./routes/vehicles")
const ordersRouter = require('./routes/orders')
const usersRouter = require('./routes/users')
const profilesRouter = require('./routes/profile')
const driverOrderRouter = require('./routes/driverOrder')
const carrierRouter = require('./routes/carrier')
const connectDB = require('./config/db')
const dotenv = require('dotenv').config()
const colors = require('colors')

const app = express()

// api route
let apiRoute = "/api"

//connect to database
connectDB()

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//vehicles route
app.use(`${apiRoute}/vehicles`,vehiclesRouter)

//orders route
app.use(`${apiRoute}/orders`,ordersRouter)

//users routes
app.use(`${apiRoute}/users`,usersRouter)

//profile routes
app.use(`${apiRoute}/profile`,profilesRouter)

//driver Order Routes
app.use(`${apiRoute}/driverorder`,driverOrderRouter)

//carrier routes
app.use(`${apiRoute}/carrier`,carrierRouter)

app.use(errorHandler)

const server = app.listen(3000, () => {
  console.log('Server started on port 3000')
})
