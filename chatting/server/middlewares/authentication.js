'use strict';

import jwtHelper from '../helpers/jwt';

export default class Authentication{

    static async isAuth (req, res, next) {
        try {
            const token = await jwtHelper.getToken(req);
            if (!token) {
                return res.status(401).json({
                    message: 'MISSING_TOKEN'
                });
            }
            const data = await jwtHelper.verifyToken(token);
            req.user = data.uid;
            return next();
        } catch (e) {
            return next(e);
        }
    }
};