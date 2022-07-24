import joi from "joi";
import { connection } from "../dbStrategy/database.js";

export function validateCategory(req, res, next) {
    const catgorySchema = joi.object({
        name: joi.string().required()
    });
    const category = req.body;
    const validation = catgorySchema.validate(category);

    if(validation.error) {
        return res.status(400).send(validation.error.details[0].message)
    }

    next();
}

export async function validateUniqueName(req, res, next) {
    const { name } = req.body;
    const { rows: uniqueName } = await connection.query(`SELECT * FROM categories WHERE name = '${name}'`);

    if(uniqueName.length > 0) {
        return res.status(409).send('Categoria já cadastrada.')
    }

    next();
}