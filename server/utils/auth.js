const logger = require('./logger');


const userAuth = (req, res, next) => {

  if (req.isAuthenticated()) {
    return next();
  }

  logger.debug(`Unauthenticated request: [${req.method}] ${req.originalUrl}`);
  return res.status(401).send({
    message: 'not authenticated',
  });
};

module.exports = userAuth;
