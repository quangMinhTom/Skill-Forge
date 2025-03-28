import * as repo from '../repositories/SubSkillRepository.js'
import * as skillService from '../axios/Skill-axios.js'

export const getAllSubs = function () {
    try{
       return repo.fetchAllSubskills();
    }catch (err){
        console.log(err);
    }
}

export const getSubById = function (id) {
    try{
       return repo.fetchSubskillById(id);
    } catch (err) {
        console.log(err);
    }
}

export const createSub = async function (sub) {
    try{
       let isExist = await skillService.getSkillById(sub.skillId);

        if(isExist === true)
            return repo.createSubskill(sub);
    } catch (err) {
        console.log(err);

    }
}

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