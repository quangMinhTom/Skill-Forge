import axios from 'axios';

const baseURL = 'http://127.0.0.1:9001/api/v1/skills/is-exist/';

// Create an axios instance for reuse
const skillAxios = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Check if a skill exists by ID, setting the token per request
export const getSkillById = async function (id, token) {
    try {
        const response = await skillAxios.get(baseURL + id, {
            headers: {
                'Authorization': `${token}`, // Set header here
            },
        });
        return response.data.exist;
    } catch (err) {
        console.error('Error checking skill existence:', err.message);
        throw err;
    }
};