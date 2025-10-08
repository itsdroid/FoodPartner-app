import axios from 'axios'

// Prefer env if set, otherwise default to Render backend URL
const baseURL = 'https://foodpartner-app-backend.onrender.com/'

const api = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 20000,
})

export default api


