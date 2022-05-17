const moment = require('moment');
const { User, RefreshToken } = require("../../models");
const { NewUser, RefreshTokenModel } = require('../../types');
const RoleService = require('../userRole/userRole.service');

const UserService = {
    find : async (email, password) =>
    {
        const data = await User.findOne({ email, password }).populate('role');

        return data;
    },
    findByEmail : async (email) =>
    {
        const data = await User.findOne({ email }).populate('role').catch((err) =>
        {
            // TODO: log error
            console.log(err);

            return null;
        });

        return data;
    },
    create : async (userData, seedingStatus) =>
    {
        try
        {
            // check data validation
            const request = Object.setPrototypeOf(userData, NewUser.prototype);

            if (!request.isValid())
            {
                return null;
            }
            // check already exists
            const users = await UserService.findByEmail(request.email);

            // check role
            const role = await RoleService.find(request.role);

            if (!role)
            {
                return {
                    created : false,
                    message : `Role does not exists. Please check selected role again.`,
                };
            }

            if (users)
            {
                return {
                    created : false,
                    message : `this email address is already in use.`,
                };
            }

            const user = new User({
                name           : request.name,
                email          : request.email,
                password       : request.password,
                phone          : request.phone,
                fileName       : request.fileName,
                emailConfirmed : seedingStatus,
                type           : request.type,
                role           : role._id,
            });

            // create user
            const data = await user.save();

            return {
                created : true,
                data,
            };
        }
        catch (e)
        {
            console.log(e);
            throw e;
        }
    },
    updateUser : async (email, name, phone) =>
    {
        await User.updateOne({ email }, {
            name,
            phone,
        }, (err, affected, resp) =>
        {
            console.log(resp);
        });

        return UserService.findByEmail(email);
    },
    activeAccount : async (email) =>
    {
        User.updateOne({ email }, {
            emailConfirmed : true,
        }, (err, affected, resp) =>
        {
            console.log(resp);
        });
    },
    resetPassword : async (email, password) =>
    {
        try
        {
            User.updateOne({ email }, {
                password,
            }, (err, affected, resp) =>
            {
                console.log(resp);
            });
        }
        catch (e)
        {
            console.log(e);
        }
    },
    saveRefreshToken : async (tokenData) =>
    {
        const token = new RefreshToken({
            token           : tokenData.token,
            expires         : tokenData.expires,
            created         : tokenData.created,
            createdByIp     : tokenData.createdByIp,
            revoked         : tokenData.revoked,
            revokedByIp     : tokenData.revokedByIp,
            replacedByToken : tokenData.replacedByToken,
            user            : tokenData.userId,
        });

        await token.save();
    },
    checkRefreshToken : async (token) =>
    {
        const tokenData = await RefreshToken.findOne({ token }).populate('user');

        if (!tokenData)
        {
            return null;
        }

        const tokenModel = Object.setPrototypeOf(
            tokenData.toObject(), RefreshTokenModel.prototype,
        );

        if (!tokenModel.isActive())
        {
            return null;
        }

        return tokenData;
    },
    replaceRefreshToken : async (token, newToken, ipAddress) =>
    {
        await RefreshToken.updateOne({ token }, {
            revoked         : moment(),
            revokedByIp     : ipAddress,
            replacedByToken : newToken,
        }, (err, affected, resp) =>
        {
            if (err) throw err;
        });
    },
    revokeToken : async (token, ipAddress) =>
    {
        await RefreshToken.updateOne({ token }, {
            revoked         : moment(),
            revokedByIp     : ipAddress,
            replacedByToken : null,
        }, (err, affected, resp) =>
        {
            if (err) throw err;
        });
    },
};

module.exports = UserService;
