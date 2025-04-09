import Lesson from '../model/Lesson.js';

export const fetchLessons = (subSkillId) => {
    return Lesson.find({ subSkillId });
}
export const fetchLessonById = (id) => {
    return Lesson.findById(id);
}

export const createLesson = (lesson) => {
    return Lesson.create(lesson);
}

export const updateLesson = (id, updateObj) => {
    return Lesson.findByIdAndUpdate(
        id,
        {
            // Patching obj
            $set: updateObj
        },
        {
            returnDocument: 'after',
            runValidators: true,
        }
    );
}

export const deleteLesson = (id) => {
    return Lesson.findByIdAndUpdate(
        id,
        {
            // MongoDB expects an obj
            $set: { isDeleted: true },
        },
        { new: true }
    );
}