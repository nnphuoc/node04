'use strict';

import Group from '../models/group';
import { groupRepository, messageRepository } from '../repositories';
import { Response } from '../helpers';

export default class ControllerGroup {

    static async create(req, res, next = (error)=> {
        console.log(error)
        return Promise.reject(error);
    }) {
        try {
            const data = req.body;
            if (req.user) {
                data.author = req.user._id;
            }
            data.type = 'author';
            const message = await messageRepository.create(data);
            await Group.updateOne({ _id: data.group }, { lastMessage: message._id });
            return Response.success(res, message);
        } catch (e) {
            return next(e);
        }
    }

    static async createBySystem(req, res, next) {
        try {
            const data = req.body;
            const message = await messageRepository.create(data);
            return Response.success(res, message);
        } catch (e) {
            return next(e);
        }
    }

    static async getAllByGroup(req, res, next) {
        try {
            const { limit, page } = req.query;
            const group = req.params.id;
            const user = req.user._id;
            console.log('here', limit);
            const existedUser = await groupRepository.getOne({ where: { members: user }});
            if (!existedUser) {
                return next(new Error('YOUR_NOT_IN_GROUP'));
            }
            const messages = await messageRepository.getAll({
                where: { group },
                limit,
                page
            });
            return Response.success(res, messages);
        } catch (e) {
            return next(e);
        }
    }

    static async delete(req, res, next) {
        try {
            const  _id= req.body.id;
            const message = await messageRepository.softDelete({ where: { _id, author: req.user._id }});
            if (message.nModified === 0) {
                return next(new Error('ACTION_FAIL'));
            }
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }
};