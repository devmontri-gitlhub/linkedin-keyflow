const BASE_URL = 'https://linkedin-keyflow.onrender.com';

export const api = {
  signup: (data) => fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }).then(res => res.json()),

  login: (data) => fetch(`${BASE_URL}/auth/login`, {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }).then(res => res.json()),

  getUsers: () => fetch(`${BASE_URL}/users`).then(res => res.json()),

  deleteUser: (id) => fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE' }).then(res => res.json())
};