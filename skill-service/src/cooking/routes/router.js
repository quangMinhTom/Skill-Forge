import express from 'express';
const router = express.Router();
import * as controller from '../controllers/SkillController.js';
import * as security from '../../middlewares/security.js';

router.route('/is-exist/:id')
    .get(controller.isSkillExist);

router.route('/')
    .get(security.verifyJWT,security.restrictTo("admin","creator"),controller.getAllSkills)
    .post(security.verifyJWT,security.restrictTo("admin","creator"),controller.createSkill)


router.route('/:id')
    .get(controller.getSkillById)
    .patch(controller.updateSkill)
    .delete(controller.deleteSkill);


export default router;