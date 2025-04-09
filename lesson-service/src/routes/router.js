import express from 'express';
const router = express.Router();
import * as controller from '../controller/LessonController.js';

router.route('/')
    .post(controller.createLesson)
    .get(controller.getAllLessons); // Expects ?subSkillId query param

router.route('/:id')
    .get(controller.getLessonById)
    .patch(controller.updateLesson)
    .delete(controller.deleteLesson);

export default router;