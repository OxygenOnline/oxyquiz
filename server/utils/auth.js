const userAuth = (req, res, next) => {

  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(403).send({
    message: 'not authenticated',
  });
};

module.exports = userAuth;
