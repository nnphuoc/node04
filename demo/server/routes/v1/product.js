'use strict';
import { ControllerProduct } from '../../controllers';
import { MiddlewareUser } from '../../middlewares';
import { schemaCreateProduct, schemaUpdateProduct } from '../../validations/validation-product';
import { celebrate, errors } from 'celebrate';

// const isDataPost = MiddlewareUser.checkUserData;
const isObjectID = MiddlewareUser.checkObjectID;
// const isPassword = MiddlewareUser.isEmptyPass;
const validateProductCreate = celebrate(schemaCreateProduct());
const validateProductUpdate = celebrate(schemaUpdateProduct());
module.exports = (app, router) => {

    router
        .route('/products')
        .get(ControllerProduct.getAll)
        .post([validateProductCreate, errors()], ControllerProduct.create);

    router
        .route('/product/user/:id')
        .get([isObjectID], ControllerProduct.getAllByUser)

        router
        .route('/product/name/:name')
        .get(ControllerProduct.getByName)
    
    router
        .route('/product/:id')
        .get([isObjectID], ControllerProduct.getOne)
        .put([isObjectID, validateProductUpdate, errors()], ControllerProduct.update)
        .delete([isObjectID], ControllerProduct.delete);

};