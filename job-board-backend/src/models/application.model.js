const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');

class ApplicationModel {
    tableName = 'applications';

    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)

        let sql = `SELECT * FROM ${this.tableName} WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        return result[0];
    }

    create = async ({ message, people_id, advertisement_id }) => {
        const sql = `INSERT INTO ${this.tableName}
        (message, people_id, advertisement_id) VALUES (?,?,?)`;
        
        const result = await query(sql, [message, people_id, advertisement_id]);  
        const affectedRows = result ? result.affectedRows : 0;
        
        return affectedRows;
    }

    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)

        let sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE id = ?`;
        const result = await query(sql, [...values, id]);

        return result;
    }

    delete = async (id) => {
        let sql = `DELETE FROM ${this.tableName}
        WHERE id = ?`;

        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

module.exports = new ApplicationModel;