const mongoose = require('mongoose')

const productsSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productNumber: { type: String, required: true },
  productImage: { type: String, required: true },
  productType: { type: String, required: true},
  price: { type: String, required: true},
  qty: { type: String, required:true }
})

const products = mongoose.model('Products', productsSchema)

module.exports = { products }
