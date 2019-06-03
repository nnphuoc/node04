import Joi from '@hapi/joi';

const pagination = () => {
    return {
        query: {
            limit: Joi.number().default(25),
            page: Joi.number().default(1)
        }
    };
};

module.exports = {
    pagination
}