import axios from 'axios'

// Base API URL: prefer VITE_API_URL but fallback to localhost
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5050').replace(/\/+$/, '')

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
})

// Attach JWT token (if present) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Export the instance
export default api
