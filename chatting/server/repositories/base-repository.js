
module.exports = class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async getAll(params) {
        params = Object.assign(
            {
                where: null,
                sort: { createdAt: -1 },
                select: null,
                populate: '',
                skip: 0,
                limit: 25,
                isLean: true
            },
            params
        );
        params.limit > 25 ? params.limit = 25 : '';
        if (params.page && params.page >= 1) {
            params.skip = params.limit * (params.page - 1);
        }
        const [data, count] = await Promise.all([
            this.model.find({ ...params.where, deletedAt: null })
                .select(params.select)
                .sort(params.sort)
                .skip(params.skip)
                .limit(params.limit)
                .populate(params.populate)
                .lean(params.isLean),
            this.model.countDocuments(params.where)
        ]);
        return {
            page: params.page ? params.page : 1,
            limit: params.limit ? params.limit : 25,
            count,
            data
        };
    }

    getOne(params) {
        params = Object.assign(
            {
                where: null,
                sort: { createdAt: -1 },
                select: null,
                populate: '',
                isLean: true
            },
            params
        );
        return this.model.findOne(params.where)
            .sort(params.sort)
            .select(params.select)
            .populate(params.populate)
            .lean(params.isLean);
    }

    create(data) {
        if (data.length > 1) {
            return this.model.insertMany(data);
        }
        return this.model.create(data);
    }

    softDelete(params) {
        return this.model.findOneAndUpdate(
            params.where,
            { deletedAt: new Date() }
            );
    }

};