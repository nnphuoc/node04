import jwt from 'jsonwebtoken';

export default class JWTHelper {
  
  static async sign(uid) {
    return jwt.sign({ uid }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24 * 30
    });
  }

  static async verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
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
