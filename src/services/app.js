import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.avisosunpaz.com.ar',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const getAuthToken = () => localStorage.getItem('token')

export const setAuthSession = ({ token, rol }) => {
  if (token) localStorage.setItem('token', token)
  if (rol) localStorage.setItem('rol', rol)
}

export const clearAuthSession = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('rol')
}

api.interceptors.request.use((config) => {
  const token = getAuthToken()

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    }
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      clearAuthSession()

      const currentPath = window.location.pathname
      if (currentPath !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api