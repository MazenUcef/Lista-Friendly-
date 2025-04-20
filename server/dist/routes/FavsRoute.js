"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyUser_1 = require("../utils/verifyUser");
const FavoriteController_1 = __importDefault(require("../controllers/FavoriteController"));
const router = express_1.default.Router();
router.post('/toggle', verifyUser_1.verifyToken, FavoriteController_1.default.toggleFavorite);
router.get('/read', verifyUser_1.verifyToken, FavoriteController_1.default.readdFavorites);
exports.default = router;
