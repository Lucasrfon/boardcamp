import {connection} from '../dbStrategy/database.js';

export async function getGames(req, res) {
    try {
        const { rows: games} = await connection.query('SELECT * FROM games');
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