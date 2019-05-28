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
            password: Joi.string().min(6).max(20).required().label("Your error a in here"),
            name: Joi.string(),
            email: Joi.string().email()
        })
    };
}

const checkUpdateUser = () => {
    return { 
        body: Joi.object({
            email: Joi.string().email(),
            name: Joi.string()
        })
    };
};

const forgotPassword = () => {
    return { 
        body: Joi.object({
            username: Joi.string().max(20).required().label("Your error message in here")
        })
    };
};

const verifyOTP = () => {
    return { 
        body: Joi.object({
            username: Joi.string().max(20).required().label("Your error message in here"),
            code: Joi.string().length(6).required()
        })
    };
}

module.exports = {
    checkName,
    checkCreateUser,
    checkUpdateUser,
    forgotPassword,
    verifyOTP
};