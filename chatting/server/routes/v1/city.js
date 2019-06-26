'use strict';
import { ControllerCity } from '../../controllers';
import { MiddlewareUser, Auth } from '../../middlewares';
import { pagination } from '../../validations/validation-pagination';
import { celebrate, errors } from 'celebrate';

const isObjectID = MiddlewareUser.checkObjectID;
const validatePagination = celebrate(pagination());
const isAuth = Auth.isAuth;

module.exports = (app, router) => {

    router
        .route('/cities')
        .get([validatePagination, errors()], ControllerCity.getAll)
        .post([isAuth], ControllerCity.create);

    router
        .route('/city/:id')
        .get([isAuth, isObjectID], ControllerCity.getOne)
        .put([isAuth, isObjectID], ControllerCity.update)
        .delete([isAuth, isObjectID], ControllerCity.delete);

};