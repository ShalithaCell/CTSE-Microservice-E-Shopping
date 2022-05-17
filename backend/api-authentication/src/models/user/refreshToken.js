const mongoose = require('mongoose');

const { Schema } = mongoose;

const RefreshTokenSchema = new Schema({
    token           : String,
    expires         : Date,
    created         : Date,
    createdByIp     : String,
    revoked         : Date,
    revokedByIp     : String,
    replacedByToken : String,
    user            : {
        type : Schema.Types.ObjectId,
        ref  : 'user',
    },
}, { collection: 'refreshToken' });

module.exports = mongoose.model('refreshToken', RefreshTokenSchema);
