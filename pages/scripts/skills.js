document.addEventListener('DOMContentLoaded', () => {
    const skillsList = document.getElementById('skills-list');

    // Fetch skills from the API
    fetch('http://127.0.0.1:9001/api/v1/skills/', {
        method: 'GET'
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
                // Store skill data in localStorage
                localStorage.setItem('selectedSkill', JSON.stringify(skill));
                // Redirect to subskills page with skillId
                window.location.href = `subskills.html?skillId=${skill._id}`;
            });
            skillsList.appendChild(skillCard);
        });
    }
});