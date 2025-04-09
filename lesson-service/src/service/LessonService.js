import * as lessonRepo from '../repository/LessonRepository.js';

export const fetchLessons = async (subSkillId) => {
    try {
        if (!subSkillId) {
            throw new Error("subSkillId is required");
        }
        const lessons = await lessonRepo.fetchLessons(subSkillId);
        if (!lessons || lessons.length === 0) {
            throw new Error("No lessons found for this sub-skill");
        }
        return lessons;
    } catch (e) {
        console.error("Error fetching lessons:", e.message);
        throw e; // Propagate error to caller
    }
};

export const fetchLessonById = function (queryObj) {
    try {
        return lessonRepo.fetchLessonById(queryObj);
    } catch (e) {
        console.log(e);
    }
}

export const createLesson = async function (lesson) {
    try {
        return await lessonRepo.createLesson(lesson);
    } catch (e) {
        console.log("Service " + e);
    }
}

export const updateLesson = async function (queryObj, lesson) {
    try {
        return await lessonRepo.updateLesson(queryObj, lesson);
    } catch (e) {
        console.log(e);
    }
}

export const deleteLesson = async function (queryObj) {
    try {
        return await lessonRepo.deleteLesson(queryObj);
    } catch (e) {
        console.log(e);
    }
}