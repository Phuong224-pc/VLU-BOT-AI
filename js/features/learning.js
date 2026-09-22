/** * FILE: js/features/learning.js
 * CHỨC NĂNG: Kích hoạt chế độ Trợ lý Giảng viên học tập
 */

window.featureLearning = {
    init: function() {
        window.currentSystemPrompt = "Bạn là giảng viên Đại học Văn Lang. Giải thích kiến thức học thuật dễ hiểu kèm 1-2 câu trắc nghiệm ôn tập.";
        if (window.ui && typeof window.ui.showToast === 'function') {
            window.ui.showToast("📚 Đã bật chế độ Học hỏi!");
        }
    }
};