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
                return next(new Error(`INVALID_OBJECT_ID`));
            }
            return next();
        } catch (e) {
            return next(e);
        }
    }
}