import Joi from '@hapi/joi';

const pagination = () => {
    return {
        query: {
            limit: Joi.number().optional(),
            page: Joi.number().default(1)
        }
    };
};

module.exports = {
    pagination
};