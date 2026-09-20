let editingBookId = null;

// Hàm Đăng xuất (Được đưa lên đầu hoặc đảm bảo có sẵn toàn cục)
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Kiểm tra quyền và tải dữ liệu khi mở trang
(function initApp() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Bảo vệ tuyến đường: Chưa đăng nhập sẽ bị đẩy sang login.html
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Đợi DOM tải xong để đảm bảo các element tồn tại trước khi thao tác
    document.addEventListener("DOMContentLoaded", () => {
        const userDisplay = document.getElementById('user-display');
        if (userDisplay) {
            userDisplay.innerText = currentUser.username;
        }

        // Gắn sự kiện submit cho Form (nếu có) thay vì viết trực tiếp ở HTML
        const bookForm = document.getElementById('book-form'); // Hãy đảm bảo form của bạn có id này
        if (bookForm) {
            bookForm.addEventListener('submit', handleSaveBook);
        }

        // Tự động gắn sự kiện click cho nút logout để tránh lỗi HTML không tìm thấy hàm
        const logoutBtn = document.getElementById('logout-btn'); // Thêm ID này vào nút đăng xuất ở HTML nếu chưa có
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }

        renderBooks();
    });
})();

// Hiển thị bảng danh sách sách
function renderBooks() {
    const bookList = document.getElementById('book-list');
    if (!bookList) return;

    let books = JSON.parse(localStorage.getItem('books')) || [];

    bookList.innerHTML = '';

    if (books.length === 0) {
        bookList.innerHTML = '<tr><td colspan="6" style="text-align:center;">Chưa có sách nào.</td></tr>';
        return;
    }

    books.forEach((book, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><b>${book.code || ''}</b></td>
            <td>${book.title || ''}</td>
            <td>${book.author || ''}</td>
            <td>${book.year || ''}</td>
            <td style="text-align: center;">
                <button type="button" class="btn-edit" onclick="editBook(${book.id})">Sửa</button>
                <button type="button" class="btn-delete" onclick="deleteBook(${book.id})">Xóa</button>
            </td>
        `;
        bookList.appendChild(tr);
    });
}

// Thêm mới hoặc Cập nhật sách
function handleSaveBook(e) {
    if (e) e.preventDefault();
    const codeInput = document.getElementById('book-code');
    const titleInput = document.getElementById('book-title');
    const authorInput = document.getElementById('book-author');
    const yearInput = document.getElementById('book-year');
    const submitBtn = document.getElementById('submit-btn');

    let books = JSON.parse(localStorage.getItem('books')) || [];

    if (editingBookId !== null) {
        // Cập nhật thông tin sách
        books = books.map(book => {
            if (book.id === editingBookId) {
                return {
                    ...book,
                    code: codeInput.value.trim(),
                    title: titleInput.value.trim(),
                    author: authorInput.value.trim(),
                    year: yearInput.value.trim()
                };
            }
            return book;
        });
        editingBookId = null;
        if (submitBtn) submitBtn.innerText = 'Thêm sách';
    } else {
        // Thêm sách mới
        books.push({
            id: Date.now(),
            code: codeInput.value.trim(),
            title: titleInput.value.trim(),
            author: authorInput.value.trim(),
            year: yearInput.value.trim()
        });
    }

    localStorage.setItem('books', JSON.stringify(books));

    // Reset form nhập liệu
    resetFormInputs();

    renderBooks();
}

// Đưa dữ liệu lên ô nhập để Sửa
function editBook(id) {
    let books = JSON.parse(localStorage.getItem('books')) || [];
    let book = books.find(b => b.id === id);

    if (book) {
        document.getElementById('book-code').value = book.code || '';
        document.getElementById('book-title').value = book.title || '';
        document.getElementById('book-author').value = book.author || '';
        document.getElementById('book-year').value = book.year || '';

        editingBookId = id;
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) submitBtn.innerText = 'Cập nhật';
    }
}

// Xóa sách
function deleteBook(id) {
    if (confirm('Bạn có chắc chắn muốn xóa sách này?')) {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        books = books.filter(book => book.id !== id);
        localStorage.setItem('books', JSON.stringify(books));

        if (editingBookId === id) {
            editingBookId = null;
            resetFormInputs();
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) submitBtn.innerText = 'Thêm sách';
        }

        renderBooks();
    }
}

// Hàm hỗ trợ xóa trắng các ô nhập
function resetFormInputs() {
    if (document.getElementById('book-code')) document.getElementById('book-code').value = '';
    if (document.getElementById('book-title')) document.getElementById('book-title').value = '';
    if (document.getElementById('book-author')) document.getElementById('book-author').value = '';
    if (document.getElementById('book-year')) document.getElementById('book-year').value = '';
}