import Joi from 'joi';

export const createCompanySchema = Joi.object({
    //para name que no sea menor a 3 caracteres y no mayor a 30 y no espacios en blanco
    name: Joi.string().trim().min(3).max(30).required(),
    lastName: Joi.string().required().trim(),
    phone: Joi.string().required().trim(),
    businessName: Joi.string().required().trim(),
    country: Joi.string().required().trim(),
    businessType: Joi.string().required().trim(),
    email: Joi.string().email().required().trim().lowercase(),
    password: Joi.string().required().trim(),
    acceptTerms: Joi.boolean().required(),
    preloadProducts: Joi.boolean().required(),
});

// Joi.string()
//         .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))