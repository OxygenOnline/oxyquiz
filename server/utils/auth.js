const userAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(403).send({
      message: 'not authenticated',
    });
  }
};

module.exports = userAuth
