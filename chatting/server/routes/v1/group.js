'use strict';
import { ControllerGroup } from '../../controllers';
import { MiddlewareUser, Auth } from '../../middlewares';
import { pagination } from '../../validations/validation-pagination';
import { celebrate, errors } from 'celebrate';
import RedisCache from 'express-redis-cache';

const cache = RedisCache({ host: '127.0.0.1', port: '6379'});

const isObjectID = MiddlewareUser.checkObjectID;
const validatePagination = celebrate(pagination());
const isAuth = Auth.isAuth;
const inGroup = Auth.inGroup;

module.exports = (app, router) => {

    router
        .route('/groups')
        .get([isAuth, validatePagination, errors(), cache.route({name: 'groups', expire: 3})], ControllerGroup.getAll)
        .post([isAuth], ControllerGroup.create);

    router
        .route('/groups/invite/:id')
        .put([isAuth, inGroup, isObjectID], ControllerGroup.invite);

    router
        .route('/groups/leave/:id')
        .put([isAuth, inGroup, isObjectID], ControllerGroup.leave);

    router
        .route('/group/:id')
        .get([isAuth, inGroup, isObjectID], ControllerGroup.getOne)
        .put([isAuth, inGroup, isObjectID], ControllerGroup.update)
        .delete([isAuth, inGroup, isObjectID], ControllerGroup.delete);

};