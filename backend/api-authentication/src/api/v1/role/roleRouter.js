const Router = require('koa-router');
const StatusCodes = require('http-status-codes');
const { version } = require('../../../config');
const { RoleService } = require('../../../services');
const { Response } = require("../../../types");

// Prefix all routes with: /user
const router = new Router({
    prefix : `${version.v1}/role`,
});

router.get('/', async (ctx, next) =>
{
    const response = new Response();

    const roles = await RoleService.all();

    response.success = true;
    response.message = `Role retrieved.`;
    response.data = {
        roles,
    };
    ctx.response.status = StatusCodes.OK;
    ctx.body = response;

    next().then();
});

module.exports = router;
