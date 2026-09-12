const API_URL = 'http://localhost:3000';

function getAccessToken() { return localStorage.getItem('accessToken'); }
function getRefreshToken() { return localStorage.getItem('refreshToken'); }

function getStoredUser() {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); }
    catch { return null; }
}

function setTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
}

function clearSession() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
}

function logoutAndRedirect() {
    clearSession();
    window.location.href = 'login.html';
}

async function apiLogin(username, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
}

async function refreshTokens() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;
    try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });
        if (!res.ok) return false;
        const data = await res.json();
        setTokens(data.accessToken, data.refreshToken);
        return true;
    } catch {
        return false;
    }
}

async function apiFetch(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    let res = await fetch(`${API_URL}${path}`, { ...options, headers });

    if (res.status === 401 && !options._retried) {
        if (await refreshTokens()) {
            const retryHeaders = { ...headers, Authorization: `Bearer ${getAccessToken()}` };
            res = await fetch(`${API_URL}${path}`, { ...options, _retried: true, headers: retryHeaders });
        } else {
            logoutAndRedirect();
            throw new Error('Session expired. Please sign in again.');
        }
    }
    return res;
}

async function getJson(path) {
    const res = await apiFetch(path);
    if (!res) throw new Error('Session expired. Please sign in again.');
    if (!res.ok) {
        let message = `Request failed (${res.status})`;
        try {
            const data = await res.json();
            if (data.error) message = data.error;
        } catch { /* ignore */ }
        throw new Error(message);
    }
    return res.json();
}