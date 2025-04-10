document.addEventListener('DOMContentLoaded', () => {
    const addLessonForm = document.getElementById('addLessonForm');
    const resultDiv = document.getElementById('result');
    const lessonsList = document.getElementById('lessons-list');
    const subSkillIdInput = document.getElementById('subSkillId');

    // Set subSkillId from localStorage as read-only
    const selectedSubskill = JSON.parse(localStorage.getItem('selectedSubskill'));
    const subSkillId = selectedSubskill ? selectedSubskill._id : null;
    if (subSkillId) {
        subSkillIdInput.value = subSkillId;
    } else {
        showResult('No subskill selected. Please go back and select a subskill.', 'error');
    }

    // Fetch and display lessons for the subskill
    async function fetchLessons() {
        const token = localStorage.getItem('jwt');
        if (!token || !subSkillId) {
            showResult('Missing token or subskill ID. Please log in and select a subskill.', 'error');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:9000/lessons/?subSkillId=${subSkillId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch lessons');
            }

            const data = await response.json();
            renderLessons(data.data || []);
        } catch (error) {
            showResult(`Error fetching lessons: ${error.message}`, 'error');
            console.error('Error:', error);
        }
    }

    // Render lessons with clickable cards
    function renderLessons(lessons) {
        lessonsList.innerHTML = '';
        if (lessons.length === 0) {
            lessonsList.innerHTML = '<p>No lessons found for this subskill.</p>';
            return;
        }

        lessons.forEach(lesson => {
            const lessonCard = document.createElement('div');
            lessonCard.className = 'col-sm-6 col-md-4 lesson-card';
            lessonCard.setAttribute('data-id', lesson._id);
            lessonCard.innerHTML = `
        <h3>${lesson.title}</h3>
        <p>ID: ${lesson._id}</p>
      `;
            lessonCard.addEventListener('click', () => {
                localStorage.setItem('selectedLessonId', lesson._id);
                window.location.href = `lesson-detail.html`;
            });
            lessonsList.appendChild(lessonCard);
        });
    }

    // Handle form submission to add a lesson
    addLessonForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('lessonTitle').value.trim();
        const overview = document.getElementById('lessonOverview').value.trim();
        const stepsInput = document.getElementById('lessonSteps').value.trim();
        const tipsInput = document.getElementById('lessonTips').value.trim();
        const token = localStorage.getItem('jwt');

        if (!title || !overview || !stepsInput) {
            showResult('Please fill in all required fields (title, overview, steps)', 'error');
            return;
        }
        if (!token) {
            showResult('You must be logged in to add a lesson', 'error');
            return;
        }
        if (!subSkillId) {
            showResult('No subskill selected.', 'error');
            return;
        }

        const steps = stepsInput.split('\n').map((line, index) => ({
            stepNumber: index + 1,
            instruction: line.trim(),
        })).filter(step => step.instruction);
        const tips = tipsInput ? tipsInput.split('\n').map(line => line.trim()).filter(tip => tip) : [];

        const payload = {
            title,
            subSkillId,
            content: {
                overview,
                steps,
                tips,
            },
        };

        try {
            const response = await fetch('http://127.0.0.1:9000/lessons', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add lesson');
            }

            showResult('Lesson added successfully!', 'success');
            document.getElementById('lessonTitle').value = '';
            document.getElementById('lessonOverview').value = '';
            document.getElementById('lessonSteps').value = '';
            document.getElementById('lessonTips').value = '';
            fetchLessons();
        } catch (error) {
            showResult(`Error: ${error.message}`, 'error');
            console.error('Error adding lesson:', error);
        }
    });

    function showResult(message, type) {
        resultDiv.textContent = message;
        resultDiv.className = `mt-4 ${type}`;
    }

    fetchLessons();
});