'use strict';
import { ControllerMessage } from '../../controllers';
import { MiddlewareUser, Auth } from '../../middlewares';
// import {
//     checkName,
//     checkCreateUser,
//     checkUpdateUser,
//     forgotPassword,
//     verifyOTP
// } from '../../validations/validation-user';
// import { celebrate, errors } from 'celebrate';

const isObjectID = MiddlewareUser.checkObjectID;
// const validateUserName = celebrate(checkName());
const isAuth = Auth.isAuth;

module.exports = (app, router) => {

    router
        .route('/messages')
        .post([isAuth], ControllerMessage.create);

    router
        .route('/messages/group/:id')
        .get([isAuth, isObjectID], ControllerMessage.getAllByGroup);

    router
        .route('/messages/:id')
        .post([isAuth, isObjectID], ControllerMessage.delete);
};