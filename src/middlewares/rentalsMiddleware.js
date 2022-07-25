import joi from "joi";
import { connection } from "../dbStrategy/database.js";

export async function validateRental(req, res, next) {
    try {
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
        
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function validateStock(req, res, next) {
    try {
        const { gameId } = req.body;
        const { rows: stock } = await connection.query(`
        SELECT games."stockTotal"
        FROM rentals
        JOIN games ON rentals."gameId" = games.id
        WHERE rentals."returnDate" IS NULL
        AND games.id = ${gameId}
        `)

        if(stock.length === 0) {
            return next();
        }
    
        if(stock.length === stock[0].stockTotal) {
            return res.status(400).send()
        }

        next();
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function validateReturnRental(req, res, next) {
    try {
        const id = req.params.id;
        const { rows: findRental } = await connection.query(`SELECT * FROM rentals WHERE id = ${id}`);

        if(findRental.length !== 1) {
            return res.status(404).send()
        }

        if(findRental[0].returnDate) {
            return res.status(400).send()
        }

        next();
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function validateRemoveRental(req, res, next) {
    try {
        const id = req.params.id;
        const {rows: rental} = await connection.query(`SELECT * FROM rentals WHERE id = ${id}`);
        
        if(rental.length !== 1) {
            return res.status(404).send()
        }
    
        if(!rental[0].returnDate) {
            return res.status(400).send()
        }
    
        next();
        
    } catch (error) {
        res.status(500).send(error);
    }
}