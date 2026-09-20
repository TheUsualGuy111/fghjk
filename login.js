// Khởi tạo tài khoản mặc định và kiểm tra điều hướng
(function initLogin() {
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Nếu chưa có tài khoản admin thì khởi tạo mặc định
    if (!users.some(user => user.username === 'admin')) {
        users.push({ username: 'admin', password: '123456' });
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Nếu đã đăng nhập thì tự động chuyển sang trang Quản lý
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        window.location.href = 'index.html';
    }
})();

// Xử lý sự kiện đăng nhập
function handleLogin(e) {
    e.preventDefault();

    // Lấy chính xác ID từ file login.html của bạn
    const u = document.getElementById('login-username').value.trim();
    const p = document.getElementById('login-password').value.trim();
    const msg = document.getElementById('login-message');

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let validUser = users.find(user => user.username === u && user.password === p);

    if (validUser) {
        localStorage.setItem('currentUser', JSON.stringify(validUser));
        window.location.href = 'index.html';
    } else {
        if (msg) {
            msg.textContent = 'Sai tên đăng nhập hoặc mật khẩu!';
            msg.style.color = 'red';
        } else {
            alert('Sai tên đăng nhập hoặc mật khẩu!');
        }
    }
}