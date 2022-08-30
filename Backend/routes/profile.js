const express = require('express')
const router = express.Router()
const {
  //createProfile,
  updateProfile,
  getProfile
} = require('../controllers/profileController')
const {isLoggedIn} = require('../middlewares/authMiddleware')

//get profile , (this was sunset for a new functionality) create profile and update profile
router
  .route('/')
  .get(isLoggedIn, getProfile)
  .put(isLoggedIn, updateProfile)

module.exports = router
