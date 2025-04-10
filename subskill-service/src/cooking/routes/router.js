import express from 'express';
const router = express.Router();
import * as controller from '../controllers/SubSkillController.js';
import * as security from "../../middlewares/security.js";

router.route('/')
    .get(controller.getAllSubs) // Expects ?skillId query param
    .post(security.verifyJWT, security.restrictTo("admin", "creator"),controller.createSub);

router.route('/:id')
    .get(controller.getSubById)
    .patch(security.verifyJWT, security.restrictTo("admin", "creator"),controller.updateSub)
    .delete(security.verifyJWT, security.restrictTo("admin", "creator"),controller.deleteSub);

export default router;