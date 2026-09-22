window.lastUploadedDocContent = "";

// Add a preview thumbnail for an image URL
function addImagePreview(url, fileName) {
    const previewContainer = document.getElementById('imagePreviewContainer');
    const previewList = document.getElementById('previewList');
    if (!previewList || !previewContainer) return;

    const item = document.createElement('div');
    item.className = 'preview-item';
    item.innerHTML = `
        <img src="${url}" alt="${fileName}">
        <button type="button" class="preview-close" title="Xóa hình">×</button>
    `;

    // close handler for this thumbnail
    const closeBtn = item.querySelector('.preview-close');
    closeBtn.onclick = (e) => {
        e.stopPropagation();
        item.remove();
        // if no previews left, hide container
        if (previewList.children.length === 0) previewContainer.style.display = 'none';
    };

    previewList.appendChild(item);
    previewContainer.style.display = 'block';
    previewContainer.classList.add('bounce-in');
}

async function processFile(file) {
    if (!file) return;

    const previewContainer = document.getElementById('imagePreviewContainer');

    if (file.type && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            addImagePreview(e.target.result, file.name);
        };
        reader.readAsDataURL(file);
    } else {
        const extension = file.name.split('.').pop().toLowerCase();

        if (file.type === "text/plain" || extension === "txt") {
            window.lastUploadedDocContent = await file.text();
            showFileStatus(file.name, "Đã trích xuất nội dung chữ thành công");
        } else {
            showFileStatus(file.name, "Đã nhận file (Cần thư viện bổ trợ để đọc định dạng này)");
        }
    }
}

function showFileStatus(fileName, status) {
    if (typeof window.renderBotMessage === 'function') {
        window.renderBotMessage(`📁 **File đính kèm:** \`${fileName}\`\n*${status}*`);
    }
}

function initDragAndDrop() {
    const dropZone = document.body;
    if (!dropZone) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(name => {
        dropZone.addEventListener(name, e => e.preventDefault());
    });

    dropZone.addEventListener('drop', (e) => {
        const files = Array.from(e.dataTransfer.files || []);
        files.forEach(file => processFile(file));
    });
}


function initPasteImages() {
    // Tránh gắn nhiều listener nếu main.js gọi init lại nhiều lần
    if (window.__vluPasteImageListenerAttached) return;
    window.__vluPasteImageListenerAttached = true;

    document.addEventListener('paste', (e) => {
        const clipboard = e.clipboardData || window.clipboardData;
        if (!clipboard) return;

        const files = [];

        // Cách 1: Chrome/Safari thường đưa ảnh trong clipboardData.items
        const items = Array.from(clipboard.items || []);
        items.forEach((item) => {
            if (item.type && item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (file) files.push(file);
            }
        });

        // Cách 2: một số trình duyệt đưa ảnh trong clipboardData.files
        if (files.length === 0 && clipboard.files) {
            Array.from(clipboard.files).forEach((file) => {
                if (file.type && file.type.startsWith('image/')) files.push(file);
            });
        }

        if (files.length === 0) return;

        e.preventDefault();
        files.forEach((file, index) => {
            const pastedName = file.name || `pasted-image-${Date.now()}-${index}.png`;
            const fixedFile = file.name ? file : new File([file], pastedName, { type: file.type || 'image/png' });
            processFile(fixedFile);
        });
    });
}

function initFilePreview() {
    const hiddenFileInput = document.getElementById('hiddenFileInput');
    const closePreview = document.getElementById('closePreview');
    const previewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');

    if (hiddenFileInput) {
        hiddenFileInput.setAttribute('multiple', '');
        hiddenFileInput.onchange = (e) => {
            const files = Array.from(e.target.files || []);
            files.forEach(f => processFile(f));
            // clear value so same file can be selected again
            hiddenFileInput.value = '';
        };
    }

    if (closePreview) {
        closePreview.onclick = (e) => {
            e.stopPropagation();
            if (previewContainer) previewContainer.style.display = 'none';
            if (imagePreview) imagePreview.src = '';
            window.lastUploadedDocContent = "";
        };
    }

    initPasteImages();
}

window.upload = {
    initFilePreview,
    initDragAndDrop,
    initPasteImages,
    processExternalFile: processFile
};