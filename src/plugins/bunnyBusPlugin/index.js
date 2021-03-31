*'use strict';

const LoggerFactory = require('@tenna-llc/hapi-log-wrapper');
const { Consumers } = require('@tenna-llc/ingestion-pipeline-shared').Bootstrap;
const { v4: uuid } = require('uuid');

const HAPI_UTILITIES = '@tenna-llc/hapi-plugin-utilities';

const queueName = 'queue1';
const topic = 'topicA';
class Plugin {
    constructor(server, options) {
        server.dependency('@tenna-llc/hapi-plugin-utilities', () => {
            const logger = new LoggerFactory().withHapiServer(server).withTag('bunnyBusPlugin').build();

            const bunnyBus = server.plugins[HAPI_UTILITIES].bunnyBusClientFactory.build(options.bunnyBusKey);
            bunnyBus.logger = logger;

            logger.info('bunnyBus plugin instantiated');

            const apiServiceAgent = server.plugins[HAPI_UTILITIES].superAgentClientFactory.build(options.apiServiceKey);

            const consumers = new Consumers({ bunnyBus })
                .withQueueSubscriptionOptions({
                    queueName: 'queue1',
                    options: {}
                })
                .setQueueHandler({
                    queueName,
                    topic,
                    handler: async ({ message, ack, rej, epsagon }) => {
                        logger.info('RMQ request made');

                        const { data } = message;
                        const { id } = data;

                        await this.apiServiceAgent.post(`/test/${id}`).send(data);
                        // await ack();
                        const data1 = await this.apiServiceAgent.get(`/test/${id}`);

                        if (data1.id === id) await ack();
                        else await rej();
                    }
                });

            server.events.on('start', async () => {
                logger.info('subscribing RMQ handlers');
                await consumers.subscribeAll();
                await this.publishTestData(100);
                //publish messages
                // let timesRun = 0;
                // let interval = setInterval(async () => {
                //     if (timesRun < 200) {
                //         await this.publishTestData(10);
                //         timesRun += 1
                //     } else {
                //         clearInterval(interval);
                //     }
                // }, 2000);
            });

            Object.assign(this, { bunnyBus, logger, apiServiceAgent });

            server.expose('plugin', this, { scope: true });
        });
    }

    async publishTestData(count) {
        for (let i = 0; i < count; ++i) {
            const message = { data: { id: uuid() } };
            this.bunnyBus.publish({ message, options: { routeKey: topic } });
        }
    }
}

module.exports = {
    pkg: {
        name: 'bunnyBusPlugin',
        version: '0.0.1'
    },
    register: (server, options) => new Plugin(server, options)
};
