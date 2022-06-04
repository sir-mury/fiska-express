const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

//password hashing
const hashPassword = async password => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
  } catch (err) {
    return `${err.message}`
  }
}

//create tokens
const createToken = (id, role) => {
  const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: 600000
  })
  return token
}

//get all users
const getUsers = asyncHandler(async (req, res) => {
  console.log('get users')
})

//register users
const registerUser = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    username,
    role
  } = req.body
  const userExists = await User.findOne({email})

  //check if all necessary credentials have been entered
  if (!req.body) {
    res.status(400)
    throw new Error('Please enter your credentials')
  }

  //check if user exists
  if(userExists){
    res.status(400)
    throw new Error('User already exists')
  }

  let hashedPassword = await hashPassword(password)
  const user = await User.create({
    email,
    password: hashedPassword,
    username,
    role
  })
  const token = createToken(user._id, user.role)
  res.status(201).json({ message: user, token: token })
})

//login users
const login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body

  if (
    (!req.body.email && !req.body.password) ||
    (!req.body.username && !req.body.password)
  ) {
    res.status(400)
    throw new Error('Please enter your correct email/username and password')
  } else {
    const user = await User.login(email, username, password)
    if (user) {
      const token = createToken(user._id, user.role)
      res.status(200).json({
        user: user,
        token: token
      })
    }
  }
})


module.exports = {
  registerUser,
  getUsers,
  login
}
