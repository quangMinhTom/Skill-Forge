import Comment from '../model/Comment.js';

export const fetchComments = (lessonId) => {
    return Comment.find({ lessonId });
}
export const fetchCommentById = (id) => {
    return Comment.findById(id);
}

export const createComment = (Comment) => {
    return Comment.create(Comment);
}

export const updateComment = (id, updateObj) => {
    return Comment.findByIdAndUpdate(
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

export const deleteComment = (id) => {
    return Comment.findByIdAndUpdate(
        id,
        {
            // MongoDB expects an obj
            $set: { isDeleted: true },
        },
        { new: true }
    );
}