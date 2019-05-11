import Joi from '@hapi/joi';

const checkName = () => {
    return { 
        params: {
            name: Joi.string().max(20).required()
        }
    };
}

const checkCreateUser = () => {
    return { 
        body: Joi.object({
            username: Joi.string().max(20).required().label("Your error message in here"),
            password: Joi.string().min(6).max(20).required().label("Your error a in here")
        })
    };
}

const checkUpdateUser = () => {
    return { 
        body: Joi.object({
            password: Joi.string().min(6).max(20).required().label("Your error a in here")
        })
    };
}

module.exports = {
    checkName,
    checkCreateUser,
    checkUpdateUser
};