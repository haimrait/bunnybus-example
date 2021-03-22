'use strict';

const LoggerFactory = require('@tenna-llc/hapi-log-wrapper');

const HAPI_UTILITIES = '@tenna-llc/hapi-plugin-utilities';
const tableName = 'test-data';
const tableSchema = {
    TableName: tableName,
    AttributeDefinitions: [
        {
            AttributeName: 'id',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'id',
            KeyType: 'HASH'
        }
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 }
};

class Plugin {
    constructor(server, options) {
        server.dependency('@tenna-llc/hapi-plugin-utilities', () => {
            const logger = new LoggerFactory().withHapiServer(server).withTag('apiPlugin').build();
            const dynamoDB = server.plugins[HAPI_UTILITIES].dynamoDBClientFactory.build(options.awsDynamoDBKey);
            dynamoDB.params = {
                region: 'us-east-1',
                endpoint: 'http://localhost:8000',
                credentials: {
                    accessKeyId: 'abc',
                    secretAccessKey: 'def'
                }
            };

            logger.info('api plugin instantiated');

            server.route([
                { method: 'GET', path: '/test/{id}', handler: async (request) => await this.read({ request }) },
                { method: 'POST', path: '/test/{id}', handler: async (request) => await this.create({ request }) }
            ]);

            server.events.on('start', async () => {
                logger.info('creating dynamo table');
                // create dynamo table

                if (await this.dynamoDB.hasTable(tableName)) {
                    await this.dynamoDB.deleteTable(tableName);
                }

                await this.dynamoDB.createTable(tableSchema);
            });

            Object.assign(this, { dynamoDB, logger });

            server.expose('plugin', this, { scope: true });
        });
    }

    async create({ request }) {
        const {
            params: { id },
            payload
        } = request;

        await this.dynamoDB.putItem(tableName, payload);
        this.logger.info(`created dynamo record ${id}`);

        return { id };
    }

    async read({ request }) {
        const {
            params: { id }
        } = request;

        const data = await this.dynamoDB.getItemByKey(tableName, { id });
        this.logger.info(`read dynamo record ${id}`);

        return data;
    }
}

module.exports = {
    pkg: {
        name: 'apiPlugin',
        version: '0.0.1'
    },
    register: (server, options) => new Plugin(server, options)
};
