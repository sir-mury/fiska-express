const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const express = require('express')
const {isEmail} = require('validator')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'Please enter an email'],
      validate: {
        validator: isEmail,
        message: props => `${props} is not a valid email`,
      }
    },
    username: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minlength: [6, 'Your password must be at least 6 characters']
    },
    role: {
      type: String,
      default: 'basic',
      enum: ['basic', 'driver', 'admin','carrier']
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

userSchema.statics.login = async function (email, username, password) {
  let user
  if (email) {
    user = await this.findOne({ email: email })
  } else if (username) {
    user = await this.findOne({ username: username })
  }

  if (user) {
    if(user.isVerified){
      const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user
    } else {
      throw new Error('Password is incorrect, check password')
    }
    }else{
      throw new Error('Please Verify your account first')
    }
  } else {
    throw new Error('Username or Email does not exist')
  }
}

module.exports = mongoose.model('User', userSchema)
