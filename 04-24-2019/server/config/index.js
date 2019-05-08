import DotENV from 'dotenv';

DotENV.config();

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || '5555';
module.exports = {
    env,
    port
};