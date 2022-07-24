import dayjs from 'dayjs';
import {connection} from '../dbStrategy/database.js';

export async function postRental(req, res) {
    try {
        const {customerId, gameId, daysRented} = req.body;
        const { rows: pricePerDay} = await connection.query(`
        SELECT "pricePerDay" FROM games 
        WHERE id = ${gameId}`);
        const originalPrice = parseInt(daysRented) * parseInt(pricePerDay[0].pricePerDay);
        const rentDate = dayjs().format('YYYY-MM-DD');

        await connection.query(`
        INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
        VALUES ('${customerId}', '${gameId}', '${rentDate}', '${daysRented}', null, '${originalPrice}', null)`);

        res.status(201).send();
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function getRentals(req, res) {
    try {
        const customerId = req.query.customerId;
        const gameId = req.query.gameId;
        const {rows: rentals} = await connection.query(`
        SELECT rentals.*, customers.name AS customer, games.name, games."categoryId", categories.name as "categoryName"
        FROM rentals
        JOIN customers ON customers.id = rentals."customerId"
        JOIN games ON games.id = rentals."gameId"
        JOIN categories ON games."categoryId" = categories.id
        ${customerId && !gameId ? `WHERE rentals."customerId" = ${customerId}` : ''}
        ${gameId && !customerId ? `WHERE rentals."gameId" = ${gameId}` : ''}
        ${gameId && customerId ? `WHERE rentals."gameId" = ${gameId} AND rentals."customerId" = ${customerId}` : ''}
        `);
        const formatRentals = rentals;
        formatRentals.forEach(each => 
            delete each.image & delete each.stockTotal & delete each.pricePerDay
            );
        res.status(200).send(formatRentals);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function removeRental(req, res) {
    try {
        const id = req.params.id;
        await connection.query(`DELETE FROM rentals WHERE id = ${id}`);
        res.status(200).send();
    } catch (error) {
        res.status(500).send(error);
    }
}