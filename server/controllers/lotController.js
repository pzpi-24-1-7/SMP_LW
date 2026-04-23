const dbPool = require('../config/db');
const HIT_DEBOUNCE_TIME = 5 * 60 * 1000;
const DEFAULT_IMAGE_URL = 'https://placehold.net/main.svg';

const getAllLots = async (req, res) => {
    try {
        const [rows] = await dbPool.query(`SELECT 
                                        l.*, 
                                        COALESCE(SUM(li.hits), 0) AS total_hits
                                        FROM lots l
                                        LEFT JOIN lot_ip li ON l.id = li.lot_id
                                        GROUP BY l.id;`);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Помилка отримання даних з БД' });
    }
};

const getLotById = async (req, res) => {
    try {
        const { id } = req.params;
        const ip = req.ip;
        const currentTime = new Date();

        const [lastHits] = await dbPool.query(
            `SELECT last_hit, hits FROM lot_ip WHERE ip = ? AND lot_id = ?`,
            [ip, id]
        );

        if (lastHits.length > 0) {
            const lastHitTime = new Date(lastHits[0].last_hit);

            if (currentTime - lastHitTime >= HIT_DEBOUNCE_TIME) {
                await dbPool.query(
                    'UPDATE lot_ip SET hits = hits + 1, last_hit = CURRENT_TIMESTAMP WHERE lot_id = ? AND ip = ?',
                    [id, ip]
                );
            }
        } else {
            await dbPool.query(
                // тут із за strict mode  і Race condition, і ip conflict:
                // ::1 -ip in  first query, ::ffff:127.0.0.1 - ip in second one 
                // todo normilize ip | right now strict mode is off
                `INSERT IGNORE INTO lot_ip (ip, lot_id, hits)
                VALUES (?, ?, 1)`,
                [ip, id]
            );
        }

        const [rows] = await dbPool.query(`
            SELECT 
                l.*, 
                (SELECT COUNT(DISTINCT ip) FROM lot_ip WHERE lot_id = l.id) as unique_hosts,
                (SELECT SUM(hits) FROM lot_ip WHERE lot_id = l.id) as total_hits,
                (SELECT hits FROM lot_ip WHERE lot_id = l.id AND ip = ?) as user_hits
            FROM lots l
            WHERE l.id = ?
        `, [ip, id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Лот не знайдено' });
        }

        res.json(rows[0]);    

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Помилка отримання лоту' });
    }
};

const createLot = async (req, res) => {
    try {
        let { 
            title, 
            category, 
            startPrice, 
            imageUrl = null 
        } = req.body;

        if (!title.trim() || !category.trim() || !startPrice || Number(startPrice) <= 0)
            return res.status(400).json({ error: 'Всі обов’язкові поля мають бути заповнені' });

        imageUrl = (imageUrl && imageUrl.trim()) ? imageUrl.trim() : DEFAULT_IMAGE_URL;
        const sql = 'INSERT INTO lots (title, category, startPrice, imageUrl) VALUES (?, ?, ?, ?)';
        imageUrl = imageUrl.trim() || null;
        const [result] = await dbPool.query(sql, [title, category, startPrice, imageUrl]);


        res.status(201).json({ 
            message: 'Лот успішно створено', 
            id: result.insertId 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Помилка створення лоту' });
    }
};


const deleteLot = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await dbPool.query('DELETE FROM lots WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Лот не знайдено' });
        }

        res.json({ message: 'Лот успішно видалено' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Помилка видалення лоту' });
    }
};

module.exports = {
    getAllLots,
    getLotById,
    createLot,
    deleteLot
};