'use strict';

import { mongoose } from './index';
// import UserClass from './classes/user';
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        username: {
            type: String,
            maxlength: 255
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            maxlength: 255
        },
        email: {
            type: String,
            maxlength: 255
        },
        facebook: {
            id: String,
            token: String
        },
        slug: {
            type: String
        },
        geoPosition: {
            type: Array,
            maxlength: 2
        },
        deletedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// schema.loadClass(UserClass);
module.exports = mongoose.model('User', schema);
