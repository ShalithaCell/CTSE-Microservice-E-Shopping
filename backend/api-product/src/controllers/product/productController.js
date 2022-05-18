const { ObjectId } = require('mongoose').Types;
const Product = require('../../models/product/productModel');
const uuid = require('uuid');

const ProductController = function () {
  this.getAllProducts = function () {
    return new Promise(function (resolve, reject) {
      Product.find({})
        .exec()
        .then(function (data) {
          resolve({ success: true, data });
        })
        .catch(function (err) {
          reject({ success: false, message: 'Test not fount' });
        });
    });
  };

  this.getProductById = function (id) {
    return new Promise(function (resolve, reject) {
      Product.find({ id })
        .exec()
        .then(function (data) {
          resolve({ success: true, data });
        })
        .catch(function (err) {
          reject({ success: false, message: 'Test not fount' });
        });
    });
  };

  this.deleteProductById = function (id) {
    return new Promise((resolve, reject) => {
      Product.deleteOne({ id })
        .exec()
        .then((data) => {
          resolve({ success: true, data });
        })
        .catch((err) => {
          reject({ status: false, message: 'err' });
        });
    });
  };

  this.createProduct = function (product) {
    return new Promise(function (resolve, reject) {
      let productToAdd = new Product(product);

      productToAdd.id = uuid.v4();

      productToAdd
        .save()
        .then((data) => {
          resolve({ success: true, data });
        })
        .catch(function (err) {
          reject({ success: false, message: 'Product cannot be added' });
        });
    });
  };

  this.updateProduct = function (id, updateData) {
    return new Promise(function (resolve, reject) {
      Product.update({ id }, updateData)
        .then((data) => {
          resolve({ success: true, data });
        })
        .catch(function (err) {
          reject({ success: false, message: 'patient cannot be updated ' });
        });
    });
  };
};
module.exports = new ProductController();
