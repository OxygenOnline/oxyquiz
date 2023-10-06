const pool = require("./index");


const selectAllRowsById = async (table, idValue, selectFields = ["*"], idColumnName = "id", limit, offset) => {

    try {

        const fields = selectFields.join(', ');
        let query = `SELECT ${fields} FROM ${table}`;

        if (idValue !== undefined) {
            query += ` WHERE ${idColumnName} = ${idValue}`;
        }

        if (limit !== undefined) {
            query += ` LIMIT ${limit}`;
        }
        if (offset !== undefined) {
            query += ` OFFSET ${offset}`;
        }

        const result = await pool.query(query);

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

const updateRow = async (table, fields, values, conditionValues, conditionFields = ["id"]) => {

    try {

        if (conditionFields.length !== conditionValues.length) {
            throw new Error();
        }

        const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
        const whereClauses = conditionFields.map((field, index) => `${field} = $${fields.length + index + 1}`).join(' AND ');

        const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClauses}`;
        await pool.query(query, [...values, ...conditionValues]);
    }
    catch (error) {

        const updateError = new Error(`Error updating ${table} row: ${error.message}`);
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

const countRows = async (table, id, idColumnName = "id") => {

    const query = `SELECT COUNT(*) FROM ${table} WHERE ${idColumnName} = $1`;
    const result = await pool.query(query, [id]);

    return Number(result.rows[0].count) !== 0;
};

const beginTransaction = async () => {
    await pool.query('BEGIN');
};

const commitTransaction = async () => {
    await pool.query('COMMIT');
};

const rollbackTransaction = async () => {
    await pool.query('ROLLBACK');
};

module.exports = {
    selectAllRowsById,
    selectSingleRowById,
    insertRow,
    updateRow,
    deleteRow,
    countRows,
    beginTransaction,
    commitTransaction,
    rollbackTransaction
};
