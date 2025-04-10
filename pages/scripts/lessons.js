document.addEventListener('DOMContentLoaded', () => {
    const subSkillsList = document.getElementById('sub-skills-list');
    const lessonInfo = document.getElementById('lesson-info');

    // Get subSkillId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const subSkillId = urlParams.get('subSkillId');

    // Get sub-skills from localStorage
    const subSkills = JSON.parse(localStorage.getItem('subSkills'));

    // Check if sub-skills are available
    if (!subSkills || subSkills.length === 0) {
        subSkillsList.innerHTML = '<p class="text-danger">No sub-skills available. Please select a skill first.</p>';
        return;
    }

    // Render sub-skills as clickable cards
    renderSubSkills(subSkills);

    // If subSkillId is provided, fetch and render the lesson immediately
    if (subSkillId) {
        fetchLesson(subSkillId);
    }

    function renderSubSkills(subSkills) {
        subSkillsList.innerHTML = '';
        subSkills.forEach(subSkill => {
            const subSkillCard = document.createElement('div');
            subSkillCard.className = 'col-sm-6 col-md-4 sub-skill-card';
            subSkillCard.innerHTML = `
                <h3>${subSkill.name}</h3>
                <p>${subSkill.description || 'No description available'}</p>
            `;
            subSkillCard.addEventListener('click', () => {
                window.location.href = `lessons.html?subSkillId=${subSkill._id}`;
            });
            subSkillsList.appendChild(subSkillCard);
        });
    }

    // Fetch lesson by subSkillId
    function fetchLesson(subSkillId) {
        fetch(`http://127.0.0.1:9003/api/v1/lessons/?subSkillId=${subSkillId}`, {
            method: 'GET'
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch lesson');
                return response.json();
            })
            .then(lessonData => {
                const lesson = lessonData.data && lessonData.data.length > 0 ? lessonData.data[0] : null;
                renderLesson(lesson);
            })
            .catch(error => {
                console.error('Error fetching lesson:', error);
                lessonInfo.innerHTML = '<p class="text-danger">Unable to load lesson. Please try again later.</p>';
            });
    }

    // Render lesson details
    function renderLesson(lesson) {
        lessonInfo.innerHTML = '';
        if (!lesson) {
            lessonInfo.innerHTML = '<p>No lesson available for this sub-skill.</p>';
            return;
        }

        const stepsList = lesson.content.steps.map(step => `<li>${step}</li>`).join('');
        lessonInfo.innerHTML = `
            <h3>${lesson.title}</h3>
            <p>${lesson.content.introduction}</p>
            <h4>Steps:</h4>
            <ol>${stepsList}</ol>
            <iframe src="${lesson.content.videoUrl}" title="${lesson.title}" allowfullscreen></iframe>
        `;
    }
});