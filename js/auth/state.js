window.vluAuthState = {
    init: function() {
        if (typeof firebase === 'undefined') return;

        const modal = document.getElementById('authModal');
        const guestBtn = document.getElementById('guestBtn');
        const closeBtn = document.querySelector('.close-modal');
        const userDropdown = document.getElementById('userDropdown');

        if (guestBtn) {
            guestBtn.onclick = (e) => {
                e.stopPropagation();
                const currentUser = firebase.auth().currentUser;
                if (currentUser) {
                    if (userDropdown) {
                        userDropdown.style.display = userDropdown.style.display === "none" ? "block" : "none";
                    }
                } else {
                    if (modal) modal.style.display = "block";
                }
            };
        }

        if (closeBtn) {
            closeBtn.onclick = () => {
                if (modal) modal.style.display = "none";
            };
        }

        window.addEventListener('click', (e) => {
            if (modal && e.target === modal) modal.style.display = "none";
            if (userDropdown && guestBtn && !guestBtn.contains(e.target)) {
                userDropdown.style.display = "none";
            }
        });

        function handleAuthSuccess(user) {
            if (modal) modal.style.display = "none";
            if (guestBtn) {
                // --- THUẬT TOÁN TỰ ĐỘNG TÁCH TÊN VÀ ĐỊNH DẠNG CHỮ CÁI ĐẦU ---
                let displayNameToShow = "";

                if (user.displayName) {
                    displayNameToShow = user.displayName;
                } else if (user.email) {
                    let userRawString = user.email.split('@')[0]; // Lấy phần trước @ (ví dụ: "duy.2474802010071")

                    if (userRawString.includes('.')) {
                        // Bóc tách lấy đúng chuỗi kí tự chữ đứng trước dấu chấm (ví dụ: "duy")
                        let firstName = userRawString.split('.')[0];
                        // Tự động viết hoa chữ cái đầu (duy -> Duy)
                        displayNameToShow = firstName.charAt(0).toUpperCase() + firstName.slice(1);
                    } else {
                        // Phương án dự phòng nếu chuỗi không chứa dấu chấm
                        displayNameToShow = userRawString.charAt(0).toUpperCase() + userRawString.slice(1);
                    }
                }

                // Đổ tên đã xử lý đẹp đẽ lên giao diện nút hiển thị của Sidebar
                guestBtn.innerHTML = `<i class="fas fa-user-check"></i> Chào, ${displayNameToShow}`;
                guestBtn.title = "Bấm vào đây để quản lý tài khoản";
            }

            const adminList = ["ngocduyprc2006@gmail.com", "duy.2474802010071@vanlanguni.vn", "trungvt040106@gmail.com", "phuongtruong121204@gmail.com"];
            const adminModule = document.getElementById('adminModule');
            if (user && adminList.includes(user.email)) {
                if (adminModule) adminModule.style.display = 'block';
            } else {
                if (adminModule) adminModule.style.display = 'none';
            }
        }

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                handleAuthSuccess(user);
            }
        });
    }
};