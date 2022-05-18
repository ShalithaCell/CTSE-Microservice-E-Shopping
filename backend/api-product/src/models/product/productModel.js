const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  storedLocation: { type: String, required: false },
});

const Products = mongoose.model('products', ProductSchema);
module.exports = Products;
