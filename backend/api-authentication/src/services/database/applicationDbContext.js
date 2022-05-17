const mongoose = require('mongoose');
const { connectionString } = require('../../config');

const dbContext = () =>
{
    mongoose.connect(connectionString,
        {
            useNewUrlParser    : true,
            useFindAndModify   : false,
            useUnifiedTopology : true,
        })
        . then(() => { console.log('connection established'); });

    mongoose.connection.once('open', () =>
    {
        console.log('connected to database');
    });

    mongoose.connection.on('error', console.error);
};

module.exports = dbContext;
