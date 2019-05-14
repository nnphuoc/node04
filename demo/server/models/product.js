'use strict';

import mongoose from 'mongoose';
import ProductClass from './classes/product';
var Schema = mongoose.Schema;

var schema = new Schema(
    {
        name: {
            type: String,
            maxlength: 255,
            required: true
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        colors: {
            type: Array
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        payload: {
            releasedAt: {
                type: Date,
                required: true
            },
            expriredAt: {
                type: Date,
                required: true
            }
        }
    },
    {
        timestamps: true
    }
);

schema.loadClass(ProductClass);
module.exports = mongoose.model('Product', schema);
