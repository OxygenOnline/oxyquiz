const { createLogger, format, transports } = require('winston');

const myFormat = format.printf(({ level, message, label, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
  });

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(
        format.timestamp(),
        myFormat
      ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'oxy.log' })
    ],
});

module.exports = logger;
