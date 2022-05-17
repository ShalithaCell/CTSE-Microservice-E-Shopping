const combineRouters = require('koa-combine-routers');
// auth routes
const applicationRouter = require('./application/applicationRouter');
const cardRouter = require('./v1/card/cardRouter');
const phoneRouter = require('./v1/phone/phoneRouter');
const defaultRouter = require('./default-router');

const router = combineRouters(
    defaultRouter,
    applicationRouter,
    cardRouter,
    phoneRouter,
);

module.exports = router;
