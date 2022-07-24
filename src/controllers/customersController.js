import {connection} from '../dbStrategy/database.js';

export async function getCustomers(req, res) {
    try {
        const cpf = req.query.cpf;
        const {rows: customers} = await connection.query(`
        SELECT * FROM customers
        ${cpf ? `WHERE cpf LIKE '${cpf}%'` : ''}
        `);
        res.status(200).send(customers);
    } catch (error) {
        res.status(500).send(error);
    }
}