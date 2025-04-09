import * as lessonService from '../service/LessonService.js';
import * as respond from '../middlewares/RespondMiddleWare.js';

export const getAllLessons = async function (req, res) {
    try {
        const subSkillId = req.params.subSkillId; // Expect subSkillId from route params
        const data = await lessonService.fetchLessons(subSkillId);
        respond.SuceessRespond(res, "success", "get all lessons for sub-skill", data);
    } catch (e) {
        respond.FailedRespond(res, "failed", e);
    }
}

export const getLessonById = async function (req, res) {
    try {
        const data = await lessonService.fetchLessonById(req.params.id);
        respond.SuceessRespond(res, "success", "get lesson by id", data);
    } catch (e) {
        respond.FailedRespond(res, "failed", e);
    }
}

export const createLesson = async function (req, res) {
    try {
        const data = await lessonService.createLesson(req.body);
        console.log("adssadadsadadasdssadasdads"); // Debug log, same as in SkillController
        respond.SuceessRespond(res, "success", "create lesson", data);
    } catch (e) {
        respond.FailedRespond(res, "failed", e);
    }
}

export const updateLesson = async function (req, res) {
    try {
        const data = await lessonService.updateLesson(req.params.id, req.body);
        respond.SuceessRespond(res, "success", "update lesson", data);
    } catch (e) {
        respond.FailedRespond(res, "failed", e);
    }
}

export const deleteLesson = async function (req, res) {
    try {
        const data = await lessonService.deleteLesson(req.params.id);
        respond.SuceessRespond(res, "success", "delete lesson", data);
    } catch (e) {
        respond.FailedRespond(res, "failed", e);
    }
}

export const isLessonExist = async function (req, res) {
    let data = await lessonService.fetchLessonById(req.params.id);

    if (data != null) {
        respond.BooleanRespond(res, "success", Boolean(true));
    } else {
        respond.BooleanRespond(res, "failed", Boolean(false));
    }
}