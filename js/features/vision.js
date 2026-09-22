/** * FILE: js/features/vision.js
 * CHỨC NĂNG: Module xử lý ảnh, nén ảnh chất lượng cao chống tràn bộ nhớ token
 */

window.featureVision = {
    // Nhận hàm nén ảnh từ chat.js bốc sang để quản lý tách biệt
    compressImage: async function(base64Str, maxWidth = 1300) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = (maxWidth / width) * height;
                    width = maxWidth;
                }
                canvas.width = Math.round(width);
                canvas.height = Math.round(height);
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.82));
            };
        });
    },

    // Hàm kích hoạt nhanh giao diện khi người dùng bấm trực tiếp nút đính kèm ảnh
    init: function() {
        console.log("📸 Module Vision AI: Khởi chạy chế độ đính kèm hình ảnh");
        const fileInput = document.getElementById('fileUploadInput'); // Thường gán ở file upload.js
        if (fileInput) fileInput.click();
    }
};