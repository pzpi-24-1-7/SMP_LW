require('dotenv').config();
const { MongoClient } = require('mongodb');

const SEED_LOTS = [
    ['Старовинний годинник', 'Антикваріат', 500.0, 'https://ireland.apollo.olxcdn.com/v1/files/5gn200ezsyq02-UA/image'],
    ['Олійний живопис', 'Мистецтво', 1200.0, 'https://i.pinimg.com/736x/c5/77/6e/c5776ee0cdb51f697d81c9d6717333cd.jpg'],
    ['Бронзова статуетка', 'Скульптура', 300.0, 'https://ireland.apollo.olxcdn.com/v1/files/b6nsea75u9ql1-UA/image;s=4272x2848'],
    ['Рідкісна монета', 'Нумізматика', 800.0, 'https://ireland.apollo.olxcdn.com/v1/files/qd8ysvreymxn1-UA/image;s=576x1024'],
    ['Порцелянова ваза', 'Кераміка', 150.0, 'https://image-thumbs.shafastatic.net/2184589706_310_430'],
    ['Лицарський меч', 'Зброя', 2000.0, 'https://fama.ua/uploads/catalog/product/picture/80386/superbig_product.webp'],
    ['Старовинний годинник (Копія)', 'Антикваріат', 500.0, 'https://ireland.apollo.olxcdn.com/v1/files/5gn200ezsyq02-UA/image'],
];

async function seed() {
    if (!process.env.MONGO_URI || !process.env.MONGO_DB_NAME) {
        throw new Error('Set MONGO_URI and MONGO_DB_NAME in .env');
    }

    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();

    const db = client.db(process.env.MONGO_DB_NAME);
    const lots = db.collection('lots');
    const lotIp = db.collection('lot_ip');
    const counters = db.collection('counters');

    await lots.deleteMany({});
    await lotIp.deleteMany({});
    await counters.deleteMany({});

    await lotIp.createIndex({ ip: 1, lot_id: 1 }, { unique: true });
    await lotIp.createIndex({ lot_id: 1 });

    const documents = SEED_LOTS.map(([title, category, startPrice, imageUrl], index) => ({
        id: index + 1,
        title,
        category,
        startPrice,
        imageUrl,
        creation_date: new Date(),
    }));

    await lots.insertMany(documents);
    await counters.insertOne({ _id: 'lots', seq: documents.length });

    console.log(`Seeded ${documents.length} lots into "${process.env.MONGO_DB_NAME}"`);
    await client.close();
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
