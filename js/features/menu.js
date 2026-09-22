/** * FILE: js/features/menu.js
 * CHỨC NĂNG: Điều khiển Menu (+) thông minh và các nút đính kèm mở rộng
 */

window.featureMenu = {
    init: function() {
        const plusBtn = document.getElementById('plusBtn');
        const attachMenu = document.getElementById('attachMenu');
        const hiddenFileInput = document.getElementById('hiddenFileInput');
        const submenu = document.querySelector('.submenu');

        if (!plusBtn || !attachMenu) return;

        plusBtn.onclick = (e) => {
            e.stopPropagation();
            const isOpen = attachMenu.classList.toggle('active');
            attachMenu.style.display = isOpen ? 'block' : 'none';
            if (!isOpen && submenu) submenu.style.display = 'none';
        };

        attachMenu.querySelectorAll('.menu-item').forEach(item => {
            item.onclick = function(e) {
                e.stopPropagation();
                const action = this.innerText.trim();

                if (action.includes("ảnh và tệp")) {
                    if (hiddenFileInput) hiddenFileInput.click();
                } else if (action.includes("Tạo hình ảnh")) {
                    if (window.featureImageGen && typeof window.featureImageGen.init === 'function') {
                        window.featureImageGen.init();
                    }
                } else if (action.includes("Đang suy nghĩ")) {
                    if (window.featureReasoning && typeof window.featureReasoning.activate === 'function') {
                        window.featureReasoning.activate(false);
                    }
                } else if (action.includes("Nghiên cứu chuyên sâu")) {
                    if (window.featureReasoning && typeof window.featureReasoning.activate === 'function') {
                        window.featureReasoning.activate(true);
                    }
                } else if (action.includes("Tìm kiếm trên mạng")) {
                    if (window.featureSearch && typeof window.featureSearch.init === 'function') {
                        window.featureSearch.init();
                    }
                } else if (action.includes("Học hỏi")) {
                    if (window.featureLearning && typeof window.featureLearning.init === 'function') {
                        window.featureLearning.init();
                    }
                } else if (action.includes("Soạn thảo văn bản")) {
                    if (window.featureWriting && typeof window.featureWriting.init === 'function') {
                        window.featureWriting.init();
                    }
                }

                window.featureMenu.closeAllMenus();
            };
        });

        document.addEventListener('click', (e) => {
            if (!attachMenu.contains(e.target) && e.target !== plusBtn) {
                window.featureMenu.closeAllMenus();
            }
        });
    },

    closeAllMenus: function() {
        const attachMenu = document.getElementById('attachMenu');
        const submenu = document.querySelector('.submenu');
        if (attachMenu) {
            attachMenu.style.display = 'none';
            attachMenu.classList.remove('active');
        }
        if (submenu) submenu.style.display = 'none';
    }
};