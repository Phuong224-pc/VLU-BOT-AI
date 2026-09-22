/** * FILE: js/features/reasoning.js
 * CHỨC NĂNG: Kích hoạt mô hình Suy nghĩ logic / Nghiên cứu chuyên sâu từng bước
 */

window.featureReasoning = {
    activate: function(isDeepStudy = false) {
        if (isDeepStudy) {
            window.currentSystemPrompt = "Bạn là chuyên gia nghiên cứu khoa học VLU. Hãy suy nghĩ từng bước chi tiết và đưa ra trích dẫn tài liệu học vụ chính xác.";
            if (window.ui && typeof window.ui.showToast === 'function') {
                window.ui.showToast("🔬 Đã bật chế độ Nghiên cứu chuyên sâu!");
            }
        } else {
            window.currentSystemPrompt = "Hãy phân tích bài toán này bằng cách chia nhỏ các bước lập luận rõ ràng.";
            if (window.ui && typeof window.ui.showToast === 'function') {
                window.ui.showToast("💭 Đã bật chế độ Đang suy nghĩ!");
            }
        }
    }
};