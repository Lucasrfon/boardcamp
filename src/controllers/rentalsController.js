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