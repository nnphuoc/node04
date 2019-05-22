'use strict';

import userDB from '../models/user';
import verifyDB from '../models/verify';
import bcrypt from 'bcrypt';
import jwtHelper from '../helpers/jwt';
import sendEmail from '../services/send-email';
import Verify from '../models/classes/verify';

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
            let salt = bcrypt.genSaltSync(2);
            let hashPass = bcrypt.hashSync(body.password, salt);
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
            const token = await jwtHelper.sign({ _id: user._id });
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

    static async verify (req, res, next) {
        try {
            const { username, code } = req.body;
            const user = await userDB.getOne({
                where: { username }
            });
            if (!user) {
                return next(new Error('USER_NOT_FOUND'));
            }
            const verify = await verifyDB.getOne({
                where: {
                    code: code,
                    user: user._id
                }
            });
            if (!verify) {
                return next(new Error('VERIFY_CODE_NOT_FOUND'));
            } 
            if (verify.expiration < new Date()) {
                return next(new Error('VERIFY_CODE_EXPIRED'));
            }
            const token = await jwtHelper.sign({ _id: user._id });
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

    static async forgotPassword (req, res, next) {
        try {
            const username = req.body.username;
            const user = await userDB.getOne(
                { 
                    where: { username },
                    select: 'email'
                }
            );
            if (!user) {
                return next(new Error('USER_NOT_FOUND'));
            }
            if (!user.email) {
                return next(new Error('EMAIL_NOT_FOUND'));
            }
            const code = Math.floor(100000 + Math.random() * 900000);
            let expiration = new Date();
            expiration = expiration.setMinutes(expiration.getMinutes() + 5);
            let data = {
                user: user._id,
                code,
                expiration
            }
            await verifyDB.create(data);
            let send = await sendEmail.send(user.email, code);
            let result = 'action false';
            if (send === 'success') {
                result = 'Life of code is 5 minutes'
            }
            return res.json({
                message: send,
                result
            });
        } catch (e) {
            return next(e);
        }
    }

    static async resertPassword (req, res, next) {
        try {
            const password = req.body.password;
            console.log(req.user);
            const user = await userDB.getOne({
                where: { _id: req.user._id },
                select: 'password',
                isLean: false
            });
            if (!user) {
                return next(new Error('USER_NOT_FOUND'));
            }
            let salt = bcrypt.genSaltSync(2);
            let hashPass = bcrypt.hashSync(password, salt);
            console.log(password, hashPass);
            user.password = hashPass;
            const result = await user.save();
            return res.json({
                message: 'success',
                result
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