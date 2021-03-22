'use strict';

const Config = require('config');
const Pkg = require('../package.json');

const manifest = {
    server: Config.server,
    register: {
        options: {},
        plugins: [
            {
                plugin: 'hapi-pino',
                options: Config.logger
            },
            {
                plugin: '@tenna-llc/hapi-plugin-utilities',
                options: Config.utilities
            },
            {
                plugin: './plugins/apiPlugin',
                options: Config.apiPlugin
            },
            {
                plugin: './plugins/bunnyBusPlugin',
                options: Config.bunnyBusPlugin
            }
        ]
    }
};

module.exports = manifest;
