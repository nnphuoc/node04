'use strict';

import mongodb from 'mongodb';

const objectId = mongodb.ObjectID;

export default class ControllerUser {
    static async create (req, res, next) {
        try {
            const body =req.body;
            const userDB = req.db.collection('user');
            const count = await userDB.countDocuments({ username: body.username });
            if (count !== 0) {
                return res.json({
                    code: 'USER_IS_USED',
                    message: 'Sorry, this user is used'
                });
            }
            const result = await userDB.insertOne({
                username: body.username,
                password: body.password
            });
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
            const userDB = req.db.collection('user');
            const results = await userDB.find({}).toArray();
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
            const userDB = req.db.collection('user');
            const result = await userDB.findOne({ _id });
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
            const userDB = req.db.collection('user');
            const result = await userDB.findOne({ username: req.params.name });
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
            const id = new objectId(req.params.id);
            const password = req.body.password;
            const userDB = req.db.collection('user');
            const user = await userDB.updateOne({ _id: id }, { $set: { password: password }});
            if (user.result.nModified === 0) {
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
            const id = new objectId(req.params.id);
            const userDB = req.db.collection('user');
            const user = await userDB.remove({ _id: id });
            if (user.result.n === 0) {
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