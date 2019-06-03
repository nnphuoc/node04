'use strict';

import Group from '../models/group';
import { groupRepository, messageRepository, userRepository } from '../repositories';
import { Response } from '../helpers';

export default class ControllerGroup {

    static async getAll(req, res, next) {
        try {
            const { limit, page } = req.query;
            const groups = await groupRepository.getAll({
                where: { members: req.user._id },
                select: 'author lastMessage type members',
                populate: {
                    path: 'lastMessage',
                    select: 'author content',
                    populate: {
                        path: 'author',
                        select: 'name'
                    }
                },
                limit,
                page
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
            if (!data.members.includes(data.author)) {
                data.members.push(data.author);
            }
            data.type = data.members.length > 2 ? Group.TYPE.GROUP : Group.TYPE.DUO;
            const promise = [
                userRepository.getAll({
                    where: {_id: { $in: data.members }},
                    select: 'name'
                })
            ];
            if (data.members.length === 2) {
                promise.push(groupRepository.getOne({
                    where: {
                        members: {
                            $all: data.members
                        },
                        type: 'duo'
                    }
                }));
            }
            const [listUsers, existGroup] = await Promise.all(promise);
            if (listUsers.data.length !== data.members.length) {
                return next(new Error('NOT_FOUND_USER_IN_LIST_MEMBER'));
            }
            if (existGroup) {
                return Response.success(res, existGroup);
            }
            const group = await groupRepository.create(data);
            let promiseUser = [];
            for (let i = 0, len = listUsers.data.length; i < len; i++) {
                if (listUsers.data[i]._id.toString() !== data.author.toString()) {
                    promiseUser.push(messageRepository.create({
                        group: group._id,
                        content: listUsers.data[i].name + ' join in group'
                    }));
                }
            }
            await Promise.all(promiseUser);
            return Response.success(res, group);
        } catch (e) {
            return next(e);
        }
    }

    static async invite(req, res, next) {
        try {
            const _id = req.params.id;
            const members = Array.from(new Set(req.body.members));
            const group = await groupRepository.findOneAndUpdate(
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
            const group = await groupRepository.updateOne(
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
            const group = await groupRepository.getOne({
                where: { _id }
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
            const group = await groupRepository.update(
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
            const group = await groupRepository.softDelete({
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