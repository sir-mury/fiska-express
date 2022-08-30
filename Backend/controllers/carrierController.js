const asyncHandler = require('express-async-handler')
const { Carrier } = require('../models/carrierModel')
const { Profile } = require('../models/profileModel')

// get carriers profile
const getCarrier = asyncHandler(async (req, res) => {
  const user = req.user
  if (user.role === 'carrier') {
    const carrier = await Carrier.findOne({ user: user.id })
    if (carrier !== null) {
      res.status(200).json({ message: carrier })
    } else {
      res.status(400).json({
        message: 'Carrier does not exist'
      })
    }
  }
})

// create a carrier profile
const createCarrier = asyncHandler(async (req, res) => {
  const {
    user,
    companyName,
    companyAddress,
    companyPhoneNumber,
    companyEmail
  } = req.body

  const itexists = await Carrier.find({ user: req.user.id })
  if (itexists === null) {
    const carrier = Carrier.create({
      user: req.user.id,
      companyName,
      companyAddress,
      //companyEmail,
      companyPhoneNumber
    })
    res
      .status(201)
      .json({ carrier: carrier, message: 'Carrier successfully created' })
  } else {
    res.status(400).json({ message: 'Carrier already exists' })
  }
})

// update your carrier profile
const updateCarrier = asyncHandler(async (req, res) => {
  const {
    user,
    companyName,
    companyAddress,
    companyPhoneNumber,
    //companyEmail,
    companyPricing,
  } = req.body

  const carrier = await Carrier.find({ user: req.params.id })
  if (carrier !== null && carrier.user === req.user.id) {
    carrier.companyName = companyName
    carrier.companyAddress = companyAddress
    //carrier.companyEmail = companyEmail
    carrier.companyPhoneNumber = companyPhoneNumber
    carrier.companyPricing = companyPricing
    await carrier.save()
  }
  res
    .status(200)
    .json({ message: 'Carrier Details Updated sucessfully', carrier: carrier })
})

//delete your carrier profile
const deleteCarrier = asyncHandler(async (req, res) => {
  const carrier = await Carrier.findById(req.params.id)
  if(!carrier){
    res.status(400)
    throw new Error("Carrier does not exist")
  }
  await carrier.remove()
  res.status(200).json({message: `carrier successfully deleted: ${req.params.id}` })
})
//get drivers
const getDrivers = asyncHandler(async (req, res) => {
    const driver = await Profile.find({carrier:req.user.id}).populate('User')
    if(driver === null){
      res.status(200).json({message: "You have no attached driver(s)"})
    }
    res.status(200).json({drivers: driver})
})

module.exports = {
    getCarrier,
    createCarrier,
    updateCarrier,
    deleteCarrier,
    getDrivers
}