if (typeof get !== 'function') {
    window.get = (id) => document.getElementById(id);
}

function renderHistory() {
    const list = document.getElementById('chatHistoryList');
    if (!list) return;

    const allChats = JSON.parse(localStorage.getItem('vlu_chat_sessions')) || {};
    const pinnedIds = JSON.parse(localStorage.getItem('vlu_pinned_chats')) || [];

    list.innerHTML = '';

    // Phân loại: ghim trước, còn lại sau
    const allIds = Object.keys(allChats).reverse();
    const pinnedList = allIds.filter(id => pinnedIds.includes(id));
    const normalList = allIds.filter(id => !pinnedIds.includes(id));
    const orderedIds = [...pinnedList, ...normalList];

    if (pinnedList.length > 0) {
        list.innerHTML += '<p class="history-label">📌 Đã ghim</p>';
    }

    let addedNormalLabel = false;

    orderedIds.forEach(id => {
        const item = allChats[id];
        if (!item) return;

        const isPinned = pinnedIds.includes(id);

        // Thêm nhãn "Gần đây" trước mục thường đầu tiên
        if (!isPinned && !addedNormalLabel) {
            addedNormalLabel = true;
            if (normalList.length > 0) {
                list.innerHTML += '<p class="history-label">Gần đây</p>';
            }
        }

        const div = document.createElement('div');
        div.className = 'history-item';
        if (id === window.currentChatId) div.classList.add('active');

        div.innerHTML = `
            <div class="history-info" style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                <i class="${isPinned ? 'fas fa-thumbtack' : 'far fa-comment-alt'}" style="${isPinned ? 'color: var(--vlu-red); font-size: 12px;' : ''}"></i>
                <span class="history-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">${item.title}</span>
            </div>
            <div class="history-actions" style="padding: 4px 4px; z-index: 10; display: flex; align-items: center; gap: 4px;">
                <button class="dot-menu-button" aria-label="Tùy chọn">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
                <div class="history-item-menu" style="display:none; min-width:140px;">
                    <div class="menu-item menu-pin ${isPinned ? 'pinned' : ''} pin-item-btn" title="${isPinned ? 'Bỏ ghim' : 'Ghim cuộc trò chuyện'}">
                        <i class="fas fa-thumbtack"></i>
                        <span style="margin-left:8px;">${isPinned ? 'Bỏ ghim' : 'Ghim đoạn chat'}</span>
                    </div>
                    <div class="menu-item menu-delete delete-item-btn" title="Xóa cuộc trò chuyện này">
                        <i class="fas fa-trash-alt"></i>
                        <span style="margin-left:8px;">Xóa</span>
                    </div>
                </div>
            </div>
        `;

        // set data attribute to identify this chat item from delegated events
        div.dataset.chatId = id;

        list.appendChild(div);
    });

    // Event delegation: attach a single click listener to the list to handle
    // open, pin/unpin, and delete actions. This avoids lost handlers after re-render.
    if (!list._historyEventsAttached) {
        list.addEventListener('click', (e) => {
            const pinBtn = e.target.closest('.pin-item-btn');
            const deleteBtn = e.target.closest('.delete-item-btn');
            const dotBtn = e.target.closest('.dot-menu-button');
            const item = e.target.closest('.history-item');
            const info = e.target.closest('.history-info');
            if (!item) return;
            const cid = item.dataset.chatId;

            // Toggle menu
            if (dotBtn) {
                e.preventDefault();
                e.stopPropagation();
                const menu = item.querySelector('.history-item-menu');
                if (menu) {
                    const open = menu.style.display === 'block';
                    // close other menus
                    document.querySelectorAll('.history-item-menu').forEach(m => m.style.display = 'none');

                    // hide other dot buttons to avoid 'bleeding' visibility
                    const allDots = document.querySelectorAll('.dot-menu-button');
                    allDots.forEach(d => {
                        if (!d.closest('.history-item')) return;
                        if (d.closest('.history-item') !== item) {
                            d.style.visibility = open ? 'visible' : 'hidden';
                        } else {
                            d.style.visibility = 'visible';
                        }
                    });

                    menu.style.display = open ? 'none' : 'block';
                }
                return;
            }

            if (pinBtn) {
                e.preventDefault();
                e.stopPropagation();
                let pins = JSON.parse(localStorage.getItem('vlu_pinned_chats')) || [];
                if (pins.includes(cid)) {
                    pins = pins.filter(p => p !== cid);
                } else {
                    pins.unshift(cid);
                }
                localStorage.setItem('vlu_pinned_chats', JSON.stringify(pins));
                renderHistory();
                return;
            }

            if (deleteBtn) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof window.deleteSpecificChat === 'function') {
                    window.deleteSpecificChat(e, cid);
                }
                return;
            }

            if (info) {
                e.preventDefault();
                if (typeof window.loadSession === 'function') {
                    window.loadSession(cid);
                }
            }
        });

        // Close menus when clicking outside and restore dot visibility
        document.addEventListener('click', (e) => {
            document.querySelectorAll('.history-item-menu').forEach(m => {
                if (!m.contains(e.target) && !m.previousElementSibling?.contains?.(e.target)) {
                    m.style.display = 'none';
                }
            });
            // restore visibility for all dot buttons
            document.querySelectorAll('.dot-menu-button').forEach(d => d.style.visibility = 'visible');
        });

        list._historyEventsAttached = true;
    }

    if (orderedIds.length === 0) {
        list.innerHTML = '<p class="history-label">Gần đây</p>';
    }
}


