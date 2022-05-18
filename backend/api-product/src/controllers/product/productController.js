const { ObjectId } = require('mongoose').Types;
const Product = require('../../models/product/productModel');

const ProductController = function() {
    this.getAllProducts = function () {
        return new Promise(function (resolve, reject) {
            Product.find().exec().then(function (data) {
                resolve({success: true, data})
            }).catch(function (err) {
                reject({success: false, message: 'data not found'})
            })
        })
    }

    this.getProductById = function (id) {
        return new Promise(function (resolve, reject) {
            Product.find({id}).exec().then(function (data) {
                resolve({success: true, data})
            }).catch(function (err) {
                reject({success: false, message: 'Test not fount'})
            })
        })
    }

    this.deleteProductById = function (id) {
        return new Promise((resolve, reject) => {
            Product.delete({id}).exec().then(data => {
                resolve({success: true,  data});
            }).catch(err => {
                reject({status: false, message: 'err'});
            })
        })
    }

    this.createProduct = function (product) {
        return new Promise(function (resolve,reject) {
            const productToAdd=new Product(product)

            productToAdd.save().then(data => {
                resolve({ success: true, data})
            }).catch(function (err) {
                reject({success: false, message:'Product cannot be added'})
            })
        })
    }

    this.updateProduct = function (id, updateData) {
        return new Promise(function (resolve,reject) {
            Product.update({id},updateData).then(data => {
                resolve({success: true, data})
            }).catch(function (err) {
                reject({success: false, message:'patient cannot be updated '})
            })
        })

    }

}
module.exports=new ProductController();
