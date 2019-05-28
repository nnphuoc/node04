'use strict';
import { omitBy, isNil } from 'lodash';

export default class BaseModelClass {

    static async getAll (params) {
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
            this.find({ ...params.where, deletedAt: null })
                .select(params.select)
                .sort(params.sort)
                .skip(params.skip)
                .limit(params.limit)
                .populate(params.populate)
                .lean(params.isLean),
                this.countDocuments(params.where)
        ]);
        return {
            page: params.page ? params.page : 1,
            limit: params.limit ? params.limit : 25,
            count,
            data
        };
    }

    static async getOne (params) {
        params = Object.assign(
            {
                where: null,
                select: null,
                populate: '',
                isLean: true,
                isUpdateCountView: false
            },
            params
        );
        return await this.findOne({...params.where, deletedAt: null })
            .populate(params.populate)
            .select(params.select)
            .lean(params.isLean);
    }

    static async softDelete (option) {
        return this.update(
            option.where,
            {
                deletedAt: new Date()
            }
        );
    }

    static async destroy (option) {
        return this.remove(
            option.where,
        );
    }

}