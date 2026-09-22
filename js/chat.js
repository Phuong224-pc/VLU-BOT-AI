const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

window.currentChatId = null;
window.vluAllKnowledgeContent = "";
window.vluCurriculumK30Content = "";

function compactText(text, maxChars) {
    if (!text) return "";
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars) + "\n\n...[Đã rút gọn dữ liệu tri thức để tránh vượt giới hạn token]";
}

function extractCreditCorrection(text) {
    const m = (text || "").match(/(?:đã\s*)?(?:tích\s*l[uũ]y|h[oọ]c|đ[aạ]t)?\s*(\d{1,3})\s*(?:tc|t[ií]n\s*ch[iỉ])/i);
    if (!m) return null;
    const value = parseInt(m[1], 10);
    return Number.isFinite(value) && value >= 0 && value <= 126 ? value : null;
}

function normalizeVietnameseText(text) {
    return String(text || "")
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd');
}

function isGraduationOptionQuery(text) {
    const normalized = normalizeVietnameseText(text);
    if (!normalized) return false;

    const asksGraduation =
        normalized.includes('tot nghiep') ||
        normalized.includes('ra truong') ||
        normalized.includes('khoa luan') ||
        normalized.includes('do an tot nghiep') ||
        normalized.includes('thay the khoa luan');

    if (!asksGraduation) return false;

    // Nếu người dùng đang gửi bảng điểm hoặc hỏi phân tích cá nhân,
    // để luồng cố vấn AI xử lý thay vì trả lời khối tốt nghiệp cố định.
    const needsTranscriptAnalysis = [
        'bang diem', 'ket qua hoc tap', 'anh diem', 'hinh diem',
        'da hoc bao nhieu', 'bao nhieu tin chi', 'con thieu bao nhieu',
        'con thieu gi', 'kiem tra giup', 'phan tich', 'mssv', 'gpa'
    ].some(keyword => normalized.includes(keyword));

    return !needsTranscriptAnalysis;
}



// ===== DETERMINISTIC COURSE LOOKUP FROM K30 CURRICULUM =====
// Xử lý trực tiếp các câu hỏi kiểu "tôi muốn học [tên môn]" để tránh AI suy đoán sai điều kiện học trước.
function getCurriculumCoursesFromLoadedText() {
    if (window.vluCurriculumCourseCache && window.vluCurriculumCourseCache.length) {
        return window.vluCurriculumCourseCache;
    }

    const source = window.vluCurriculumK30Content || window.vluAllKnowledgeContent || "";
    const courses = [];
    const seen = new Set();

    source.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (!/^\d{2}[A-Z0-9]{6,}\s*\|/.test(trimmed)) return;

        const parts = trimmed.split('|').map(part => part.trim());
        if (parts.length < 4) return;

        const code = parts[0];
        if (seen.has(code)) return;

        const getField = (prefix) => {
            const normalizedPrefix = normalizeVietnameseText(prefix);
            const field = parts.find(part => normalizeVietnameseText(part).startsWith(normalizedPrefix));
            if (!field) return "";
            const colonIndex = field.indexOf(':');
            return colonIndex >= 0 ? field.slice(colonIndex + 1).trim() : field.trim();
        };

        const creditsMatch = (parts[3] || "").match(/\d+/);
        const course = {
            code,
            name: parts[1] || "",
            englishName: parts[2] || "",
            credits: creditsMatch ? Number(creditsMatch[0]) : null,
            curriculumCode: parts[4] || "",
            group: getField('Nhóm'),
            major: getField('Chuyên ngành'),
            year: getField('Năm') || (parts.find(part => normalizeVietnameseText(part).startsWith('nam ')) || ""),
            semester: getField('HK') || (parts.find(part => normalizeVietnameseText(part).startsWith('hk ')) || ""),
            prerequisiteText: getField('Tiên quyết'),
            priorText: getField('Học trước')
        };

        course.prerequisites = parseCurriculumRequirement(course.prerequisiteText);
        course.priorCourses = parseCurriculumRequirement(course.priorText);

        seen.add(code);
        courses.push(course);
    });

    window.vluCurriculumCourseCache = courses;
    return courses;
}

function parseCurriculumRequirement(rawText) {
    const raw = String(rawText || "").replace(/^[:\s]+/, '').trim();
    if (!raw || normalizeVietnameseText(raw) === 'khong') return [];

    const requirements = [];
    const regex = /\[?([0-9]{2}[A-Z0-9]{6,})\]?\s*(?:[-–—])?\s*([^,;|]*)/gi;
    let match;

    while ((match = regex.exec(raw)) !== null) {
        requirements.push({
            code: match[1].trim(),
            name: String(match[2] || "").replace(/^[-–—\s]+/, '').trim()
        });
    }

    return requirements.length ? requirements : [{ code: "", name: raw }];
}

function findCourseByQuestion(question) {
    const courses = getCurriculumCoursesFromLoadedText();
    if (!courses.length) return null;

    const original = String(question || "");
    const normalized = normalizeVietnameseText(original);
    const codeMatch = original.match(/\b\d{2}[A-Z0-9]{6,}\b/i);

    if (codeMatch) {
        const code = codeMatch[0].toUpperCase();
        const byCode = courses.find(course => course.code.toUpperCase() === code);
        if (byCode) return byCode;
    }

    const aliases = [
        { keys: ['java nang cao', 'advanced java'], code: '71ITSE30803' },
        { keys: ['lap trinh ung dung java', 'java application programming'], code: '71ITSE30403' },
        { keys: ['toi uu hoa may tim kiem', 'search engine optimization', ' seo '], code: '71ITIS30603' },
        { keys: ['thuong mai dien tu', 'e-commerce', 'e commerce'], code: '71ITIS30503' },
        { keys: ['do an tot nghiep', 'graduation project'], code: '71ITGR40206' }
    ];

    for (const alias of aliases) {
        if (alias.keys.some(key => normalized.includes(key.trim()) || ` ${normalized} `.includes(key))) {
            const byAlias = courses.find(course => course.code === alias.code);
            if (byAlias) return byAlias;
        }
    }

    const matched = courses
        .filter(course => {
            const name = normalizeVietnameseText(course.name);
            const english = normalizeVietnameseText(course.englishName);
            return (name && normalized.includes(name)) || (english && normalized.includes(english));
        })
        .sort((a, b) => normalizeVietnameseText(b.name).length - normalizeVietnameseText(a.name).length);

    return matched[0] || null;
}

function isSpecificCourseQuestion(question) {
    const normalized = normalizeVietnameseText(question);
    if (!normalized) return false;

    const intentWords = [
        'toi muon hoc', 'muon hoc', 'hoc mon', 'dang ky', 'dang ki',
        'mon nay', 'hoc phan', 'tien quyet', 'hoc truoc', 'dieu kien',
        'co hoc duoc', 'duoc hoc', 'nen hoc', 'can hoc', 'thong tin mon'
    ];

    return intentWords.some(word => normalized.includes(word));
}

