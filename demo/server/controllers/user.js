'use strict';

import userDB from '../models/user'

export default class ControllerUser {
    static async create (req, res, next) {
        try {
            const body =req.body;
            const count = await userDB.countDocuments({ username: body.username });
            if (count !== 0) {
                return res.json({
                    code: 'USER_IS_USED',
                    message: 'Sorry, this user is used'
                });
            }
            const result = await userDB.create(body);
            delete result.createdAt;
            delete result.updatedAt;
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
            const results = await userDB.getAll({});
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
            const result = await userDB.getOne({ where: { username: req.params.name }});
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
            const id = req.params.id;
            const password = req.body.password;
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
            const id = req.params.id;
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