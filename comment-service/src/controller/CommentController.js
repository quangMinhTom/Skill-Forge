import * as CommentService from '../service/CommentService.js';
import * as respond from '../middlewares/RespondMiddleWare.js';

export const getAllComments = async function (req, res) {
    try {
        const lessonId = req.query.lessonId; // Expect subSkillId from route params
        const data = await CommentService.fetchComments(lessonId);
        respond.SuceessRespond(res, "success", "get all Comments for sub-skill", data);
    } catch (e) {
        respond.FailedRespond(res, "failed", e);
    }
}

export const getCommentById = async function (req, res) {
    try {
        const data = await CommentService.fetchCommentById(req.params.id);
        respond.SuceessRespond(res, "success", "get Comment by id", data);
    } catch (e) {
        respond.FailedRespond(res, "failed", e);
    }
}

export const createComment = async function (req, res) {
    try {
        const data = await CommentService.createComment(req.body);
        console.log("adssadadsadadasdssadasdads"); // Debug log, same as in SkillController
        respond.SuceessRespond(res, "success", "create Comment", data);
    } catch (e) {
        respond.FailedRespond(res, "failed", e);
    }
}

export const updateComment = async function (req, res) {
    try {
        const data = await CommentService.updateComment(req.params.id, req.body);
        respond.SuceessRespond(res, "success", "update Comment", data);
    } catch (e) {
        respond.FailedRespond(res, "failed", e);
    }
}

export const deleteComment = async function (req, res) {
    try {
        const data = await CommentService.deleteComment(req.params.id);
        respond.SuceessRespond(res, "success", "delete Comment", data);
    } catch (e) {
        respond.FailedRespond(res, "failed", e);
    }
}

export const isCommentExist = async function (req, res) {
    let data = await CommentService.fetchCommentById(req.params.id);

    if (data != null) {
        respond.BooleanRespond(res, "success", Boolean(true));
    } else {
        respond.BooleanRespond(res, "failed", Boolean(false));
    }
}