function resolveRequirementLabel(requirement, courses) {
    if (!requirement) return "Không";

    const knownCourse = requirement.code
        ? courses.find(course => course.code.toUpperCase() === requirement.code.toUpperCase())
        : null;

    const name = (knownCourse && knownCourse.name) || requirement.name || "";
    if (requirement.code && name) return `${requirement.code} – ${name}`;
    if (requirement.code) return requirement.code;
    return name || "Không";
}

function formatRequirementCell(requirements, courses) {
    if (!requirements || !requirements.length) return "Không";
    return requirements.map(req => resolveRequirementLabel(req, courses)).join('<br>');
}

function safeTableText(value) {
    return String(value || "Không").replace(/\|/g, '/');
}

function formatCourseLookupResponse(course) {
    const courses = getCurriculumCoursesFromLoadedText();
    const prerequisiteCell = formatRequirementCell(course.prerequisites, courses);
    const priorCell = formatRequirementCell(course.priorCourses, courses);
    const firstRequirement = (course.priorCourses && course.priorCourses[0]) || (course.prerequisites && course.prerequisites[0]);
    const requirementLabel = firstRequirement ? resolveRequirementLabel(firstRequirement, courses) : "";
    // Chỉ hiển thị năm học gợi ý. Không hiển thị HK để tránh UI sinh dòng thừa kiểu "HK 2 |".
    const timeHint = course.year || "Không rõ";

    let conclusion;
    if (firstRequirement) {
        conclusion = `Bạn có thể đăng ký học phần này khi đã học và đạt **${requirementLabel}**. Nếu chưa đạt học phần này, bạn nên hoàn thành trước rồi mới đăng ký **${course.name}**.`;
    } else {
        conclusion = `Học phần này không có điều kiện tiên quyết/học trước trong khung K30. Bạn có thể cân nhắc đăng ký nếu phù hợp học kỳ, chuyên ngành và kế hoạch tín chỉ của mình.`;
    }

    return `
📘 **Tra cứu học phần theo Khung CTĐT K30 CNTT**

| Nội dung | Thông tin |
|---|---|
| **Mã học phần** | **${safeTableText(course.code)}** |
| **Tên học phần** | **${safeTableText(course.name)}** |
| **Tên tiếng Anh** | ${safeTableText(course.englishName)} |
| **Số tín chỉ** | **${course.credits || "Không rõ"} tín chỉ** |
| **Nhóm kiến thức** | ${safeTableText(course.group)} |
| **Chuyên ngành** | ${safeTableText(course.major)} |
| **Thời điểm gợi ý** | ${safeTableText(timeHint)} |

**Điều kiện học phần**

| Loại điều kiện | Kết quả |
|---|---|
| **Tiên quyết** | ${prerequisiteCell} |
| **Học trước** | ${priorCell} |

✅ **Kết luận:** ${conclusion}

📌 **Lưu ý:** Nếu bạn gửi thêm bảng điểm, bot sẽ kiểm tra trực tiếp xem bạn đã đủ điều kiện đăng ký học phần này chưa.
`.trim();
}

function getDeterministicCurriculumReply(question) {
    if (isGraduationOptionQuery(question)) {
        return formatGraduationResponse();
    }

    const course = findCourseByQuestion(question);
    if (course && isSpecificCourseQuestion(question)) {
        return formatCourseLookupResponse(course);
    }

    return null;
}

function getApiKey() {
    return (typeof window.CONFIG !== "undefined" && window.CONFIG.GROQ_API_KEY) ? window.CONFIG.GROQ_API_KEY : "";
}

async function loadKnowledgeBase() {
    const knowledgeRoots = ['/knowledge', '/VLU-Chatbot/knowledge'];
    let combinedData = "";
    let curriculumK30 = "";

    for (const root of knowledgeRoots) {
        try {
            const listResponse = await fetch(`${root}/list.json`);
            if (!listResponse.ok) continue;

            const fileList = await listResponse.json();

            for (const fileName of fileList) {
                try {
                    const fileResponse = await fetch(`${root}/${fileName}`);
                    if (fileResponse.ok) {
                        const fileText = await fileResponse.text();
                        combinedData += `--- NỘI DUNG TỆP TRI THỨC CHÍNH THỨC: ${fileName} ---\n${fileText}\n\n`;

                        if (fileName.toLowerCase().includes('khungk30') || fileName.toLowerCase().includes('curriculum')) {
                            curriculumK30 += `--- KHUNG CHƯƠNG TRÌNH K30: ${fileName} ---\n${fileText}\n\n`;
                        }
                    }
                } catch (fileErr) { console.error(`Không thể nạp tệp ${root}/${fileName}:`, fileErr); }
            }
        } catch (err) { console.warn(`Không thể nạp danh mục tri thức từ ${root}:`, err); }
    }

    // Fallback trực tiếp để tránh lỗi sai đường dẫn list.json khi deploy Firebase.
    if (!curriculumK30) {
        for (const root of knowledgeRoots) {
            try {
                const directResponse = await fetch(`${root}/khungK30.txt`);
                if (directResponse.ok) {
                    const fileText = await directResponse.text();
                    curriculumK30 += `--- KHUNG CHƯƠNG TRÌNH K30: khungK30.txt ---\n${fileText}\n\n`;
                    combinedData += `--- NỘI DUNG TỆP TRI THỨC CHÍNH THỨC: khungK30.txt ---\n${fileText}\n\n`;
                    break;
                }
            } catch (err) { console.warn(`Không thể nạp trực tiếp khungK30 từ ${root}:`, err); }
        }

        // Fallback bổ sung từ file Word người dùng cung cấp.
        for (const root of knowledgeRoots) {
            try {
                const wordResponse = await fetch(`${root}/khungK30_word.txt`);
                if (wordResponse.ok) {
                    const fileText = await wordResponse.text();
                    curriculumK30 += `--- KHUNG CHƯƠNG TRÌNH K30 TỪ FILE WORD: khungK30_word.txt ---\n${fileText}\n\n`;
                    combinedData += `--- NỘI DUNG TỆP TRI THỨC CHÍNH THỨC: khungK30_word.txt ---\n${fileText}\n\n`;
                    break;
                }
            } catch (err) { console.warn(`Không thể nạp trực tiếp khungK30_word từ ${root}:`, err); }
        }
    }

    window.vluAllKnowledgeContent = combinedData;
    window.vluCurriculumK30Content = curriculumK30;
}

