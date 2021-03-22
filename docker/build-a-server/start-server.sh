#!/bin/bash

node src/server.js 2>&1 | ./node_modules/.bin/json-wrap | ./node_modules/.bin/pino-papertrail l -H logs5.papertrailapp.com -p 44075 -a hapi-server-example