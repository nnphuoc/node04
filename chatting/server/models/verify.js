'use strict';

import mongoose from 'mongoose';
import VerifyClass from './classes/verify';
var Schema = mongoose.Schema;

var schema = new Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },
        code: {
            type: Number,
            required: true
        },
        expiration: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

schema.loadClass(VerifyClass);
module.exports = mongoose.model('Verify', schema);
