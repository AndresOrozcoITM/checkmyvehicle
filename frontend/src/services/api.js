import axios from 'axios';

// La URL base es relativa porque Nginx se encargará de redirigir a /api/ al backend.
const api = axios.create({
    baseURL: '/api'
});

export default api;