window.vluRegister = {
    init: function() {
        const registerForm = document.getElementById('registerForm');
        const loginTabBtn = document.getElementById('loginTabBtn');
        if (!registerForm) return;

        registerForm.onsubmit = (e) => {
            e.preventDefault();

            try {
                const accountInput = document.getElementById('regEmail').value.trim().toLowerCase();
                const pass = document.getElementById('regPass').value;
                const confirm = document.getElementById('regPassConfirm').value;

                if (!accountInput) { alert("Vui lòng điền tài khoản sinh viên!"); return; }
                if (pass.includes(" ")) { alert("Mật khẩu không được chứa khoảng trắng!"); return; }
                if (pass !== confirm) { alert("Mật khẩu nhập lại không khớp!"); return; }

                // Kiểm tra định dạng cấu trúc chuẩn sinh viên tên.mssv
                const accountRegex = /^[a-z0-9.]+(\.[0-9]+)?$/;
                let finalEmail = accountInput;

                if (!accountInput.includes('@')) {
                    if (!/^[a-z0-9]+\.[0-9]+$/.test(accountInput)) {
                        alert("🚫 Đăng ký thất bại!\nTài khoản sinh viên phải đúng định dạng: tên.mssv\nVí dụ: duy.2474802010071");
                        return;
                    }
                    // Tự động bù đuôi email trường hợp lệ để Firebase Auth chấp nhận
                    finalEmail = `${accountInput}@vanlanguni.vn`;
                }

                firebase.auth().createUserWithEmailAndPassword(finalEmail, pass)
                    .then(() => {
                        alert("Đăng ký tài khoản nội bộ thành công! Mời bạn đăng nhập bằng chính tài khoản vừa tạo.");
                        if (loginTabBtn) loginTabBtn.click();
                        const loginUserInp = document.getElementById('loginUser');
                        if (loginUserInp) loginUserInp.value = accountInput;
                    })
                    .catch((error) => {
                        console.error("Lỗi đăng ký Firebase Auth:", error);
                        alert("Đăng ký thất bại: " + error.message);
                    });

            } catch (err) {
                console.error("Lỗi lấy dữ liệu form đăng ký:", err);
                alert("Hệ thống gặp lỗi cấu trúc form, vui lòng kiểm tra lại các ID trong file HTML.");
            }
        };
    },

    // Tính năng nhúng liên kết cổng đăng ký nhanh bằng tài khoản Microsoft trường
    initMicrosoftRegister: function() {
        const msRegisterBtn = document.getElementById('microsoftRegisterBtn');
        if (!msRegisterBtn) return;

        msRegisterBtn.onclick = async(e) => {
            e.preventDefault();
            const provider = new firebase.auth.OAuthProvider('microsoft.com');

            provider.setCustomParameters({
                prompt: 'select_account',
                tenant: 'common'
            });

            try {
                const result = await firebase.auth().signInWithPopup(provider);
                const user = result.user;
                const email = user.email.toLowerCase();

                // Bộ lọc kiểm soát bảo mật: Chấp nhận cả 2 đuôi mail chính thức của Văn Lang
                if (!email.endsWith('@vanlanguni.vn') && !email.endsWith('@vanlanguni.edu.vn')) {
                    await firebase.auth().signOut();
                    alert("❌ Đăng ký bị từ chối! Hệ thống chỉ chấp nhận tài khoản Microsoft Mail chính thức cấp bởi trường Đại học Văn Lang.");
                    return;
                }

                alert(`Đăng ký và xác thực tài khoản trường thành công:\n${user.email}\nHệ thống sẽ tự động chuyển hướng bạn vào phòng chat.`);

                const authModal = document.getElementById('authModal');
                if (authModal) {
                    authModal.style.display = "none";
                    authModal.classList.remove("show");
                } else {
                    window.location.href = "index.html";
                }

            } catch (error) {
                console.error("Lỗi liên kết cổng Microsoft Register:", error);
                alert("❌ Đăng ký bằng Microsoft thất bại: " + error.message);
            }
        };
    }
};