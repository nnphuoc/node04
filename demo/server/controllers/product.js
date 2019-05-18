'use strict';

import Product from '../models/product';
import User from '../models/user';

export default class ControllerUser {
    static async create (req, res, next) {
        try {
            let body = req.body;
            const user = await User.findOne({ where: { _id: body.user }});
            if (!user) {
                return res.status(400).json({
                    message: 'Sorry, user not found',
                    code: 'USER_NOT_FOUND'
                });
            }
            const result = await Product.create(body);
            return res.status(201).json({
                message: 'success',
                result: result
            });
        } catch (e) {
            console.log('e');
            return next(e);
        }
    }

    static async getAll (req, res, next) {
        try {
            const products = await Product.getAll({
                populate: [{
                    path: 'user',
                    select: '_id name username'
                }]
            });
            return res.json({
                message: 'success',
                result: products
            });
        } catch (e) {
            return next(e);
        }
    }

    static async getAllByUser (req, res, next) {
        try {
            const user = req.params.id;
            const results = await Product.getAll({ 
                where: { user }
             });
            return res.json({
                message: 'success',
                result: results
            });
        } catch (e) {
            return next(e);
        }
    }


    static async getOne (req, res, next) {
        try {
            const _id = req.params.id;
            const result = await Product.getOne({ where: { _id }});
            return res.json({
                message: 'success',
                result: result
            });
        } catch (e) {
            return next(e);
        }
    }

    static async getByName (req, res, next) {
        try {
            const result = await Product.getOne({ where: { name: req.params.name }});
            return res.json({
                message: 'success',
                result: result
            });
        } catch (e) {
            return next(e);
        }
    }

    static async update (req, res, next) {
        try {
            const body = req.body;
            const product = await Product.findByIdAndUpdate(req.params.id, body, { new: true });
            if (!product) {
                return next(new Error('ACTION_FAIL'));
            }
            return res.json({
                message: 'success',
                product
            });
        } catch (e) {
            return next(e);
        }
    }

    static async delete (req, res, next) {
        try {
            const product = await Product.findByIdAndRemove(req.params.id);
            if (!product) {
                return next(new Error('ACTION_FAIL'));
            }
            return res.json({
                message: 'success'
            });
        } catch (e) {
            return next(e);
        }
    }
}