const API_URL = "http://localhost:3000";

const themeButton = document.querySelector('[data-theme-toggle]');
const themeIcon = document.querySelector('[data-theme-icon]');

if (themeButton) {
    themeButton.addEventListener('click', () => {
        const light = document.body.classList.toggle('light-mode');
        themeIcon.textContent = light ? '☾' : '☀';
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#f4f5f7' : '#030b1b');
    });
}

function showMessage(message, isError = false) {
    const el = document.querySelector('#formMessage');
    if (!el) return;
    el.hidden = false;
    el.style.display = 'block';
    el.textContent = message;
    el.classList.toggle('form-message--error', isError);
    el.classList.toggle('form-message', !isError);
}

async function login(username, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error || 'Login failed');
    }
    return data;
}

const loginForm = document.querySelector('#loginForm');
if (loginForm) {
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const usernameInput = loginForm.querySelector('#username');
    const passwordInput = loginForm.querySelector('#password');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        submitButton.disabled = true;
        submitButton.textContent = 'Signing in...';

        try {
            const data = await login(usernameInput.value.trim(), passwordInput.value);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'home.html';
        } catch (err) {
            showMessage(err.message, true);
            submitButton.disabled = false;
            submitButton.textContent = 'Sign in';
        }
    });
}