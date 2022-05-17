const Router = require('koa-router');
const StatusCodes = require('http-status-codes');
const { Response } = require('../../types');

// Prefix all routes with: /auth
const router = new Router({
    prefix : '/auth-api/v1',
});

router.get('/', async (ctx, next) =>
{
    const response = new Response();

    ctx.response.status = StatusCodes.OK;
    response.success = true;
    response.message = "Application Invoked !";
    response.data = {
        versions : {
            latest : 'v1',
            all    : {
                v1 : 'v1',
            },
        },
        endpoints : {
            description : 'public user exposed api information',
            auth        : {
                endpoint    : '/auth',
                fullPath    : 'api/v1/auth',
                type        : 'post',
                description : 'Application authentication endpoint.',
                contentType : 'application/json',
                parameters  : {
                    email    : 'string',
                    password : 'string',
                },
            },
        },
    };

    ctx.body = response;
    next().then();
});

module.exports = router;
