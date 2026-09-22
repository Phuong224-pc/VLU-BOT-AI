/** * FILE: js/features/help.js
 * CHỨC NĂNG: Xử lý nút Trợ giúp hiển thị cẩm nang hướng dẫn sử dụng Chatbot
 */

window.featureHelp = {
    init: function() {
        const helpBtn = document.getElementById('helpBtn');
        const helpModal = document.getElementById('helpModal');
        const closeHelpModalBtn = document.getElementById('closeHelpModalBtn');

        if (!helpBtn || !helpModal) return;

        helpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            helpModal.style.display = 'block';
            helpModal.classList.add('show');
        });

        if (closeHelpModalBtn) {
            closeHelpModalBtn.onclick = (e) => {
                e.preventDefault();
                helpModal.style.display = 'none';
                helpModal.classList.remove('show');
            };
        }

        window.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                helpModal.style.display = 'none';
                helpModal.classList.remove('show');
            }
        });
    }
};