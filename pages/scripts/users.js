document.addEventListener('DOMContentLoaded', () => {
    const resultDiv = document.getElementById('result');
    const usersList = document.getElementById('users-list');

    // Fetch users
    async function fetchUsers() {
        const token = localStorage.getItem('jwt');

        if (!token) {
            showResult('You must be logged in to view users.', 'error');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:9000/users/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch users');
            }

            const data = await response.json();
            renderUsers(data.data || []);
            showResult(data.message, 'success');
        } catch (error) {
            showResult(`Error fetching users: ${error.message}`, 'error');
            console.error('Error:', error);
        }
    }

    // Render users in the DOM with click functionality to redirect
    function renderUsers(users) {
        usersList.innerHTML = '';
        if (users.length === 0) {
            usersList.innerHTML = '<p>No users found.</p>';
            return;
        }

        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'col-sm-6 col-md-4 user-card';
            userCard.setAttribute('data-id', user._id);
            userCard.innerHTML = `
        <h3>${user.username}</h3>
        <p>Email: ${user.email}</p>
        <p>ID: ${user._id}</p>
      `;
            // Store user ID in localStorage and redirect to user-detail.html on click
            userCard.addEventListener('click', () => {
                localStorage.setItem('selectedUserId', user._id);
                console.log(`Selected user ID stored: ${user._id}`);
                window.location.href = 'user-detail.html'; // Redirect to detail page
            });
            usersList.appendChild(userCard);
        });
    }

    // Function to display result messages
    function showResult(message, type) {
        resultDiv.textContent = message;
        resultDiv.className = `mt-4 ${type}`;
    }

    // Initial fetch of users
    fetchUsers();
});