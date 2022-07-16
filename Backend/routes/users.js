const express = require('express')
const router = express.Router()
const { registerUser,login,verifyAccount } = require('../controllers/userController')

//register user route
router.post('/register',registerUser)
router.post('/login',login)
router.get('/verify/:id/:token',verifyAccount)

module.exports = router