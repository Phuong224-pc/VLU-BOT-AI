window.featurePrompts = {
    'roadmap': `Bạn là chuyên gia tư vấn lộ trình học tập thuộc Khoa CNTT - VLU. Hãy thực hiện nghiêm ngặt các quy tắc sau:
1. TƯ DUY TRỌNG TÂM: Đi thẳng vào danh sách môn học cốt lõi của từng học kỳ theo tiến độ chuẩn. Không chào hỏi, không kết bài xã giao.
2. VÍ DỤ MẪU:
- Người dùng: "Tư vấn lộ trình học kỳ 3 ngành phần mềm"
- Trợ lý: "- Học kỳ 3 tập trung vào Kiến trúc máy tính và Cấu trúc dữ liệu & Giải thuật.
- Môn tiên quyết cần pass: Kỹ thuật lập trình.
- Kỹ năng bổ trợ: Thực hành cấu trúc dữ liệu bằng Java/C++."`,

    'results': `Bạn là chuyên gia phân tích kết quả học tập nội bộ VLU. Hãy thực hiện nghiêm ngặt các quy tắc sau:
1. ĐỊNH DẠNG: Đọc thông số điểm, giải thích quy chế đổi điểm GPA thang 4 và thang 10 chuẩn Văn Lang một cách dứt khoát. 
2. ĐIỂM CHẠM: Chỉ ra ngay môn nào dưới điểm D để cảnh báo học vụ và đưa ra giải pháp cải thiện học lực tối giản.
3. VÍ DỤ MẪU:
- Người dùng: "Điểm toán rời rạc của mình được 4.8 tính hệ 4 thế nào"
- Trợ lý: "- Điểm 4.8 hệ 10 quy đổi thành điểm D (Hệ 4 tương đương 1.0).
- Trạng thái: Đạt (Pass) nhưng ở mức tối thiểu.
- Khuyến nghị: Nên đăng ký học cải thiện vào học kỳ phụ để nâng tổng GPA tích lũy."`,

    'graduation': `Bạn là cố vấn xét tốt nghiệp Khoa CNTT - VLU. Hãy thực hiện nghiêm ngặt các quy tắc sau:
1. TIÊU CHUẨN: Nêu trực diện các điều kiện cốt lõi: Đủ số tín chỉ tích lũy theo khung đào tạo, chứng chỉ chuẩn đầu ra ngoại ngữ (TOEIC/IELTS), chứng chỉ Tin học MOS, và không bị kỷ luật học vụ.
2. VÍ DỤ MẪU:
- Người dùng: "Nợ chuẩn đầu ra Anh văn có được ra trường không"
- Trợ lý: "- Tuyệt đối KHÔNG.
- Lý do: Chứng chỉ ngoại ngữ theo quy định VLU là điều kiện bắt buộc để cấp bằng tốt nghiệp.
- Giải pháp: Nộp bổ sung chứng chỉ trước đợt xét tốt nghiệp tối thiểu 2 tuần."`,

    'future': `Bạn là chuyên gia định hướng nghề nghiệp Kỹ thuật phần mềm VLU. Hãy thực hiện nghiêm ngặt các quy tắc sau:
1. THỰC TẾ: Phân tích trực diện xu hướng thị trường (Frontend, Backend, AI, Data...). Đưa ra lời khuyên thực tế về Stack công nghệ cần học, bỏ qua mọi lý thuyết suông.
2. VÍ DỤ MẪU:
- Người dùng: "Muốn làm Backend thì học gì"
- Trợ lý: "- Lộ trình công nghệ trọng tâm: Node.js (Express) hoặc Java (Spring Boot).
- Cơ sở dữ liệu bắt buộc: MySQL và MongoDB.
- Kỹ năng doanh nghiệp cần: Tư duy thiết kế API RESTful và quản lý source code bằng Git."`,

    'advisor': `Bạn là Cố vấn lộ trình học tập AI của Khoa CNTT - Đại học Văn Lang.

NHIỆM VỤ CHÍNH:
1. Khi sinh viên gửi ảnh bảng điểm: phải đọc ảnh, in lại toàn bộ bảng điểm đọc được theo từng học kỳ, sau đó đối chiếu với khung CTĐT K30 CNTT để xác định môn đã học, môn còn thiếu, môn chưa đạt và môn nên học kỳ tiếp theo.
2. Khi sinh viên hỏi muốn học một môn cụ thể: tra điều kiện tiên quyết/học trước trong khung CTĐT. Nếu môn điều kiện đã xuất hiện trong bảng điểm với trạng thái đạt thì kết luận đủ điều kiện; nếu chưa thấy dữ liệu thì hỏi lại sinh viên đã học và đạt môn điều kiện chưa.
3. Khi gợi ý kỳ tiếp theo: chia rõ nhóm môn Đại cương, Lý luận chính trị, Ngoại ngữ, Cơ sở khối ngành, Cơ sở ngành, Chuyên ngành/chuyên sâu. Ưu tiên môn còn thiếu, môn bắt buộc, môn mở khóa cho môn sau.

ĐỊNH DẠNG BẮT BUỘC:
- Luôn dùng Markdown table khi liệt kê môn học.
- Không được tự bịa điểm, tín chỉ, môn đã học.
- Không được đưa môn đã đạt vào danh sách còn thiếu.
- Nếu ảnh mờ/thiếu trang bảng điểm, phải ghi rõ "Ảnh chưa đủ rõ hoặc chưa đủ toàn bộ bảng điểm để kết luận chính xác".`,

    'default': `Bạn là một AI Core trợ lý ảo cao cấp của VLU Chatbot. Hãy thực hiện chính xác các quy tắc tư duy sau:
1. TƯ DUY TRỌNG TÂM: Với mọi câu hỏi, đưa ra câu trả lời trực diện ngay từ dòng đầu tiên. Không chào hỏi, không lặp lại câu hỏi của người dùng, không giả định rườm rà.
2. ĐỊNH DẠNG MẠCH LẠC: Loại bỏ hoàn toàn các đoạn văn dài dòng. Chia nhỏ thông tin thành các gạch đầu dòng (-) ngắn gọn, súc tích, có giá trị thông tin cao nhất với số lượng từ tối giản nhất.
3. DỊCH THUẬT CHUYÊN NGHIỆP: Khi người dùng yêu cầu dịch thuật, hãy đóng vai biên dịch viên chuyên ngành. Dịch sát nghĩa theo ngữ cảnh phần mềm, giữ nguyên thuật ngữ kỹ thuật, tuyệt đối không dịch thô word-by-word.
4. VÍ DỤ MẪU:
- Người dùng: "Chào bạn, bạn có thể giải thích Git là gì cho một sinh viên mới học không?"
- Trợ lý: "- Git là hệ thống quản lý phiên bản phân tán (Distributed Version Control System).
- Chức năng: Theo dõi lịch sử thay đổi của mã nguồn và hỗ trợ làm việc nhóm không bị đè code.
- Lợi ích: Khôi phục lại các phiên bản mã nguồn cũ khi gặp sự cố lỗi."`
};

