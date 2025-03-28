import * as skillrepo from '../repositories/SkillRepository.js';

export const fetchSkills = () => {
    try{
        return skillrepo.fetchSkills();
    } catch(e) {
        console.log(e);
    }
}

export const fetchSkillsById = function (queryObj){
    try{
        return skillrepo.fetchSkillById(queryObj);

    } catch(e) {
        console.log(e);
    }
}

export const createSkill = async function (skill){
   try{
       return await skillrepo.createSkill(skill);
   } catch(e) {
       console.log( "Service " + e);
   }
}

export const updateSkill = async function (queryObj, skill){
    try{
        return await skillrepo.updateSkill(queryObj, skill);
    } catch(e) {
        console.log(e);
    }
}

export const deleteSkill = async function (queryObj){
    try{
       return await skillrepo.deleteSkill(queryObj);
    }catch(e) {
        console.log(e);
    }
}