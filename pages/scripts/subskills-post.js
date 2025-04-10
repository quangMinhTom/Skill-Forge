document.addEventListener('DOMContentLoaded', () => {
    const addSubskillForm = document.getElementById('addSubskillForm');
    const resultDiv = document.getElementById('result');
    const subskillsList = document.getElementById('subskills-list');

    // Fetch and display subskills
    async function fetchSubskills() {
        const token = localStorage.getItem('jwt');
        const selectedSkill = JSON.parse(localStorage.getItem('selectedSkill'));
        const skillId = selectedSkill ? selectedSkill._id : null;

        if (!token || !skillId) {
            showResult('Missing token or skill ID. Please log in and select a skill.', 'error');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:9000/sub-skills/?skillId=${skillId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch subskills');
            }

            const data = await response.json();
            renderSubskills(data.data || []); // Assuming response has "data" array
        } catch (error) {
            showResult(`Error fetching subskills: ${error.message}`, 'error');
            console.error('Error:', error);
        }
    }

    // Render subskills in the DOM with click functionality
    function renderSubskills(subskills) {
        subskillsList.innerHTML = '';
        if (subskills.length === 0) {
            subskillsList.innerHTML = '<p>No subskills found for this skill.</p>';
            return;
        }

        subskills.forEach(subskill => {
            const subskillCard = document.createElement('div');
            subskillCard.className = 'col-sm-6 col-md-4 subskill-card';
            subskillCard.setAttribute('data-id', subskill._id); // Store ID for reference
            subskillCard.innerHTML = `
        <h3>${subskill.name}</h3>
        <p>ID: ${subskill._id}</p>
      `;
            // Add click event to redirect to lessons.html
            subskillCard.addEventListener('click', () => {
                localStorage.setItem('selectedSubskill', JSON.stringify(subskill));
                window.location.href = `lessons-post.html?subSkillId=${subskill._id}`;
            });
            subskillsList.appendChild(subskillCard);
        });
    }

    // Handle form submission to add a subskill
    addSubskillForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const subskillName = document.getElementById('subskillName').value.trim();
        const token = localStorage.getItem('jwt');
        const selectedSkill = JSON.parse(localStorage.getItem('selectedSkill'));
        const skillId = selectedSkill ? selectedSkill._id : null;

        if (!subskillName) {
            showResult('Please enter a subskill name', 'error');
            return;
        }
        if (!token) {
            showResult('You must be logged in to add a subskill', 'error');
            return;
        }
        if (!skillId) {
            showResult('No skill selected. Please go back and select a skill.', 'error');
            return;
        }

        const payload = {
            name: subskillName,
            skillId: skillId, // e.g., "67d530563fcb1162e25a7b04"
        };

        try {
            const response = await fetch('http://127.0.0.1:9000/sub-skills/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add subskill');
            }

            const data = await response.json();
            showResult('Subskill added successfully!', 'success');
            document.getElementById('subskillName').value = ''; // Clear input
            fetchSubskills(); // Refresh the subskills list
        } catch (error) {
            showResult(`Error: ${error.message}`, 'error');
            console.error('Error adding subskill:', error);
        }
    });

    // Function to display result messages
    function showResult(message, type) {
        resultDiv.textContent = message;
        resultDiv.className = `mt-4 ${type}`;
    }

    // Initial fetch of subskills
    fetchSubskills();
});