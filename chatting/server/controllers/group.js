'use strict';

import Group from '../models/group';
import User from '../models/user';
import { Response } from '../helpers';

export default class ControllerGroup {

    static async getAll(req, res, next) {
        try {
            const groups = await Group.getAll({
                select: 'author lastMessage type',
                populate: {
                    path: 'lastMessage',
                    select: 'author content',
                    populate: {
                        path: 'author',
                        select: 'name'
                    }
                }
            });
            return Response.success(res, groups);
        } catch (e) {
            return next(e);
        }
    }

    static async create(req, res, next) {
        try {
            const data = req.body;
            data.author = req.user._id;
            data.members = Array.from(new Set(data.members));
            data.type = Group.TYPE.DUO;
            if (data.members.length > 1) {
                data.type = Group.TYPE.GROUP;
            }
            if (data.members && data.members.length > 0) {
                const count = await User.countDocuments({ _id: { $in: data.members }});
                if (count !== data.members.length) {
                    return next(new Error('NOT_FOUND_USER_IN_LIST_MEMBER'));
                }
            } else {
                data.members = [];
            }
            data.members.push(data.author);
            const group = await Group.create(data);
            return Response.success(res, group);
        } catch (e) {
            return next(e);
        }
    }

    static async invite(req, res, next) {
        try {
            const _id = req.params.id;
            const members = Array.from(new Set(req.body.members));
            const group = await Group.findOneAndUpdate(
                { _id },
                { $addToSet: { members: members }}
            );
            if (group.nModified === 0) {
                return next(new Error('INVITE_GROUP_FALSE'));
            }
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }

    static async leave(req, res, next) {
        try {
            const _id = req.params.id;
            const user = req.user._id;
            const group = await Group.updateOne(
                { _id },
                { $pull: { members: user }}
            );
            if (group.nModified === 0) {
                return next(new Error('LEAVE_GROUP_FALSE'));
            }
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }

    static async getOne(req, res, next) {
        try {
            const _id = req.params.id;
            const group = await Group.getOne({
                where: { _id },
                populate: {
                    path: 'members',
                    select: 'name email slug geoPosition'
                }
            });
            return Response.success(res, group);
        } catch (e) {
            return next(e);
        }
    }

    static async update(req, res, next) {
        try {
            const _id = req.params.id;
            const data = req.body;
            const group = await Group.update(
                { _id },
                { $set: data }
            );
            if (group.nModified === 0) {
                return next(new Error('JOIN_GROUP_FALSE'));
            }
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }

    static async delete(req, res, next) {
        try {
            const _id = req.params.id;
            const group = await Group.softDelete({
                where: { _id, author: req.user._id }
            });
            if (group.nModified === 0) {
                return next(new Error('ACTION_FAIL'));
            }
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }

};