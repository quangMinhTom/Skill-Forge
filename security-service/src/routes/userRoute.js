import express from 'express';
import * as UsersController from '../controller/UserController.js';
const router = express.Router();
import * as security from "../middleware/security.js"

router.route('/')
.get(security.verifyJWT,security.restrictTo("admin"), UsersController.getAllUsers)

router.route('/:id')
.get(security.verifyJWT,security.restrictTo("admin"), UsersController.getUserById)
.put(security.verifyJWT,security.restrictTo("admin"),UsersController.updateUser)
.delete(security.verifyJWT,security.restrictTo("admin"),UsersController.deleteUser);

export default router;