'use strict';
import { ControllerUser } from '../../controllers';
import { MiddlewareUser } from '../../middlewares';

const isDataPost = MiddlewareUser.checkUserData;
const isObjectID = MiddlewareUser.checkObjectID;

module.exports = (app, router) => {

    router
        .route('/users')
        .get(ControllerUser.getAll)
        .post([isDataPost], ControllerUser.create);

    router
        .route('/user/:id')
        .get([isObjectID], ControllerUser.getOne)
        .put([isObjectID], ControllerUser.update)
        .delete([isObjectID], ControllerUser.delete);

};