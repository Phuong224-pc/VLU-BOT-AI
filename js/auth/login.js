window.vluLogin = {
    initTabs: function() {
        const loginTabBtn = document.getElementById('loginTabBtn');
        const registerTabBtn = document.getElementById('registerTabBtn');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginTabBtn && registerTabBtn && loginForm && registerForm) {
            loginTabBtn.onclick = () => {
                registerTabBtn.classList.remove('active');
                loginTabBtn.classList.add('active');
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
            };
            registerTabBtn.onclick = () => {
                loginTabBtn.classList.remove('active');
                registerTabBtn.classList.add('active');
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
            };
        }
    },

    initLoginFormSubmit: function() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;

        loginForm.onsubmit = (e) => {
            e.preventDefault();

            try {
                const userInput = document.getElementById('loginUser').value.trim().toLowerCase();
                const passInput = document.getElementById('loginPass').value;

                if (!userInput || !passInput) {
                    alert("Vui lòng điền đầy đủ tài khoản và mật khẩu!");
                    return;
                }

                let finalEmail = userInput;
                // Nếu người dùng chỉ gõ mỗi tên.mssv thì tự động đính đuôi để xác thực với Firebase
                if (!userInput.includes('@')) {
                    if (!/^[a-z0-9]+\.[0-9]+$/.test(userInput)) {
                        alert("🚫 Đăng nhập thất bại!\nTài khoản đăng nhập phải đúng định dạng sinh viên: tên.mssv\nVí dụ: duy.2474802010071");
                        return;
                    }
                    finalEmail = `${userInput}@vanlanguni.vn`;
                }

                firebase.auth().signInWithEmailAndPassword(finalEmail, passInput)
                    .then((userCredential) => {
                        console.log("Đăng nhập thành công hệ thống nội bộ VLU:", userCredential.user.email);
                        const authModal = document.getElementById('authModal');
                        if (authModal) {
                            authModal.style.display = "none";
                            authModal.classList.remove("show");
                        } else {
                            window.location.href = "index.html";
                        }
                    })
                    .catch((error) => {
                        console.error("Lỗi đăng nhập Firebase:", error);
                        alert("Sai tài khoản hoặc mật khẩu, vui lòng kiểm tra lại!");
                    });

            } catch (err) {
                console.error("Lỗi xử lý đăng nhập:", err);
                alert("Hệ thống gặp lỗi cấu trúc form đăng nhập.");
            }
        };
    },

    // THÊM VÀO ĐÂY: Hàm xử lý gửi Link reset khôi phục mật khẩu thông qua email trường
    initForgotPassword: function() {
        const forgotLink = document.getElementById('forgotPasswordLink');
        if (!forgotLink) return;

        forgotLink.onclick = (e) => {
            e.preventDefault();

            const userInput = document.getElementById('loginUser').value.trim().toLowerCase();

            // Yêu cầu sinh viên điền tài khoản sinh viên trước để hệ thống biết gửi mail cho ai
            if (!userInput) {
                alert("Vui lòng nhập tài khoản định dạng (tên.mssv) vào ô Đăng nhập trước khi bấm Quên mật khẩu!");
                document.getElementById('loginUser').focus();
                return;
            }

            let finalEmail = userInput;
            if (!userInput.includes('@')) {
                if (!/^[a-z0-9]+\.[0-9]+$/.test(userInput)) {
                    alert("Tài khoản sinh viên không đúng định dạng tên.mssv để hệ thống gửi mail khôi phục!");
                    return;
                }
                finalEmail = `${userInput}@vanlanguni.vn`;
            }

            const confirmSend = confirm(`Hệ thống sẽ gửi một liên kết đặt lại mật khẩu đến Email trường của bạn:\n${finalEmail}\n\nBạn có muốn tiếp tục không?`);
            if (!confirmSend) return;

            firebase.auth().sendPasswordResetEmail(finalEmail)
                .then(() => {
                    alert(`🎉 Gửi thành công!\nHệ thống đã gửi một email chứa liên kết đặt lại mật khẩu. Vui lòng kiểm tra hộp thư Outlook (hoặc kiểm tra mục Spam/Thư rác nếu không thấy) của email: ${finalEmail} để đặt lại mật khẩu mới.`);
                })
                .catch((error) => {
                    console.error("Lỗi gửi mail reset mật khẩu:", error);
                    alert("Không thể gửi email khôi phục. Vui lòng kiểm tra lại sự tồn tại của tài khoản sinh viên này trên cơ sở dữ liệu!");
                });
        };
    },

    initMicrosoftAuth: function() {
        const msBtn = document.getElementById('microsoftLoginBtn');
        if (!msBtn) return;

        msBtn.onclick = async(e) => {
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

                if (!email.endsWith('@vanlanguni.vn') && !email.endsWith('@vanlanguni.edu.vn')) {
                    await firebase.auth().signOut();
                    alert("❌ Truy cập bị từ chối! Hệ thống chỉ cho phép tài khoản Microsoft Mail trường Văn Lang đăng nhập.");
                    return;
                }

                console.log("Đăng nhập thành công bằng Microsoft:", user.email);

                const authModal = document.getElementById('authModal');
                if (authModal) {
                    authModal.style.display = "none";
                    authModal.classList.remove("show");
                } else {
                    window.location.href = "index.html";
                }

            } catch (error) {
                console.error("Lỗi xác thực Microsoft:", error);
                alert("❌ Đăng nhập bằng Microsoft thất bại: " + error.message);
            }
        };
    }
};