const express  = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const productApi = require('./src/api/product/product');
const healthCheck = require('express-healthcheck');


dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const MONGODB_URI = "mongodb+srv://admin:4atk1uWZQE34rMBI@applicationframework.fx2sd.mongodb.net/onlineStore"

let healthy = true;

// function to `check` liveness
function healthyIntercept(req, res, next){
    if(healthy){
        next();
    } else {
        next(new Error('unhealthy'));
    }
}

// sets the Pod status to `unhealthy`
app.use('/unhealthy', function(req, res, next){
    healthy = false;
    res.status(200).json({ healthy });
});

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
    if(error){
        console.log('Database Error : ', error.message);
    }
});

mongoose.connection.once('open', () => {
    console.log('MDB Connected');
});

app.use('/readiness', function (req, res, next) {
    res.status(200).json({ ready: true });
});

// returns the liveness response
app.use('/healthcheck', healthyIntercept, healthCheck());

app.route('/').get((req,res)=> {
    res.send('Server is running');
});


app.use('/product', productApi());


const PORT =4000;

app.listen(PORT, () => {
    console.log(`Connected to ${PORT}`);
})
