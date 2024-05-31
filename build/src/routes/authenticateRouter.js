"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticationController_1 = require("../controllers/authentication/authenticationController");
const router = express_1.default.Router();
router.post('/company', authenticationController_1.createCompanyContoller);
exports.default = router;
