"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompanyRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
const createCompanyRepository = (companyData) => __awaiter(void 0, void 0, void 0, function* () {
    const dbInstance = yield database_1.default;
    if (!dbInstance) {
        throw new Error('Database instance is null');
    }
    const collection = dbInstance.collection('company');
    const resultCompany = yield collection.insertOne(Object.assign(Object.assign({}, companyData), { id: '', createdAt: new Date(), updatedAt: new Date() }));
    if (resultCompany.acknowledged === false) {
        throw new Error('Company was not created');
    }
    return {
        id: resultCompany.insertedId.toString(),
        name: companyData.name,
        lastName: companyData.lastName,
        phone: companyData.phone,
        nameCompany: companyData.nameCompany,
        tipoNegocio: companyData.tipoNegocio,
        email: companyData.email,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
});
exports.createCompanyRepository = createCompanyRepository;
