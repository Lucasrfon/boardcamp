import joi from "joi";
import { connection } from "../dbStrategy/database.js";

export async function validateGame(req, res, next) {
    try {
        const gameSchema = joi.object({
            name: joi.string().required(),
            image: joi.string().required(),
            stockTotal: joi.number().integer().greater(0).required(),
            categoryId: joi.number().integer().greater(0).required(),
            pricePerDay: joi.number().integer().greater(0).required()
        });
        const game = req.body;
        const validation = gameSchema.validate(game);
        
        if(validation.error) {
            return res.status(400).send(validation.error.details[0].message)
        }
    
        const { rows: findCategory} = await connection.query(`SELECT * FROM categories WHERE id = ${game.categoryId}`)
        
        if(findCategory.length !== 1) {
            return res.status(400).send('Categoria não existe')
        }
        
        next();
        
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function validateUniqueGame(req, res, next) {
    try {
        const { name } = req.body;
        const { rows: uniqueName } = await connection.query(`SELECT * FROM games WHERE LOWER(name) = LOWER('${name}')`);
    
        if(uniqueName.length > 0) {
            return res.status(409).send('Jogo já cadastrado.')
        }
    
        next();
        
    } catch (error) {
        res.status(500).send(error);
    }
}