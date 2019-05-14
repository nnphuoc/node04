import Joi from '@hapi/joi';

const schemaCreateProduct = () => {
    return { 
        body: Joi.object({
            name: Joi.string().required(),
            user: Joi.string().length(24).required(),
            price: Joi.number(),
            colors: Joi.array().items(),
            isAvailable: Joi.boolean().required(),
            payload: Joi.object({
                releasedAt: Joi.date(),
                expriredAt: Joi.date().greater(Joi.ref('releasedAt'))
            })
        })
    };
}

const schemaUpdateProduct = () => {
    return {
        body: Joi.object({
            name: Joi.string(),
            price: Joi.number(),
            colors: Joi.array().items(),
            isAvailable: Joi.boolean(),
            payload: Joi.object({
                releasedAt: Joi.date(),
                expriredAt: Joi.date()
            })
        })
    };
}

module.exports = {
    schemaCreateProduct,
    schemaUpdateProduct
};