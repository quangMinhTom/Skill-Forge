document.addEventListener('DOMContentLoaded', () => {
    const skillsList = document.getElementById('skills-list');

    // Get the JWT token from localStorage
    const token = localStorage.getItem('jwt');

    // Fetch skills from the API with token in Authorization header
    fetch('http://127.0.0.1:9000/skills/', {
        method: 'GET',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '', // Attach token if it exists
            'Content-Type': 'application/json' // Optional, for clarity
        }
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch skills');
            return response.json();
        })
        .then(data => {
            if (data.status === 'success' && Array.isArray(data.data)) {
                renderSkills(data.data);
            } else {
                throw new Error('Invalid API response');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            skillsList.innerHTML = '<p class="text-danger">Unable to load skills. Please try again later.</p>';
        });

    // Function to render skills dynamically
    function renderSkills(skills) {
        skillsList.innerHTML = '';
        skills.forEach(skill => {
            const skillCard = document.createElement('div');
            skillCard.className = 'col-sm-6 col-md-4 skill-card';
            skillCard.setAttribute('data-id', skill._id);
            skillCard.innerHTML = `
                <h3>${skill.name}</h3>
                <p>${skill.description}</p>
                <div class="date">Created: ${new Date(skill.createdAt).toLocaleDateString()}</div>
            `;
            skillCard.addEventListener('click', () => {
                localStorage.setItem('selectedSkill', JSON.stringify(skill));
                window.location.href = `subskills.html?skillId=${skill._id}`;
            });
            skillsList.appendChild(skillCard);
        });
    }
});