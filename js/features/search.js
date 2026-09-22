/** * FILE: js/features/search.js
 * CHỨC NĂNG: Kích hoạt chế độ Tìm kiếm trên mạng thời gian thực
 */

window.featureSearch = {
    init: function() {
        window.currentSystemPrompt = "Bạn là trợ lý VLU có khả năng truy cập Internet để tìm thông tin thời gian thực. Hãy tổng hợp dữ liệu chuẩn xác nhất.";
        if (window.ui && typeof window.ui.showToast === 'function') {
            window.ui.showToast("🌐 Đã kích hoạt Tìm kiếm trên mạng!");
        }
    }
};