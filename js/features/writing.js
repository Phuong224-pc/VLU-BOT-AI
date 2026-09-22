/** * FILE: js/features/writing.js
 * CHỨC NĂNG: Kích hoạt chế độ Soạn thảo văn bản hành chính, tiểu luận môn học
 */

window.featureWriting = {
    init: function() {
        window.currentSystemPrompt = "Bạn là chuyên gia soạn thảo văn bản hành chính. Giúp tối ưu hóa văn phong email, báo cáo thực tập trang trọng, lịch sự.";
        if (window.ui && typeof window.ui.showToast === 'function') {
            window.ui.showToast("✍️ Đã bật chế độ Soạn thảo văn bản!");
        }
    }
};