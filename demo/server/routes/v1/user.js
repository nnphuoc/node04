'use strict';
import { ControllerUser } from '../../controllers';
import { MiddlewareUser } from '../../middlewares';
import { checkName, checkCreateUser, checkUpdateUser } from '../../validations/validation-user';
import { celebrate, errors } from 'celebrate';
import Joi from 'joi';

const isDataPost = MiddlewareUser.checkUserData;
const isObjectID = MiddlewareUser.checkObjectID;
const isPassword = MiddlewareUser.isEmptyPass;
const validateUserName = celebrate(checkName());
const validateUserCreate = celebrate(checkCreateUser());
const validateUserUpdate = celebrate(checkUpdateUser());
module.exports = (app, router) => {

    router
        .route('/users')
        .get(ControllerUser.getAll)
        .post([validateUserCreate, errors()], ControllerUser.create);

    router
        .route('/user/name/:name')
        .get([validateUserName], ControllerUser.getByName);
    
    router
        .route('/user/:id')
        .get([isObjectID], ControllerUser.getOne)
        .put([isObjectID, validateUserUpdate, errors()], ControllerUser.update)
        .delete([isObjectID], ControllerUser.delete);

};