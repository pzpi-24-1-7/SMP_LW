require('dotenv').config();

const MySqlDatabaseAdapter = require('../database/MySqlDatabaseAdapter');
const MongoDatabaseAdapter = require('../database/MongoDatabaseAdapter');
const MySqlLotRepository = require('../repositories/MySqlLotRepository');
const MongoLotRepository = require('../repositories/MongoLotRepository');

const DB_ADAPTER = (process.env.DB_ADAPTER || 'mysql').toLowerCase();

function createMySqlStack() {
    if (
        !process.env.DB_HOST ||
        !process.env.DB_USER ||
        !process.env.DB_PASSWORD ||
        !process.env.DB_NAME
    ) {
        throw new Error('MySQL environment variables are not set (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)');
    }

    const dbAdapter = new MySqlDatabaseAdapter({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    const lotRepository = new MySqlLotRepository(dbAdapter);
    return { dbAdapter, lotRepository };
}

function createMongoStack() {
    if (!process.env.MONGO_URI || !process.env.MONGO_DB_NAME) {
        throw new Error('MongoDB environment variables are not set (MONGO_URI, MONGO_DB_NAME)');
    }

    const dbAdapter = new MongoDatabaseAdapter({
        uri: process.env.MONGO_URI,
        database: process.env.MONGO_DB_NAME,
    });

    const lotRepository = new MongoLotRepository(dbAdapter);
    return { dbAdapter, lotRepository };
}

function createDatabaseStack() {
    switch (DB_ADAPTER) {
        case 'mysql':
            return createMySqlStack();
        case 'mongo':
            return createMongoStack();
        default:
            throw new Error(`Unknown DB_ADAPTER "${DB_ADAPTER}". Use "mysql" or "mongo".`);
    }
}

const { dbAdapter, lotRepository } = createDatabaseStack();

async function connectDatabase() {
    await dbAdapter.connect();
}

async function disconnectDatabase() {
    await dbAdapter.disconnect();
}

module.exports = {
    dbAdapter,
    lotRepository,
    connectDatabase,
    disconnectDatabase,
};
