
const BASE = 'http://localhost:3000';

const headers = (auth = false) => ({
  'Content-Type': 'application/json',
  ...(auth && { Authorization: `Bearer ${localStorage.getItem('token')}` })
})

const handle = async (res) => {
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Something went wrong')
  return data
}

export const register = (body) =>
  fetch(`${BASE}/register`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle)

export const login = (body) =>
  fetch(`${BASE}/login`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle)

export const getTasks = () =>
  fetch(`${BASE}/tasks`, { headers: headers(true) }).then(handle)

export const createTask = (body) =>
  fetch(`${BASE}/tasks`, { method: 'POST', headers: headers(true), body: JSON.stringify(body) }).then(handle)

export const updateTask = (id, body) =>
  fetch(`${BASE}/tasks/${id}`, { method: 'PUT', headers: headers(true), body: JSON.stringify(body) }).then(handle)

export const deleteTask = (id) =>
  fetch(`${BASE}/tasks/${id}`, { method: 'DELETE', headers: headers(true) }).then(handle)

