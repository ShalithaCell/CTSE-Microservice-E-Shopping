const express = require('express');
const router = express.Router();

const saleController = require('../../controllers/sales/sales.controller');

module.exports = function () {
    router.post('/create', saleController.createSale);
    router.delete('/delete/:id', saleController.deleteSale);
    router.get('/charges/:id', saleController.calculateAmount);
    router.get('/', saleController.getAllSales);

    return router;
}