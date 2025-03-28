import Skill from '../models/Skill.js';

export const fetchSkills = () => {
    return Skill.find();
}

export const fetchSkillById = (id) => {
   return Skill.findById(id);
}

export const createSkill = (skill) => {
    return Skill.create(skill);
}

export const updateSkill = (id,updateObj) => {
    return Skill.findByIdAndUpdate(
        id,
        {
            //patching obj
            $set: updateObj
        },
        {
            returnDocument: 'after',
            runValidators: true,
        }

    );
}

export const deleteSkill = (id) => {
      return Skill.findByIdAndUpdate(
        id,
        {//MongoDB expect an obj
            $set: {isDeleted: true},
        },{ new: true },
      );
}