async function sendMessage() {
    const ui = {
        input: document.getElementById('userInput'),
        display: document.getElementById('messagesContainer'),
        box: document.getElementById('chatbox'),
        welcome: document.getElementById('welcomeScreen'),
        preContainer: document.getElementById('imagePreviewContainer')
    };

    if (!ui.input || !ui.display) return;

    const text = ui.input.value.trim();
    const docContent = window.lastUploadedDocContent || "";
    const previewImages = ui.preContainer ? Array.from(ui.preContainer.querySelectorAll('img')) : [];
    const hasImage = previewImages.length > 0;

    if (!text && !hasImage && !docContent) return;

    // Bảo đảm đã nạp khung chương trình K30 trước khi gửi câu hỏi lên AI.
    if (!window.vluAllKnowledgeContent && typeof loadKnowledgeBase === 'function') {
        await loadKnowledgeBase();
    }

    if (ui.welcome) ui.welcome.classList.add('hidden');

    // Lấy và nén ảnh trước khi xóa preview. Đây là dữ liệu sẽ gửi lên model vision.
    const imagePayloads = [];
    if (hasImage) {
        for (const img of previewImages) {
            const src = img.src;
            let dataToSend = src;
            if (window.featureVision && typeof window.featureVision.compressImage === 'function') {
                dataToSend = await window.featureVision.compressImage(src, 1300);
            }
            imagePayloads.push(dataToSend);
        }
    }

    const imageDefaultPrompt = `Hãy đọc nội dung trong ảnh và trả lời rõ ràng bằng tiếng Việt. Nếu ảnh là câu hỏi trắc nghiệm, hãy chọn đáp án đúng và giải thích ngắn gọn. Nếu ảnh là bảng điểm/kết quả học tập, KHÔNG được tính tổng ngay. Trước tiên phải in ra bảng tất cả môn đã đọc được từ ảnh theo từng học kỳ: Mã môn, tên môn, tín chỉ, điểm hệ 10, điểm hệ 4, điểm chữ, kết quả. Sau khi đã liệt kê dữ liệu đọc được, mới lập các bảng tổng hợp: tổng tín chỉ đã đạt, môn không tính tín chỉ, môn chưa đạt, môn còn thiếu khi đối chiếu khung CTĐT K30 CNTT. Nếu trong ảnh có nhiều dòng tổng theo học kỳ, phải lấy dòng tổng ở học kỳ mới nhất/lớn nhất như "Tổng số tín chỉ tích lũy" hoặc "Tổng số tín chỉ đã đạt"; không được lấy nhầm tổng của học kỳ cũ. Chỉ tính theo dữ liệu nhìn thấy rõ trong ảnh; nếu ảnh nhỏ/mờ/không thấy hết, phải nói rõ chưa đủ dữ liệu, không được tự suy đoán. Tuyệt đối không dùng tổng 126 TC của chương trình làm tín chỉ đã học. Không được lấy nhầm "Số tín chỉ đạt học kỳ" thành "Tổng tín chỉ đã đạt"; phải ưu tiên số "Tổng số tín chỉ tích lũy" của học kỳ cuối cùng nhìn thấy trong ảnh. Tuyệt đối không liệt kê một môn là còn thiếu nếu môn đó đã xuất hiện trong ảnh bảng điểm với trạng thái đạt hoặc điểm chữ đạt.`;
    const userQuestion = text || (hasImage ? imageDefaultPrompt : "");

    // Hiển thị tin nhắn người dùng
    if (hasImage) {
        renderUserImageGridMessage(imagePayloads);
        if (text) renderUserMessage(text);
        saveChatToLocal('user', text ? `[Hình ảnh] ${text}` : "[Hình ảnh] Đọc ảnh và trả lời");

        const previewList = ui.preContainer.querySelector('#previewList');
        if (previewList) previewList.innerHTML = '';
        ui.preContainer.style.display = 'none';
    } else if (text || docContent) {
        const displayPrompt = text + (docContent ? `\n*(Đã đính kèm tài liệu)*` : "");
        renderUserMessage(displayPrompt);
        saveChatToLocal('user', displayPrompt);
    }

    ui.input.value = '';
    ui.input.style.height = 'auto';

    const typingMsg = showTypingIndicator();

    if (!hasImage && !docContent) {
        const deterministicReply = getDeterministicCurriculumReply(userQuestion);
        if (deterministicReply) {
            removeTypingIndicator(typingMsg);
            renderBotMessage(deterministicReply, true);
            saveChatToLocal('bot', deterministicReply);
            return;
        }
    }

    const apiKey = getApiKey();

    if (!apiKey) {
        setTimeout(() => {
            removeTypingIndicator(typingMsg);
            renderBotMessage("Ối! Bạn chưa dán Key vào config.js kìa!", true);
        }, 600);
        return;
    }

    // --- KIỂM TRA TỪ KHÓA BẰNG HÀM CÓ SẴN (NẾU CÓ) ---
    const textLower = userQuestion.toLowerCase();
    const userCreditCorrection = extractCreditCorrection(userQuestion);
    const isVLUKeywords = textLower.includes('văn lang') || textLower.includes('vlu') || (textLower.includes('học phần') && textLower.includes('đăng ký')) || (textLower.includes('tốt nghiệp') && textLower.includes('điều kiện')) || (textLower.includes('lịch thi') || textLower.includes('phòng thi'));

    if (isVLUKeywords && !hasImage && !docContent && window.ui && typeof window.ui.fetchVLUData === 'function') {
        try {
            const botReply = await window.ui.fetchVLUData(userQuestion);
            removeTypingIndicator(typingMsg);
            renderBotMessage(botReply, true);
            saveChatToLocal('bot', botReply);
        } catch (err) {
            removeTypingIndicator(typingMsg);
            renderBotMessage("Ối! Hệ thống tra cứu dữ liệu trường gặp sự cố rồi.", true);
        }
        return;
    }

    // --- THIẾT LẬP LUỒNG LIÊN KẾT LỊCH SỬ CHAT (MULTI-TURN) ---
    let systemPrompt = `Bạn là Trợ lý Ảo Tư vấn Học tập của Khoa CNTT - Đại học Văn Lang. Bạn có nhiệm vụ hướng dẫn sinh viên đăng ký môn học và lên lộ trình theo quy tắc tương tác từng bước (Multi-turn conversation).

QUY TẮC ĐỊNH DẠNG CÂU TRẢ LỜI:
- Luôn trình bày rõ ràng bằng Markdown.
- Những nhãn quan trọng phải in đậm, ví dụ: **Đáp án đúng:**, **Giải thích:**, **Kết luận:**, **Lưu ý:**.
- Mỗi ý chính viết trên một dòng riêng, không gộp toàn bộ câu trả lời thành một đoạn dài.
- Với câu hỏi trắc nghiệm, ưu tiên cấu trúc:
  **Đáp án đúng:** [chữ cái + nội dung đáp án]
  
  **Giải thích:** [giải thích ngắn gọn, dễ hiểu]
- Không lạm dụng in đậm toàn bộ câu; chỉ in đậm phần cần nhấn mạnh.

QUY TẮC ĐỌC ẢNH:
- Khi người dùng gửi ảnh, hãy đọc chữ trong ảnh trước, sau đó trả lời đúng trọng tâm câu hỏi.
- Nếu ảnh là câu hỏi trắc nghiệm, hãy xác định đáp án đúng theo các lựa chọn trong ảnh, rồi giải thích ngắn gọn.
- Nếu chữ trong ảnh bị mờ hoặc thiếu dữ liệu, hãy nói rõ phần chưa đọc chắc chắn, không bịa.

QUY TẮC ĐỌC ẢNH BẢNG ĐIỂM / KẾT QUẢ HỌC TẬP:
- Nếu người dùng chụp bảng điểm, hãy trích xuất dữ liệu theo từng dòng môn học: Học kỳ, mã môn, tên môn, số tín chỉ, điểm hệ 10, điểm hệ 4, điểm chữ, kết quả.
- Nếu người dùng gửi nhiều ảnh, hãy xem đó là các phần của cùng một bảng điểm. Ghép dữ liệu lại theo đúng thứ tự học kỳ và KHÔNG tính trùng môn.
- BẮT BUỘC LÀM THEO THỨ TỰ NÀY, KHÔNG ĐƯỢC NHẢY THẲNG VÀO TỔNG HỢP:
  **Bước 1:** In ra toàn bộ dữ liệu môn học đọc được từ ảnh, chia theo từng học kỳ bằng bảng Markdown. Bảng phải có cột: Học kỳ | Mã môn | Tên môn | TC | Điểm 10 | Điểm 4 | Điểm chữ | Kết quả | Tính TC?
  **Bước 2:** Sau khi đã liệt kê dữ liệu đọc được, mới cộng tín chỉ và lập bảng tổng quan.
  **Bước 3:** Cuối cùng mới đối chiếu khung CTĐT K30 CNTT ĐỂ LIỆT KÊ MÔN CÒN THIẾU/CẦN HỌC TIẾP.
- Tuyệt đối KHÔNG dùng tổng 126 TC của chương trình làm tín chỉ đã học. 126 TC chỉ là mốc yêu cầu để tốt nghiệp.
- Tổng tín chỉ đã đạt phải lấy theo một trong hai cách sau:
  1) Ưu tiên dùng dòng "Tổng số tín chỉ tích lũy" hoặc "Tổng số tín chỉ đã đạt" ở học kỳ mới nhất/cuối cùng nhìn thấy rõ trong ảnh, đặc biệt là khối tổng kết màu be ở bên phải cuối mỗi học kỳ. Nếu ảnh mới nhất nhìn thấy "Tổng số tín chỉ tích lũy: 65" thì tổng đã đạt là 65 TC. Nếu người dùng đã sửa lại con số tín chỉ, phải ưu tiên con số người dùng xác nhận.
  2) Nếu không thấy dòng tổng, tự cộng từ các môn đọc được rõ ràng và đã đạt.
- Khi tính tín chỉ, phải tự kiểm tra lại phép trừ: Tín chỉ còn thiếu = 126 - Tổng tín chỉ đã đạt. Ví dụ đã đạt 42 TC thì còn thiếu 84 TC; đã đạt 59 TC thì còn thiếu 67 TC; đã đạt 65 TC thì còn thiếu 61 TC. Không được ghi mâu thuẫn giữa tổng đã đạt và còn thiếu.
- Nếu ảnh nhỏ/mờ, chỉ thấy thumbnail, thiếu cột hoặc không đọc chắc số tín chỉ/điểm, hãy nói: "Ảnh chưa đủ rõ để tính chính xác" và KHÔNG được tự suy đoán thành số lớn.
- Tín chỉ đã học chỉ tính các môn có trạng thái Đạt/Passed/dấu tick xanh hoặc điểm chữ đạt: A+, A, B+, B, C+, C, D+, D, P và TC > 0. Không tính môn Rớt, F, Học lại, Chưa đạt, Vắng thi, MT, điểm bảo lưu 0 tín chỉ.
- Không được tự loại môn chính trị, giáo dục thể chất, giáo dục quốc phòng ra khỏi tổng tín chỉ nếu bảng điểm ghi TC > 0 và kết quả đạt. Ví dụ Kinh tế chính trị Mác-Lênin 2 TC điểm B, GDQP, Bơi lội, Bóng rổ, Chủ nghĩa xã hội khoa học đều phải tính TC nếu đã đạt.
- Chỉ loại Anh văn dự bị/AV0 hoặc Kiểm tra tiếng Anh đầu khóa nếu TC = 0, điểm chữ MT hoặc bảng ghi rõ không tính tín chỉ.
- Các môn Giáo dục quốc phòng, Giáo dục thể chất, kiểm tra tiếng Anh đầu khóa, chứng chỉ/điều kiện đầu ra có thể hiển thị trong bảng đã đọc được nhưng nếu cột tín chỉ là 0 hoặc là điều kiện riêng thì ghi "Không tính TC".
- Khi đối chiếu với khung CTĐT K30 CNTT, bắt buộc dùng thuật toán đối chiếu hai lớp:
  1) Ưu tiên so mã môn/mã học phần.
  2) Nếu mã khác hoặc ảnh mờ, so tên môn gần giống không phân biệt hoa thường/dấu câu/dấu tiếng Việt.
- TUYỆT ĐỐI KHÔNG được đưa một môn vào danh sách "còn thiếu" nếu môn đó đã xuất hiện trong bảng điểm với trạng thái đạt. Ví dụ nếu ảnh đã có "Lập trình hướng đối tượng", "Các nền tảng phát triển phần mềm", "Lập trình ứng dụng Web", "Cấu trúc dữ liệu và giải thuật", "Toán rời rạc" thì các môn này phải được xếp vào nhóm ĐÃ ĐẠT, không được liệt kê lại là thiếu.
- Nếu chưa chắc môn đã đạt hay chưa do ảnh mờ, hãy đặt vào mục "Cần kiểm tra lại" thay vì kết luận thiếu.
- Khi người dùng hỏi đã học bao nhiêu tín chỉ/còn thiếu gì, phải trình bày bằng Markdown table, không viết một đoạn dài. Tuyệt đối không bọc bảng trong dấu backtick/code block, không ghi dòng "Code", không thụt đầu dòng trước bảng. Cấu trúc bắt buộc:

  **1. Dữ liệu bảng điểm đọc được**
  | Học kỳ | Mã môn | Tên môn | TC | Điểm 10 | Điểm 4 | Điểm chữ | Kết quả | Tính TC? |
  |---|---|---|---:|---:|---:|---|---|---|

  **2. Tổng quan tín chỉ**
  | Hạng mục | Kết quả |
  |---|---|
  | Tổng tín chỉ đã đạt | ... / 126 TC |
  | Tín chỉ còn thiếu | ... TC |
  | Số môn đã đọc được | ... môn |
  | Số môn không tính TC | ... môn |
  | Mức độ chắc chắn | Cao/Trung bình/Thấp + lý do |

  **3. Thống kê theo nhóm môn**
  | Nhóm môn | Đã đạt | Còn thiếu | Ghi chú |
  |---|---:|---:|---|
  | Cơ sở khối ngành | ... | ... | ... |
  | Cơ sở ngành | ... | ... | ... |
  | Chuyên ngành/chuyên sâu | ... | ... | ... |

  **4. Môn chưa đạt / cần học lại**
  | Mã môn | Tên môn | Điểm chữ | Ghi chú |
  |---|---|---|---|

  **5. Gợi ý học kỳ tiếp theo**
  | Thứ tự | Môn nên học | Lý do |
  |---:|---|---|
- Nếu ảnh bảng điểm không đủ toàn bộ học kỳ hoặc không đọc được hết, hãy mở đầu bằng câu: "Mình chỉ tính theo phần bảng điểm đọc được trong ảnh." và yêu cầu gửi thêm ảnh/phần còn thiếu.
- Không tự bịa điểm, tín chỉ hoặc môn đã học nếu không đọc được trong ảnh.

QUY TẮC TƯƠNG TÁC QUAN TRỌNG CHO CỐ VẤN LỘ TRÌNH:
1. Khi sinh viên gửi bảng điểm/ảnh điểm, BẮT BUỘC in lại toàn bộ dữ liệu đọc được trước; sau đó mới rà soát tổng số môn đã đạt và tổng tín chỉ đã đạt.
2. Sau khi phân tích bảng điểm, BẮT BUỘC hỏi sinh viên đang theo chuyên ngành nào: Công nghệ Phần mềm, Công nghệ Dữ liệu hay Trí tuệ Nhân tạo. Chỉ khi sinh viên trả lời chuyên ngành thì mới đề xuất môn chuyên ngành kỳ tới.
3. Khi sinh viên trả lời chuyên ngành, gợi ý môn kỳ tới theo quy tắc:
   - Ưu tiên môn chưa học/chưa đạt trong khung CTĐT.
   - Chỉ gợi ý môn mà điều kiện học trước đã đạt hoặc không có điều kiện.
   - Nếu môn có điều kiện chưa đạt, đưa vào mục "Chưa nên đăng ký vì thiếu điều kiện".

4. Khi sinh viên hỏi muốn học một môn cụ thể, phải kiểm tra điều kiện học trước/tiên quyết bằng khung CTĐT:
   - Nếu ĐÃ ĐỦ điều kiện:
     → Chỉ được trả lời: "Bạn đã đủ điều kiện để đăng ký môn này."
   - Nếu CHƯA ĐỦ điều kiện:
     → KHÔNG được dùng câu chung chung như "nếu đủ điều kiện tiên quyết".
     → PHẢI chỉ rõ:
        1. Môn đang thiếu
        2. Mã môn điều kiện tiên quyết (nếu có)
        3. Câu bắt buộc: "Bạn cần học và đạt môn [Tên môn điều kiện] trước khi học môn này."
   - Nếu không tìm thấy dữ liệu điều kiện:
     → Trả lời: "Không xác định được điều kiện tiên quyết từ dữ liệu hiện tại."
   - TUYỆT ĐỐI không dùng câu mơ hồ kiểu: "nếu đủ điều kiện tiên quyết thì học được"

5. Trường hợp đặc biệt bắt buộc: "Các nền tảng phát triển phần mềm" / "71ITDS30103" có điều kiện học trước là "71ITBS10103 - Nhập môn Công nghệ thông tin". Nếu bảng điểm chưa có hoặc chưa rõ đã đạt môn Nhập môn Công nghệ thông tin, phải nhắc: "Bạn cần học và đạt Nhập môn Công nghệ thông tin trước rồi mới nên đăng ký Các nền tảng phát triển phần mềm."`;

    if (userCreditCorrection !== null) {
        systemPrompt += `

NGƯỜI DÙNG ĐÃ XÁC NHẬN / SỬA SỐ TÍN CHỈ: ${userCreditCorrection} TC. Khi trả lời phải dùng đúng ${userCreditCorrection} TC là tín chỉ đã đạt và tính tín chỉ còn thiếu = 126 - ${userCreditCorrection} = ${126 - userCreditCorrection} TC. Nếu câu trả lời trước đó khác số này, hãy nhận lỗi và sửa lại.`;
    }

    // Nạp kho tri thức chính thức vào System Prompt nếu phát hiện câu hỏi liên quan đến VLU hoặc bảng điểm.
    const isTranscriptQuery = hasImage || (
        textLower.includes('bảng điểm') ||
        textLower.includes('kết quả học tập') ||
        textLower.includes('tín chỉ') ||
        textLower.includes('đã học') ||
        textLower.includes('còn thiếu') ||
        textLower.includes('cơ sở khối ngành') ||
        textLower.includes('cơ sở ngành') ||
        textLower.includes('chuyên ngành') ||
        textLower.includes('môn tiếp') ||
        textLower.includes('học tiếp') ||
        textLower.includes('lộ trình') ||
        textLower.includes('tốt nghiệp') ||
        textLower.includes('ra trường') ||
        !text
    );

    const isVLUQuery = isTranscriptQuery || textLower.includes('ngành') || textLower.includes('học phần') || textLower.includes('môn') || textLower.includes('đào tạo') || textLower.includes('lộ trình') || textLower.includes('khung') || textLower.includes('chuyên ngành') || textLower.includes('cơ sở ngành') || textLower.includes('bảng điểm') || textLower.includes('kết quả học tập') || textLower.includes('tín chỉ') || textLower.includes('tốt nghiệp') || textLower.includes('ra trường') || textLower.includes('quy chế') || textLower.includes('học phí') || textLower.includes('k30') || textLower.includes('lập trình') || textLower.includes('toán rời rạc') || textLower.includes('tiên quyết');

    if (isTranscriptQuery && window.vluCurriculumK30Content) {
        systemPrompt += `

KHUNG CHƯƠNG TRÌNH K30 CNTT ĐỂ ĐỐI CHIẾU BẢNG ĐIỂM:
${compactText(window.vluCurriculumK30Content, hasImage ? 7000 : 22000)}

LƯU Ý BẮT BUỘC: Chỉ dùng khung chương trình trên để đối chiếu môn còn thiếu, KHÔNG dùng khung chương trình để suy ra sinh viên đã học đủ tín chỉ. Không tự bịa môn học, mã môn, số tín chỉ hoặc điều kiện tiên quyết. Khi phân tích bảng điểm, ưu tiên các nhóm Công nghệ thông tin: Kiến thức cơ sở khối ngành, Kiến thức cơ sở ngành, Kiến thức chuyên ngành/chuyên sâu. Phải đối chiếu cả mã môn và tên môn; môn nào đã xuất hiện trong ảnh bảng điểm với trạng thái đạt thì không được liệt kê là còn thiếu. Nếu ảnh bảng điểm không đủ dữ liệu, hãy nói rõ phạm vi tính toán. Bắt buộc in bảng "Dữ liệu bảng điểm đọc được" trước, sau đó mới lập bảng tổng hợp và đối chiếu môn thiếu.`;
    } else if (isVLUQuery && window.vluAllKnowledgeContent) {
        systemPrompt += `

CƠ SỞ DỮ LIỆU TRI THỨC CHÍNH THỨC CỦA ĐẠI HỌC VĂN LANG:
${compactText(window.vluAllKnowledgeContent, 22000)}

LƯU Ý: Tuyệt đối không tự bịa đặt môn học hoặc điều kiện nằm ngoài dữ liệu trên. Định dạng câu trả lời bằng Markdown đẹp đẽ, rõ ràng.`;
    } else if (docContent) {
        systemPrompt += `

NỘI DUNG TÀI LIỆU ĐÍNH KÈM:
${compactText(docContent, 9000)}`;
    }

    // Bốc lịch sử trò chuyện thực tế từ LocalStorage để gửi lên API (Giúp bot nhớ mạch Có/Chưa)
    let apiMessages = [{ role: "system", content: systemPrompt }];
    let allChats = JSON.parse(localStorage.getItem('vlu_chat_sessions')) || {};

    if (window.currentChatId && allChats[window.currentChatId]) {
        // Bỏ tin nhắn user vừa lưu ở cuối để tránh gửi trùng. Tin hiện tại sẽ được thêm bằng payload bên dưới.
        const history = allChats[window.currentChatId].messages.slice(-11, -1);
        history.forEach(msg => {
            apiMessages.push({
                role: msg.role === 'bot' ? 'assistant' : 'user',
                content: msg.text
            });
        });
    }

    let combinedText = userQuestion;
    if (docContent) combinedText = `Nội dung tài liệu: ${compactText(docContent, 9000)}\n\nCâu hỏi: ${userQuestion || "Hãy tóm tắt tài liệu."}`;

    if (hasImage) {
        const contentPayload = [{ type: "text", text: combinedText || imageDefaultPrompt }];
        imagePayloads.forEach(url => {
            contentPayload.push({ type: "image_url", image_url: { url } });
        });
        apiMessages.push({ role: "user", content: contentPayload });
    } else {
        apiMessages.push({ role: "user", content: combinedText });
    }

    // --- GỌI API GROQ ---
    try {
        // Đổi cả hai trường hợp text và image sang bản Scout 17B để dùng hạn mức 30K TPM cực rộng
        const model = hasImage ?
            ((window.CONFIG && window.CONFIG.GROQ_VISION_MODEL) || "openai/gpt-oss-120b") :
            ((window.CONFIG && window.CONFIG.GROQ_TEXT_MODEL) || "openai/gpt-oss-120b");

        const response = await fetch(GROQ_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model,
                messages: apiMessages,
                // Hạ bớt max_tokens xuống để tiết kiệm hạn mức ngày và tránh lỗi overload
                max_tokens: hasImage ? 2048 : 1024,
                temperature: 0.1
            })
        });
        const data = await response.json();
        removeTypingIndicator(typingMsg);

        if (data.choices && data.choices[0]) {
            const botResponse = data.choices[0].message.content;
            renderBotMessage(botResponse, true);
            saveChatToLocal('bot', botResponse);
            window.lastUploadedDocContent = "";
        } else if (data.error) {
            renderBotMessage("Ối! Groq báo lỗi: " + data.error.message);
        }
    } catch (error) {
        removeTypingIndicator(typingMsg);
        renderBotMessage("Ối! Mạng chập chờn rồi bạn ơi.", true);
        console.error("Lỗi:", error);
    }
}

