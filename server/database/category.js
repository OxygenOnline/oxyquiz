const db = require('./models/index');
const { Category } = db;


const getAllCategories = async () => {

    const categories = await Category.findAll();
    return categories;
};


module.exports = {
    getAllCategories
};