async function handleAction(text, mode = 'default') {
    if (typeof window.setMode === 'function') window.setMode(mode);

    // If caller requests a new chat, reset currentChatId so messages save to a new session
    if (mode === 'new') {
        window.currentChatId = null;
        if (typeof window.setCurrentChatId === 'function') window.setCurrentChatId(null);
    }

    const welcome = get('welcomeScreen');
    if (welcome) welcome.classList.add('hidden');

    const container = get('messagesContainer');
    if (container) container.innerHTML = '';

    const input = get('userInput');
    if (input) {
        input.value = text;
    }

    const appendFunc = window.appendMessage || (window.chat && window.chat.appendMessage);
    const showTypingFunc = window.showTypingIndicator || (window.chat && window.chat.showTypingIndicator);
    const removeTypingFunc = window.removeTypingIndicator || (window.chat && window.chat.removeTypingIndicator);
    const saveChatFunc = window.saveChatToLocal || (window.chat && window.chat.saveChatToLocal);

    if (typeof appendFunc === 'function') {
        appendFunc('user', text);
        if (input) {
            input.value = '';
            input.style.height = 'auto';
        }

        let typingMsg = null;
        if (typeof showTypingFunc === 'function') {
            typingMsg = showTypingFunc();
        } else {
            const c = document.getElementById('messagesContainer');
            if (c) {
                typingMsg = document.createElement('div');
                typingMsg.className = "message bot-message typing-indicator";
                typingMsg.innerHTML = `<div class="bot-icon"><i class="fas fa-robot"></i></div><div class="content"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
                c.appendChild(typingMsg);
                const b = document.getElementById('chatbox');
                if (b) b.scrollTop = b.scrollHeight;
            }
        }

        const botReply = await window.ui.fetchVLUData(text);

        if (typeof removeTypingFunc === 'function') {
            removeTypingFunc(typingMsg);
        } else if (typingMsg && typingMsg.parentNode) {
            typingMsg.parentNode.removeChild(typingMsg);
        }

        appendFunc('bot', botReply);

        if (typeof saveChatFunc === 'function') {
            saveChatFunc('user', text);
            saveChatFunc('bot', botReply);
        }
    } else if (container) {
        container.innerHTML += `<div class="message user-message"><div class="content">${text}</div></div>`;
        if (input) {
            input.value = '';
            input.style.height = 'auto';
        }

        const typingMsg = document.createElement('div');
        typingMsg.className = "message bot-message typing-indicator";
        typingMsg.innerHTML = `<div class="bot-icon"><i class="fas fa-robot"></i></div><div class="content"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
        container.appendChild(typingMsg);
        const b = document.getElementById('chatbox');
        if (b) b.scrollTop = b.scrollHeight;

        const botReply = await window.ui.fetchVLUData(text);

        if (typingMsg && typingMsg.parentNode) {
            typingMsg.parentNode.removeChild(typingMsg);
        }

        container.innerHTML += `<div class="message bot-message"><div class="content">${botReply.replace(/\n/g, '<br>')}</div></div>`;

        if (typeof saveChatFunc === 'function') {
            saveChatFunc('user', text);
            saveChatFunc('bot', botReply);
        }
    }
}

function initSidebar() {
    const sidebar = document.querySelector('.vlu-sidebar');
    const toggle = get('headerToggle');

    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }

    if (toggle && sidebar) {
        toggle.onclick = (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('closed');
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        };
    }

    overlay.onclick = () => {
        if (sidebar) {
            sidebar.classList.remove('active');
            sidebar.classList.add('closed');
        }
        overlay.classList.remove('active');
    };

    const newChatBtn = get('newChatBtn');
    if (newChatBtn) {
        newChatBtn.onclick = () => {
            window.currentChatId = null;
            if (typeof window.setCurrentChatId === 'function') window.setCurrentChatId(null);

            const container = get('messagesContainer');
            const welcome = get('welcomeScreen');
            if (container) container.innerHTML = '';
            if (welcome) welcome.classList.remove('hidden');

            const input = get('userInput');
            if (input) {
                input.value = '';
                input.style.height = 'auto';
                input.focus();
            }
            renderHistory();
        };
    }
}

function updateDynamicGreeting() {
    const g = get('dynamicGreeting');
    if (!g) return;
    const h = new Date().getHours();
    if (h < 12) g.innerText = "Chào buổi sáng! Chúc bạn ngày mới năng suất tại VLU! ☀️";
    else if (h < 18) g.innerText = "Buổi chiều tốt lành! Bạn đã nộp bài tập chưa đó? 📝";
    else g.innerText = "Tối muộn rồi, đừng thức khuya quá nhé sinh viên VLU ơi! 🌙";
}

function initScrollToBottom() {
    const box = get('chatbox');
    const btn = get('scrollToBottom');
    if (box && btn) {
        box.onscroll = () => {
            btn.style.display = (box.scrollTop < box.scrollHeight - box.clientHeight - 100) ? 'flex' : 'none';
        };
        btn.onclick = () => box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
    }
}

function initClearHistory() {
    const clearBtn = get('clearHistoryBtn');
    if (clearBtn) {
        clearBtn.onclick = () => {
            if (confirm("Xóa hết lịch sử trò chuyện nhé?")) {
                localStorage.removeItem('vlu_chat_sessions');
                window.currentChatId = null;
                const container = get('messagesContainer');
                const welcome = get('welcomeScreen');
                if (container) container.innerHTML = '';
                if (welcome) welcome.classList.remove('hidden');
                renderHistory();
            }
        };
    }
}

function copyCode(btn) {
    if (!btn) return;
    const wrapper = btn.closest('.code-block-wrapper');
    if (!wrapper) return;
    const codeElement = wrapper.querySelector('code');
    if (!codeElement) return;

    const textToCopy = codeElement.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-check';
            btn.style.color = '#50fa7b';
        }

        showToast("Đã sao chép vào bộ nhớ tạm");

        setTimeout(() => {
            if (icon) {
                icon.className = 'far fa-clone';
                btn.style.color = '';
            }
        }, 2000);
    });
}

