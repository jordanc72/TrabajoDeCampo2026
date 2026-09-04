// src/services/api.js
import axios from 'axios';

// Instancia de Axios con la URL base de tu backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // Si el backend tarda más de 10 sg corta la petición
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;