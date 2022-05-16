const mongoose = require('mongoose');

const SalesSchema = new mongoose.Schema({
    saleId : { type: String, required: true },
    productId : [{ type: String, required: true }],
    customerId :  { type: String, required: false },
    date :  { type: Date, required: false },
    status :  { type: Boolean, required: false },
    // vehicles : [{ type: mongoose.Schema.Types.ObjectId, required: false, ref : 'vehicles' }]
})

const Sales = mongoose.model('sales', SalesSchema);
module.exports = Sales;