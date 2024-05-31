"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompanySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createCompanySchema = joi_1.default.object({
    name: joi_1.default.string().required().messages({ 'string.empty': 'El name es requerido' }),
    lastName: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    nameCompany: joi_1.default.string().required(),
    tipoNegocio: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
