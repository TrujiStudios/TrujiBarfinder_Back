import Joi from 'joi';

export const createCategorySchema = Joi.object({
    id: Joi.string(),
    name: Joi.string().trim().min(3).max(30).required(),
    description: Joi.string().required().trim(),
    // companyId: Joi.string().required().trim(),

});
