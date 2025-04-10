document.addEventListener('DOMContentLoaded', () => {
    const contentBtn = document.getElementById('content-btn');
    const userManagerBtn = document.getElementById('user-manager-btn');
    const resultDiv = document.getElementById('result');

    contentBtn.addEventListener('click', () => {
        window.location.href = 'skills-post.html';
        resultDiv.className = 'mt-4 success';
    });

    userManagerBtn.addEventListener('click', () => {
        window.location.href = 'users.html'; // Redirect to User Manager page
    });
});