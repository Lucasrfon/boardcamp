import {connection} from '../dbStrategy/database.js';

export async function getCategories(req, res) {
    try {
        const desc = req.query.desc;
        const order = req.query.order;
        const offset = req.query.offset;
        const limit = req.query.limit;
        const { rows: categories} = await connection.query(`
        SELECT * FROM categories
        ${order && !desc ? `ORDER BY ${order}` : ''}
        ${order && desc ? `ORDER BY ${order} DESC` : ''}
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