const User = require('../models/userModel')
const {Profile} = require('../models/profileModel')
const {DriverOrder} = require('../models/driverOrderModel')

const findDrivers = async (order) => {

/* This is all rudimentary code,
    The actual functionality is that we use google maps api
    to get the drivers close to site of creation of the order and 
    then list them out for the user to choose from,
    when driver is chosen, then a driver order is to be created
*/
  try {
    const drivers = await User.find({ role: 'driver' })
    let orderDriver
    let driverStreet
    let driverAddress = new Map()
    //get the address of every driver, this is rudimentary code
    for (const driver of drivers) {
      const driverProfile = await Profile.findOne(driver.user)
      //console.log(driverProfile)
      driverStreet = driverProfile.address.streetName
      driverAddress.set(driverStreet, driverProfile.user)
    }
    if (driverAddress.has(order.deliveryAddress.streetName)) {
      orderDriver = driverAddress.get(order.deliveryAddress.streetName)
      console.log(`Driver ${orderDriver} is notified to pick up the following order`)
      const driverOrder = await DriverOrder.create({
        driver: orderDriver,
        order
      })
      return 'successful'
    } else {
      console.log('No driver available to pick up this order')
      return 'failed'
    }
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = {
   findDrivers
}