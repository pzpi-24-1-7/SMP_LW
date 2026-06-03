const LotRepository = require('./LotRepository');

const LOTS = 'lots';
const LOT_IP = 'lot_ip';
const COUNTERS = 'counters';

class MongoLotRepository extends LotRepository {
    constructor(dbAdapter) {
        super();
        this.dbAdapter = dbAdapter;
    }

    async _collections() {
        const db = await this.dbAdapter.getDb();
        return {
            lots: db.collection(LOTS),
            lotIp: db.collection(LOT_IP),
            counters: db.collection(COUNTERS),
        };
    }

    async _nextLotId(counters) {
        await counters.updateOne(
            { _id: LOTS },
            { $inc: { seq: 1 } },
            { upsert: true }
        );
        const counter = await counters.findOne({ _id: LOTS });
        return counter.seq;
    }

    async findAllWithTotalHits() {
        const { lots, lotIp } = await this._collections();

        const allLots = await lots.find().sort({ id: 1 }).toArray();
        const hitAgg = await lotIp
            .aggregate([
                { $group: { _id: '$lot_id', total_hits: { $sum: '$hits' } } },
            ])
            .toArray();

        const hitsByLotId = new Map(hitAgg.map((row) => [row._id, row.total_hits]));

        return allLots.map((lot) => {
            const { _id, ...fields } = lot;
            return {
                ...fields,
                total_hits: hitsByLotId.get(lot.id) ?? 0,
            };
        });
    }

    async findByIdWithHitTracking(lotId, ip, hitDebounceMs) {
        const lotIdNum = Number(lotId);
        const { lots, lotIp } = await this._collections();
        const currentTime = new Date();

        const lot = await lots.findOne({ id: lotIdNum });
        if (!lot) {
            return null;
        }

        const existingHit = await lotIp.findOne({ ip, lot_id: lotIdNum });

        if (existingHit) {
            const lastHitTime = new Date(existingHit.last_hit);

            if (currentTime - lastHitTime >= hitDebounceMs) {
                await lotIp.updateOne(
                    { ip, lot_id: lotIdNum },
                    { $inc: { hits: 1 }, $set: { last_hit: currentTime } }
                );
            }
        } else {
            await lotIp.updateOne(
                { ip, lot_id: lotIdNum },
                {
                    $setOnInsert: {
                        ip,
                        lot_id: lotIdNum,
                        hits: 1,
                        last_hit: currentTime,
                    },
                },
                { upsert: true }
            );
        }

        const ipStats = await lotIp
            .aggregate([
                { $match: { lot_id: lotIdNum } },
                {
                    $group: {
                        _id: null,
                        unique_hosts: { $addToSet: '$ip' },
                        total_hits: { $sum: '$hits' },
                    },
                },
            ])
            .toArray();

        const userHit = await lotIp.findOne({ ip, lot_id: lotIdNum });
        const stats = ipStats[0] || { unique_hosts: [], total_hits: 0 };

        const { _id, ...lotFields } = lot;

        return {
            ...lotFields,
            unique_hosts: stats.unique_hosts.length,
            total_hits: stats.total_hits,
            user_hits: userHit?.hits ?? null,
        };
    }

    async create({ title, category, startPrice, imageUrl }) {
        const { lots, counters } = await this._collections();
        const id = await this._nextLotId(counters);

        const doc = {
            id,
            title,
            category,
            startPrice: Number(startPrice),
            imageUrl,
            creation_date: new Date(),
        };

        await lots.insertOne(doc);
        return { id };
    }

    async deleteById(lotId) {
        const lotIdNum = Number(lotId);
        const { lots, lotIp } = await this._collections();

        const result = await lots.deleteOne({ id: lotIdNum });
        if (result.deletedCount > 0) {
            await lotIp.deleteMany({ lot_id: lotIdNum });
            return true;
        }
        return false;
    }
}

module.exports = MongoLotRepository;
