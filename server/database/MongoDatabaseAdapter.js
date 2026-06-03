const { MongoClient } = require('mongodb');
const DatabaseAdapter = require('./DatabaseAdapter');

class MongoDatabaseAdapter extends DatabaseAdapter {
    constructor(config) {
        super();
        this.config = config;
        this.client = null;
        this.db = null;
    }

    async connect() {
        if (this.db) {
            return this.db;
        }

        this.client = new MongoClient(this.config.uri);
        await this.client.connect();
        this.db = this.client.db(this.config.database);
        return this.db;
    }

    async getDb() {
        return this.connect();
    }

    async disconnect() {
        if (this.client) {
            await this.client.close();
            this.client = null;
            this.db = null;
        }
    }
}

module.exports = MongoDatabaseAdapter;
