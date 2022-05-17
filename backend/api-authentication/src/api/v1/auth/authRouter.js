const Router = require('koa-router');
const StatusCodes = require('http-status-codes');
const { CredentialType } = require('../../../types');
const { authenticate, koaJwt } = require('../../../middlewares');
const { version } = require('../../../config');
const { TokenService, userService } = require('../../../services');

// Prefix all routes with: /auth
const router = new Router({
    prefix : `${version.v1}/auth`,
});

// Routes will go here

// user sign in method
router.post('/', async (ctx, next) =>
{
    const request = Object.setPrototypeOf(ctx.request.body, CredentialType.prototype);
    // Check if any of the data field not empty

    if (!request.isValid())
    {
        ctx.response.status = StatusCodes.BAD_REQUEST;
        ctx.body = 'Please enter username and password';
        next().then();

        return;
    }

    await authenticate.passwordSignInAsync(ctx, request);
    next().then();
});

router.get('/confirm', async (ctx, next) =>
{
    // fetch token
    const { token, email } = ctx.query;

    if (!(token && email))
    {
        ctx.response.status = StatusCodes.BAD_REQUEST;
        ctx.body = 'Invalid request';
        next().then();

        return;
    }

    const result = await TokenService.isTokenValid(email, token);

    if (!result)
    {
        ctx.response.status = StatusCodes.FORBIDDEN;
        ctx.body = 'Cannot confirm your account !. Please contact support.';
        next().then();

        return;
    }

    await userService.activeAccount(email);

    ctx.response.status = StatusCodes.OK;
    ctx.body = 'Account successfully Confirmed.';
    next().then();
});

router.get('/check', koaJwt, async (ctx, next) =>
{
    ctx.response.status = StatusCodes.OK;
    ctx.body = 'Access Granted';
    next().then();
});

router.post('/refresh-token', async (ctx, next) =>
{
    await authenticate.refreshTokenAsync(ctx);
    next().then();
});

router.post('/revoke-token', async (ctx, next) =>
{
    await authenticate.revokeToken(ctx);
    next().then();
});

module.exports = router;