function showToast(message) {
    const oldToast = document.querySelector('.copy-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

async function fetchVLUData(searchQuery) {
    let cleanQuery = searchQuery.toLowerCase();
    let optimizedKeyword = searchQuery;

    if (cleanQuery.includes("tốt nghiệp")) {
        optimizedKeyword = "điều kiện xét tốt nghiệp đại học văn lang";
    } else if (cleanQuery.includes("học phí")) {
        optimizedKeyword = "quy định học phí văn lang";
    } else if (cleanQuery.includes("lịch thi") || cleanQuery.includes("phòng thi")) {
        optimizedKeyword = "thông báo lịch thi học kỳ văn lang";
    } else if (cleanQuery.includes("học phần") || cleanQuery.includes("đăng ký môn")) {
        optimizedKeyword = "thông báo đăng ký học phần văn lang";
    } else if (cleanQuery.includes("cẩm nang")) {
        optimizedKeyword = "cẩm nang sinh viên đại học văn lang";
    } else if (cleanQuery.includes("sự kiện") || cleanQuery.includes("hoạt động")) {
        optimizedKeyword = "lịch công tác tuần trường văn lang";
    } else if (cleanQuery.includes("khung chương trình") || cleanQuery.includes("đào tạo")) {
        optimizedKeyword = "khung chương trình đào tạo công nghệ thông tin văn lang";
    }

    const gscInput = document.querySelector('input.gsc-input');
    const gscBtn = document.querySelector('button.gsc-search-button');

    if (!gscInput || !gscBtn) {
        return "Ối! Hệ thống không tìm thấy dữ liệu phản hồi từ website trường. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau.";
    }

    gscInput.value = optimizedKeyword;
    gscBtn.click();

    await new Promise(resolve => setTimeout(resolve, 1200));

    const results = document.querySelectorAll('.gsc-webResult .gsc-result');
    if (!results || results.length === 0) {
        return "Ối! Hệ thống không tìm thấy dữ liệu phản hồi từ website trường. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau.";
    }

    let processedReply = "Dưới đây là thông tin chi tiết tôi tìm thấy và tổng hợp từ website nhà trường:<br><br>";
    const validResults = [];

    results.forEach(item => {
        const titleEl = item.querySelector('a.gs-title');
        const snippetEl = item.querySelector('.gs-bktxt') || item.querySelector('.gs-snippet');
        if (titleEl && validResults.length < 3) {
            const title = titleEl.innerText || titleEl.textContent;
            const link = titleEl.getAttribute('href');
            const fallbackSnippet = snippetEl ? (snippetEl.innerText || snippetEl.textContent) : "Vui lòng bấm vào liên kết để xem toàn văn văn bản.";
            if (title && link) {
                validResults.push({ title, link, fallbackSnippet });
            }
        }
    });

    const fetchPromises = validResults.map(async(data) => {
        let contentSummary = "";
        try {
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(data.link)}`;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1000);

            const response = await fetch(proxyUrl, { signal: controller.signal });
            clearTimeout(timeoutId);

            const proxyData = await response.json();

            if (proxyData.contents) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(proxyData.contents, "text/html");
                const articleBody = doc.querySelector('.cms-content, .post-content, .entry-content, article, main, .content');
                let rawText = "";

                if (articleBody) {
                    rawText = articleBody.innerText || articleBody.textContent;
                } else {
                    const paragraphs = doc.querySelectorAll('p');
                    paragraphs.forEach(p => {
                        if ((p.innerText || p.textContent).length > 30) {
                            rawText += (p.innerText || p.textContent) + " ";
                        }
                    });
                }

                rawText = rawText.replace(/\s+/g, ' ').trim();
                if (rawText.length > 150) {
                    contentSummary = rawText.substring(0, 450) + "...";
                }
            }
        } catch (e) {
            contentSummary = "";
        }

        if (!contentSummary) {
            contentSummary = data.fallbackSnippet;
        }

        return `• <strong><a href="${data.link}" target="_blank" style="color: #0066cc; text-decoration: underline;">${data.title}</a></strong><br>📝 <strong>Nội dung chi tiết trích xuất:</strong> ${contentSummary}<br>📌 <em>Để xem chi tiết toàn văn thông báo này, bạn vui lòng nhấn trực tiếp vào đường liên kết xanh ở trên.</em><br><br>`;
    });

    const renderedParts = await Promise.all(fetchPromises);
    processedReply += renderedParts.join("");

    return processedReply;
}

window.ui = {
    initSidebar,
    updateDynamicGreeting,
    initScrollToBottom,
    renderHistory,
    initClearHistory,
    copyCode,
    showToast,
    fetchVLUData,
    useSuggestion: (text) => handleAction(text, 'new'), // open suggestion in a new chat session
    updateHistorySidebar: renderHistory
};