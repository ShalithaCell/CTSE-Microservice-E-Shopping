const Router = require('koa-router');
const StatusCodes = require('http-status-codes');
const { Response } = require('../types');

// Prefix all routes with: /auth
const router = new Router({
    prefix : '/',
});


router.get('/', async (ctx, next) =>
{
    const response = new Response();

    ctx.response.status = StatusCodes.OK;
    response.success = true;
    response.message = "Application Invoked !";
    response.data = {}

    ctx.body = response;
    next().then();
});

router.get('/readiness', async (ctx, next) =>
{
    const response = new Response();

    ctx.response.status = StatusCodes.OK;
    response.success = true;
    response.message = "Application Invoked !";
    response.data = {}

    ctx.body = response;
    next().then();
});

module.exports = router;