import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
const privateKey = fs.readFileSync(path.resolve(__dirname, '../config/cert/private.key'), 'utf8');
const publicKey = fs.readFileSync(path.resolve(__dirname, '../config/cert/public.key'), 'utf8');
export default class JWTHelper {
  
  static async sign(uid, options) {
    options = Object.assign(
      {
        algorithm: 'RS256', 
        expiresIn: 60*60*60
      },
      options
    );
    return jwt.sign({ uid }, privateKey, options);
  }

  static async verifyToken(token, options = {}) {
    return jwt.verify(token, publicKey, options);
  }

  static async getToken(req) {
    let authorization = null;
    let token = null;
    if (req.query && req.query.token) {
      return req.query.token;
    } else if (req.authorization) {
      authorization = req.authorization;
    } else if (req.headers) {
      authorization = req.headers.authorization;
    } else if (req.socket) {
      if (req.socket.handshake.query && req.socket.handshake.query.token) {
        return req.socket.handshake.query.token;
      }
      authorization = req.socket.handshake.headers.authorization;
    }
    if (authorization) {
      const tokens = authorization.split('Bearer ');
      if (Array.isArray(tokens) || tokens.length === 2) {
        token = tokens[1];
      }
    }
    return token;
  }
};
