const { genSaltSync, hashSync } = require('bcryptjs');
const { User, sequelize } = require('./models/index');


const userExists = async (where) => {

    const count = await User.count({
        where
    });
    return count != 0;
};

const userExistsByUsername = async (username) => {

    const result = await userExists({ username });
    return result;
};

const userExistsByEmail = async (email) => {

    const result = await userExists({ email });
    return result;
};

const userExistsById = async (id) => {

    const result = await userExists({ id });
    return result;
};

const createUser = async (user) => {

    const { email, username, password } = user;
    const t = await sequelize.transaction();

    try {

        const salt = genSaltSync(10);
        const hashedPassword = hashSync(password, salt);
        const normalizedEmail = email.toLowerCase();
        const user = await User.create({ username, email: normalizedEmail, password: hashedPassword });

        await t.commit();

        return user.id;
    }
    catch (error) {

        await t.rollback();
        throw error;
    }
};

const getUser = async (where, includePassword = false) => {

    const attributes = ['id', 'username', 'email', 'joiningDate'];
    if (includePassword) {
      attributes.push('password');
    }

    const user = await User.findOne({
      where,
      attributes,
    });
    return user.get({plain: true});
};

const getUserByEmail = async (email) => {

    const user = await getUser({ email }, includePassword);
    return user;
};

const getUserByUsernameWithPassword = async (username) => {

    const user = await getUserByUsername(username, true);
    return user;
};

const getUserByUsername = async (username, includePassword = false) => {

    const user = await getUser({ username }, includePassword);
    return user;
};

const getUserById = async (id) => {

    const user = await getUser({ id });
    return user;
};

module.exports = {
    userExistsByEmail,
    userExistsByUsername,
    userExistsById,
    createUser,
    getUserByEmail,
    getUserByUsername,
    getUserByUsernameWithPassword,
    getUserById
}
