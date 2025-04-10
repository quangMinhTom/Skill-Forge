import * as repo from '../repositories/SubSkillRepository.js'
import * as skillService from '../axios/Skill-axios.js'

export const getAllSubs = function (skillId) {
    try {
        return repo.fetchAllSubskills(skillId);
    } catch (err) {
        console.log(err);
    }
};

export const getSubById = function (id) {
    try{
       return repo.fetchSubskillById(id);
    } catch (err) {
        console.log(err);
    }
}

export const createSub = async function (sub, req) {
    try {
        let token = req.headers.authorization;

        // Check if the skill exists
        const isExist = await skillService.getSkillById(sub.skillId,token);

        if (isExist === true) {
            return await repo.createSubskill(sub); // Create subskill if skill exists
        } else {
            throw new Error('Skill does not exist');
        }
    } catch (err) {
        console.error('Error creating subskill:', err.message);
        throw err; // Re-throw to be handled by the caller
    }
};

export const updateSub = function (id,sub) {
    try {
       return repo.updateSubSkill(id,sub);
    } catch (err) {
        console.log(err);
    }
}

export const deleteSub = async function (id) {
    try {
       return await repo.deleteSubSkill(id);
    } catch (err) {
        console.log(err);
    }
}