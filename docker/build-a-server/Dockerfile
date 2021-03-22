FROM node:12-alpine3.9

LABEL maintainer="Tenna LLC"

EXPOSE 8080

WORKDIR /opt/app
ENV WORKDIR=/opt/app

ENTRYPOINT [ "npm", "run", "start-with-script" ]

COPY config config/
COPY src/server.js src/server.js
COPY src/manifest.build-a-server.js src/manifest.js
COPY src/epsagon.js src/epsagon.js
COPY docker/build-a-server/start-server.sh start-server.sh
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY node_modules node_modules/