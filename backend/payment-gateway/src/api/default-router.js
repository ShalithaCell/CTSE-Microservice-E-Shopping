const Router = require('koa-router');
const StatusCodes = require('http-status-codes');
const { Response } = require('../types');

// Prefix all routes with: /auth
const router = new Router();

router.get('/', async (ctx, next) =>
{
    const response = new Response();

    ctx.response.status = StatusCodes.OK;
    response.success = true;
    response.message = "Payment Gateway Invoked !";
    response.data = {};

    ctx.body = response;
    next().then();
});

router.get('/readiness', async (ctx, next) =>
{
    ctx.response.status = StatusCodes.OK;
    ctx.body = { ready: true };

    next().then();
});

module.exports = router;
