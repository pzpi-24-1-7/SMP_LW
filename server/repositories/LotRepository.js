/**
 * Контракт репозиторію лотів - доменні операції без прив'язки до SQL/Mongo.
 */
class LotRepository {
    async findAllWithTotalHits() {
        throw new Error('findAllWithTotalHits() must be implemented');
    }

    /**
     * @returns {Promise<object|null>} лот зі статистикою переглядів або null
     */
    async findByIdWithHitTracking(lotId, ip, hitDebounceMs) {
        throw new Error('findByIdWithHitTracking() must be implemented');
    }

    async create({ title, category, startPrice, imageUrl }) {
        throw new Error('create() must be implemented');
    }

    /**
     * @returns {Promise<boolean>} true якщо запис видалено
     */
    async deleteById(lotId) {
        throw new Error('deleteById() must be implemented');
    }
}

module.exports = LotRepository;
