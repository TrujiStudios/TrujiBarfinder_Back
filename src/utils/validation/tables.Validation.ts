import Joi from 'joi';

export const createTablesSchema = Joi.object({
    name: Joi.string().trim().min(2).max(30).required(),
    description: Joi.string().required().trim(),
    status: Joi.boolean().required(),
    image: Joi.string().uri().required(),
});
