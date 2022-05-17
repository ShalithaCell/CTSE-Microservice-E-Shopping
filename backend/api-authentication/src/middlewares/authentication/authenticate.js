const jwt = require('jsonwebtoken');
const StatusCodes = require('http-status-codes');
const moment = require('moment');
const { jwtSecret, tokenExpireTime, refreshTokenExpireTime } = require('../../config');
const { userService, dataManagerService } = require('../../services');
const { Response } = require('../../types');

const authenticate = {
    passwordSignInAsync : async (ctx, data) =>
    {
        const response = new Response();

        try
        {
            const user = await userService.findByEmail(data.email);

            if (user)
            {
                // check email confirmed
                if (!user.emailConfirmed)
                {
                    ctx.status = StatusCodes.UNAUTHORIZED;

                    // set response
                    response.success = false;
                    response.message = `Your account not has been confirmed.Please verify your account.`;
                    response.data = {
                        token : null,
                        user  : null,
                    };
                    ctx.body = response;

                    return;
                }

                // check password
                const authenticated = await dataManagerService
                    .checkPassword(data.password, user.password);

                // check user is authenticated or not
                if (!authenticated)
                {
                    ctx.status = StatusCodes.UNAUTHORIZED;

                    // set response
                    response.success = false;
                    response.message = `There was an error with your e-mail/password combination. Please try again.`;
                    response.data = {
                        token : null,
                        user  : null,
                    };

                    ctx.body = response;

                    return;
                }

                ctx.status = StatusCodes.OK;

                // generate JWT Token
                const token = await jwt.sign(user.toJSON(), jwtSecret, {
                    expiresIn : tokenExpireTime,
                });

                // generate refreshToken
                const refreshToken = await dataManagerService
                    .generateRefreshToken(ctx.request.ip);

                const refreshTokenObj = {
                    token           : refreshToken.token,
                    expires         : refreshToken.expiresTime,
                    created         : refreshToken.createTime,
                    createdByIp     : refreshToken.ipAddress,
                    revoked         : null,
                    revokedByIp     : null,
                    replacedByToken : null,
                    userId          : user._id,
                };

                // save freshToken
                await userService.saveRefreshToken(refreshTokenObj);

                // remove password field
                user.password = undefined;

                // set response
                response.success = true;
                response.message = `Successfully singed in as ${user.name}.`;
                response.data = {
                    token,
                    refreshToken,
                    user,
                };

                // set the cookie
                ctx.cookies.set("refresh-token", refreshToken.token, {
                    httpOnly : false,
                });
            }
            else
            {
                ctx.status = StatusCodes.UNAUTHORIZED;

                // set response
                response.success = false;
                response.message = `There was an error with your e-mail/password combination. Please try again.`;
                response.data = {
                    token : null,
                    user  : null,
                };
            }
        }
        catch (error)
        {
            console.log(error);

            ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;

            // set response
            response.success = false;
            response.message = `Sorry, there were some technical issues while processing your request.`;
            response.data = {
                message : error.message,
                error,
            };
        }

        ctx.body = response;
    },
    refreshTokenAsync : async (ctx) =>
    {
        // check refresh token attached to the cookie
        let refreshToken = ctx.cookies.get("refresh-token");

        const response = new Response();

        // if refresh token is not attache to the cookie, check it passed with request body
        if (!refreshToken)
        {
            if (ctx.request.body.refreshToken)
            {
                refreshToken = ctx.request.body.refreshToken;
            }
            else
            {
                ctx.status = StatusCodes.UNAUTHORIZED;

                // set response
                response.success = false;
                response.message = `Refresh Token is not found.`;
                response.data = {
                    token        : null,
                    refreshToken : null,
                    user         : null,
                };
                ctx.body = response;

                return;
            }
        }

        // check refresh token is valid
        const tokenStatus = await userService.checkRefreshToken(refreshToken);

        // if not valid refresh token
        if (!tokenStatus)
        {
            ctx.status = StatusCodes.UNAUTHORIZED;

            // set response
            response.success = false;
            response.message = `Refresh Token is expired or not valid`;
            response.data = {
                token        : null,
                refreshToken : null,
                user         : null,
            };
            ctx.body = response;

            return;
        }

        // if the refresh token is valid, Then we have to generate new JWT token and refresh token for user.

        const newJWTToken = await jwt.sign(tokenStatus.user.toJSON(), jwtSecret, {
            expiresIn : tokenExpireTime,
        });

        const newRefreshToken = await dataManagerService
            .generateRefreshToken(ctx.request.ip);

        // replace old refresh token
        await userService.replaceRefreshToken(
            refreshToken,
            newRefreshToken.token,
            ctx.request.ip,
        );
        // save new refresh token
        const refreshTokenObj = {
            token           : newRefreshToken.token,
            expires         : newRefreshToken.expiresTime,
            created         : newRefreshToken.createTime,
            createdByIp     : newRefreshToken.ipAddress,
            revoked         : null,
            revokedByIp     : null,
            replacedByToken : null,
            userId          : tokenStatus.user._id,
        };

        await userService.saveRefreshToken(refreshTokenObj);

        response.success = true;
        response.message = `Refresh token granted.`;
        response.data = {
            token        : newJWTToken,
            refreshToken : newRefreshToken,
            user         : tokenStatus.user,
        };

        // set the cookie
        ctx.cookies.set("refresh-token", newRefreshToken.token, {
            httpOnly : false,
        });

        ctx.body = response;
    },
    revokeToken : async (ctx) =>
    {
        // check refresh token attached to the cookie
        let refreshToken = ctx.cookies.get("refresh-token");

        const response = new Response();

        // if refresh token is not attache to the cookie, check it passed with request body
        if (!refreshToken)
        {
            if (ctx.request.body.refreshToken)
            {
                refreshToken = ctx.request.body.refreshToken;
            }
            else
            {
                ctx.status = StatusCodes.BAD_REQUEST;

                // set response
                response.success = false;
                response.message = `Refresh Token is not found.`;
                response.data = {
                    token        : null,
                    refreshToken : null,
                    user         : null,
                };
                ctx.body = response;

                return;
            }
        }

        // check refresh token is valid
        const tokenStatus = await userService.checkRefreshToken(refreshToken);

        // if not valid refresh token
        if (!tokenStatus)
        {
            ctx.status = StatusCodes.OK;

            // set response
            response.success = false;
            response.message = `Refresh Token is already expired or not valid`;
            response.data = {
                token        : null,
                refreshToken : null,
                user         : null,
            };
            ctx.body = response;

            return;
        }

        // update database
        await userService.revokeToken(refreshToken, ctx.request.ip);

        ctx.status = StatusCodes.OK;

        // set response
        response.success = false;
        response.message = `Refresh Token successfully revoked.`;
        response.data = {
            token        : null,
            refreshToken : null,
            user         : null,
        };
        ctx.body = response;
    },
};

module.exports = authenticate;
