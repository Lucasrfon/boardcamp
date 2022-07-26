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
        const desc = req.query.desc;
        const order = req.query.order;
        const offset = req.query.offset;
        const limit = req.query.limit;
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
        ${order && !desc ? `ORDER BY ${order}` : ''}
        ${order && desc ? `ORDER BY ${order} DESC` : ''}
        ${limit ? `LIMIT ${limit}` : ''}
        ${offset ? `OFFSET ${offset}` : ''}
        `);
        const formatRentals = rentals.map(format);
        formatRentals.map(each => 
            delete each.image & 
            delete each.stockTotal & 
            delete each.pricePerDay &
            delete each.name &
            delete each.categoryId &
            delete each.categoryName
            );
        res.status(200).send(formatRentals);
    } catch (error) {
        res.status(500).send(error);
    }
}

function format(rental) {
    return {
        ...rental, 
        customer: {id: rental.customerId, name: rental.customer},
        game: {
            id: rental.gameId, 
            name: rental.name, 
            categoryId: rental.categoryId, 
            categoryName: rental.categoryName
        }
    }
}

export async function returnRental(req, res) {
    try {
        const id = req.params.id;
        const returnDate = dayjs().format('YYYY-MM-DD');
        const {rows: rental} = await connection.query(`SELECT * FROM rentals WHERE id = ${id}`);
        const daysRented = dayjs(returnDate).diff(dayjs(rental[0].rentDate), 'day') - 3;
        const {rows : game} = await connection.query(`SELECT * FROM games WHERE id = ${rental[0].gameId}`);
        const delayFee = daysRented > 0 ? daysRented * game[0].pricePerDay : 0;
        
        await connection.query(`
        UPDATE rentals 
        SET "returnDate" = '${returnDate}', "delayFee" = '${delayFee}' 
        WHERE id = ${id}
        `);
        res.status(200).send();
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

export async function caculateMetrics(req, res) {
    try {
        const {rows: rentals} = await connection.query(`SELECT COUNT(id) FROM rentals WHERE "returnDate" IS NOT NULL`);
        const {rows: revenueOriginal} = await connection.query(`SELECT SUM("originalPrice") FROM rentals WHERE "returnDate" IS NOT NULL`);
        const {rows: revenueDelayFee} = await connection.query(`SELECT SUM("delayFee") FROM rentals WHERE "returnDate" IS NOT NULL`);
        const revenue = (revenueOriginal[0].sum + revenueDelayFee[0].sum);
        const average = rentals[0].count === 0 ? 0 : revenue / rentals[0].count;

        res.status(200).send({revenue, rentals: rentals[0].count, average})
    } catch (error) {
        res.status(500).send(error);
    }
}