FROM node:12-alpine3.9

LABEL maintainer="Tenna LLC"

EXPOSE 8080

WORKDIR /opt/app
ENV WORKDIR=/opt/app

# This needs to change so we use something like PM2
# or use a bash script to handle PID0
ENTRYPOINT [ "npm", "run", "migrate" ]

COPY config config/
COPY src/postgresMigrationConfig.js src/postgresMigrationConfig.js
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY node_modules node_modules/