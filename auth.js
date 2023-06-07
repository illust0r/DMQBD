const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const registerUsername = document.getElementById('register-username');
const registerPassword = document.getElementById('register-password');
const loginUsername = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = registerUsername.value.trim();
    const password = registerPassword.value.trim();

    if (!username || !password) {
        alert('请输入有效的用户名和密码');
        return;
    }

    const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        alert('注册成功！请登录。');
    } else {
        alert('注册失败，请重试。');
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    if (!username || !password) {
        alert('请输入有效的用户名和密码');
        return;
    }

    const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        alert('登录成功！');
        // 在这里添加重定向到主页面的代码
        // window.location.href = '/main.html'; // 假设您的主页面文件名为 main.html
    } else {
        alert('登录失败，请检查您的用户名和密码。');
    }
});
