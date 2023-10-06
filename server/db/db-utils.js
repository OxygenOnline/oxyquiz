const pool = require("./index");

const selectAllRowsById = async (table, idValue, selectFields = ["*"], idColumnName = "id") => {

    try {

        const fields = selectFields.join(', ');
        const query = `SELECT ${fields} FROM ${table} WHERE ${idColumnName} = $1`;

        const result = await pool.query(query, [idValue]);

        return result.rows;
    }
    catch (error) {

        const selectError = new Error(`Error in selecting from ${table} by id ${idValue}: ${error.message}`);
        throw selectError;
    }
};

const selectSingleRowById = async (table, idValue, selectFields = ["*"], idColumnName = "id") => {

    const rows = await selectAllRowsById(table, idValue, selectFields, idColumnName);
    return rows[0];
};

const insertRow = async (table, fields, values, returnId = true) => {

    try {

        if (fields.length !== values.length) {
            throw new Error();
        }

        const fieldNames = fields.join(', ');
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
        let query = `INSERT INTO ${table} (${fieldNames}) VALUES (${placeholders})`;

        if (returnId) {
            query += ` RETURNING id;`;
        }

        const result = await pool.query(query, values);

        return returnId ? result.rows[0].id : undefined;
    }
    catch (error) {

        const insertError = new Error(`Error inserting row into ${table}: ${error.message}`);
        throw insertError;
    }
};

const updateRow = async (table, fields, values, id) => {

    try {

        const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
        const query = `UPDATE ${table} SET ${setClause} WHERE id = $${fields.length + 1}`;

        await pool.query(query, [...values, id]);
    }
    catch (error) {

        const updateError = new Error(`Error updating ${table} row with ID ${id}: ${error.message}`);
        throw updateError;
    }
};

const deleteRow = async (table, conditionValues, conditionFields = ["id"]) => {

    try {

        if (conditionFields.length !== conditionValues.length) {
            throw new Error();
        }

        const whereClauses = conditionFields.map((field, index) => `${field} = $${index + 1}`).join(' AND ');
        const query = `DELETE FROM ${table} WHERE ${whereClauses}`;

        await pool.query(query, conditionValues);
    }
    catch (error) {

        const deleteError = new Error(`Error deleting row from ${table}: ${error.message}`);
        throw deleteError;
    }
};

module.exports = {
    selectAllRowsById,
    selectSingleRowById,
    insertRow,
    updateRow,
    deleteRow
};
