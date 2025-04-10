document.addEventListener('DOMContentLoaded', () => {
    if (window.fetchUserExecuted) {
        console.log('fetchUser already executed, skipping...');
        return;
    }
    window.fetchUserExecuted = true;

    console.log('DOMContentLoaded fired, starting user fetch...');

    const userTitle = document.getElementById('user-title');
    const userPhoto = document.getElementById('user-photo');
    const userId = document.getElementById('user-id');
    const userEmail = document.getElementById('user-email');
    const userRole = document.getElementById('user-role');
    const userCreated = document.getElementById('user-created');
    const userUpdated = document.getElementById('user-updated');
    const updateBtn = document.getElementById('update-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const resultDiv = document.getElementById('result');

    const token = localStorage.getItem('jwt');
    const userIdFromStorage = localStorage.getItem('selectedUserId');

    if (!token || !userIdFromStorage) {
        showResult('Missing token or user ID. Please log in and select a user.', 'error');
        return;
    }

    userPhoto.onerror = () => {
        console.log('Photo failed to load, using fallback');
        userPhoto.src = '../images/default.jpg';
        userPhoto.onerror = null;
    };

    let isEditing = false;

    async function fetchUser() {
        try {
            console.log(`Fetching user with ID: ${userIdFromStorage}`);
            const response = await fetch(`http://127.0.0.1:9000/users/${userIdFromStorage}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch user');
            }

            const data = await response.json();
            console.log('User data fetched:', data);
            renderUser(data.data);
            showResult(data.message, 'success');
        } catch (error) {
            showResult(`Error fetching user: ${error.message}`, 'error');
            console.error('Error:', error);
        }
    }

    function renderUser(user) {
        console.log('Rendering user:', user);
        userTitle.textContent = user.username;
        userPhoto.src = `../images/${user.photo}`;
        userId.textContent = user._id;
        userEmail.textContent = user.email;
        userRole.textContent = user.role;
        userCreated.textContent = new Date(user.createdAt).toLocaleString();
        userUpdated.textContent = new Date(user.updatedAt).toLocaleString();
    }

    async function deleteUser() {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`http://127.0.0.1:9000/users/${userIdFromStorage}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete user');
            }

            showResult('User deleted successfully!', 'success');
            setTimeout(() => window.location.href = 'users.html', 1000); // Redirect after 1s
        } catch (error) {
            showResult(`Error deleting user: ${error.message}`, 'error');
            console.error('Error:', error);
        }
    }

    async function updateUser() {
        const updatedUser = {
            username: userTitle.textContent.trim(),
            email: userEmail.textContent.trim(),
            role: userRole.textContent.trim(),
        };

        try {
            const response = await fetch(`http://127.0.0.1:9000/users/${userIdFromStorage}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update user');
            }

            const data = await response.json();
            showResult('User updated successfully!', 'success');
            isEditing = false;
            updateBtn.textContent = 'Update';
            toggleEditable(false);
            renderUser(data.data); // Re-render with updated data
        } catch (error) {
            showResult(`Error updating user: ${error.message}`, 'error');
            console.error('Error:', error);
        }
    }

    function toggleEditable(editable) {
        userTitle.contentEditable = editable;
        userEmail.contentEditable = editable;
        userRole.contentEditable = editable;
    }

    updateBtn.addEventListener('click', () => {
        if (!isEditing) {
            isEditing = true;
            updateBtn.textContent = 'Save';
            toggleEditable(true);
        } else {
            updateUser();
        }
    });

    deleteBtn.addEventListener('click', deleteUser);

    function showResult(message, type) {
        console.log(`Showing result: ${message} (${type})`);
        resultDiv.textContent = message;
        resultDiv.className = `mt-4 ${type}`;
    }

    fetchUser();
});