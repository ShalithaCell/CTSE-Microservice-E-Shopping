const express = require('express');
const router = express.Router();

const productController = require('../../controllers/product/productController');

module.exports = function () {
    router.get('/data/:id', (req, res) => {
        productController.getProductById(req.params.id).then(response => {
            res.status(200).send(response);
        }).catch(err => {
            res.status(400).send(err.message);
        })
    });

    router.put('/data', (req,res) => {
        productController.updateProduct(req.params.id, req.body).then(resData => {
            res.status(200).send(resData)
        }).catch(err => {
            res.status(400).send(err.message)
        })
    });

    router.post('/data',  (req,res) => {
        productController.createProduct(req.body).then(resData => {
            res.status(200).send(resData)
        }).catch(err => {
            res.status(400).send(err.message)
        })
    });

    router.get('/data/all',  (req,res)  => {
        productController.getAllProducts().then( resData => {
            res.status(200).send(resData)
        }).catch(function (err) {
            res.status(400).send(err.message)
        })
    });

    router.delete('/data/:id',  (req, res) => {
        productController.deleteProductById(req.params.id).then(response => {
            res.status(200).send(response);
        }).catch(err => {
            res.status(err.status).send(err.message);
        })
    });

    return router;
}
