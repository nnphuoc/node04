'use strict';

import City from '../models/city';
import { cityRepository } from '../repositories';
import { Response } from '../helpers';

export default class ControllerGroup {

    static async getAll(req, res, next) {
        try {
            const { limit, page } = req.query;
            const cities = await cityRepository.getAll({
                limit,
                page
            });
            return Response.success(res, cities);
        } catch (e) {
            return next(e);
        }
    }

    static async create(req, res, next) {
        try {
            const city = new City({
                name: req.body.name
            });
            await city.save();
            return Response.success(res, group);
        } catch (e) {
            return next(e);
        }
    }

    static async getOne(req, res, next) {
        try {
            const _id = req.params.id;
            const group = await cityRepository.getOne({
                where: { _id }
            });
            return Response.success(res, group);
        } catch (e) {
            return next(e);
        }
    }

    static async update(req, res, next) {
        try {
            const _id = req.params.id;
            const city = await cityRepository.update(
                { _id },
                { $set: { name: req.body.name }}
            );
            if (city.nModified === 0) {
                return next(new Error('UPDATE_FALSE'));
            }
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }

    static async delete(req, res, next) {
        try {
            const _id = req.params.id;
            const city = await cityRepository.softDelete({
                where: { _id, author: req.user._id }
            });
            if (city.nModified === 0) {
                return next(new Error('ACTION_FAIL'));
            }
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }

};