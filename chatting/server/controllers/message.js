'use strict';

import Message from '../models/message';
import Group from '../models/group';
import { Response } from '../helpers';

export default class ControllerGroup {

    static async create(req, res, next) {
        try {
            const data = req.body;
            data.author = req.user._id;
            data.type = Message.TYPE.AUTHOR;
            const message = await Message.create(data);
            return Response.success(res, message);
        } catch (e) {
            return next(e);
        }
    }

    static async createBySystem(req, res, next) {
        try {
            const data = req.body;
            const message = await Message.create(data);
            return Response.success(res, message);
        } catch (e) {
            return next(e);
        }
    }

    static async getAllByGroup(req, res, next) {
        try {
            const group = req.params.id;
            const user = req.user._id;
            const existedUser = await Group.getOne({ where: { members: user }});
            if (!existedUser) {
                return next(new Error('YOUR_NOT_IN_GROUP'));
            }
            const messages = await Message.getAll({ where: { group }});
            return Response.success(res, messages);
        } catch (e) {
            return next(e);
        }
    }

    static async delete(req, res, next) {
        try {
            const  _id= req.body.id;
            const message = await Message.softDelete({ where: { _id, author: req.user._id }});
            if (message.nModified === 0) {
                return next(new Error('ACTION_FAIL'));
            }
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }
};