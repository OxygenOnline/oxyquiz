const userAuth = (req, res, next) => {

  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).send({
    message: 'not authenticated',
  });
};

module.exports = userAuth;
