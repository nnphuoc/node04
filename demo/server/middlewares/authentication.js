'use strict';

import jwt from 'jsonwebtoken';
import jwtHelper from '../helpers/jwt';
import User from '../models/user';

export default class Authentication{

    static async isAuth (req, res, next) {
        try {
            const token = await jwtHelper.getToken(req);
            if (!token) {
                return res.status(401).json({
                    message: 'AUTHORIZED'
                });
            }
            const data = await jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({ _id: data._id }).select('_id').lean();
            if (!user) {
                return res.status(401).json({
                    message: 'AUTHENTICATION_FAILED'
                });
            }
            req.user = user;
            return next();
        } catch (e) {
            return next(e);
        }
    }
};