const express = require('express')
const router = express.Router()
const { updateDriverOrder ,createDriverOrder} = require('../controllers/driverOrderController')
const { isLoggedIn } = require('../middlewares/authMiddleware')

//create a new driver order
router.post('/',isLoggedIn,createDriverOrder)

//update driver order (status primarily)
router.put('/:id', isLoggedIn, updateDriverOrder)

module.exports = router