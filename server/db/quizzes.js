const pool = require("./index");

async function checkQuizExists(id) {

    try {
        const queryText = "SELECT * FROM quiz WHERE id = $1";
        const { rowCount } = await pool.query(queryText, [id]);

        if (rowCount === 0) {
            return false;
        }

        return true;
    }
    catch (error) {
        console.error(error.message);
    }
}

module.exports = {
    checkQuizExists
};
