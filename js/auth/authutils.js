/** * FILE: js/auth/authutils.js
 * CHỨC NĂNG: Xử lý nút bấm Đăng xuất tài khoản hệ thống
 */

window.vluAuthUtils = {
    init: function() {
        const logoutBtn = document.getElementById('logoutBtn');
        const guestBtn = document.getElementById('guestBtn');
        const userDropdown = document.getElementById('userDropdown');
        const adminModule = document.getElementById('adminModule');

        if (logoutBtn) {
            logoutBtn.onclick = () => {
                firebase.auth().signOut().then(() => {
                    alert("Đã đăng xuất thành công!");
                    if (userDropdown) userDropdown.style.display = "none";
                    if (guestBtn) {
                        guestBtn.innerHTML = `<i class="fas fa-user-circle"></i> Đăng nhập`;
                        guestBtn.style.background = "";
                    }
                    if (adminModule) adminModule.style.display = 'none';

                    const welcomeScreen = document.getElementById('welcomeScreen');
                    const container = document.getElementById('messagesContainer');
                    if (container) container.innerHTML = '';
                    if (welcomeScreen) welcomeScreen.classList.remove('hidden');
                    window.currentChatId = null;
                    window.currentSystemPrompt = window.featurePrompts['default'];

                }).catch((error) => {
                    console.error("Lỗi đăng xuất:", error);
                });
            };
        }
    }
};