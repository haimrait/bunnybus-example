'use strict';

const Epsagon = require('epsagon-frameworks');
const Config = require('config');

const epsagonConfig = Config.get('epsagon');

module.exports = ({ appName }) => {
    Epsagon.init({
        token: epsagonConfig.token,
        appName,
        isEpsagonDisabled: epsagonConfig.isEpsagonDisabled,
        ignoredKeys: ['items', 'item'],
        labels: [['env', process.env.NODE_ENV || 'unknown']],
        metadataOnly: false
    });
    Epsagon.consts.MAX_TRACE_SIZE_BYTES = 250 * 1024;
    Epsagon.ignoreEndpoints(['/health']);

    return Epsagon;
};
