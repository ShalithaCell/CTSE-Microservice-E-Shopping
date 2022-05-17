const combineRouters = require('koa-combine-routers');

const authRouter = require('./v1/auth/authRouter');
const applicationRouter = require('./application/applicationRouter');
const userRouter = require('./v1/user/userRouter');
const roleRouter = require('./v1/role/roleRouter');
const defaultRouter = require('./default-router');

const router = combineRouters(
    defaultRouter,
    applicationRouter,
    authRouter,
    userRouter,
    roleRouter,
);

module.exports = router;
