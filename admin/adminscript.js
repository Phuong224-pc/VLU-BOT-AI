/** * FILE: admin/adminscript.js
 * CHỨC NĂNG: Quản lý bảo mật phân quyền Admin và Đọc/Ghi đồng bộ System Prompt
 */

window.vluAdminCore = {
    // 1. Kiểm tra trạng thái đăng nhập và bảo mật phân quyền truy cập
    checkAdminAuth: function() {
        if (typeof firebase === 'undefined') return;

        firebase.auth().onAuthStateChanged((user) => {
            const adminList = ["ngocduyprc2006@gmail.com", "duy.2474802010071@vanlanguni.vn", "trungvt040106@gmail.com", "phuongtruong121204@gmail.com"];

            if (user) {
                if (!adminList.includes(user.email)) {
                    alert("🚫 Cảnh báo: Tài khoản của bạn không có quyền truy cập khu vực Admin!");
                    location.href = "../index.html"; // Đẩy ngược ra trang chủ ở thư mục gốc
                } else {
                    console.log("🔒 Xác thực hệ thống: Chào mừng Admin Võ Ngọc Duy!");
                }
            } else {
                alert("🔒 Khu vực bảo mật! Vui lòng đăng nhập tài khoản Admin trước.");
                location.href = "../index.html";
            }
        });
    },

    // 2. Đồng bộ nạp dữ liệu cũ và ghi nhận thay đổi form System Prompt
    initPromptConfig: function() {
        const keys = ['default', 'roadmap', 'results', 'graduation', 'future'];
        const storedPrompts = JSON.parse(localStorage.getItem('vlu_custom_prompts')) || {};

        const defaultSystemPrompts = {
            'roadmap': "Bạn là chuyên gia tư vấn lộ trình học tập tại VLU. Hãy dựa vào chương trình đào tạo để tư vấn môn học.",
            'results': "Bạn là chuyên gia phân tích kết quả học tập. Hãy giúp sinh viên hiểu về GPA và quy chế VLU.",
            'graduation': "Bạn là cố vấn tốt nghiệp. Tư vấn về điều kiện xét tốt nghiệp và chứng chỉ đầu ra.",
            'future': "Bạn là chuyên gia định hướng nghề nghiệp cho sinh viên VLU.",
            'default': "Bạn là trợ lý ảo của Đại học Văn Lang (VLU). Trả lời thân thiện bằng tiếng Việt."
        };

        // Đổ dữ liệu lên giao diện
        keys.forEach(key => {
            const textarea = document.getElementById(`prompt-${key}`);
            if (textarea) {
                textarea.value = storedPrompts[key] || defaultSystemPrompts[key];
            }
        });

        // Xử lý nộp form lưu dữ liệu mới
        const form = document.getElementById('adminPromptForm');
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                const newPrompts = {};

                keys.forEach(key => {
                    const textarea = document.getElementById(`prompt-${key}`);
                    if (textarea) {
                        newPrompts[key] = textarea.value.trim();
                    }
                });

                localStorage.setItem('vlu_custom_prompts', JSON.stringify(newPrompts));
                alert("🎉 Hệ thống đã cập nhật Prompt chuyên gia thành công! Chatbot sẽ áp dụng cấu hình mới ngay lập tức.");
            };
        }
    }
};

// Khởi chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    window.vluAdminCore.checkAdminAuth();
    window.vluAdminCore.initPromptConfig();
});