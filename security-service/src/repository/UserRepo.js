import User from '../model/User.js';

export function getUserByEmail(email) {
   return User.findOne({email});
}

// Get all users
export const getAllUsers = () => {
    return User.find();
};

// Get a single user by ID
export const getUserById = (id) => {
    return User.findById(id);
};

// Update a user by ID
export const updateUser = (id, updatedUser) => {
    return User.findByIdAndUpdate(
        id,
        {
            //this will trigger validator to field in schema that have validator
            $set: updatedUser, // Spread updatedUser into $set
            updatedAt: Date.now(),
        },
        {
            returnDocument: 'after', // Equivalent to new: true
            //findByIdAndUpdate only run validator on modified field against the schema
            // while .save() will validate whole document against its schema
            //Validates only the fields being modified against their schema definitions.
            runValidators: true,
        }
    );
};

// Soft-delete a user by ID
export const deleteUser = (id) => {
    return User.findByIdAndUpdate(
        id,
        {
            $set: { isDeleted: true },
            updatedAt: Date.now(),
        },
        { new: true }
    );
};

export const getUserByProperties = (properties) => {
    return User.findOne({ ...properties });
};