const express = require("express")
const healthCheck = require('express-healthcheck');
const bodyParser = require("body-parser")
const app = express()

let healthy = true;

// function to `check` liveness
function healthyIntercept(req, res, next){
    if(healthy){
        next();
    } else {
        next(new Error('unhealthy'));
    }
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// sets the Pod status to `unhealthy`
app.use('/unhealthy', function(req, res, next){
    healthy = false;
    res.status(200).json({ healthy });
});

app.use('/readiness', function (req, res, next) {
    res.status(200).json({ ready });
});

// returns the liveness response
app.use('/healthcheck', healthyIntercept, healthCheck());

app.get("/", (req, res) => {
    res.send("Welcome to Auth server version 1")
})



app.listen(4500, () => {
    console.log("Listening on PORT 4500")
})
