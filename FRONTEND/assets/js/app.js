const themeButton = document.querySelector('[data-theme-toggle]');
const themeIcon = document.querySelector('[data-theme-icon]');

if (themeButton) {
    themeButton.addEventListener('click', () => {
        const light = document.body.classList.toggle('light-mode');
        themeIcon.textContent = light ? '☾' : '☀';
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#f4f5f7' : '#030b1b');
    });
}

const loginForm = document.querySelector('#loginForm');
if (loginForm) {
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const message = document.querySelector('#formMessage');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        submitButton.disabled = true;
        submitButton.textContent = 'Signing in...';
        window.setTimeout(() => {
            message.hidden = false;
            submitButton.disabled = false;
            submitButton.textContent = 'Sign In';
        }, 450);
    });
}
