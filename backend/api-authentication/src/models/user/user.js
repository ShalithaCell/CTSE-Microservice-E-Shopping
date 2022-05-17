const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
    name           : String,
    email          : String,
    password       : String,
    phone          : String,
    emailConfirmed : Boolean,
    fileName       : String,
    type           : String,
    role           : {
        type : Schema.Types.ObjectId,
        ref  : 'role',
    },
    materials : [ {
        type : Schema.Types.ObjectId,
        ref  : 'researchMaterial',
    } ],
    materialsWorkshop : [ {
        type : Schema.Types.ObjectId,
        ref  : 'workshopMaterial',
    } ],
    refreshTokens : [ {
        type : Schema.Types.ObjectId,
        ref  : 'refreshToken',
    } ],
}, { collection: 'user' });

module.exports = mongoose.model('user', UserSchema);
