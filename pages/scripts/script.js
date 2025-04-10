// Toggle between login and signup forms
function toggleForm() {
    const loginForm = document.querySelector('.login');
    const signupForm = document.querySelector('.signup');
    loginForm.classList.toggle('hidden');
    signupForm.classList.toggle('hidden');
}

// Handle Login Form Submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const payload = { email, password };

    try {
        const response = await fetch('http://127.0.0.1:9011/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include' // Keep cookie support
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }
        const data = await response.json();
        console.log('Login successful:', data);

        // Store token in localStorage
        if (data.data && data.data.token) {
            localStorage.setItem('jwt', data.data.token);
            localStorage.setItem('role', data.data.role);
            console.log('Token stored in localStorage:', data.data.token);
        } else {
            console.warn('No token found in response');
        }

        window.location.href = '../Cooking-Master/index1.html'; // Redirect to home page
    } catch (error) {
        console.error('Error:', error);
        alert('Login failed: ' + error.message);
    }
});

// Handle Signup Form Submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const role = document.getElementById('signupRole').value;
    const password = document.getElementById('signupPassword').value;
    const passwordConfirm = document.getElementById('signupPasswordConfirm').value;

    if (password !== passwordConfirm) {
        alert('Passwords do not match!');
        return;
    }

    const payload = { username, email, role, password, passwordConfirm };

    try {
        const response = await fetch('http://127.0.0.1:9011/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include' // Keep cookie support
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Signup failed');
        }
        const data = await response.json();
        console.log('Signup successful:', data);

        // Store token in localStorage
        if (data.data && data.data.token) {
            localStorage.setItem('jwt', data.data.token);
            console.log('Token stored in localStorage:', data.data.token);
        } else {
            console.warn('No token found in response');
        }

        window.location.href = '../Cooking-Master/index1.html'; // Redirect to home page
    } catch (error) {
        console.error('Error:', error);
        alert('Signup failed: ' + error.message);
    }
});