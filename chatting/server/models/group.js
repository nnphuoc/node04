'use strict';

import mongoose from 'mongoose';
import ClassGroup from './classes/group';
const Schema = mongoose.Schema;

const TYPE = {
    DUO: 'duo',
    GROUP: 'group'
};
const schema = new Schema(
    {
        author: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            maxlength: 255,
            required: true
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                unique: true
            }
        ],
        lastMessage: {
            type: mongoose.Types.ObjectId,
            ref: 'Message'
        },
        type: {
            type: String,
            enum: Object.values(TYPE),
            default: TYPE.DUO
        },
        deletedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);
schema.statics = {
    TYPE
};
schema.loadClass(ClassGroup);
module.exports = mongoose.model('Group', schema);
