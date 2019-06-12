'use strict';

import { userRepository } from '../repositories'
import verifyDB from '../models/verify';
import bcrypt from 'bcrypt';
import { Response, JWTHelper, Slug } from '../helpers';
import sendEmail from '../services/send-email';

export default class ControllerUser {
    static async create(req, res, next) {
        try {
            const body =req.body;
            const user = await userRepository.getOne({ where: { username: body.username }});
            if (user) {
                return res.json({
                    code: 'USER_IS_USED',
                    message: 'Sorry, this user is used'
                });
            }
            let salt = bcrypt.genSaltSync(2);
            let hashPass = bcrypt.hashSync(body.password, salt);
            body.password = hashPass;
            const result = await userRepository.create(body);
            result.slug = result._id;
            await result.save();
            delete result._doc.createdAt;
            delete result._doc.updatedAt;
            delete result._doc.password;
            return Response.success(res, result);
        } catch (e) {
            console.log('e');
            return next(e);
        }
    }

    static async getAll(req, res, next) {
        try {
            const results = await userRepository.getAll();
            return Response.success(res, results);
        } catch (e) {
            return next(e);
        }
    }

    static async getOne(req, res, next) {
        try {
            const _id = req.params.id;
            const result = await userRepository.getOne({ where: { _id }});
            return Response.success(res, result);
        } catch (e) {
            return next(e);
        }
    }

    static async getByName(req, res, next) {
        try {
            const result = await userRepository.getOne({ where: { username: req.params.name }});
            return Response.success(res, result);
        } catch (e) {
            return next(e);
        }
    }

    static async login(req, res, next) {
        try {
            const user = await userRepository.getOne({ 
                where: { 
                    username: req.body.username 
                }
            });
            if (!user) {
                return next(new Error('LOGIN_FAIL'));
            }
            const checkPass = bcrypt.compareSync(req.body.password, user.password);
            if (!checkPass) {
                return next(new Error('LOGIN_FAIL'));
            }
            const token = await JWTHelper.sign({ _id: user._id });
            return Response.success(res,
                {
                    token,
                    user: user._id
                });
        } catch (e) {
            return next(e);
        }
    }

    static async verify(req, res, next) {
        try {
            const { username, code } = req.body;
            const user = await userRepository.getOne({
                where: { username }
            });
            if (!user) {
                return next(new Error('USER_NOT_FOUND'));
            }
            const verify = await verifyDB.getOne({
                where: {
                    code: code,
                    user: user._id
                },
                isLean: false
            });
            if (!verify) {
                return next(new Error('VERIFY_CODE_NOT_FOUND'));
            } 
            if (verify.expiration < new Date()) {
                return next(new Error('VERIFY_CODE_EXPIRED'));
            }
            const token = await JWTHelper.sign({ _id: user._id });
            await verify.remove();
            return Response.success(res, {
                token,
                user: user._id
            });
        } catch (e) {
            return next(e);
        }
    }

    static async forgotPassword(req, res, next) {
        try {
            const username = req.body.username;
            const user = await userRepository.getOne(
                { 
                    where: { username },
                    select: 'email'
                }
            );
            if (!user) {
                return next(new Error('USER_NOT_FOUND'));
            }
            if (!user.email) {
                return next(new Error('EMAIL_NOT_FOUND'));
            }
            const code = Math.floor(100000 + Math.random() * 900000); // randomstring
            let expiration = new Date();
            expiration = expiration.setMinutes(expiration.getMinutes() + 5);
            let data = {
                user: user._id,
                code,
                expiration
            };
            await verifyDB.create(data);
            let send = await sendEmail.send(user.email, code);
            if (send !== 'success') {
                return next(new Error('SEND_EMAIL_FAIL'));
            }
            return Response.success(res, 'Life of code is 5 minutes');
        } catch (e) {
            return next(e);
        }
    }

    static async resetPassword(req, res, next) {
        try {
            const password = req.body.password;
            console.log(req.user);
            const user = await userRepository.getOne({
                where: { _id: req.user._id },
                select: 'password',
                isLean: false
            });
            if (!user) {
                return next(new Error('USER_NOT_FOUND'));
            }
            let salt = bcrypt.genSaltSync(2);
            let hashPass = bcrypt.hashSync(password, salt);
            console.log(password, hashPass);
            user.password = hashPass;
            const result = await user.save();
            return Response.success(res, result);
        } catch (e) {
            return next(e);
        }
    }

    static async update(req, res, next) {
        try {
            const id = req.user._id;
            const data = req.body;
            data.name = data.name.trim().replace(/\s+/g, ' ');
            data.slug = Slug.parseSlug(data.name);
            const user = await userRepository.updateOne({ _id: id }, { $set: data });
            if (user.nModified === 0) {
                return next(new Error('ACTION_FAIL'));
            }
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }

    static async delete(req, res, next) {
        try {
            const _id = req.params.id;
            const user = await userRepository.softDelete(
                { where: { _id }}
                );
            if (user.nModified === 0) {
                return next(new Error('ACTION_FAIL'));
            }
            return Response.success(res);
        } catch (e) {
            return next(e);
        }
    }

    static async createWithFB(req, res, next) {
      try {
          const body = req.body;
          const userExist = await userRepository.findOne({
              $and: [{
                  token: body.facebook.token,
                  id: body.facebook.id
              }]
          });
          if (userExist) {
              return Response.success(res);
          }
          const user = await userRepository.create(body);
      } catch (e) {
          return next(e);
      }
    };
}