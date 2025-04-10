document.addEventListener('DOMContentLoaded', () => {
    const skillInfo = document.getElementById('skill-info');
    const subSkillsList = document.getElementById('sub-skills');
    const skillTitle = document.getElementById('skill-title');

    // Get skill data from localStorage
    const skill = JSON.parse(localStorage.getItem('selectedSkill'));
    const urlParams = new URLSearchParams(window.location.search);
    const skillId = urlParams.get('skillId');

    // Check if skill data and ID are present
    if (!skill || !skillId || skill._id !== skillId) {
        skillInfo.innerHTML = '<p class="text-danger">No skill selected or invalid data.</p>';
        return;
    }

    // Render skill info from localStorage
    renderSkillInfo(skill);

    // Fetch, store, and render sub-skills with token
    fetchSubSkills(skillId);

    // Clean up only 'selectedSkill' from localStorage
    localStorage.removeItem('selectedSkill');

    // Render skill info as plain text
    function renderSkillInfo(skill) {
        skillTitle.textContent = skill.name;
        skillInfo.innerHTML = `
            <h3>${skill.name}</h3>
            <p>${skill.description}</p>
            <div class="date">Created: ${new Date(skill.createdAt).toLocaleDateString()}</div>
        `;
    }

    // Fetch sub-skills and store in localStorage
    function fetchSubSkills(skillId) {
        // Get the JWT token from localStorage
        const token = localStorage.getItem('jwt');

        fetch(`http://127.0.0.1:9000/sub-skills/?skillId=${skillId}`, {
            method: 'GET',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '', // Attach token if it exists
                'Content-Type': 'application/json' // Optional, for clarity
            }
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch sub-skills');
                return response.json();
            })
            .then(subSkillsData => {
                localStorage.setItem('subSkills', JSON.stringify(subSkillsData.data));
                renderSubSkills(JSON.parse(localStorage.getItem('subSkills')));
            })
            .catch(error => {
                console.error('Error fetching sub-skills:', error);
                subSkillsList.innerHTML = '<p class="text-danger">Unable to load sub-skills. Please try again later.</p>';
            });
    }

    // Render sub-skills as clickable cards
    function renderSubSkills(subSkills) {
        subSkillsList.innerHTML = '';
        if (!subSkills || subSkills.length === 0) {
            subSkillsList.innerHTML = '<p>No sub-skills available for this skill.</p>';
            return;
        }
        subSkills.forEach(subSkill => {
            const subSkillCard = document.createElement('div');
            subSkillCard.className = 'col-sm-6 col-md-4 skill-card';
            subSkillCard.innerHTML = `
                <h3>${subSkill.name}</h3>
                <p>${subSkill.description || 'No description available'}</p>
                <div class="date">Created: ${new Date(subSkill.createdAt || Date.now()).toLocaleDateString()}</div>
            `;
            // Add click event to redirect to lessons page with subSkillId
            subSkillCard.addEventListener('click', () => {
                window.location.href = `lessons.html?subSkillId=${subSkill._id}`;
            });
            subSkillsList.appendChild(subSkillCard);
        });
    }
});