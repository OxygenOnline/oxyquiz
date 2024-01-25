const categorydb = require('../database/category');

const getAllCategories = async (req, res, next) => {
    try {
        const categories = await categorydb.getAllCategories();
        res.json(categories);
    }
    catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCategories
};
