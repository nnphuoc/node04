import Joi from '@hapi/joi';

const createGroup = () => {
    return {
        body: {
            author: Joi.string().length(24).required(),
            name: Joi.string().max(20).required(),
            members: Joi.array(),
            lastMessage: Joi.string().length(24),
            type: Joi.string().valid(['single', 'group', 'system'])
        }
    };
};

const updateGroup = () => {
    return {
        body: {
            author: Joi.string().length(24).required(),
            name: Joi.string().max(20).required(),
            members: Joi.array(),
            lastMessage: Joi.string().length(24),
            type: Joi.string().valid(['single', 'group', 'system'])
        }
    };
};

module.exports = {
    createGroup
};