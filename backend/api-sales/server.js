const express  = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const salesApi = require('./src/api/sales/sales.api');
const healthCheck = require('express-healthcheck');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 7000;

const MONGODB_URI = process.env.MONGODB_URI;
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

mongoose.connect(MONGODB_URI, {
    useCreateIndex : true,
    useNewUrlParser : true,
    useFindAndModify : false,
    useUnifiedTopology : true,
}, (error) => {
    if(error){
        console.log('Database Error : ', error.message);
    }
});

mongoose.connection.once('open', () => {
    console.log('Database synced');
});

app.use('/readiness', function (req, res, next) {
    res.status(200).json({ ready: true });
});

// returns the liveness response
app.use('/healthcheck', healthyIntercept, healthCheck());

app.route('/').get((req,res)=> {
    res.send('Server is running');
});


app.use('/sales', salesApi());


app.listen(PORT, () => {
    console.log(`Server is tunning on PORT ${PORT}`);
})
