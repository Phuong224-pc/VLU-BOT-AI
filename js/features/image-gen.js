/** * FILE: js/features/image-gen.js
 * CHỨC NĂNG: Kích hoạt chế độ Tạo hình ảnh AI
 */

window.featureImageGen = {
    init: function() {
        const input = document.getElementById('userInput');
        if (input) {
            input.value = "/imagine ";
            input.focus();
        }
        if (window.ui && typeof window.ui.showToast === 'function') {
            window.ui.showToast("🎨 Đã bật chế độ vẽ ảnh! Hãy nhập mô tả bằng tiếng Anh.");
        }
    }
};