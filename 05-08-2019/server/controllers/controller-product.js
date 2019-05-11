'use strict';

import mongodb from 'mongodb';

const objectId = mongodb.ObjectID;

export default class ControllerUser {
    static async create (req, res, next) {
        try {
            let body =req.body;
            body.userId = new objectId(body.userId);
            const productDB = req.db.collection('product');
            const result = await productDB.insertOne(body);
            return res.status(201).json({
                message: 'success',
                result: result.ops[0]
            });
        } catch (e) {
            console.log('e');
            return next(e);
        }
    }

    static async getAll (req, res, next) {
        try {
            const productDB = req.db.collection('product');
            const userDB = req.db.collection('user');
            const promise = await Promise.all([
                productDB.find({}).toArray(),
                userDB.find({}).toArray()
            ])
            const [products, users] = promise;
            let objUser = {};
            const results = [...products];
            for (let user of users) {
                objUser[user._id] = user
            }
            for (let result of results) {
                if (!result[objUser[result.userId]]) {
                    result.users = {};
                }
                result.users = objUser[result.userId];
            }
            console.log(results);
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
            const _id = new objectId(req.params.id);
            const productDB = req.db.collection('product');
            const result = await productDB.findOne({ _id });
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
            const productDB = req.db.collection('product');
            const result = await productDB.findOne({ name: req.params.name });
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
            const _id = new objectId(req.params.id);
            const body = req.body;
            const productDB = req.db.collection('product');
            const product = await productDB.updateOne({ _id }, { $set: body });
            if (product.result.nModified === 0) {
                return next(new Error('ACTION_FAIL'));
            }
            return res.json({
                message: 'success'
            });
        } catch (e) {
            return next(e);
        }
    }

    static async delete (req, res, next) {
        try {
            const _id = new objectId(req.params.id);
            const productDB = req.db.collection('product');
            const product = await productDB.remove({ _id });
            if (product.result.n === 0) {
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