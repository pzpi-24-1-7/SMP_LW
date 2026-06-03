const LotRepository = require('./LotRepository');

class MySqlLotRepository extends LotRepository {
    constructor(dbAdapter) {
        super();
        this.db = dbAdapter;
    }

    async findAllWithTotalHits() {
        const [rows] = await this.db.query(
            `SELECT
                l.*,
                COALESCE(SUM(li.hits), 0) AS total_hits
            FROM lots l
            LEFT JOIN lot_ip li ON l.id = li.lot_id
            GROUP BY l.id`
        );
        return rows;
    }

    async findByIdWithHitTracking(lotId, ip, hitDebounceMs) {
        const currentTime = new Date();

        const [lastHits] = await this.db.query(
            'SELECT last_hit, hits FROM lot_ip WHERE ip = ? AND lot_id = ?',
            [ip, lotId]
        );

        if (lastHits.length > 0) {
            const lastHitTime = new Date(lastHits[0].last_hit);

            if (currentTime - lastHitTime >= hitDebounceMs) {
                await this.db.query(
                    'UPDATE lot_ip SET hits = hits + 1, last_hit = CURRENT_TIMESTAMP WHERE lot_id = ? AND ip = ?',
                    [lotId, ip]
                );
            }
        } else {
            await this.db.query(
                'INSERT IGNORE INTO lot_ip (ip, lot_id, hits) VALUES (?, ?, 1)',
                [ip, lotId]
            );
        }

        const [rows] = await this.db.query(
            `SELECT
                l.*,
                (SELECT COUNT(DISTINCT ip) FROM lot_ip WHERE lot_id = l.id) AS unique_hosts,
                (SELECT SUM(hits) FROM lot_ip WHERE lot_id = l.id) AS total_hits,
                (SELECT hits FROM lot_ip WHERE lot_id = l.id AND ip = ?) AS user_hits
            FROM lots l
            WHERE l.id = ?`,
            [ip, lotId]
        );

        return rows.length > 0 ? rows[0] : null;
    }

    async create({ title, category, startPrice, imageUrl }) {
        const [result] = await this.db.query(
            'INSERT INTO lots (title, category, startPrice, imageUrl) VALUES (?, ?, ?, ?)',
            [title, category, startPrice, imageUrl]
        );
        return { id: result.insertId };
    }

    async deleteById(lotId) {
        const [result] = await this.db.query('DELETE FROM lots WHERE id = ?', [lotId]);
        return result.affectedRows > 0;
    }
}

module.exports = MySqlLotRepository;
