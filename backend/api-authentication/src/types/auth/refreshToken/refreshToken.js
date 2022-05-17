const moment = require('moment');

function RefreshToken()
{
    this.token = null;
    this.expires = null;
    this.created = null;
    this.createdByIp = null;
    this.revoked = null;
    this.revokedByIp = null;
    this.replacedByToken = null;
    this.user = null;
}

RefreshToken.prototype.isExpired = function()
{
    // check whether token is expired
    return this.revoked === null && (moment() >= moment(this.expires));
};

RefreshToken.prototype.isActive = function()
{
    // check whether token is valid
    return this.revoked === null && !this.isExpired();
};

module.exports = RefreshToken;
