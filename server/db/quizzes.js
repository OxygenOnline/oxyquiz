const pool = require("./index");

const getAllQuizzes = async (limit = 20, offset = 0) => {

    try {
        const queryText = "SELECT * FROM quiz LIMIT $1 OFFSET $2";
        const result = await pool.query(queryText, [limit, offset]);
        return result.rows;
    }
    catch (error) {
        console.error(error.message);
        throw error;
    }
};

const getQuizById = async (id) => {

    try {
        const queryText = "SELECT * FROM quiz WHERE id = $1";
        const result = await pool.query(queryText, [id]);
        return result.rows[0];
    }
    catch (error) {
        console.error(error.message);
        throw error;
    }
};

const deleteQuizById = async (id) => {

    try {
        const queryText = "DELETE FROM quiz WHERE id = $1";
        await pool.query(queryText, [id]);
    }
    catch (error) {
        console.error(error.message);
        throw error;
    }
};

const checkQuizExists = async (id) => {

    try {
        const queryText = "SELECT * FROM quiz WHERE id = $1 LIMIT 1";
        const { rowCount } = await pool.query(queryText, [id]);

        if (rowCount === 0) {
            return false;
        }

        return true;
    }
    catch (error) {
        console.error(error.message);
        throw error;
    }
}

module.exports = {
    getAllQuizzes,
    getQuizById,
    deleteQuizById,
    checkQuizExists
};
