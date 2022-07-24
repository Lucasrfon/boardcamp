import joi from "joi";
import { connection } from "../dbStrategy/database.js";

export function validateCustomer(req, res, next) {
    const customerSchema = joi.object({
        name: joi.string().required(),
        phone: joi.string().pattern(/^[0-9]{10,11}$/).required(),
        cpf: joi.string().pattern(/^[0-9]{11}$/).required(),
        birthday: joi.date().required()
    });
    const customer = req.body;
    const validation = customerSchema.validate(customer);

    if(validation.error) {
        return res.status(400).send(validation.error.details[0].message)
    }

    next();
}

export async function validateUniqueCpf(req, res, next) {
    const { cpf } = req.body;
    const { rows: uniqueCpf } = await connection.query(`SELECT * FROM customers WHERE cpf = '${cpf}'`);

    if(uniqueCpf.length > 0) {
        return res.status(409).send('Não foi possível cadastrar esse cliente.')
    }

    next();
}

export async function validateIdCustomer(req, res, next) {
    const id = req.params.id;
    const { rows: findId } = await connection.query(`SELECT * FROM customers WHERE id = '${id}'`);

    if(findId.length !== 1) {
        return res.status(404).send('Não foi possível localizar esse cliente.')
    }

    next();
}