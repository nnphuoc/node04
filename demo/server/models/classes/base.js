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
                isLean: true
            },
            params
        );
        const data = await this.find({ ...params.where, deletedAt: null })
            .sort(params.sort)
            .select(params.select)
            .populate(params.populate)
            .lean(params.isLean);

        return { data };
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