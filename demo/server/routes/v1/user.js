'use strict';
import { ControllerUser } from '../../controllers';
import { MiddlewareUser, Auth } from '../../middlewares';
import { checkName, checkCreateUser, checkUpdateUser } from '../../validations/validation-user';
import { celebrate, errors } from 'celebrate';
import Joi from 'joi';

const isDataPost = MiddlewareUser.checkUserData;
const isObjectID = MiddlewareUser.checkObjectID;
const isPassword = MiddlewareUser.isEmptyPass;
const validateUserName = celebrate(checkName());
const validateUserCreate = celebrate(checkCreateUser());
const validateUserUpdate = celebrate(checkUpdateUser());
const isAuth = Auth.isAuth;

module.exports = (app, router) => {

    router
        .route('/login')
        .post(ControllerUser.login);
    
    router
        .route('/users')
        .get([isAuth], ControllerUser.getAll)
        .post([validateUserCreate, errors()], ControllerUser.create);

    router
        .route('/user/name/:name')
        .get([isAuth, validateUserName], ControllerUser.getByName);
    
    router
        .route('/user/:id')
        .get([isAuth, isObjectID], ControllerUser.getOne)
        .put([isAuth, isObjectID, validateUserUpdate, errors()], ControllerUser.update)
        .delete([isAuth, isObjectID], ControllerUser.delete);

};