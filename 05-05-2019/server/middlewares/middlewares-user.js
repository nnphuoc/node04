'use strict';

import MongoDB from 'mongodb';
const ObjectID = MongoDB.ObjectID;

export default class MiddlewareUser {

    static async checkUserData (req, res, next) {
        try {
            const body =req.body;
            if (!body.username || !body.password) {
                return res.status(401).json({
                    message: 'Missing username or password'
                });
            }
            return next();
        } catch (e) {
            return next(e);
        }
    }
    static async checkObjectID (req, res, next) {
        try {
            const _id =req.params.id;
            if (_id.length !== 24 || !ObjectID.isValid(_id)) {
                return res.json({
                    code: 'ID_NOT_MATCH',
                    message: 'Sorry, this id not match'
                });
            }
            return next();
        } catch (e) {
            return next(e);
        }
    }

    static async isEmptyPass (req, res, next) {
        try {
            const password =req.body.password;
            if (!req.body.password) {
                return res.json({
                    code: 'MISSING_PRAMS',
                    message: 'Sorry, this missing password'
                });
            }
            return next();
        } catch (e) {
            return next(e);
        }
    }
}