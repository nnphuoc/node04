'use strict';
import { ControllerUser } from '../../controllers';

module.exports = (app, router) => {

    router.route('/users')
        .get(ControllerUser.getAll)
        .post(ControllerUser.create);

};