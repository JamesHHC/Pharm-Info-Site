// Config
import config from '../config.js';
const serverIp = config.server_ip;
const serverPort = config.server_port;

// Auth API
const API = `http://${serverIp}:${serverPort}/auth`;

// Get new token
export async function login(username, password) {
	const res = await fetch(`${API}/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ username, password }),
	});
	const data = await res.json();
	if (res.ok) localStorage.setItem('token', data.token);
	return data;
}

// Create new user in db
export async function register(username, password) {
	const res = await fetch(`${API}/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, password }),
	});
	return res.json();
}

// Get user info for current token
export async function fetchUser() {
	const token = localStorage.getItem('token');
	const res = await fetch(`${API}/me`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.ok ? await res.json() : null;
}

// Refresh access token
export async function refreshToken() {
	const res = await fetch(`${API}/refresh`, {
		method: 'POST',
		credentials: 'include',
	});
	const data = await res.json();
	if (res.ok) localStorage.setItem('token', data.token);
	return res.ok;
}

// Remove current token
export function logout() {
	localStorage.removeItem('token');
}