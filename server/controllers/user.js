const passport = require('passport');
const userdb = require('../database/user');


const register = async (req, res, next) => {

  const user = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  }

  try {

    await userdb.createUser(user);
    return res.status(200).json({
      message: `Registration successful for ${user.username}`,
    });
  }
  catch (error) {

    next(error);
  }
};

const login = async (req, res, next) => {

  return passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({
        message: err,
      });
    }

    if (!user) {
      return res.status(404).json({
        message: err,
      });
    }

    req.login(user, err => {
      if (!err) {
        return res.status(200).json({
          message: `Login successful for ${user.username}`,
        });
      }
    });
  })(req, res);
};

const logout = async (req, res) => {

  req.logout(err => {
    if (!err) {
      return res.status(200).json({
        message: 'Logout successful.'
      });
    }
  });
};

const getUser = async (req, res) => {

  const userData = await userdb.getUserById(req.user.id);
  return res.json(userData);
};

const checkAuth = async (req, res) => {

  return res.status(200).send();
};

module.exports = {
  register,
  login,
  logout,
  getUser,
  checkAuth
};
