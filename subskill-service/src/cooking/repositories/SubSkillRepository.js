import subSkill from '../models/SubSkill.js';

export const fetchAllSubskills = function (skillId) {
    return subSkill.find({ skillId });
};
export const fetchSubskillById =  function (id) {
    return subSkill.findById(id);
}

export const createSubskill = function (subskill) {
    return subSkill.create(subskill);
}

export const updateSubSkill = function (id, subskill) {
    return subSkill.findByIdAndUpdate(
        id,
        {
            $set: subskill
        },
        {
            returnDocument: 'after',
            runValidators: true,
        }
    );
}

export const deleteSubSkill = (id) => {
    try{
        return subSkill.findByIdAndUpdate(
            id,
            { $set: { isDeleted: true } },
            { new: true } // Ensure updated document is returned
        );
    }catch(err){
        console.log(err);
    }
};
