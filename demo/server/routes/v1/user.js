'use strict';
import { ControllerUser } from '../../controllers';
import { MiddlewareUser, Auth } from '../../middlewares';
import { 
    checkName, 
    checkCreateUser, 
    checkUpdateUser, 
    forgotPassword, 
    verifyOTP 
} from '../../validations/validation-user';
import { celebrate, errors } from 'celebrate';

const isDataPost = MiddlewareUser.checkUserData;
const isObjectID = MiddlewareUser.checkObjectID;
const isPassword = MiddlewareUser.isEmptyPass;
const validateUserName = celebrate(checkName());
const validateUserCreate = celebrate(checkCreateUser());
const validateUserUpdate = celebrate(checkUpdateUser());
const validateUserForgotPassword = celebrate(forgotPassword());
const validateUserVerify = celebrate(verifyOTP());
const isAuth = Auth.isAuth;

module.exports = (app, router) => {

    router
        .route('/login')
        .post(ControllerUser.login);
    
    router
        .route('/user/verify')
        .post([validateUserVerify], ControllerUser.verify);

    router
        .route('/user/resert-password')
        .post([isAuth], ControllerUser.resertPassword);

    router
        .route('/forgot-password')
        .post([validateUserForgotPassword], ControllerUser.forgotPassword);

    router
        .route('/users')
        .get([isAuth], ControllerUser.getAll)
        .post([isAuth, validateUserCreate, errors()], ControllerUser.create);

    router
        .route('/user/name/:name')
        .get([isAuth, validateUserName], ControllerUser.getByName);
    
    router
        .route('/user/:id')
        .get([isAuth, isObjectID], ControllerUser.getOne)
        .put([isAuth, isObjectID, validateUserUpdate, errors()], ControllerUser.update)
        .delete([isAuth, isObjectID], ControllerUser.delete);

};