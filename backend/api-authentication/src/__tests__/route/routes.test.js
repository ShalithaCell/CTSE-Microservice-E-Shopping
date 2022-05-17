const request = require("supertest");

const server = require('../../app');

beforeAll(async () =>
{
    console.log('Jest starting!');
});

// close the server after each test
afterAll(async () =>
{
    server.close();
    console.log('server closed!');
});

afterEach(async () =>
{
    await server.close();
});

describe('When testing the server.js', () =>
{
    // const agent = request.agent(server);

    it('Should connect successfully and be able to return a response',
        async () => new Promise((resolve) =>
        {
            request(server)
                .get('/api/')
                .set('Accept', 'application/json')
                .retry(2)
                .expect('Content-Type', /json/)
                .end((err, res) =>
                {
                    expect(res.status).toBe(200);

                    resolve();
                });
        }), 30000);
});

describe('When testing the login', () =>
{
    // const agent = request.agent(server);

    it('responds with json', async () => new Promise((resolve) =>
    {
        request(server)
            .post('/api/v1/auth/')
            .send({ email: 'admin@gmail.com', password: "Shalitha123456" })
            .set('Accept', 'application/json')
            .retry(2)
            .expect('Content-Type', /json/)
            .end((err, res) =>
            {
                expect(res.status).toBe(200);

                expect(res.body.success).toBe(true);

                resolve();
            });
    }), 30000);
});

describe('When testing the user create', () =>
{
    // const agent = request.agent(server);

    it('responds with json', async () => new Promise((resolve) =>
    {
        const randomEmail = `test123456${Date.now()}@gmail.com`;

        request(server)
            .post('/api/v1/user/create/user/')
            .send({
                name     : 'testingUser',
                password : "Shalitha@123456",
                email    : randomEmail,
                phone    : "0711234567" })
            .set('Accept', 'application/json')
            .retry(2)
            .expect('Content-Type', /json/)
            .end((err, res) =>
            {
                expect(res.status).toBe(200);

                expect(res.body.success).toBe(true);
                expect(res.body.message.includes(randomEmail)).toBe(true);
                resolve();
            });
    }), 30000);
});

describe('When testing the user create', () =>
{
    // const agent = request.agent(server);

    it('responds with json', async () => new Promise((resolve) =>
    {
        const randomEmail = `test123456${Date.now()}@gmail.com`;

        request(server)
            .post('/api/v1/user/create/reviewer/')
            .send({
                name     : 'testingUser',
                password : "Shalitha@123456",
                email    : randomEmail,
                phone    : "0711234567" })
            .set('Accept', 'application/json')
            .retry(2)
            .expect('Content-Type', /json/)
            .end((err, res) =>
            {
                expect(res.status).toBe(200);

                expect(res.body.success).toBe(true);
                expect(res.body.message.includes(randomEmail)).toBe(true);
                resolve();
            });
    }), 30000);
});

describe('When testing the role fetching', () =>
{
    // const agent = request.agent(server);

    it('responds with json', async () => new Promise((resolve) =>
    {
        request(server)
            .get('/api/v1/role/')
            .set('Accept', 'application/json')
            .retry(2)
            .expect('Content-Type', /json/)
            .end((err, res) =>
            {
                expect(res.status).toBe(200);

                expect(res.body.success).toBe(true);
                resolve();
            });
    }), 30000);
});
