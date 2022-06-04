const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const isLoggedIn = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      //Get token from header
      token = req.headers.authorization.split(' ')[1]

      // verify token
      decodedToken = jwt.verify(token, process.env.JWT_SECRET)

      //Get user from decoded token
      req.user = await User.findById(decodedToken.id).select('-password')

      next()
    } catch (error) {
      console.log(error.message)
      res.status(401)
      throw new Error('Not authorized')
    }
  }
  if (!token) {
    res.status(401)
    throw new Error('Not Authorized, no token provided')
  }
})

module.exports = { isLoggedIn }
