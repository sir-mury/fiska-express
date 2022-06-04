const express = require('express')
const router = express.Router()
const {
  createProfile,
  updateProfile,
  getProfile
} = require('../controllers/profileController')
const {isLoggedIn} = require('../middlewares/authMiddleware')

//get profile , create profile and update profile
router
  .route('/')
  .get(isLoggedIn, getProfile)
  .post(isLoggedIn, createProfile)
  .put(isLoggedIn, updateProfile)

module.exports = router
