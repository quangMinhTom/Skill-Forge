import express from 'express';
const router = express.Router();
import * as controller from '../controller/LessonController.js';
import * as security from "../middlewares/security.js";

router.route('/')
    .post(security.verifyJWT, security.restrictTo("admin", "creator"),controller.createLesson)
    .get(controller.getAllLessons); // Expects ?subSkillId query param

router.route('/:id')
    .get(controller.getLessonById)
    .patch(security.verifyJWT, security.restrictTo("admin", "creator"),controller.updateLesson)
    .delete(security.verifyJWT, security.restrictTo("admin", "creator"),controller.deleteLesson);

export default router;