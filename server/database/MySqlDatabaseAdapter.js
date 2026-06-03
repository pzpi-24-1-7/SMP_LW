const mysql = require('mysql2/promise');
const DatabaseAdapter = require('./DatabaseAdapter');

class MySqlDatabaseAdapter extends DatabaseAdapter {
    constructor(config) {
        super();
        this.config = config;
        this.pool = null;
    }

    async connect() {
        if (this.pool) {
            return this.pool;
        }

        this.pool = mysql.createPool({
            host: this.config.host,
            user: this.config.user,
            port: this.config.port,
            password: this.config.password,
            database: this.config.database,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            ssl: this.config.ssl,
        });

        return this.pool;
    }

    async query(sql, params = []) {
        const pool = await this.connect();
        return pool.query(sql, params);
    }

    async disconnect() {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
        }
    }
}

module.exports = MySqlDatabaseAdapter;
