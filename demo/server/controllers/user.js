'use strict';

import userDB from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class ControllerUser {
    static async create (req, res, next) {
        try {
            const body =req.body;
            const user = await userDB.getOne({ where: { username: body.username }});
            if (user) {
                return res.json({
                    code: 'USER_IS_USED',
                    message: 'Sorry, this user is used'
                });
            }
            var salt = bcrypt.genSaltSync(2);
            var hashPass = bcrypt.hashSync(body.password, salt);
            body.password = hashPass;
            const result = await userDB.create(body);
            delete result._doc.createdAt;
            delete result._doc.updatedAt;
            delete result._doc.password;
            return res.status(201).json({
                message: 'success',
                result
            });
        } catch (e) {
            console.log('e');
            return next(e);
        }
    }

    static async getAll (req, res, next) {
        try {
            const token = req.query.token;
            const data = jwt.verify(token, 'key');
            if (new Date(data.exp*1000) < new Date()) {
                return res.json({
                    code: 'Expressed',
                    message: 'Sorry, expressed'
                });
            }
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
            const result = await userDB.getOne({ where: { _id }});
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

    static async login (req, res, next) {
        try {
            const user = await userDB.getOne({ 
                where: { 
                    username: req.body.username 
                }
            });
            if (!user) {
                return next(new Error('LOGIN_FAIL'));
            }
            const checkPass = bcrypt.compareSync(req.body.password, user.password);
            if (!checkPass) {
                return next(new Error('LOGIN_FAIL'));
            }
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: 60*60*60 });
            return res.json({
                message: 'success',
                result: {
                    token,
                    user: user._id
                }
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
            if (user.nModified === 0) {
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
            if (user.n === 0) {
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