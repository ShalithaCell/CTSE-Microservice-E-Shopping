const fs = require('fs');
const path = require('path');
const { siteLogo,
    accountConfirmationURL,
    siteName,
    siteUrl,
} = require('../../../config');
const mailService = require('../mailer/nodeMailer.service');

const emailNotificationService = {
    sendUserConfirmationEmail : async (userName, senderEmail, suffixData) =>
    {
        try
        {
            fs.readFile(path.resolve('public/email-confirm.html'), 'utf8', (err, data) =>
            {
                if (err)
                {
                    // TODO: send telegram notification
                    throw err;
                }

                const htmlBody = data.replace("{IMG}", siteLogo)
                    .replace("{NAME}", userName)
                    .replace("{LINK}", `${accountConfirmationURL}?email=${encodeURIComponent(suffixData.email)}&token=${encodeURIComponent(suffixData.token)}`);

                mailService.send(senderEmail, 'Confirm Your ABC Account', htmlBody).then();
            });
        }
        catch (ex)
        {
            console.log("email not send", ex);
        }
    },
    sendPasswordResetEmail : async (email, password) =>
    {
        fs.readFile(path.resolve('public/reset-password.html'), 'utf8', (err, data) =>
        {
            if (err)
            {
                // TODO: send telegram notification
                throw err;
            }

            const htmlBody = data.replace("{siteName}", siteName)
                .replace("{siteUrl}", siteUrl)
                .replace("{siteName}", siteName)
                .replace("{email}", email)
                .replace('{company}', siteName)
                .replace("{password}", password);

            mailService.send(email, 'Reset Your ABC Account', htmlBody).then();
        });
    },
};

module.exports = emailNotificationService;
