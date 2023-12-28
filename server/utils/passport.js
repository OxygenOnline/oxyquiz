const LocalStrategy = require('passport-local');
const { compareSync } = require('bcryptjs');
const userdb = require('../database/user');
const passport = require('passport');


passport.use(new LocalStrategy(async (username, password, next) => {

    try {
        const userExists = await userdb.userExistsByUsername(username);
        if (!userExists) {
            return next(null, false, { message: `Unknown user ${username}` });
        }

        const user = await userdb.getUserByUsernameWithPassword(username);
        const validPassword = compareSync(password, user.password);

        if (!validPassword) {
            return next(null, false, { message: 'Invalid password' });
        }

        return next(null, user);
    }
    catch (error) {

        next(error);
    }
}));

passport.serializeUser((user, next) => {
    next(null, user.id);
});

passport.deserializeUser(async (userId, next) => {

    try {
        const user = await userdb.getUserById(userId);
        if (!user) {
            return next(null, false, { message: 'User does not exist.' });
        }
        next(null, user);
    }
    catch (error) {

        next(error);
    }
});
