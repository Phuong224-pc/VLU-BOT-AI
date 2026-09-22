/** * FILE: js/features/theme.js
 * CHỨC NĂNG: Module xử lý chuyển đổi giao diện Sáng / Tối (Dark Mode)
 */

window.featureTheme = {
    init: function() {
        const btn = document.getElementById('darkModeBtn');
        if (!btn) return;

        // Tải cấu hình giao diện cũ từ bộ nhớ trình duyệt
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            const icon = btn.querySelector('i');
            if (icon) icon.className = 'fas fa-sun';
        }

        btn.onclick = () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }

            if (window.ui && typeof window.ui.showToast === 'function') {
                window.ui.showToast(isDark ? "🌙 Đã chuyển sang chế độ tối" : "☀️ Đã chuyển sang chế độ sáng");
            }
        };
    }
};