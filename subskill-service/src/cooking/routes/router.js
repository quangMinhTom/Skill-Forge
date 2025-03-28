import express from 'express';
const router = express.Router();
import * as controller from '../controllers/SubSkillController.js';

router.route('/')
    .get(controller.getAllSubs)
    .post(controller.createSub)


router.route('/:id')
    .get(controller.getSubById)
    .patch(controller.updateSub)
    .delete(controller.deleteSub);


export default router;