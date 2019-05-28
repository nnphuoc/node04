import Joi from '@hapi/joi';

const userCreateMessage = () => {
    return {
        body: {
            content: Joi.string().required(),
            group: Joi.string().length(24).required()
        }
    };
};

const systemCreateMessage = () => {
    return {
        body: {
            content: Joi.string().required(),
            group: Joi.string().length(24).required()
        }
    };
};

module.exports = {
    userCreateMessage,
    systemCreateMessage
};