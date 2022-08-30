const asyncHandler = require('express-async-handler')
const { Profile } = require('../models/profileModel')

const getProfile = asyncHandler(async (req, res) => {
  const user = req.user
  if (user.role === 'basic') {
    const profile = await Profile.findOne({ user: user.id }).populate('user')
    //console.log(`customerProfile ${profile}`)
    if (profile !== null) {
      res.status(200).json({ message: profile })
    }
  } else if (user.role === 'driver') {
    const profile = await Profile.findOne({ user: user.id }).populate('user')
    //console.log(user.id)
    //console.log(`driverProfile ${profile}`)
    if (profile !== null) {
      res.status(200).json({ message: profile })
    }
  } else {
    res.status(200).json({ message: 'Profile not available' })
  }
})



// const createProfile = asyncHandler(async (req, res) => {
//   const {
//     user,
//     firstName,
//     lastName,
//     address,
//     phoneNumber,
//     vehicle,
//     carrier,
//     pricing,
//     userType
//   } = req.body
//   console.log(`created: ${req.user.id}`)
//   const profileExist = await Profile.findOne({ user: `${req.user.id}` })
//   //(console.log(driverProfileExist)

//   //check if either customer or driver profile exist
//   if (profileExist) {
//     res.status(400)
//     throw new Error('Profile already exists')
//   }
//   //user = req.user.id
//   if (req.user.role === 'basic') {
//     const profile = await Profile.create({
//       user: req.user.id,
//       firstName,
//       lastName,
//       phoneNumber,
//       address,
//       userType: 'customer'
//     })
//     res.status(201).json({ message: profile })
//   } else if (req.user.role === 'driver') {
//     const profile = await Profile.create({
//       user: req.user.id,
//       firstName,
//       lastName,
//       phoneNumber,
//       address,
//       pricing,
//       vehicle,
//       carrier,
//       userType: 'driver'
//     })
//     res.status(201).json({ message: profile })
//   }
// })

const updateProfile = asyncHandler(async (req, res) => {
  const {
    user,
    firstName,
    lastName,
    address,
    phoneNumber,
    pricing,
    vehicle,
    carrier
  } = req.body
  if (req.user.role === 'customer') {
    const profile = await Profile.find({ user: req.user.id })

    if (profile !== null && profile.user.id === req.user.id) {
      profile.firstName = firstName
      profile.lastName = lastName
      profile.phoneNumber = phoneNumber
      profile.address = address
      profile = await profile.save()
    }
    res
      .status(200)
      .json({ message: 'Profile successfully updated', profile: profile })
  } else if (req.user.role === 'driver') {
    const profile = await Profile.findOne({ user: req.user.id })
    if (profile !== null && profile.user.toString() === req.user.id) {
      profile.firstName = req.body.firstName
      profile.lastName = req.body.ProfilelastName
      profile.phoneNumber = req.body.phoneNumber
      profile.address = req.body.address
      profile.vehicle = req.body.vehicle
      profile.carrier = req.body.carrier
      profile.pricing = req.body.pricing
      await profile.save()
    }
    res
      .status(200)
      .json({ message: 'Profile successfully updated', profile: profile })
  }
})

module.exports = {
  //createProfile,
  updateProfile,
  getProfile
}
