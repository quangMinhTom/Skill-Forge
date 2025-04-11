import express from 'express';
const router = express.Router();
import * as controller from '../controller/CommentController.js';
import * as security from "../middlewares/security.js";

router.route('/')
    .post(security.verifyJWT, security.restrictTo("admin", "creator"),controller.createComment)
    .get(controller.getAllComments); // Expects ?subSkillId query param

router.route('/:id')
    .get(controller.getCommentById)
    .patch(security.verifyJWT, security.restrictTo("admin", "creator"),controller.updateComment)
    .delete(security.verifyJWT, security.restrictTo("admin", "creator"),controller.deleteComment);

export default router;