import axios from 'axios';

const baseURL = 'http://127.0.0.1:9001/api/v1/skill/is-exist/';

//create instance for re-use
const skillAxios = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const getSkillById = async function(id) {
   let response = await skillAxios.get(baseURL + id);
   return response.data.exist;
}