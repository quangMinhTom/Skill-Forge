document.addEventListener('DOMContentLoaded', () => {
    const skillsList = document.getElementById('skills-list');
    const addSkillForm = document.getElementById('addSkillForm');
    const token = localStorage.getItem('jwt');

    // Fetch skills from the API
    function fetchSkills() {
        fetch('http://127.0.0.1:9000/skills/', {
            method: 'GET',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
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
    }

    // Function to render skills dynamically
    function renderSkills(skills) {
        skillsList.innerHTML = '';
        skills.forEach(skill => {
            const skillCard = document.createElement('div');
            skillCard.className = 'col-sm-6 col-md-4 skill-card';
            skillCard.setAttribute('data-id', skill._id);
            skillCard.innerHTML = `
        <h3>${skill.name}</h3>
        <p>${skill.description || 'A skill to master.'}</p>
        <div class="date">Created: ${new Date(skill.createdAt).toLocaleDateString()}</div>
      `;
            skillCard.addEventListener('click', () => {
                localStorage.setItem('selectedSkill', JSON.stringify(skill));
                window.location.href = `subskills-post.html?skillId=${skill._id}`;
            });
            skillsList.appendChild(skillCard);
        });
    }

    // Handle form submission to add a skill
    addSkillForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const skillName = document.getElementById('skillName').value.trim();

        if (!skillName) {
            alert('Please enter a skill name');
            return;
        }

        fetch('http://127.0.0.1:9000/skills/', {
            method: 'POST',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: skillName })
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to add skill');
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    document.getElementById('skillName').value = ''; // Clear input
                    fetchSkills(); // Refresh skills list
                } else {
                    throw new Error('Invalid API response');
                }
            })
            .catch(error => {
                console.error('Error adding skill:', error);
                alert('Failed to add skill: ' + error.message);
            });
    });

    // Initial fetch of skills
    fetchSkills();
});