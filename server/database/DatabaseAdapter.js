/**
 * Базовий адаптер підключення до БД (патерн Adapter).
 * Конкретні драйвери реалізують connect / disconnect.
 */
class DatabaseAdapter {
    async connect() {
        throw new Error('connect() must be implemented');
    }

    async disconnect() {
        throw new Error('disconnect() must be implemented');
    }
}

module.exports = DatabaseAdapter;
