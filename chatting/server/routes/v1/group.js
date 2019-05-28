'use strict';
import { ControllerGroup } from '../../controllers';
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
        .route('/groups')
        .get(ControllerGroup.getAll)
        .post([isAuth], ControllerGroup.create);

    router
        .route('/groups/invite/:id')
        .put([isAuth, isObjectID], ControllerGroup.invite);

    router
        .route('/groups/leave/:id')
        .put([isAuth, isObjectID], ControllerGroup.leave);

    router
        .route('/groups/:id')
        .get([isAuth, isObjectID], ControllerGroup.getOne)
        .put([isAuth, isObjectID], ControllerGroup.update)
        .delete([isAuth, isObjectID], ControllerGroup.delete);

};