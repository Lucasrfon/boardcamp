import joi from "joi";
import { connection } from "../dbStrategy/database.js";

export async function validateRental(req, res, next) {
    const rentalSchema = joi.object({
        customerId: joi.number().integer().greater(0).required(),
        gameId: joi.number().integer().greater(0).required(),
        daysRented: joi.number().integer().greater(0).required()
    });
    const rental = req.body;
    const validation = rentalSchema.validate(rental);

    const { rows: findCustomerId } = await connection.query(`SELECT * FROM customers WHERE id = '${rental.customerId}'`);
    const { rows: findGameId } = await connection.query(`SELECT * FROM games WHERE id = '${rental.gameId}'`);

    if(validation.error || (findCustomerId.length !== 1) || (findGameId.length !== 1)) {
        return res.status(400).send()
    }

    next();
}

export async function validateStock (req, res, next) {
    try {
        console.log('implementar!')
    } catch (error) {
        res.status(500).send(error);
    }
}