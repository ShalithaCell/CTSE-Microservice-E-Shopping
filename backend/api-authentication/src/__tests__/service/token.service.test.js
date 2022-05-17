const { TokenService } = require('../../services');

describe("When testing the token service,", () =>
{
    it("Should generate random password and it wil be a strong password", async () =>
    {
        const response = await TokenService.generateRandomPassword();

        expect(response).not.toBeNull();

        const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        const valid = re.test(response);

        expect(valid).toBeTruthy();
    }, 30000);
});
