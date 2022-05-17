const Koa = require('koa');
const koaBody = require('koa-body');
const KoaStatic = require('koa-static');
const cors = require('@koa/cors');
const router = require('./api');
const { dbContext, exceptionService, applicationDataSeeder } = require('./services');

// init the database connection.
dbContext();

const app = new Koa();

app
    .use(koaBody({ formidable : {
        uploadDir      : `${__dirname}/../public/materials`, // directory where files will be uploaded
        keepExtensions : true, // keep file extension on upload
    },
    multipart  : true,
    urlencoded : true }))
    .use(exceptionService.errorHandler) // register generic error handler middleware
    .use(exceptionService.jsonErrorHandler) // register json error handler middleware
    .use(cors()) // allowed CORS
    .use(require('koa-simple-healthcheck')())
    .use(router()) // Use the Router on the sub routes
    .use(KoaStatic('public')); // server statics
// .use(logger()); // enable logs
// .use(loggerFile('./log/')) // log to file
// Bootstrap the server

const server = app.listen(process.env.PORT || 4500, async () =>
{
    console.log('server stared with port 5000');

    // application default data seeder
    await applicationDataSeeder.seedRoles();
    await applicationDataSeeder.seedUsers();

    console.log();
    console.log();
    console.log('=======================Server StartUp===========================');
    console.log('For more info :');
    console.log('\x1b[33m\x1b[4m%s\x1b[0m', 'http://localhost:4500/api/');
    console.log('=====================================================================');
    console.log();
});

module.exports = server;
