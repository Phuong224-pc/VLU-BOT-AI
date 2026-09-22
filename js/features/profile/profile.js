(() => {
    const STORAGE_PREFIX = 'vlu_profile_module_';
    const DEFAULT_STATE = {
        profile: {
            fullName: '',
            mssv: '',
            email: '',
            phone: '',
            className: '',
            cohort: '',
            major: '',
            position: '',
            objectType: '',
            highSchool: '',
            unionStatus: '',
            ethnicity: '',
            religion: '',
            nationality: '',
            province: '',
            district: '',
            gender: '',
            trainingType: 'Đại Học CQ Tín Chỉ',
            advisorName: '',
            advisorPhone: '',
            studentClass: '',
            schoolEmail: '',
            personalEmail: '',
            studentAddress: '',
            insuranceCode: '',
            hospitalProvince: '',
            bankAccount: '',
            bankName: '',
            beneficiaryName: '',
            contactName: '',
            contactPhone: '',
            contactAddress: '',
            source: ''
        }
    };

    const state = cloneDefaultState();
    let activeUserKey = null;

    const el = {};

    function cloneDefaultState() {
        return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }

    function $(selector) {
        return document.querySelector(selector);
    }

    function normalizeText(value) {
        return String(value || '')
            .replace(/\r/g, '\n')
            .replace(/\u00a0/g, ' ')
            .replace(/[ \t]+/g, ' ')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }

    function normalizeLoose(value) {
        return safeText(value)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    }

    function safeText(value) {
        return String(value ?? '').trim();
    }

    function escapeHTML(value) {
        return String(value ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function escapeRegExp(value) {
        return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Danh sách nhãn (labels) dùng để nhận diện trường thông tin trong text OCR/PDF.
    const ALL_LABELS = [
        'Họ tên', 'Họ và tên', 'Sinh viên', 'Student name', 'Tên sinh viên',
        'Mã SV', 'MSSV', 'Mã số sinh viên', 'Student ID', 'Mã sinh viên',
        'Giới tính', 'Khóa học', 'Lớp', 'Class', 'Niên khóa', 'Khóa', 'Khoa nhập học',
        'Dân tộc', 'Tôn giáo', 'Quốc gia', 'Quốc tịch', 'Tỉnh thành', 'Quận huyện',
        'Di động', 'Điện thoại', 'Số điện thoại', 'Mobile', 'SĐT',
        'Cố vấn học tập', 'Liên hệ cố vấn học tập', 'Lớp sinh viên', 'Email trường',
        'Email cá nhân', 'Địa chỉ SV', 'Địa chỉ sinh viên', 'Mã bảo hiểm',
        'Mã tỉnh/thành bệnh viện', 'Số tài khoản', 'Tên ngân hàng', 'Người thụ hưởng',
        'Họ tên người liên hệ', 'Điện thoại người liên hệ', 'Địa chỉ người liên hệ',
        'Chức vụ', 'Đối tượng', 'THPT lớp 12', 'Đoàn', 'Ngày vào đoàn', 'Đảng', 'Ngày vào đảng',
        'Ngành', 'Chuyên ngành', 'Major', 'Loại hình đào tạo',
        'ĐT bàn', 'Điện thoại bàn', 'Landline'
    ];

    // Bảng ánh xạ: label text (lowercase, bỏ dấu) → field key trong state.profile
    const LABEL_FIELD_MAP = buildLabelFieldMap();

    function buildLabelFieldMap() {
        const mapping = {
            fullName: ['Họ tên', 'Họ và tên', 'Sinh viên', 'Student name', 'Tên sinh viên'],
            mssv: ['Mã SV', 'MSSV', 'Mã số sinh viên', 'Student ID', 'Mã sinh viên'],
            gender: ['Giới tính'],
            className: ['Khóa học'],
            cohort: ['Niên khóa', 'Khoa nhập học'],
            ethnicity: ['Dân tộc'],
            religion: ['Tôn giáo'],
            nationality: ['Quốc gia', 'Quốc tịch'],
            province: ['Tỉnh thành'],
            district: ['Quận huyện'],
            phone: ['Di động', 'Điện thoại', 'Số điện thoại', 'Mobile', 'SĐT'],
            advisorName: ['Cố vấn học tập'],
            advisorPhone: ['Liên hệ cố vấn học tập'],
            studentClass: ['Lớp sinh viên', 'Lớp', 'Class'],
            schoolEmail: ['Email trường'],
            personalEmail: ['Email cá nhân'],
            studentAddress: ['Địa chỉ SV', 'Địa chỉ sinh viên'],
            insuranceCode: ['Mã bảo hiểm'],
            hospitalProvince: ['Mã tỉnh/thành bệnh viện'],
            bankAccount: ['Số tài khoản'],
            bankName: ['Tên ngân hàng'],
            beneficiaryName: ['Người thụ hưởng'],
            contactName: ['Họ tên người liên hệ'],
            contactPhone: ['Điện thoại người liên hệ'],
            contactAddress: ['Địa chỉ người liên hệ'],
            position: ['Chức vụ'],
            objectType: ['Đối tượng'],
            highSchool: ['THPT lớp 12'],
            unionStatus: ['Đoàn', 'Ngày vào đoàn', 'Đảng', 'Ngày vào đảng'],
            major: ['Ngành', 'Chuyên ngành', 'Major'],
            trainingType: ['Loại hình đào tạo'],
            landline: ['ĐT bàn', 'Điện thoại bàn', 'Landline']
        };

        const map = {};
        for (const [fieldKey, labels] of Object.entries(mapping)) {
            for (const label of labels) {
                const key = normalizeLabel(label);
                map[key] = fieldKey;
            }
        }
        return map;
    }

    function normalizeLabel(label) {
        return String(label || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function capitalizeSentence(value) {
        const text = safeText(value);
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    function getStorageKey() {
        return activeUserKey ? `${STORAGE_PREFIX}${activeUserKey}` : '';
    }

    function loadState() {
        state.profile = cloneDefaultState().profile;
        if (!activeUserKey) return;
        const raw = localStorage.getItem(getStorageKey());
        if (!raw) return;
        try {
            const parsed = JSON.parse(raw);
            state.profile = Object.assign(cloneDefaultState().profile, parsed.profile || {});
        } catch (error) {
            console.warn('Không đọc được dữ liệu hồ sơ đã lưu:', error);
            state.profile = cloneDefaultState().profile;
        }
    }

    function saveState() {
        if (!activeUserKey) return;
        // Tránh lưu photoDataUrl quá lớn (> 500KB) vào localStorage để tránh vượt quota.
        const toSave = JSON.parse(JSON.stringify(state));
        if (toSave.profile.photoDataUrl && toSave.profile.photoDataUrl.length > 500000) {
            toSave.profile.photoDataUrl = ''; // Bỏ ảnh quá lớn
        }
        localStorage.setItem(getStorageKey(), JSON.stringify(toSave));
    }

    function setSessionBadge(text, ready = false) {
        if (!el.sessionBadge) return;
        el.sessionBadge.classList.toggle('ready', ready);
        el.sessionBadge.innerHTML = `<i class="fas fa-user-check"></i><span>${text}</span>`;
    }

    function copyTargetText(targetId) {
        const node = document.getElementById(targetId);
        if (!node) return;
        navigator.clipboard.writeText(node.textContent || '').catch(() => {});
    }

    function firstMatch(text, patterns) {
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1]) return safeText(match[1]);
        }
        return '';
    }

    // ========================================================================
    //  FIX A+B: Hàm trích xuất giá trị MỚI — Linh hoạt cho cả OCR và PDF
    // ========================================================================

    /**
     * extractValueFromText — Phiên bản mới, linh hoạt hơn.
     * Hỗ trợ 3 dạng:
     *   1) "Label: Value"       (cùng dòng, có dấu : hoặc -)
     *   2) "Label  Value"       (cùng dòng, cách bằng khoảng trắng lớn hoặc tab)
     *   3) "Label\nValue"       (label trên 1 dòng, value ở dòng kế tiếp — phổ biến khi OCR)
     */
    function extractValueFromText(text, labels) {
        const uniqueLabels = [...new Set(labels.filter(Boolean))];
        if (!uniqueLabels.length) return '';

        // Xây regex cho từng label. Ưu tiên label dài hơn trước để tránh match nhầm.
        const sortedLabels = uniqueLabels.slice().sort((a, b) => b.length - a.length);
        const labelPattern = sortedLabels.map(escapeRegExp).join('|');

        // Cách 1: "Label[: -] Value" trên cùng dòng
        const sameLine = new RegExp(
            `(?:^|\\n)\\s*(?:${labelPattern})\\s*[:;\\-–—]\\s*(.+?)\\s*$`,
            'im'
        );
        const m1 = text.match(sameLine);
        if (m1 && m1[1] && m1[1].trim()) {
            return cleanExtractedValue(m1[1]);
        }

        // Cách 2: "Label    Value" (cùng dòng, cách ≥2 space hoặc tab, không có dấu :)
        const sameLineNoColon = new RegExp(
            `(?:^|\\n)\\s*(?:${labelPattern})\\s{2,}(.+?)\\s*$`,
            'im'
        );
        const m2 = text.match(sameLineNoColon);
        if (m2 && m2[1] && m2[1].trim()) {
            return cleanExtractedValue(m2[1]);
        }

        // Cách 3: "Label\nValue" (label chiếm trọn 1 dòng, value ở dòng kế tiếp)
        const nextLine = new RegExp(
            `(?:^|\\n)\\s*(?:${labelPattern})\\s*[:;\\-–—]?\\s*\\n\\s*(.+?)\\s*$`,
            'im'
        );
        const m3 = text.match(nextLine);
        if (m3 && m3[1] && m3[1].trim()) {
            // Chỉ lấy nếu dòng tiếp theo không phải là một label khác
            const candidate = m3[1].trim();
            if (!isKnownLabel(candidate)) {
                return cleanExtractedValue(candidate);
            }
        }

        return '';
    }

    /**
     * Kiểm tra xem text có phải là một label đã biết (tránh lấy nhầm label làm value).
     */
    function isKnownLabel(text) {
        const normalized = normalizeLabel(text);
        if (LABEL_FIELD_MAP[normalized]) return true;
        // Check partial match: text chứa label + dấu :
        for (const label of ALL_LABELS) {
            const norm = normalizeLabel(label);
            if (normalized === norm || normalized.startsWith(norm + ' ')) return true;
        }
        return false;
    }

    /**
     * Dọn dẹp giá trị đã trích xuất.
     */
    function cleanExtractedValue(value) {
        let result = safeText(value);
        // Bỏ các ký tự mở đầu thừa
        result = result.replace(/^[\s:\-–—;]+/, '').trim();
        // Bỏ trailing label nếu có (ví dụ: "Nguyễn Văn A  Giới tính" → chỉ lấy "Nguyễn Văn A")
        for (const label of ALL_LABELS) {
            const idx = result.indexOf(label);
            if (idx > 0 && idx < result.length) {
                // Chỉ cắt nếu label xuất hiện ở cuối hoặc sau khoảng trắng lớn
                const before = result.substring(0, idx).trimEnd();
                const afterLabel = result.substring(idx + label.length).trim();
                if (before && (!afterLabel || /^[\s:\-–—;]/.test(afterLabel))) {
                    result = before;
                    break;
                }
            }
        }
        return result;
    }

    // ========================================================================
    //  FIX B: extractFieldsFromLines — Parse text theo cặp dòng
    // ========================================================================

    /**
     * Phân tích text theo từng dòng, tìm label → lấy value.
     * Hoạt động tốt cho cả PDF (text rõ ràng) và OCR (text lộn xộn).
     */
    function extractFieldsFromLines(text) {
        const fields = {};
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Thử match mỗi label với dòng hiện tại
            for (const label of ALL_LABELS) {
                const escaped = escapeRegExp(label);
                // Pattern: label ở đầu dòng, theo sau là [:- ] rồi value
                const regex = new RegExp(
                    `^\\s*${escaped}\\s*[:;\\-–—]?\\s*(.*)$`, 'i'
                );
                const match = line.match(regex);
                if (!match) continue;

                const fieldKey = LABEL_FIELD_MAP[normalizeLabel(label)];
                if (!fieldKey || fields[fieldKey]) continue; // Đã có giá trị rồi thì skip

                let value = (match[1] || '').trim();

                // Nếu value rỗng → thử lấy dòng tiếp theo
                if (!value && i + 1 < lines.length) {
                    const nextLine = lines[i + 1].trim();
                    // Chỉ lấy nếu dòng tiếp KHÔNG phải là label khác
                    if (nextLine && !isKnownLabel(nextLine)) {
                        value = nextLine;
                    }
                }

                if (value) {
                    fields[fieldKey] = cleanExtractedValue(value);
                }
                break; // Mỗi dòng chỉ match 1 label
            }
        }

        return fields;
    }

    /**
     * extractFieldsFromText — Dùng extractValueFromText cho từng trường.
     * Giữ lại như cách cũ nhưng dùng hàm mới đã fix.
     */
    function extractFieldsFromText(text) {
        const fields = {};
        const put = (key, value) => {
            if (!fields[key] && value) fields[key] = value;
        };

        put('fullName', extractValueFromText(text, ['Họ tên', 'Họ và tên', 'Sinh viên', 'Student name', 'Tên sinh viên']));
        put('mssv', extractValueFromText(text, ['Mã SV', 'MSSV', 'Mã số sinh viên', 'Student ID', 'Mã sinh viên']));
        put('gender', extractValueFromText(text, ['Giới tính']));
        put('className', extractValueFromText(text, ['Khóa học']));
        put('cohort', extractValueFromText(text, ['Niên khóa', 'Khoa nhập học']));
        put('ethnicity', extractValueFromText(text, ['Dân tộc']));
        put('religion', extractValueFromText(text, ['Tôn giáo']));
        put('nationality', extractValueFromText(text, ['Quốc gia', 'Quốc tịch']));
        put('province', extractValueFromText(text, ['Tỉnh thành']));
        put('district', extractValueFromText(text, ['Quận huyện']));
        put('phone', extractValueFromText(text, ['Di động', 'Điện thoại', 'Số điện thoại', 'Mobile', 'SĐT']));
        put('advisorName', extractValueFromText(text, ['Cố vấn học tập']));
        put('advisorPhone', extractValueFromText(text, ['Liên hệ cố vấn học tập']));
        put('studentClass', extractValueFromText(text, ['Lớp sinh viên', 'Lớp', 'Class']));
        put('schoolEmail', extractValueFromText(text, ['Email trường']));
        put('personalEmail', extractValueFromText(text, ['Email cá nhân']));
        put('studentAddress', extractValueFromText(text, ['Địa chỉ SV', 'Địa chỉ sinh viên']));
        put('insuranceCode', extractValueFromText(text, ['Mã bảo hiểm']));
        put('hospitalProvince', extractValueFromText(text, ['Mã tỉnh/thành bệnh viện']));
        put('bankAccount', extractValueFromText(text, ['Số tài khoản']));
        put('bankName', extractValueFromText(text, ['Tên ngân hàng']));
        put('beneficiaryName', extractValueFromText(text, ['Người thụ hưởng']));
        put('contactName', extractValueFromText(text, ['Họ tên người liên hệ']));
        put('contactPhone', extractValueFromText(text, ['Điện thoại người liên hệ']));
        put('contactAddress', extractValueFromText(text, ['Địa chỉ người liên hệ']));
        put('position', extractValueFromText(text, ['Chức vụ']));
        put('objectType', extractValueFromText(text, ['Đối tượng']));
        put('highSchool', extractValueFromText(text, ['THPT lớp 12']));
        put('unionStatus', extractValueFromText(text, ['Đoàn', 'Ngày vào đoàn', 'Đảng', 'Ngày vào đảng']));
        put('major', extractValueFromText(text, ['Ngành', 'Chuyên ngành', 'Major']));
        put('trainingType', extractValueFromText(text, ['Loại hình đào tạo']));

        return fields;
    }

    // ========================================================================
    //  FIX E: extractPersonalInfo — Cải thiện với pattern bổ sung cho VLU Portal
    // ========================================================================

    function extractPersonalInfo(text) {
        const normalized = normalizeText(text);
        const lines = normalized.split('\n').map(line => line.trim()).filter(Boolean);

        // Chạy 2 chiến lược song song, merge kết quả (ưu tiên line-based vì chính xác hơn)
        const lineBasedFields = extractFieldsFromLines(normalized);
        const regexFields = extractFieldsFromText(normalized);

        // Merge: lineBasedFields ưu tiên, regexFields bổ sung
        const mergedFields = { ...regexFields, ...lineBasedFields };

        // Fallback regex patterns cho các trường quan trọng nếu 2 chiến lược trên chưa match
        const fullName = mergedFields.fullName || firstMatch(normalized, [
            /(?:Họ và tên|Họ tên|Sinh viên|Student name|Tên sinh viên)\s*[:\-–—]\s*([^\n]+)/i,
            /(?:Tên sinh viên)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const email = mergedFields.personalEmail || mergedFields.schoolEmail || firstMatch(normalized, [
            /([\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/i
        ]);

        const mssv = mergedFields.mssv || firstMatch(normalized, [
            /(?:MSSV|Mã số sinh viên|Student ID|Mã SV|Mã sinh viên|ID)\s*[:\-–—]\s*([0-9]{8,14})/i,
            /\b(2[0-9]{9,13})\b/,  // MSSV VLU thường bắt đầu bằng "2"
            /\b([0-9]{10,14})\b/
        ]);

        const phone = mergedFields.phone || firstMatch(normalized, [
            /(?:Số điện thoại|Điện thoại|Phone|Mobile|Di động|SĐT)\s*[:\-–—]\s*([0-9+() \-]{8,20})/i,
            /(0[0-9]{8,10})/
        ]);

        const className = mergedFields.className || firstMatch(normalized, [
            /(?:Khóa học)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const cohort = mergedFields.cohort || firstMatch(normalized, [
            /(?:Niên khóa|Khoa\s*nhập học|Cohort)\s*[:\-–—]\s*([^\n]+)/i,
            /(K\d{2})/i,
            /(\d{4}\s*[-–]\s*\d{4})/  // Pattern "2024 - 2028"
        ]);

        const major = mergedFields.major || firstMatch(normalized, [
            /(?:Ngành|Chuyên ngành|Major)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const position = mergedFields.position || firstMatch(normalized, [
            /(?:Chức vụ)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const objectType = mergedFields.objectType || firstMatch(normalized, [
            /(?:Đối tượng)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const highSchool = mergedFields.highSchool || firstMatch(normalized, [
            /(?:THPT lớp 12|Trường THPT)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const unionStatus = mergedFields.unionStatus || firstMatch(normalized, [
            /(?:Đoàn|Ngày vào đoàn|Đảng|Ngày vào đảng)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const ethnicity = mergedFields.ethnicity || firstMatch(normalized, [
            /(?:Dân tộc)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const religion = mergedFields.religion || firstMatch(normalized, [
            /(?:Tôn giáo)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const nationality = mergedFields.nationality || firstMatch(normalized, [
            /(?:Quốc gia|Quốc tịch)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const province = mergedFields.province || firstMatch(normalized, [
            /(?:Tỉnh thành)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const district = mergedFields.district || firstMatch(normalized, [
            /(?:Quận huyện)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const gender = mergedFields.gender || firstMatch(normalized, [
            /(?:Giới tính)\s*[:\-–—]\s*([^\n]+)/i,
            /\b(Nam|Nữ|Male|Female)\b/i
        ]);

        const advisorName = mergedFields.advisorName || firstMatch(normalized, [
            /(?:Cố vấn học tập)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const advisorPhone = mergedFields.advisorPhone || firstMatch(normalized, [
            /(?:Liên hệ cố vấn học tập)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const studentClass = mergedFields.studentClass || firstMatch(normalized, [
            /(?:Lớp sinh viên)\s*[:\-–—]\s*([^\n]+)/i,
            /(?:Lớp)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const schoolEmail = mergedFields.schoolEmail || firstMatch(normalized, [
            /(?:Email trường)\s*[:\-–—]\s*([^\n]+)/i,
            /([\w.+-]+@vlu\.edu\.vn)/i
        ]);

        const personalEmail = mergedFields.personalEmail || firstMatch(normalized, [
            /(?:Email cá nhân)\s*[:\-–—]\s*([^\n]+)/i,
            /([\w.+-]+@(?:gmail|yahoo|outlook|hotmail)\.\w+)/i
        ]);

        const studentAddress = mergedFields.studentAddress || firstMatch(normalized, [
            /(?:Địa chỉ SV|Địa chỉ sinh viên)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const insuranceCode = mergedFields.insuranceCode || firstMatch(normalized, [
            /(?:Mã bảo hiểm)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const hospitalProvince = mergedFields.hospitalProvince || firstMatch(normalized, [
            /(?:Mã tỉnh\/thành bệnh viện)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const bankAccount = mergedFields.bankAccount || firstMatch(normalized, [
            /(?:Số tài khoản)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const bankName = mergedFields.bankName || firstMatch(normalized, [
            /(?:Tên ngân hàng)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const beneficiaryName = mergedFields.beneficiaryName || firstMatch(normalized, [
            /(?:Người thụ hưởng)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const contactName = mergedFields.contactName || firstMatch(normalized, [
            /(?:Họ tên người liên hệ)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const contactPhone = mergedFields.contactPhone || firstMatch(normalized, [
            /(?:Điện thoại người liên hệ)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const contactAddress = mergedFields.contactAddress || firstMatch(normalized, [
            /(?:Địa chỉ người liên hệ)\s*[:\-–—]\s*([^\n]+)/i
        ]);

        const trainingType = mergedFields.trainingType || firstMatch(normalized, [
            /(?:Loại hình đào tạo)\s*[:\-–—]\s*([^\n]+)/i
        ]) || 'Đại Học CQ Tín Chỉ';

        const source = lines.slice(0, 4).join(' · ');

        return {
            fullName,
            email,
            mssv,
            phone,
            className,
            cohort,
            major,
            position,
            objectType,
            highSchool,
            unionStatus,
            ethnicity,
            religion,
            nationality,
            province,
            district,
            gender,
            advisorName,
            advisorPhone,
            studentClass,
            schoolEmail,
            personalEmail,
            studentAddress,
            insuranceCode,
            hospitalProvince,
            bankAccount,
            bankName,
            beneficiaryName,
            contactName,
            contactPhone,
            contactAddress,
            trainingType,
            source: source || 'Đã đọc từ tài liệu'
        };
    }

    function updateProfileFields(fields) {
        for (const [key, value] of Object.entries(fields)) {
            if (!value) continue;
            state.profile[key] = value;
        }
    }

    function bindFieldInputs() {
        Object.keys(state.profile).forEach((key) => {
            const node = document.getElementById(key);
            if (!node) return;
            const value = state.profile[key];
            node.innerHTML = value ? escapeHTML(value) : '&nbsp;';
        });
    }

    function renderDashboard() {
        bindFieldInputs();
        if (el.profilePhoto && state.profile.photoDataUrl) {
            el.profilePhoto.src = state.profile.photoDataUrl;
        } else if (el.profilePhoto && el.defaultPhotoSrc) {
            el.profilePhoto.src = el.defaultPhotoSrc;
        }
        if (el.syncStatus) {
            el.syncStatus.textContent = buildAnalysisText();
        }
        saveState();
    }

    function buildAnalysisText() {
        const profile = state.profile;
        const lines = [];

        if (profile.fullName) lines.push(`Tên: ${profile.fullName}`);
        if (profile.mssv) lines.push(`MSSV: ${profile.mssv}`);
        if (profile.className) lines.push(`Lớp: ${profile.className}`);
        if (profile.major) lines.push(`Ngành: ${profile.major}`);

        if (!lines.length) {
            lines.push('Hãy tải ảnh hoặc PDF vào từng mục để bắt đầu.');
        }

        return lines.join('\n');
    }

    function applyParsedData(parsed, file) {
        state.profile.source = parsed.rawText;
        state.profile.photoDataUrl = parsed.photoDataUrl || state.profile.photoDataUrl || '';
        updateProfileFields(extractPersonalInfo(parsed.rawText));
        updateProfileFields(parsed.personal || {});
        const matchedCount = Object.entries(parsed.personal || {}).filter(([, value]) => value).length;
        setImportStatus(`${file.name}: đã nhận diện ${matchedCount} trường thông tin.`);
        if (el.ocrPreview) {
            el.ocrPreview.textContent = parsed.rawText ? parsed.rawText.slice(0, 1200) : 'OCR chưa trả về văn bản.';
        }
    }

    async function extractTextFromPdf(file) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const chunks = [];

        for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
            const page = await pdf.getPage(pageIndex);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(' ');
            chunks.push(pageText);
        }

        return normalizeText(chunks.join('\n'));
    }

    function readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(reader.error || new Error('Không đọc được ảnh.'));
            reader.readAsDataURL(file);
        });
    }

    async function extractTextFromImage(file) {
        const imageDataUrl = await readFileAsDataUrl(file);
        setImportStatus(`Đang quét ảnh ${file.name}...`);
        const result = await window.Tesseract.recognize(imageDataUrl, 'vie+eng', {
            logger: (info) => {
                if (info.status && typeof info.progress === 'number') {
                    setStatus(`Đang đọc ảnh: ${info.status} ${Math.round(info.progress * 100)}%`);
                    setImportStatus(`Đang quét ảnh ${file.name}: ${info.status} ${Math.round(info.progress * 100)}%`);
                }
            }
        });
        const text = normalizeText(result.data.text);
        if (!text) {
            setImportStatus(`Ảnh ${file.name} đã quét xong nhưng không trích được chữ.`);
        }
        return text;
    }

    async function extractTextFromTxt(file) {
        return normalizeText(await file.text());
    }

    async function readFileText(file) {
        const name = file.name.toLowerCase();
        const type = (file.type || '').toLowerCase();
        const isImageFile = type.startsWith('image/') || /\.(png|jpg|jpeg|webp|bmp|gif|heic|heif)$/i.test(name);
        const isPdfFile = name.endsWith('.pdf') || type.includes('pdf');
        const isTextFile = name.endsWith('.txt') || type.startsWith('text/');

        if (isPdfFile) {
            return extractTextFromPdf(file);
        }
        if (isImageFile) {
            return extractTextFromImage(file);
        }
        if (isTextFile) {
            return extractTextFromTxt(file);
        }
        throw new Error('Định dạng file không được hỗ trợ.');
    }

    function setStatus(message, isError = false) {
        if (!el.sessionBadge) return;
        el.sessionBadge.classList.toggle('ready', !isError);
        el.sessionBadge.innerHTML = `<i class="fas ${isError ? 'fa-triangle-exclamation' : 'fa-spinner fa-spin'}"></i><span>${message}</span>`;
    }

    function setImportStatus(message) {
        if (!el.importStatus) return;
        el.importStatus.textContent = message;
    }

    // ========================================================================
    //  FIX D: AI Vision Fallback — Gọi Groq Vision API khi OCR thất bại
    // ========================================================================

    function getApiKey() {
        return (typeof window.CONFIG !== 'undefined' && window.CONFIG.GROQ_API_KEY) ? window.CONFIG.GROQ_API_KEY : '';
    }

    /**
     * Gọi Groq Vision API để đọc ảnh hồ sơ sinh viên và trả JSON chứa thông tin.
     * Chỉ gọi khi Tesseract OCR thất bại hoặc không match được trường nào.
     */
    async function extractFieldsViaVisionAPI(imageDataUrl) {
        const apiKey = getApiKey();
        if (!apiKey) {
            console.warn('Không có API key để gọi Vision AI fallback.');
            return null;
        }

        const prompt = `Đây là ảnh chụp hồ sơ sinh viên hoặc trang thông tin cá nhân sinh viên từ cổng thông tin đại học. Hãy đọc toàn bộ thông tin trong ảnh và trả về dưới dạng JSON thuần túy (không markdown, không code block). 

JSON phải có đúng các key sau (bỏ trống "" nếu không tìm thấy):
{
  "fullName": "Họ và tên sinh viên",
  "mssv": "Mã số sinh viên",
  "gender": "Nam hoặc Nữ",
  "className": "Khóa học (ví dụ K30)",
  "cohort": "Niên khóa (ví dụ 2024 - 2028)",
  "major": "Ngành học",
  "phone": "Số điện thoại",
  "schoolEmail": "Email trường (@vlu.edu.vn)",
  "personalEmail": "Email cá nhân",
  "ethnicity": "Dân tộc",
  "religion": "Tôn giáo",
  "nationality": "Quốc tịch",
  "province": "Tỉnh thành",
  "district": "Quận huyện",
  "studentClass": "Lớp sinh viên",
  "studentAddress": "Địa chỉ sinh viên",
  "advisorName": "Tên cố vấn học tập",
  "advisorPhone": "Liên hệ cố vấn",
  "position": "Chức vụ",
  "objectType": "Đối tượng",
  "highSchool": "Trường THPT lớp 12",
  "unionStatus": "Thông tin đoàn/đảng",
  "insuranceCode": "Mã bảo hiểm",
  "hospitalProvince": "Mã tỉnh/thành bệnh viện",
  "bankAccount": "Số tài khoản ngân hàng",
  "bankName": "Tên ngân hàng",
  "beneficiaryName": "Người thụ hưởng",
  "contactName": "Họ tên người liên hệ",
  "contactPhone": "Điện thoại người liên hệ",
  "contactAddress": "Địa chỉ người liên hệ",
  "trainingType": "Loại hình đào tạo"
}

CHỈ trả JSON, KHÔNG giải thích gì thêm.`;

        try {
            setImportStatus('Đang gọi AI Vision để đọc ảnh...');

            const model = (window.CONFIG && window.CONFIG.GROQ_VISION_MODEL) || 'meta-llama/llama-4-scout-17b-16e-instruct';
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        {
                            role: 'user',
                            content: [
                                { type: 'text', text: prompt },
                                { type: 'image_url', image_url: { url: imageDataUrl } }
                            ]
                        }
                    ],
                    max_tokens: 2000,
                    temperature: 0.05
                })
            });

            const data = await response.json();

            if (data.choices && data.choices[0]) {
                let content = data.choices[0].message.content || '';
                // Bỏ markdown code block nếu model trả về
                content = content.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();

                try {
                    const parsed = JSON.parse(content);
                    console.log('✅ Vision AI đã đọc thành công:', parsed);
                    setImportStatus('AI Vision đã đọc ảnh thành công!');
                    return parsed;
                } catch (parseErr) {
                    console.warn('Vision AI trả response nhưng không parse được JSON:', content);
                    // Thử trích xuất JSON từ response text
                    const jsonMatch = content.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        try {
                            const fallbackParsed = JSON.parse(jsonMatch[0]);
                            console.log('✅ Vision AI (fallback parse):', fallbackParsed);
                            setImportStatus('AI Vision đã đọc ảnh thành công!');
                            return fallbackParsed;
                        } catch { /* ignore */ }
                    }
                    setImportStatus('AI Vision trả lời nhưng không parse được dữ liệu.');
                    return null;
                }
            } else if (data.error) {
                console.warn('Groq Vision API lỗi:', data.error.message);
                setImportStatus(`Vision AI lỗi: ${data.error.message}`);
                return null;
            }
        } catch (error) {
            console.error('Vision API fallback lỗi:', error);
            setImportStatus('Không kết nối được AI Vision.');
            return null;
        }

        return null;
    }

    // ========================================================================
    //  FIX C+D: handleFiles — Fix blob URL + thêm Vision AI fallback
    // ========================================================================

    async function handleFiles(fileList) {
        const files = [...fileList];
        if (!files.length) return;

        const currentUser = getCurrentUser();
        if (!currentUser) {
            setSessionBadge('Bạn phải đăng nhập trước khi thêm thông tin', false);
            return;
        }

        for (const file of files) {
            try {
                setStatus(`Đang đọc ${file.name}`);
                const isImageFile = (file.type || '').toLowerCase().startsWith('image/') || /\.(png|jpg|jpeg|webp|bmp|gif|heic|heif)$/i.test(file.name.toLowerCase());

                let text = '';
                let photoDataUrl = '';

                if (isImageFile) {
                    // FIX C: Dùng base64 data URL thay vì blob URL để lưu được vào localStorage
                    photoDataUrl = await readFileAsDataUrl(file);

                    // Bước 1: Thử OCR bằng Tesseract
                    try {
                        text = await readFileText(file);
                    } catch (ocrErr) {
                        console.warn('Tesseract OCR thất bại:', ocrErr);
                        text = '';
                    }

                    // Kiểm tra xem OCR có trích xuất được thông tin hữu ích không
                    const ocrFields = text ? extractPersonalInfo(text) : {};
                    const ocrMatchCount = Object.entries(ocrFields).filter(([k, v]) => v && k !== 'source' && k !== 'trainingType').length;

                    // FIX D: Nếu OCR không match được hoặc quá ít trường → gọi Vision AI fallback
                    if (ocrMatchCount < 3) {
                        console.log(`OCR chỉ match ${ocrMatchCount} trường. Thử Vision AI fallback...`);
                        setImportStatus(`OCR đọc được ít thông tin (${ocrMatchCount} trường). Đang thử AI Vision...`);

                        // Nén ảnh trước khi gửi API (tránh tràn token)
                        let compressedImage = photoDataUrl;
                        if (window.featureVision && typeof window.featureVision.compressImage === 'function') {
                            compressedImage = await window.featureVision.compressImage(photoDataUrl, 1300);
                        }

                        const visionResult = await extractFieldsViaVisionAPI(compressedImage);

                        if (visionResult) {
                            // Merge: Vision AI result + OCR result (Vision ưu tiên)
                            const visionMatchCount = Object.entries(visionResult).filter(([k, v]) => v && k !== 'source' && k !== 'trainingType').length;

                            if (visionMatchCount > ocrMatchCount) {
                                // Dùng Vision result làm chính
                                updateProfileFields(visionResult);
                                // Bổ sung từ OCR cho các trường Vision bỏ sót
                                updateProfileFields(ocrFields);

                                const totalMatched = Object.entries(state.profile).filter(([k, v]) => v && k !== 'source' && k !== 'trainingType' && k !== 'photoDataUrl').length;
                                setImportStatus(`${file.name}: AI Vision nhận diện ${visionMatchCount} trường, tổng cộng ${totalMatched} trường có dữ liệu.`);
                            } else {
                                // OCR tốt hơn, dùng OCR
                                updateProfileFields(ocrFields);
                                updateProfileFields(visionResult);
                                setImportStatus(`${file.name}: OCR nhận diện ${ocrMatchCount} trường.`);
                            }

                            // Tạo rawText từ Vision result để hiển thị trong OCR preview
                            if (!text && visionResult) {
                                text = Object.entries(visionResult)
                                    .filter(([, v]) => v)
                                    .map(([k, v]) => `${k}: ${v}`)
                                    .join('\n');
                            }

                            state.profile.photoDataUrl = photoDataUrl;
                            state.profile.source = text;
                            if (el.ocrPreview) {
                                el.ocrPreview.textContent = text ? text.slice(0, 1200) : 'Dữ liệu đọc bởi AI Vision.';
                            }
                            setStatus(`Đã đọc ${file.name}`, false);
                            setSessionBadge(`Đã đọc ${file.name}`, true);
                            continue; // Skip bước applyParsedData bên dưới
                        }
                    }
                } else {
                    text = await readFileText(file);
                }

                // Xử lý bình thường (OCR đủ tốt, hoặc file PDF/TXT)
                const parsed = {
                    rawText: text,
                    personal: extractPersonalInfo(text),
                    photoDataUrl: isImageFile ? photoDataUrl : ''
                };
                applyParsedData(parsed, file);
                setStatus(`Đã đọc ${file.name}`);
                setSessionBadge(`Đã đọc ${file.name}`, true);
            } catch (error) {
                console.error(error);
                setStatus(`Lỗi đọc file ${file.name}`, true);
                setSessionBadge(`Lỗi đọc file ${file.name}`, false);
                setImportStatus(`Không đọc được ${file.name}.`);
            }
        }

        renderDashboard();
    }

    function resetAllData() {
        const fresh = cloneDefaultState();
        state.profile = fresh.profile;

        bindFieldInputs();
        renderDashboard();
    }

    function attachUploadHandlers(inputId, dropZoneId) {
        const input = document.getElementById(inputId);
        const dropZone = document.getElementById(dropZoneId);
        if (input) {
            input.addEventListener('change', () => handleFiles(input.files));
        }
        if (dropZone) {
            dropZone.addEventListener('dragover', (event) => {
                event.preventDefault();
                dropZone.classList.add('dragging');
            });
            dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragging'));
            dropZone.addEventListener('drop', (event) => {
                event.preventDefault();
                dropZone.classList.remove('dragging');
                handleFiles(event.dataTransfer.files);
            });
        }
    }

    function hookCopyButtons() {
        document.querySelectorAll('[data-copy-target]').forEach((button) => {
            button.addEventListener('click', () => copyTargetText(button.dataset.copyTarget));
        });
    }

    function getCurrentUser() {
        try {
            return window.firebase?.auth?.().currentUser || null;
        } catch {
            return null;
        }
    }

    function getUserKeyFromAuth() {
        const user = getCurrentUser();
        if (!user) return null;
        return user.uid || user.email || null;
    }

    function restoreSavedStateForUser() {
        activeUserKey = getUserKeyFromAuth();
        loadState();
        bindFieldInputs();
        renderDashboard();

        const user = getCurrentUser();
        if (user) {
            setSessionBadge(`Đang đăng nhập: ${user.email || user.displayName || 'tài khoản VLU'}`, true);
        } else {
            setSessionBadge('Bạn phải đăng nhập để xem và lưu hồ sơ sinh viên', false);
        }
    }

    function initAuthWatcher() {
        try {
            if (window.firebase?.auth) {
                window.firebase.auth().onAuthStateChanged((user) => {
                    const nextKey = user?.email || user?.uid || 'guest';
                    activeUserKey = user ? (user.uid || user.email || null) : null;
                    loadState();
                    bindFieldInputs();
                    if (user) {
                        setSessionBadge(`Đang đăng nhập: ${user.email || user.displayName || 'tài khoản VLU'}`, true);
                        if (el.personalUpload) el.personalUpload.disabled = false;
                        if (el.syncFromFileBtn) el.syncFromFileBtn.disabled = false;
                    } else {
                        setSessionBadge('Bạn phải đăng nhập để xem và lưu hồ sơ sinh viên', false);
                        if (el.personalUpload) el.personalUpload.disabled = true;
                        if (el.syncFromFileBtn) el.syncFromFileBtn.disabled = true;
                    }
                    renderDashboard();
                });
            }
        } catch (error) {
            console.warn('Không theo dõi được trạng thái đăng nhập:', error);
        }
    }

    function init() {
        el.sessionBadge = $('#sessionBadge');
        el.profilePhoto = $('#profilePhoto');
        el.defaultPhotoSrc = el.profilePhoto ? el.profilePhoto.getAttribute('src') : '';
        el.syncStatus = $('#syncStatus');
        el.importStatus = $('#importStatus');
        el.ocrPreview = $('#ocrPreview');
        el.personalUpload = $('#personalUpload');
        el.syncFromFileBtn = $('#syncFromFileBtn');

        if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        hookCopyButtons();
        bindFieldInputs();
        attachUploadHandlers('personalUpload');

        if (el.syncFromFileBtn) {
            el.syncFromFileBtn.addEventListener('click', () => {
                if (!getCurrentUser()) {
                    setSessionBadge('Bạn phải đăng nhập trước khi thêm thông tin', false);
                    return;
                }
                renderDashboard();
                setSessionBadge('Đã cập nhật thông tin cá nhân', true);
            });
        }

        loadState();
        bindFieldInputs();
        renderDashboard();
        restoreSavedStateForUser();
        initAuthWatcher();

        if (!getCurrentUser() && el.importStatus) {
            el.importStatus.textContent = 'Hãy đăng nhập trước khi nhập ảnh hoặc PDF.';
        }

        window.addEventListener('beforeunload', saveState);
    }

    document.addEventListener('DOMContentLoaded', init);
})();