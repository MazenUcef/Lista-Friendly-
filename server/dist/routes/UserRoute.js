"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const UserController_1 = __importDefault(require("@/controllers/UserController"));
const validation_1 = require("@/middleware/validation");
const verifyUser_1 = require("@/utils/verifyUser");
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
});
router.post("/signout", UserController_1.default.Signout);
router.put("/update/:userId", verifyUser_1.verifyToken, exports.upload.single("profilePicture"), validation_1.validateUpdate, UserController_1.default.UpdateUser);
router.delete("/delete/:userId", verifyUser_1.verifyToken, UserController_1.default.DeleteUser);
router.get('/getUser', verifyUser_1.verifyToken, UserController_1.default.GetUsers);
router.delete('/admin-delete/:userId', verifyUser_1.verifyToken, UserController_1.default.DeleteUsers);
exports.default = router;