function renderUserMessage(text) {
    const container = document.getElementById('messagesContainer');
    if (!container) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = "message user-message fade-in";

    const contentDiv = document.createElement('div');
    contentDiv.className = "content";
    contentDiv.textContent = text || "";

    msgDiv.appendChild(contentDiv);
    container.appendChild(msgDiv);
    scrollToBottom();
}

function renderUserImageGridMessage(urls) {
    const container = document.getElementById('messagesContainer');
    if (!container || !Array.isArray(urls) || urls.length === 0) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = "message user-message user-image-grid-message fade-in";

    const contentDiv = document.createElement('div');
    contentDiv.className = "content";

    const gridDiv = document.createElement('div');
    gridDiv.className = "user-image-grid";
    if (urls.length === 1) gridDiv.classList.add('single-image');

    urls.forEach((url, index) => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Ảnh đã gửi ${index + 1}`;
        img.loading = 'lazy';
        gridDiv.appendChild(img);
    });

    contentDiv.appendChild(gridDiv);
    msgDiv.appendChild(contentDiv);
    container.appendChild(msgDiv);
    scrollToBottom();
}

function renderUserImageMessage(url) {
    renderUserImageGridMessage([url]);
}

function formatBotAnswerText(text) {
    let formatted = String(text || "").trim();
    if (!formatted) return "";

    const isAdvisorMode = document.body && document.body.classList.contains('advisor-mode');

    // Cố vấn lộ trình thường trả về bảng Markdown. Nếu model lỡ bọc bảng trong code block
    // hoặc sinh ra dòng "Code"/dòng thụt đầu dòng trước bảng, Marked sẽ hiểu nhầm thành khối code.
    // Chuẩn hóa mạnh trước khi parse để bảng điểm không bị hiện thành khung Code.
    if (isAdvisorMode) {
        formatted = formatted
            .replace(/```(?:markdown|md|text|txt|table|csv|html|json|javascript|js|code)?\s*/gi, "")
            .replace(/```/g, "")
            .replace(/^\s*[-*•]?\s*(?:<\/?[^>]+>\s*)?Code(?:\s*\[[^\]]*\])?\s*$/gim, "")
            .replace(/^\s*[-*•]?\s*(?:<\/?[^>]+>\s*)?Mã nguồn\s*$/gim, "")
            .replace(/^\s{2,}(\|.*)$/gm, "$1")
            .replace(/^\s{2,}([^\n]*\|[^\n]*)$/gm, "$1")
            .replace(/\n\s*\|\s*\n/g, "\n")
            .replace(/^\s*\|\s*$/gm, "");
    }

    // Chuẩn hóa xuống dòng quanh bảng Markdown để không bị dính thành một đoạn dài.
    formatted = formatted
        .replace(/\s+(\|\s*Học kỳ\s*\|)/gi, "\n\n$1")
        .replace(/\s+(\|\s*Hạng mục\s*\|)/gi, "\n\n$1")
        .replace(/\s+(\|\s*Nhóm môn\s*\|)/gi, "\n\n$1")
        .replace(/\s+(\|\s*Ưu tiên\s*\|)/gi, "\n\n$1")
        .replace(/\s+(\|\s*Mã môn\s*\|)/gi, "\n\n$1")
        .replace(/\s+(\|\s*Thứ tự\s*\|)/gi, "\n\n$1")
        .replace(/\|\s*(\d+\.\s+)/g, "|\n\n$1");

    // Chuẩn hóa các nhãn thường gặp để khi render bằng Markdown sẽ tự in đậm và xuống dòng đẹp hơn.
    const labelRules = [
        { regex: /(^|\n|\.\s+)(Câu trả lời đúng là\s*:)/gi, label: "Câu trả lời đúng là:" },
        { regex: /(^|\n|\.\s+)(Đáp án đúng là\s*:)/gi, label: "Đáp án đúng:" },
        { regex: /(^|\n|\.\s+)(Đáp án đúng\s*:)/gi, label: "Đáp án đúng:" },
        { regex: /(^|\n|\.\s+)(Đáp án\s*:)/gi, label: "Đáp án:" },
        { regex: /(^|\n|\.\s+)(Trả lời\s*:)/gi, label: "Trả lời:" },
        { regex: /(^|\n|\.\s+)(Giải thích\s*:)/gi, label: "Giải thích:" },
        { regex: /(^|\n|\.\s+)(Dữ liệu bảng điểm đọc được\s*:)/gi, label: "Dữ liệu bảng điểm đọc được:" },
        { regex: /(^|\n|\.\s+)(Tổng quan\s*:)/gi, label: "Tổng quan:" },
        { regex: /(^|\n|\.\s+)(Tổng quan tín chỉ\s*:)/gi, label: "Tổng quan tín chỉ:" },
        { regex: /(^|\n|\.\s+)(Thống kê theo nhóm môn\s*:)/gi, label: "Thống kê theo nhóm môn:" },
        { regex: /(^|\n|\.\s+)(Môn đã đạt quan trọng\s*:)/gi, label: "Môn đã đạt quan trọng:" },
        { regex: /(^|\n|\.\s+)(Môn còn thiếu\s*\/\s*cần học tiếp\s*:)/gi, label: "Môn còn thiếu / cần học tiếp:" },
        { regex: /(^|\n|\.\s+)(Môn chưa đạt\s*\/\s*cần học lại\s*:)/gi, label: "Môn chưa đạt / cần học lại:" },
        { regex: /(^|\n|\.\s+)(Gợi ý học kỳ tiếp theo\s*:)/gi, label: "Gợi ý học kỳ tiếp theo:" },
        { regex: /(^|\n|\.\s+)(Phân tích và đề xuất\s*:)/gi, label: "Phân tích và đề xuất:" },
        { regex: /(^|\n|\.\s+)(Kết luận\s*:)/gi, label: "Kết luận:" },
        { regex: /(^|\n|\.\s+)(Lưu ý\s*:)/gi, label: "Lưu ý:" }
    ];

    labelRules.forEach(({ regex, label }) => {
        formatted = formatted.replace(regex, (match, prefix) => {
            const separator = prefix && prefix.trim().endsWith('.') ? "\n\n" : (prefix || "");
            return `${separator}**${label}** `;
        });
    });

    formatted = formatted.replace(/\s+\*\*((Giải thích|Dữ liệu bảng điểm đọc được|Tổng quan|Tổng quan tín chỉ|Thống kê theo nhóm môn|Môn đã đạt quan trọng|Môn còn thiếu \/ cần học tiếp|Môn chưa đạt \/ cần học lại|Gợi ý học kỳ tiếp theo|Phân tích và đề xuất|Kết luận|Lưu ý)):\*\*/g, "\n\n**$1:**");

    // Tách các mục đánh số / gạch đầu dòng nếu API trả về dính liền.
    formatted = formatted.replace(/([^\n])\s+(\d+\.\s)/g, "$1\n\n$2");
    // Không tách dấu gạch ngang trong dòng bảng Markdown, vì các ô như "Năm 3 - HK 2"
    // có thể bị render thành bullet thừa "HK 2 |".
    formatted = formatted
        .split('\n')
        .map(line => line.includes('|') ? line : line.replace(/([^\n])\s+(-\s)/g, "$1\n$2"))
        .join('\n');

    // Dọn lỗi model hay sinh ra: hàng bảng rỗng, ký tự code fence thừa.
    if (isAdvisorMode) {
        formatted = formatted
            .replace(/^\s*\|\s*\|\s*$/gm, "")
            .replace(/^\s*\|\s*---[^\n]*$/gm, m => m.replace(/\s+/g, ' '))
            .replace(/•\s*<\/?>?\s*Code\s*/gi, "")
            .replace(/<\/?>\s*Code/gi, "")
            .replace(/\n\s*\|\s*\n/g, "\n");
    }

    formatted = formatted.replace(/\n{3,}/g, "\n\n");
    return formatted;
}

function looksLikeAdvisorTableCode(codeText) {
    const text = String(codeText || '').trim();
    if (!text) return false;
    const pipeCount = (text.match(/\|/g) || []).length;
    return pipeCount >= 4 && !/(function\s+|const\s+|let\s+|var\s+|=>|class\s+|<script|import\s+)/i.test(text);
}

function codeTextToPlainTableBlock(codeText) {
    let text = String(codeText || '').trim();
    text = text
        .replace(/^\s*[-*•]?\s*(?:<\/?[^>]+>\s*)?Code\s*$/gim, '')
        .replace(/^\s{2,}(\|.*)$/gm, '$1')
        .replace(/^\s*\|\s*$/gm, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    return text;
}

function renderBotMessage(text) {
    const container = document.getElementById('messagesContainer');
    if (!container) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = "message bot-message fade-in";

    const formattedText = formatBotAnswerText(text);
    if (typeof marked !== 'undefined' && marked.setOptions) { marked.setOptions({ gfm: true, breaks: false }); }
    let htmlContent = (typeof marked !== 'undefined') ? marked.parse(formattedText) : formattedText;
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    tempDiv.querySelectorAll('pre').forEach(pre => {
        const codeElement = pre.querySelector('code');
        const codeText = codeElement ? codeElement.textContent : pre.textContent;

        // Riêng màn Cố vấn lộ trình: nếu khối code thực chất là bảng Markdown bị parse lỗi,
        // bỏ khung Code và hiển thị lại như nội dung thường để tránh UI vỡ.
        if (document.body && document.body.classList.contains('advisor-mode') && looksLikeAdvisorTableCode(codeText)) {
            const plain = document.createElement('div');
            plain.className = 'advisor-table-plain';
            plain.textContent = codeTextToPlainTableBlock(codeText);
            pre.replaceWith(plain);
            return;
        }

        let wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';

        let lang = 'Code';
        if (codeElement) { const langClass = Array.from(codeElement.classList).find(c => c.startsWith('language-')); if (langClass) lang = langClass.replace('language-', '').toUpperCase(); }

        const header = document.createElement('div');
        header.className = 'code-header';
        header.innerHTML = `
            <span class="code-lang"><i class="fas fa-code"></i> ${lang}</span>
            <button class="copy-btn" onclick="window.ui.copyCode(this)" title="Sao chép mã nguồn">
                <i class="far fa-clone"></i>
            </button>
        `;

        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);
    });

    msgDiv.innerHTML = `
        <div class="bot-icon"><i class="fas fa-robot"></i></div>
        <div class="content">${tempDiv.innerHTML}</div>
    `;

    container.appendChild(msgDiv);
    if (window.Prism) window.Prism.highlightAllUnder(msgDiv);
    scrollToBottom();
}

window.renderBotMessage = renderBotMessage;
window.renderUserMessage = renderUserMessage;

function showTypingIndicator() {
    const c = document.getElementById('messagesContainer');
    if (!c) return null;
    const d = document.createElement('div');
    d.className = "message bot-message typing-indicator";
    d.innerHTML = `<div class="bot-icon"><i class="fas fa-robot"></i></div><div class="content"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
    c.appendChild(d);
    scrollToBottom();
    return d;
}

function removeTypingIndicator(e) { if (e && e.parentNode) e.parentNode.removeChild(e); }

function scrollToBottom() { const b = document.getElementById('chatbox'); if (b) b.scrollTop = b.scrollHeight; }

function saveChatToLocal(role, text) {
    if (!window.currentChatId) { window.currentChatId = Date.now().toString(); }
    let allChats = JSON.parse(localStorage.getItem('vlu_chat_sessions')) || {};
    if (!allChats[window.currentChatId]) {
        let titleText = text.replace(/\[Hình ảnh\]\s*/g, "");
        allChats[window.currentChatId] = { title: titleText.substring(0, 25) + (titleText.length > 25 ? '...' : ''), messages: [], timestamp: Date.now() };
    }
    allChats[window.currentChatId].messages.push({ role, text });
    localStorage.setItem('vlu_chat_sessions', JSON.stringify(allChats));

    if (window.ui && typeof window.ui.renderHistory === 'function') { window.ui.renderHistory(); }
}

function renderSession(id) {
    const container = document.getElementById('messagesContainer');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const allChats = JSON.parse(localStorage.getItem('vlu_chat_sessions')) || {};
    const chatData = allChats[id];

    if (chatData && container) {
        container.innerHTML = '';
        if (welcomeScreen) welcomeScreen.classList.add('hidden');

        chatData.messages.forEach(msg => { if (msg.role === 'user') { renderUserMessage(msg.text); } else { renderBotMessage(msg.text); } });
        scrollToBottom();
    }
}

window.sendMessage = sendMessage;

window.loadSession = function (id) {
    window.currentChatId = id;
    renderSession(id);
    if (window.ui && typeof window.ui.renderHistory === 'function') window.ui.renderHistory();
};

window.deleteSpecificChat = function (event, id) {
    if (event) event.stopPropagation();

    if (confirm('Bạn có muốn xóa cuộc trò chuyện này không?')) {
        let allChats = JSON.parse(localStorage.getItem('vlu_chat_sessions')) || {};
        delete allChats[id];
        localStorage.setItem('vlu_chat_sessions', JSON.stringify(allChats));

        let pins = JSON.parse(localStorage.getItem('vlu_pinned_chats')) || [];
        pins = pins.filter(p => p !== id);
        localStorage.setItem('vlu_pinned_chats', JSON.stringify(pins));

        if (id === window.currentChatId) { window.currentChatId = null; const container = document.getElementById('messagesContainer'); const welcomeScreen = document.getElementById('welcomeScreen'); if (container) container.innerHTML = ''; if (welcomeScreen) welcomeScreen.classList.remove('hidden'); }

        if (window.ui && typeof window.ui.renderHistory === 'function') { window.ui.renderHistory(); }
    }
};

window.loadKnowledgeBase = loadKnowledgeBase;
document.addEventListener('DOMContentLoaded', loadKnowledgeBase);

// ===== FIXED GRADUATION RESPONSE =====
function formatGraduationResponse() {
    return `
🎓 **Khối kiến thức: I.4.2. Khóa luận / Đồ án tốt nghiệp**

Để hoàn thành phần tốt nghiệp, sinh viên chọn **1 trong 2 phương án** sau:

**Phương án 1: Học học phần thay thế khóa luận/đồ án**

Sinh viên hoàn thành **02 học phần chuyên đề**, tổng cộng **6 tín chỉ**:

- **71ITIS30603 – Chuyên đề Tối ưu hóa máy tìm kiếm** *(Search Engine Optimization)* – **3 tín chỉ**
- **71ITIS30503 – Chuyên đề Thương mại điện tử** *(E-Commerce)* – **3 tín chỉ**

📌 **Điều kiện:** Không yêu cầu học phần tiên quyết.

**Phương án 2: Thực hiện Đồ án tốt nghiệp**

Sinh viên hoàn thành học phần:

- **71ITGR40206 – Đồ án tốt nghiệp** *(Graduation Project)* – **6 tín chỉ**

📌 **Tính chất học phần:** Bắt buộc chuyên ngành / thuộc nhóm học phần tốt nghiệp.

---

✅ **Tóm tắt dễ hiểu**

- Nếu **không làm đồ án tốt nghiệp**, sinh viên có thể chọn **02 học phần chuyên đề thay thế**.
- Nếu **làm đồ án tốt nghiệp**, sinh viên chỉ cần hoàn thành **Đồ án tốt nghiệp 6 tín chỉ**.
- Sinh viên chỉ cần hoàn thành **một trong hai phương án**, không bắt buộc làm cả hai.

📌 Ngoài khối tốt nghiệp này, sinh viên vẫn cần đáp ứng các điều kiện chung như tổng tín chỉ chương trình, GPA và các chuẩn đầu ra theo thông báo chính thức của trường.
`.trim();
}
