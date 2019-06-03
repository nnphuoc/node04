'use strict';
import { ControllerMessage } from '../../controllers';
import { MiddlewareUser, Auth } from '../../middlewares';
import { pagination } from '../../validations/validation-pagination';
import { celebrate, errors } from 'celebrate';

const isObjectID = MiddlewareUser.checkObjectID;
const validatePagination = celebrate(pagination());
const isAuth = Auth.isAuth;
const inGroup = Auth.inGroup;

module.exports = (app, router) => {

    router
        .route('/messages')
        .post([isAuth, inGroup], ControllerMessage.create);

    router
        .route('/messages/group/:id')
        .get([isAuth, inGroup, isObjectID, validatePagination, errors()], ControllerMessage.getAllByGroup);

    router
        .route('/messages/:id')
        .delete([isAuth, isObjectID], ControllerMessage.delete);
};