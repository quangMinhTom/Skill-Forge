import * as userRepo from '../repository/UserRepo.js';

// Get all users
export const getAllUsers = async () => {
    return await userRepo.getAllUsers();
};

// Get a single user by ID
export const getUserById = (id) => {
   return userRepo.getUserById(id);
};

// Update a user by ID
export const updateUser = (id, updatedUser) => {
    return userRepo.updateUser(id, updatedUser);
};

// Soft-delete a user by ID
export const deleteUser = (id) => {
    return userRepo.deleteUser(id);
};

export const getUserByEmail =  (email) => {
   return userRepo.getUserByEmail(email);
}

export const getUserByProperties = (properties) => {
    return userRepo.getUserByProperties(properties);
}