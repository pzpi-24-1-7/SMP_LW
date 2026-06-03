const { lotRepository } = require('../config/db');

const HIT_DEBOUNCE_TIME = 5 * 60 * 1000;
const DEFAULT_IMAGE_URL = 'https://placehold.net/main.svg';

const getAllLots = async (req, res) => {
    try {
        const rows = await lotRepository.findAllWithTotalHits();
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

        const lot = await lotRepository.findByIdWithHitTracking(id, ip, HIT_DEBOUNCE_TIME);

        if (!lot) {
            return res.status(404).json({ error: 'Лот не знайдено' });
        }

        res.json(lot);
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
            imageUrl = null,
        } = req.body;

        if (!title.trim() || !category.trim() || !startPrice || Number(startPrice) <= 0) {
            return res.status(400).json({ error: 'Всі обов’язкові поля мають бути заповнені' });
        }

        imageUrl = (imageUrl && imageUrl.trim()) ? imageUrl.trim() : DEFAULT_IMAGE_URL;

        const { id } = await lotRepository.create({
            title,
            category,
            startPrice,
            imageUrl,
        });

        res.status(201).json({
            message: 'Лот успішно створено',
            id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Помилка створення лоту' });
    }
};

const deleteLot = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await lotRepository.deleteById(id);

        if (!deleted) {
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
    deleteLot,
};
