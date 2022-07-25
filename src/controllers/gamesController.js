import {connection} from '../dbStrategy/database.js';

export async function getGames(req, res) {
    try {
        const desc = req.query.desc;
        const order = req.query.order;
        const offset = req.query.offset;
        const limit = req.query.limit;
        const name = req.query.name;
        const { rows: games} = await connection.query(`
        SELECT games.*, categories.name AS "categoryName"
        FROM games
        JOIN categories
        ON games."categoryId" = categories.id
        ${name ? `WHERE LOWER(games.name) LIKE LOWER('${name}%')` : ''}
        ${order && !desc ? `ORDER BY ${order}` : ''}
        ${order && desc ? `ORDER BY ${order} DESC` : ''}
        ${limit ? `LIMIT ${limit}` : ''}
        ${offset ? `OFFSET ${offset}` : ''}
        `);
        res.status(200).send(games);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function postGame(req, res) {
    try {
        const {name, image, stockTotal, categoryId, pricePerDay} = req.body;
        await connection.query(`
        INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ('${name}', '${image}', '${stockTotal}', '${categoryId}', '${pricePerDay}')`);
        res.status(201).send();
    } catch (error) {
        res.status(500).send(error);
    }
}