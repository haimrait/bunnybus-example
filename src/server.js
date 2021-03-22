'use strict';

const Epsagon = require('./epsagon')({ appName: 'build-a-server' });
const Glue = require('@hapi/glue');
const Manifest = require('./manifest.js');

let server = null;

const options = {
    relativeTo: __dirname
};

const errorHandler = (err) => {
    console.error(err);
    process.exit(1);
};

const init = async function () {
    try {
        server = await Glue.compose(Manifest, options);
        await server.start();
        server.log(['info'], `Server running on ${server.info.uri}`);
    } catch (err) {
        errorHandler(err);
    }
};

process.on('uncaughtException', errorHandler);
process.on('unhandledRejection', errorHandler);

init();
