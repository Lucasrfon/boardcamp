import {connection} from '../dbStrategy/database.js';

export async function getCategories(req, res) {
    try {
        const offset = req.query.offset;
        const limit = req.query.limit;
        const { rows: categories} = await connection.query(`
        SELECT * FROM categories
        ${limit ? `LIMIT ${limit}` : ''}
        ${offset ? `OFFSET ${offset}` : ''}
        `);
        res.status(200).send(categories);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function postCategory(req, res) {
    try {
        const { name } = req.body;
        await connection.query(`INSERT INTO categories (name) VALUES ('${name}')`);
        res.status(201).send();
    } catch (error) {
        res.status(500).send(error);
    }
}