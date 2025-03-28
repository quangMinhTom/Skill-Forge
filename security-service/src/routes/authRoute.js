import express from 'express';
import * as authService from '../service/authService.js';
const router = express.Router();

router.route("/signup")
    .post(authService.signUp);
router.route("/login")
    .post(authService.login);
router.route("/verify")
    .get(authService.verifyJWT);
router.route("/internalToken")
    .get(authService.generateInternalToken);
router.route("/forgotPassword")
    .post(authService.forgotPassword);
router.route("/resetPassword/:token")
    .patch(authService.resetPassword);
export default router;