const dbPool = require('../config/db');

const getAllLots = async (req, res) => {
    try {
        const [rows] = await dbPool.query('SELECT * FROM lots ORDER BY creation_date DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Помилка отримання даних з БД' });
    }
};

const getLotById = async (req, res) => {
    try {
        const { id } = req.params;

        await dbPool.query('UPDATE lots SET views = views + 1 WHERE id = ?', [id]);
        
        const [rows] = await dbPool.query('SELECT * FROM lots WHERE id = ?', [id]);
        
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
            title = "Lot", 
            category = "Category", 
            startPrice = 100.00, 
            imageUrl = null 
        } = req.body;

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