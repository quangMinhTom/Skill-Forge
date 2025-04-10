document.addEventListener('DOMContentLoaded', () => {
    const lessonTitle = document.getElementById('lesson-title');
    const lessonOverview = document.getElementById('lesson-overview');
    const lessonSteps = document.getElementById('lesson-steps');
    const lessonTips = document.getElementById('lesson-tips');
    const resultDiv = document.getElementById('result');

    const token = localStorage.getItem('jwt');
    const lessonId = localStorage.getItem('selectedLessonId');

    if (!token || !lessonId) {
        showResult('Missing token or lesson ID. Please log in and select a lesson.', 'error');
        return;
    }

    async function fetchLesson() {
        try {
            const response = await fetch(`http://127.0.0.1:9000/lessons/${lessonId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch lesson');
            }

            const data = await response.json();
            renderLesson(data.data);
        } catch (error) {
            showResult(`Error: ${error.message}`, 'error');
            console.error('Error fetching lesson:', error);
        }
    }

    function renderLesson(lesson) {
        lessonTitle.textContent = lesson.title;
        lessonOverview.textContent = lesson.content.overview;

        lessonSteps.innerHTML = '';
        lesson.content.steps.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step.instruction;
            lessonSteps.appendChild(li);
        });

        lessonTips.innerHTML = '';
        lesson.content.tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            lessonTips.appendChild(li);
        });
    }

    function showResult(message, type) {
        resultDiv.textContent = message;
        resultDiv.className = `mt-4 ${type}`;
    }

    fetchLesson();
});