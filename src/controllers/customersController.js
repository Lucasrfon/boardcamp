import {connection} from '../dbStrategy/database.js';

export async function getCustomers(req, res) {
    try {
        const id = req.params.id;
        const cpf = req.query.cpf;

        const {rows: customers} = await connection.query(`
        SELECT * FROM customers
        ${cpf && !id ? `WHERE cpf LIKE '${cpf}%'` : ''}
        ${id && !cpf ? `WHERE id = ${id}` : ''}
        ${id && cpf ? `WHERE id = ${id} AND cpf LIKE '${cpf}%'` : ''}
        `);

        res.status(200).send(customers);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function postCustomer(req, res) {
    try {
        const {name, phone, cpf, birthday} = req.body;

        await connection.query(`
        INSERT INTO customers (name, phone, cpf, birthday) VALUES ('${name}', '${phone}', '${cpf}', '${birthday}')`);

        res.status(201).send();
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function updateCustomer(req, res) {
    try {
        const id = req.params.id;
        const {name, phone, cpf, birthday} = req.body;

        await connection.query(`
        UPDATE customers
        SET name = '${name}', phone = '${phone}', cpf = '${cpf}', birthday = '${birthday}'
        WHERE id = ${id}`);

        res.status(200).send();
    } catch (error) {
        res.status(500).send(error);
    }
}