import * as CommentRepo from '../repository/CommentRepository.js';

export const fetchComments = async (lessonId) => {
    try {
        if (!lessonId) {
            throw new Error("lessonId is required");
        }
        const Comments = await CommentRepo.fetchComments(lessonId);
        if (!Comments || Comments.length === 0) {
            throw new Error("No Comments found for this sub-skill");
        }
        return Comments;
    } catch (e) {
        console.error("Error fetching Comments:", e.message);
        throw e; // Propagate error to caller
    }
};

export const fetchCommentById = function (queryObj) {
    try {
        return CommentRepo.fetchCommentById(queryObj);
    } catch (e) {
        console.log(e);
    }
}

export const createComment = async function (Comment) {
    try {
        return await CommentRepo.createComment(Comment);
    } catch (e) {
        console.log("Service " + e);
    }
}

export const updateComment = async function (queryObj, Comment) {
    try {
        return await CommentRepo.updateComment(queryObj, Comment);
    } catch (e) {
        console.log(e);
    }
}

export const deleteComment = async function (queryObj) {
    try {
        return await CommentRepo.deleteComment(queryObj);
    } catch (e) {
        console.log(e);
    }
}