window.currentSystemPrompt = window.featurePrompts['default'];

document.addEventListener('DOMContentLoaded', () => {
    console.log("%c🚀 VLU AI Core: Booting...", "color: #ff9900; font-weight: bold;");

    const startApp = () => {
        if (window.ui) {
            if (typeof ui.initSidebar === 'function') ui.initSidebar();
            if (typeof ui.updateDynamicGreeting === 'function') ui.updateDynamicGreeting();
            if (typeof ui.initScrollToBottom === 'function') ui.initScrollToBottom();
            if (typeof ui.renderHistory === 'function') ui.renderHistory();
            if (typeof ui.initClearHistory === 'function') ui.initClearHistory();
        }

        if (window.vluAuthState && typeof window.vluAuthState.init === 'function') window.vluAuthState.init();
        if (window.vluAuthUtils && typeof window.vluAuthUtils.init === 'function') window.vluAuthUtils.init();
        if (window.vluRegister && typeof window.vluRegister.init === 'function') window.vluRegister.init();

        if (window.vluLogin) {
            if (typeof window.vluLogin.initTabs === 'function') window.vluLogin.initTabs();
            if (typeof window.vluLogin.initLoginFormSubmit === 'function') window.vluLogin.initLoginFormSubmit();
            if (typeof window.vluLogin.initMicrosoftAuth === 'function') window.vluLogin.initMicrosoftAuth();
            if (typeof window.vluLogin.initForgotPassword === 'function') window.vluLogin.initForgotPassword();
        }

        const loginTabBtn = document.getElementById('loginTabBtn');
        const registerTabBtn = document.getElementById('registerTabBtn');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginTabBtn && registerTabBtn && loginForm && registerForm) {
            registerTabBtn.onclick = () => {
                loginTabBtn.classList.remove('active');
                registerTabBtn.classList.add('active');
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
            };
            loginTabBtn.onclick = () => {
                registerTabBtn.classList.remove('active');
                loginTabBtn.classList.add('active');
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
            };
        }

        if (window.upload) {
            if (typeof upload.initFilePreview === 'function') upload.initFilePreview();
            if (typeof upload.initDragAndDrop === 'function') upload.initDragAndDrop();
            console.log("✅ Module Upload & Drag-Drop: Connected");
        } else {
            setTimeout(startApp, 300);
            return;
        }

        if (window.featureMenu && typeof window.featureMenu.init === 'function') window.featureMenu.init();
        if (window.featureTheme && typeof window.featureTheme.init === 'function') window.featureTheme.init();
        if (window.featureHelp && typeof window.featureHelp.init === 'function') window.featureHelp.init();
        if (window.featureSetting && typeof window.featureSetting.init === 'function') window.featureSetting.init();

        if (window.ui && typeof window.ui.renderHistory === "function") {
            window.ui.renderHistory();
        }

        const singleToggleBtn = document.getElementById('headerToggle');
        const sidebarElement = document.querySelector('.vlu-sidebar');

        if (singleToggleBtn && sidebarElement) {
            singleToggleBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                sidebarElement.classList.toggle('collapsed');
                sidebarElement.classList.toggle('closed');
            };
        }

        const dropdownTrigger = document.getElementById('headerDropdownTrigger');
        const dropdownMenu = document.getElementById('headerDropdownMenu');
        const headerHelp = document.getElementById('headerHelpBtn');
        const headerSetting = document.getElementById('headerSettingBtn');

        if (dropdownTrigger && dropdownMenu) {
            dropdownTrigger.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isHidden = dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '';
                dropdownMenu.style.display = isHidden ? 'block' : 'none';
            };

            document.addEventListener('click', () => {
                dropdownMenu.style.display = 'none';
            });

            if (headerHelp) {
                headerHelp.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdownMenu.style.display = 'none';
                };
            }

            if (headerSetting) {
                headerSetting.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdownMenu.style.display = 'none';
                };
            }
        }

        const personalMenuTrigger = document.getElementById('personalMenuTrigger');
        if (personalMenuTrigger) {
            personalMenuTrigger.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                personalMenuTrigger.classList.toggle('active');
            };
        }

        const btnRoadmap = document.getElementById('btn-roadmap');
        const btnAdvisor = document.getElementById('btn-advisor');
        const btnResults = document.getElementById('btn-results');
        const btnProfile = document.getElementById('btn-profile');
        const btnGraduation = document.getElementById('btn-graduation');
        const btnFuture = document.getElementById('btn-future');

        const updateProfileAccess = (user) => {
            if (!btnProfile) return;
            btnProfile.style.display = user ? '' : 'none';
        };

        if (typeof firebase !== 'undefined' && firebase.auth) {
            updateProfileAccess(firebase.auth().currentUser);
            firebase.auth().onAuthStateChanged((user) => {
                updateProfileAccess(user);
            });
        } else {
            updateProfileAccess(null);
        }

        // ĐÃ CẬP NHẬT: Định hướng đúng vào cấu trúc thư mục con tương ứng
        if (btnRoadmap) {
            btnRoadmap.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = "js/features/roadmap/roadmap.html";
            };
        }

        if (btnAdvisor) {
            btnAdvisor.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = "js/features/advisor/advisor.html";
            };
        }

        const urlMode = new URLSearchParams(window.location.search).get('mode');
        if (urlMode === 'advisor') {
            window.currentSystemPrompt = window.featurePrompts['advisor'];
            document.body.classList.add('advisor-mode');
            const title = document.querySelector('.gradient-text');
            const greeting = document.getElementById('dynamicGreeting');
            const input = document.getElementById('userInput');
            if (title) title.textContent = 'Cố vấn lộ trình học tập';
            if (greeting) greeting.textContent = 'Gửi ảnh bảng điểm hoặc hỏi môn muốn học, AI sẽ đối chiếu Khung CTĐT K30 CNTT cho bạn.';
            if (input) input.placeholder = 'Ví dụ: Tôi muốn học Kinh tế chính trị Mác-Lênin, kiểm tra điều kiện giúp tôi...';
            if (btnAdvisor) btnAdvisor.classList.add('active');
        }

        if (btnResults) {
            btnResults.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = "js/features/gpa/gpa.html";
            };
        }

        if (btnProfile) {
            btnProfile.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const currentUser = typeof firebase !== 'undefined' && firebase.auth ? firebase.auth().currentUser : null;
                if (!currentUser) {
                    alert('Bạn phải đăng nhập trước khi mở hồ sơ sinh viên.');
                    if (authModal) {
                        authModal.style.display = 'block';
                        authModal.classList.add('show');
                    }
                    return;
                }
                window.location.href = "js/features/profile/profile.html";
            };
        }

        if (btnGraduation) {
            btnGraduation.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = "js/features/graduation/graduation.html";
            };
        }

        if (btnFuture) {
            btnFuture.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = "js/features/career/career.html";
            };
        }

        const footerHelpBtn = document.getElementById('helpBtn');
        const footerSettingsBtn = document.getElementById('settingsBtn');
        const helpModal = document.getElementById('helpModal');
        const authModal = document.getElementById('authModal');
        const closeHelpModalBtn = document.getElementById('closeHelpModalBtn');
        const closeAuthModalBtn = document.querySelector('.close-modal');

        if (footerHelpBtn && helpModal) {
            footerHelpBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                helpModal.style.display = 'block';
                helpModal.classList.add('show');
            };
        }

        if (closeHelpModalBtn && helpModal) {
            closeHelpModalBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                helpModal.style.display = 'none';
                helpModal.classList.remove('show');
            };
        }

        if (footerSettingsBtn && authModal) {
            footerSettingsBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                authModal.style.display = 'block';
                authModal.classList.add('show');
            };
        }

        if (closeAuthModalBtn && authModal) {
            closeAuthModalBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                authModal.style.display = 'none';
                authModal.classList.remove('show');
            };
        }

        window.addEventListener('click', (event) => {
            if (event.target === helpModal) {
                helpModal.style.display = 'none';
                helpModal.classList.remove('show');
            }
            if (event.target === authModal) {
                authModal.style.display = 'none';
                authModal.classList.remove('show');
            }
        });
    };

    startApp();

    const uiElements = {
        input: document.getElementById('userInput'),
        sendBtn: document.getElementById('sendBtn'),
        micBtn: document.querySelector('.mic-btn'),
        logoHomeBtn: document.getElementById('logoHomeBtn'),
        helpBtn: document.getElementById('headerHelpBtn')
    };

    const handleSend = () => {
        const sendFunc = window.sendMessage || (window.chat && window.chat.sendMessage);
        if (typeof sendFunc === 'function') {
            sendFunc();
        } else {
            console.error("❌ sendMessage() not found in chat.js");
        }
    };

    if (uiElements.logoHomeBtn) {
        uiElements.logoHomeBtn.onclick = (e) => {
            e.preventDefault();
            window.currentChatId = null;
            window.currentSystemPrompt = window.featurePrompts['default'];
            const messagesContainer = document.getElementById('messagesContainer');
            if (messagesContainer) messagesContainer.innerHTML = '';
            const welcomeScreen = document.getElementById('welcomeScreen');
            if (welcomeScreen) welcomeScreen.classList.remove('hidden');
            if (uiElements.input) {
                uiElements.input.value = '';
                uiElements.input.style.height = 'auto';
                uiElements.input.focus();
            }
            if (window.ui && typeof window.ui.renderHistory === 'function') {
                window.ui.renderHistory();
            }
        };
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (uiElements.micBtn && SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'vi-VN';
        uiElements.micBtn.onclick = (e) => {
            e.preventDefault();
            recognition.start();
            uiElements.micBtn.classList.add('recording');
            uiElements.micBtn.style.color = "red";
        };
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (uiElements.input) {
                uiElements.input.value = transcript;
                handleSend();
            }
            uiElements.micBtn.classList.remove('recording');
            uiElements.micBtn.style.color = "";
        };
        recognition.onerror = () => {
            uiElements.micBtn.classList.remove('recording');
            uiElements.micBtn.style.color = "";
        };
    }

    if (uiElements.input) {
        uiElements.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        });
        uiElements.input.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 180) + 'px';
        });
        uiElements.input.focus();
    }

    if (uiElements.sendBtn) {
        uiElements.sendBtn.onclick = (e) => {
            e.preventDefault();
            handleSend();
        };
    }

    console.log("%c🏁 VLU AI Core: Ready to chat!", "color: #00ff00; font-weight: bold;");
});

window.copyText = (el) => {
    const textWrapper = el.closest('.message-wrapper') || el.closest('.bot-message');
    if (!textWrapper) return;
    const text = textWrapper.querySelector('.content').innerText;
    navigator.clipboard.writeText(text).then(() => {
        const originalIcon = el.className;
        el.className = "fas fa-check";
        setTimeout(() => el.className = originalIcon, 2000);
    });
};

window.speakText = (el) => {
    const textWrapper = el.closest('.message-wrapper') || el.closest('.bot-message');
    if (!textWrapper) return;
    const text = textWrapper.querySelector('.content').innerText;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    window.speechSynthesis.speak(utterance);
};