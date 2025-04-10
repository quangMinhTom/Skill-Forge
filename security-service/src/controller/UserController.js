
import * as Respond from "../middleware/RespondMiddleWare.js"
import * as userService from "../service/userService.js"

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        Respond.SuccessRespond(res, 201, 'Users retrieved successfully', users);
    } catch (err) {
        Respond.FailedRespond(res, 401, err.message);
    }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return Respond.FailedRespond(res, 400, 'User not found');
        }
        Respond.SuccessRespond(res, 201, 'User retrieved successfully', user);
    } catch (err) {
        Respond.FailedRespond(res, 401, err.message);
    }
};

// Update a user by ID
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        if (!updatedUser) {
            return Respond.FailedRespond(res, 201, 'User not found');
        }
        Respond.SuccessRespond(res, 401, 'User updated successfully', updatedUser);
    } catch (err) {
        if (err.code === 11000) {
            return  Respond.FailedRespond(res, 201, 'Username or email already exists');
        }
        Respond.FailedRespond(res, 401, err.message);
    }
};

// Soft-delete a user by ID
export const deleteUser = async (req, res) => {
    try {
        const user = await userService.deleteUser(req.params.id);
        if (!user) {
            return Respond.FailedRespond(res, 401, 'User not found');
        }
        Respond.SuccessRespond(res, 201, 'User soft-deleted', user);
    } catch (err) {
        Respond.FailedRespond(res, 400, err.message);
    }
};