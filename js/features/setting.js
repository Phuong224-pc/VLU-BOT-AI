/** * FILE: js/features/setting.js
 * CHỨC NĂNG: Khởi tạo bảng Cài đặt hệ thống nâng cao cho người dùng
 */

window.featureSetting = {
    init: function() {
        const settingBtn = document.getElementById('headerSettingBtn');
        if (!settingBtn) return;

        settingBtn.onclick = (e) => {
            e.preventDefault();
            if (window.ui && typeof window.ui.showToast === 'function') {
                window.ui.showToast("⚙️ Chức năng cấu hình cài đặt đang được tối ưu hóa!");
            } else {
                alert("⚙️ Chức năng cấu hình cài đặt đang được tối ưu hóa!");
            }
        };
    }
};