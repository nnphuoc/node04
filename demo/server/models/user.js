'use strict';

import mongoose from 'mongoose';
import UserClass from './classes/user';
var Schema = mongoose.Schema;

var schema = new Schema(
    {
        username: {
            type: String,
            maxlength: 255,
            unique: true,
            required: true
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
        }
    },
    {
        timestamps: true
    }
);

schema.loadClass(UserClass);
module.exports = mongoose.model('User', schema);
