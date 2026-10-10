import { getToken } from './token.js'

const configuredApiUrl = import.meta.env.VITE_API_URL
const defaultApiUrl = import.meta.env.DEV
  ? 'http://localhost:3000'
  : 'https://trackflow-solution.onrender.com'

const API_BASE_URL = (configuredApiUrl || defaultApiUrl).replace(/\/+$/, '')

export const apiUrl = (path) => `${API_BASE_URL}${path}`

// Drop-in replacement for fetch that automatically adds the Authorization header
export const authFetch = (path, options = {}) => {
  const token = getToken()
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
  return fetch(apiUrl(path), { ...options, headers })
}
