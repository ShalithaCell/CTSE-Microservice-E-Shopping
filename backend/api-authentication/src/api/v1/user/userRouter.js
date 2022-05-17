const Router = require('koa-router');
const StatusCodes = require('http-status-codes');
const validator = require("email-validator");
const owasp = require('owasp-password-strength-test');
const { NewUser, Response } = require("../../../types");
const { userService,
    emailNotificationService,
    TokenService,
    dataManagerService,
} = require('../../../services');
const { version } = require('../../../config');
const { koaJwt } = require('../../../middlewares');

// Prefix all routes with: /user
const router = new Router({
    prefix : `${version.v1}/user`,
});

const createUser = async (ctx, request) =>
{
    const response = new Response();

    // check data validation
    if (!request.isValid())
    {
        ctx.response.status = StatusCodes.BAD_REQUEST;

        response.success = false;
        response.message = "required field(s) missing";
        response.data = {
            message : "required field(s) missing",
        };

        ctx.body = response;

        return;
    }

    // checkEmail
    if (!validator.validate(request.email))
    {
        ctx.response.status = StatusCodes.BAD_REQUEST;

        response.success = false;
        response.message = "Please use a valid email address.";
        response.data = {
            message : "Please use a valid email address.",
        };

        ctx.body = response;

        return;
    }

    // check password
    const passwordValidationResult = owasp.test(request.password);

    if (!passwordValidationResult.strong)
    {
        ctx.response.status = StatusCodes.BAD_REQUEST;

        response.success = false;
        response.message = "Your Password is week.";
        response.data = {
            message : passwordValidationResult.errors,
        };

        ctx.body = response;

        return;
    }

    const hashPassword = await dataManagerService.encryptPassword(request.password);

    request.password = hashPassword;

    const result = await userService.create(request);

    if (!result)
    {
        ctx.response.status = StatusCodes.FORBIDDEN;

        response.success = false;
        response.message = "Cannot create account";
        response.data = {
            message : result,
        };

        ctx.body = response;

        return;
    }

    // check error occurred
    if (!result.created)
    {
        ctx.response.status = StatusCodes.FORBIDDEN;

        response.success = false;
        response.message = "Cannot create account";
        response.data = {
            message : result,
        };

        ctx.body = response;

        return;
    }

    // get token
    const tokenData = await TokenService.generateNewToken(request.email);

    // send email for new user account confirmation
    emailNotificationService
        .sendUserConfirmationEmail(request.name, request.email, tokenData).then();

    response.success = true;
    response.message = `You are now registered amd your request is processing.A verification email has been sent to ${request.email}.`;
    response.data = {
        user : result,
    };
    ctx.response.status = StatusCodes.OK;
    ctx.body = response;
};

// user sign in methods
router.post('/create/user', async (ctx, next) =>
{
    // check data validation
    const request = Object.setPrototypeOf(ctx.request.body, NewUser.prototype);

    request.role = 'user';

    await createUser(ctx, request);

    next().then();
});


router.post('/create/admin', koaJwt, async (ctx, next) =>
{
    // check data validation
    const request = Object.setPrototypeOf(ctx.request.body, NewUser.prototype);

    request.role = 'admin';
    request.type = 'auth';

    await createUser(ctx, request);

    next().then();
});

router.post('/reset-password', async (ctx, next) =>
{
    const response = new Response();

    // check email
    if (!ctx.request.body.email)
    {
        ctx.response.status = StatusCodes.BAD_REQUEST;

        response.success = false;
        response.message = "Email is missing.";
        response.data = {
            message : "required field(s) missing",
        };

        ctx.body = response;
        next().then();

        return;
    }

    // checkEmail
    if (!validator.validate(ctx.request.body.email))
    {
        ctx.response.status = StatusCodes.BAD_REQUEST;

        response.success = false;
        response.message = "Please use a valid email address.";
        response.data = {
            message : "Please use a valid email address.",
        };

        ctx.body = response;
        next().then();

        return;
    }

    const password = await TokenService.generateRandomPassword();

    const hashPassword = await dataManagerService.encryptPassword(password);

    await userService.resetPassword(ctx.request.body.email, hashPassword);

    // send email for new user account confirmation
    emailNotificationService
        .sendPasswordResetEmail(ctx.request.body.email, password).then();

    response.success = true;
    response.message = `A new password has been sent to your email address(${ctx.request.body.email})`;
    response.data = {
        message : `A new password has been sent to your email address(${ctx.request.body.email})`,
    };
    ctx.response.status = StatusCodes.OK;
    ctx.body = response;

    next().then();
});

router.put('/', async (ctx, next) =>
{
    const response = new Response();

    if (!ctx.request.body.email || !ctx.request.body.phone || !ctx.request.body.name)
    {
        ctx.response.status = StatusCodes.BAD_REQUEST;

        response.success = false;
        response.message = "required field(s) missing";
        response.data = {
            message : "required field(s) missing",
        };

        ctx.body = response;
        next().then();

        return;
    }

    const data = await userService.updateUser(
        ctx.request.body.email,
        ctx.request.body.name,
        ctx.request.body.phone,
    );

    response.success = true;
    response.message = `User updated successfully.`;
    response.data = {
        user : data,
    };
    ctx.response.status = StatusCodes.OK;
    ctx.body = response;

    next().then();
});

module.exports = router;
