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

const matchDrivers = async (order) =>{
  try {
    //get the profile of all drivers
    const driverProfiles = await Profile.find({userType:'driver'}).populate('user')
    const drivers = []

    //for each driver,check their location and confirm distance to pickup address is within 1km
    driverProfiles.forEach( profile => {
      let start = {
        "latitude" : order.pickupAddress.latitude,
        "longitude": order.pickupAddress.longitude
      }
      let destination = {
        "latitude" : profile.address.latitude,
        "longitude" : profile.address.longitude
      }
      let dist = distanceBtw2Locations(start,destination)
      //console.log(dist)
      if(dist <= 7){
        drivers.push(profile)
      }
    });
    return drivers

  } catch (error) {
    console.log(error)
  }
}

const degreesToRadians = (degrees) => {
  let radians = (degrees * Math.PI)/180
  return radians
}

const distanceBtw2Locations = (start, destination) => {
  let startLat = degreesToRadians(start.latitude)
  let startLon = degreesToRadians(start.longitude)
  let destinationLat = degreesToRadians(destination.latitude)
  let destinationLon = degreesToRadians(destination.longitude)
  let theta = degreesToRadians((start.longitude - destination.longitude))
  
  let radius = 6371
  if ((startLat === destinationLat) && (startLon === destinationLon)) {
    return 0
  }
  let distance = Math.acos(Math.sin(startLat) * Math.sin(destinationLat) +
  Math.cos(startLat) * Math.cos(destinationLat) *
  Math.cos(theta)) * radius;
  return distance
}

module.exports = {
   findDrivers,
   matchDrivers
}