'use strict';

import jwtHelper from '../helpers/jwt';
import { groupRepository } from '../repositories';

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

    static async inGroup (req, res, next) {
        try {
            const group = req.params.id || req.body.group;
            const user = req.user._id;
            const data = await groupRepository.getOne({
                where: { _id: group, members: user }
            });
            if (!data) {
                return next(new Error('USER_NOT_IN_GROUP'));
            }
            return next();
        } catch (e) {
            return next(e);
        }
    }
};