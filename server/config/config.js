const { config } = require('dotenv');
config();

module.exports = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 8000,
    SERVER_URL: process.env.SERVER_URL,
    CLIENT_URL: process.env.CLIENT_URL,
    SECRET: process.env.SECRET,
    REDIS: (
        process.env.REDIS_URL ?
            { url: process.env.REDIS_URL }
            : {
                socket: {
                    host: process.env.REDIS_HOST,
                    port: process.env.REDIS_PORT,
                }
            })
};
