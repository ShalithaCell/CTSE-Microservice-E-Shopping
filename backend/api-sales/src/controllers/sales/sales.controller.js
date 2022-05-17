const { ObjectId } = require('mongoose').Types;
const Sale = require('../../models/sales/sales.model');

const createSale = async (req, res) => {
    console.log("in service");
    if(req.body){
        const sale = new Sale(req.body);
        await sale.save()
        .then(data => {
            res.status(200).send({data: data});
        })
        .catch(err => {
            res.status(500).send({err: err.message});
        })
    }
}

const getAllSales = async (req, res) => {
    let sales = await Sale.find({}).populate('vehicles', '_id name vehicleType description')
    .then(data => {
        res.status(200).send({data: data});
        return sales;
    })
    .catch(err => {
        res.status(500).send({err: err.message});
    })
}

const deleteSale = async (req, res) => {
    console.log(req.params);
    if(req.params && req.params.id){
        const data = await Sale.deleteOne({ _id: ObjectId(req.params.id) });
        data.then(data => {
            res.status(200).send({data: data});
            return data;
        })
        .catch(err => {
            res.status(500).send({err: err.message});
        })
    }
}
const calculateAmount = async (req, res) => {
    if(req.params && req.params.id){

        const sale = await Sale.findById(req.params.id);

        let totalAmount = 0;

        console.log(totalAmount);

        totalAmount = (load.load * load.amountPrKm);
        
        res.status(200).send({totalAmount: totalAmount});
    }
}


module.exports = {
    createSale,
    getAllSales,
    deleteSale,
    calculateAmount
}