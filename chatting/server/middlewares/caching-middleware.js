import RedisCache from 'express-redis-cache';

const cache = RedisCache({ host: '127.0.0.1', port: '6379'});
const cachingUrlDic = [
    '/cities'
];
export default class Caching{

    static async cache(req, res, next){
        try {
            const orinalURL = req.originalUrl;
            if (cachingUrlDic.includes(orinalURL)) {

            } else {
                return next();
            }
        } catch (e) {
            return next(e);
        }
    }
};