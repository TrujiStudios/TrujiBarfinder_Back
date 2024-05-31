import Joi from 'joi';

export const createCompanySchema = Joi.object({
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().required(),
    nameCompany: Joi.string().required(),
    tipoNegocio: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
