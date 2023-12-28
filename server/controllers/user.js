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
  }
  catch (error) {

    next(error);
  }
};

const login = async (req, res, next) => {

  return passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.log(err)
      return res.status(500).send({
        message: '500: Authentication failed, try again.',
      });
    }

    if (!user) {
      return res.status(404).send({
        message: '404: Authentication failed, try again.',
      });
    }

    req.login(user, err => {
      if (!err) {
        return res.status(200).send({
          message: `Login successful for ${user.username}`,
        });
      }
    });
  })(req, res);
};

const logout = async (req, res) => {

  req.logout(err => {
    if (!err) {
      return res.status(200).send({
        message: 'Logout successful.',
      });
    }
  });
};

module.exports = {
  register,
  login,
  logout
};
