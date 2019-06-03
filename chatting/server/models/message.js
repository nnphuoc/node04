'use strict';

import { mongoose } from './index';
import MessageGroup from './classes/message';
const Schema = mongoose.Schema;

const TYPE = {
    AUTHOR: 'author',
    SYSTEM: 'system'
};
const schema = new Schema(
    {
        author: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        content: {
            type: String,
            minlength: 1,
            required: true
        },
        group: {
            type: mongoose.Types.ObjectId,
            ref: 'Group',
            required: true
        },
        type: {
            type: String,
            enum: Object.values(TYPE),
            default: TYPE.SYSTEM
        },
        deletedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);
// schema.statics = {
//     TYPE
// };
// schema.loadClass(MessageGroup);
module.exports = mongoose.model('Message', schema);
