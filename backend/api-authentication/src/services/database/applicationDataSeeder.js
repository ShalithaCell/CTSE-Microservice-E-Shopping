const fs = require('fs');
const path = require('path');
const RoleService = require('../userRole/userRole.service');
const UserService = require('../user/user.service');
const dataManagerService = require('../system/dataManager/dataManager.service');

const ApplicationDataSeeder = {
    seedRoles : async () =>
    {
        await fs.readFile(path.resolve('data/roles.json'), (err, data) =>
        {
            if (err) throw err;
            const roles = JSON.parse(data);

            roles.forEach((role) =>
            {
                RoleService.create(role);
            });
        });
    },
    seedUsers : async () =>
    {
        await fs.readFile(path.resolve('data/users.json'), (err, data) =>
        {
            if (err) throw err;
            const users = JSON.parse(data);

            users.forEach((user) =>
            {
                const newUser = user;

                dataManagerService.encryptPassword(user.password).then((password) =>
                {
                    newUser.password = password;
                    const result = UserService.create(newUser, true);

                    console.log(result);
                });
            });
        });
    },
};

module.exports = ApplicationDataSeeder;
