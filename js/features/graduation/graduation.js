const TARGET_CREDITS = 126;
const AVG_CREDITS_PER_TERM = 18;

const $ = (selector) => document.querySelector(selector);

const demoStudents = {
    '2474802010414': {
        id: '2474802010414',
        name: 'Võ Thành Trung',
        major: 'Công nghệ Thông tin',
        cohort: 'K30',
        className: 'CNTT K30',
        earnedCredits: 72,
        gpa4: 3.09,
        rating: 'Khá',
        failedCourses: 0,
        englishStatus: 'missing',
        mosStatus: 'unknown',
        debtStatus: 'clear',
        recommendedTrack: 'Công nghệ phần mềm',
        missingCourses: [
            { code: '71ITAI40103', name: 'Nhập môn Trí tuệ nhân tạo', credits: 3, reason: 'Cơ sở ngành bắt buộc chưa thấy trong bảng điểm', priority: 'Cao', suggest: 'Ưu tiên đăng ký khi mở môn để hoàn tất nhóm cơ sở ngành bắt buộc' },
            { code: '71ITDS40203', name: 'Xác suất thống kê ứng dụng', credits: 3, reason: 'Tự chọn cơ sở ngành TC209 nên bổ sung nếu muốn theo Data/AI hoặc phân tích dữ liệu', priority: 'Trung bình', suggest: 'Có thể học sau Toán rời rạc, phù hợp nếu muốn mở rộng hướng dữ liệu' },
            { code: '71ITSE41003', name: 'Nhập môn Công nghệ phần mềm', credits: 3, reason: 'Môn mở đầu hướng chuyên ngành Công nghệ phần mềm', priority: 'Cao', suggest: 'Nên học trước các môn Kỹ thuật lấy yêu cầu, Kiểm thử phần mềm, Quản lý dự án phần mềm' },
            { code: '71ITSE41103', name: 'Kỹ thuật lấy yêu cầu', credits: 3, reason: 'Môn chuyên ngành Công nghệ phần mềm chưa học', priority: 'Trung bình', suggest: 'Học sau Nhập môn Công nghệ phần mềm' },
            { code: '71ITSE41203', name: 'Kiểm thử phần mềm', credits: 3, reason: 'Môn chuyên ngành Công nghệ phần mềm chưa học', priority: 'Trung bình', suggest: 'Có thể học song song với nhóm môn chuyên ngành năm 3' },
            { code: '71ITIN40304', name: 'Đồ án thực tập', credits: 4, reason: 'Học kỳ doanh nghiệp/thực tập chưa hoàn thành', priority: 'Cao', suggest: 'Chuẩn bị sau khi hoàn tất phần lớn môn cơ sở ngành và chuyên ngành' },
            { code: '71ITGR40206', name: 'Đồ án tốt nghiệp', credits: 6, reason: 'Học phần tốt nghiệp cuối khóa chưa hoàn thành', priority: 'Cao', suggest: 'Đăng ký sau thực tập và đủ điều kiện theo khoa' }
        ],
        notes: 'Đã tích lũy 72/126 TC. Chưa có dữ liệu MOS nên cần cập nhật thêm trước khi xét tốt nghiệp.',
        forecast: 'Còn khoảng 54 TC, dự kiến cần 3 học kỳ chính + thực tập/đồ án nếu học 15–18 TC/học kỳ.'
    },
    '2474802010118': {
        id: '2474802010118',
        name: 'Huỳnh Nhựt Hoà',
        major: 'Công nghệ Thông tin',
        cohort: 'K30',
        className: 'CNTT K30',
        earnedCredits: 74,
        gpa4: 2.70,
        rating: 'Khá',
        failedCourses: 1,
        englishStatus: 'missing',
        mosStatus: 'unknown',
        debtStatus: 'clear',
        recommendedTrack: 'Công nghệ phần mềm / An ninh mạng',
        missingCourses: [
            { code: '71POLE10022', name: 'Kinh tế chính trị Mác-Lênin', credits: 2, reason: 'Bảng điểm ghi F/chưa đạt, cần học lại để đủ điều kiện', priority: 'Rất cao', suggest: 'Đăng ký học lại sớm vì là môn bắt buộc và ảnh hưởng xét tốt nghiệp' },
            { code: '71ITAI40103', name: 'Nhập môn Trí tuệ nhân tạo', credits: 3, reason: 'Cơ sở ngành bắt buộc chưa thấy trong bảng điểm', priority: 'Cao', suggest: 'Nên học trong học kỳ gần nhất' },
            { code: '71ITDS40203', name: 'Xác suất thống kê ứng dụng', credits: 3, reason: 'Tự chọn cơ sở ngành TC209 nên bổ sung để đủ nhóm tín chỉ tự chọn', priority: 'Trung bình', suggest: 'Phù hợp nếu muốn theo hướng dữ liệu hoặc an ninh có phân tích log' },
            { code: '71ITSE41003', name: 'Nhập môn Công nghệ phần mềm', credits: 3, reason: 'Môn mở đầu hướng chuyên ngành chưa học', priority: 'Cao', suggest: 'Học trước các môn chuyên ngành phần mềm phía sau' },
            { code: '71ITSE41203', name: 'Kiểm thử phần mềm', credits: 3, reason: 'Môn chuyên ngành nên học để đủ nhóm chuyên sâu', priority: 'Trung bình', suggest: 'Có thể học sau Nhập môn Công nghệ phần mềm' },
            { code: '71ITIN40304', name: 'Đồ án thực tập', credits: 4, reason: 'Học kỳ doanh nghiệp/thực tập chưa hoàn thành', priority: 'Cao', suggest: 'Chuẩn bị sau khi xử lý môn F và học đủ nhóm chuyên ngành' },
            { code: '71ITGR40206', name: 'Đồ án tốt nghiệp', credits: 6, reason: 'Học phần tốt nghiệp cuối khóa chưa hoàn thành', priority: 'Cao', suggest: 'Đăng ký sau thực tập và đủ điều kiện theo khoa' }
        ],
        notes: 'Cần ưu tiên học lại Kinh tế chính trị Mác-Lênin, sau đó bổ sung AI/cơ sở ngành và chuyên ngành.',
        forecast: 'Còn khoảng 52 TC và 1 môn F, dự kiến cần 3–4 học kỳ nếu xử lý môn chưa đạt trong học kỳ gần nhất.'
    },
    '2474802010419': {
        id: '2474802010419',
        name: 'Phan Thanh Tú',
        major: 'Công nghệ Thông tin',
        cohort: 'K30',
        className: 'CNTT K30',
        earnedCredits: 65,
        gpa4: 3.39,
        rating: 'Giỏi',
        failedCourses: 0,
        englishStatus: 'missing',
        mosStatus: 'unknown',
        debtStatus: 'clear',
        recommendedTrack: 'Công nghệ dữ liệu / Trí tuệ nhân tạo',
        missingCourses: [
            { code: '71ITAI40103', name: 'Nhập môn Trí tuệ nhân tạo', credits: 3, reason: 'Đang học/chưa có điểm nên chưa tính vào tín chỉ tích lũy', priority: 'Cao', suggest: 'Chờ điểm cuối kỳ; nếu đạt thì sẽ được cộng vào tín chỉ' },
            { code: '71ENG51053', name: 'Anh văn 5 (AV5)', credits: 3, reason: 'Chưa thấy trong bảng điểm đã đạt, cần bổ sung ngoại ngữ theo lộ trình', priority: 'Cao', suggest: 'Đăng ký học/thi theo tiến độ ngoại ngữ đầu ra' },
            { code: '71ITSE30403', name: 'Lập trình ứng dụng Java', credits: 3, reason: 'Tự chọn cơ sở ngành TC209 chưa thấy trong bảng điểm', priority: 'Trung bình', suggest: 'Nên học nếu muốn tăng nền tảng backend hoặc học Java nâng cao sau này' },
            { code: '71ITDS40303', name: 'Nhập môn Phân tích Dữ liệu lớn', credits: 3, reason: 'Môn mở đầu hướng Công nghệ dữ liệu chưa học', priority: 'Cao', suggest: 'Phù hợp với hồ sơ đang học AI/Xác suất thống kê' },
            { code: '71ITAI40203', name: 'Nhập môn học máy', credits: 3, reason: 'Môn chuyên ngành dữ liệu/AI chưa học', priority: 'Cao', suggest: 'Nên học sau Xác suất thống kê ứng dụng và nền tảng AI' },
            { code: '71ITIN40304', name: 'Đồ án thực tập', credits: 4, reason: 'Học kỳ doanh nghiệp/thực tập chưa hoàn thành', priority: 'Cao', suggest: 'Chuẩn bị sau khi hoàn tất phần lớn môn chuyên ngành' },
            { code: '71ITGR40206', name: 'Đồ án tốt nghiệp', credits: 6, reason: 'Học phần tốt nghiệp cuối khóa chưa hoàn thành', priority: 'Cao', suggest: 'Đăng ký sau thực tập và đủ điều kiện theo khoa' }
        ],
        notes: 'GPA tốt, nhưng tín chỉ còn thiếu nhiều và cần hoàn tất ngoại ngữ/MOS trước khi xét tốt nghiệp.',
        forecast: 'Còn khoảng 61 TC, dự kiến cần 4 học kỳ nếu học đều 15–18 TC/học kỳ.'
    },
    '2474802010071': {
        id: '2474802010071',
        name: 'Võ Ngọc Duy',
        major: 'Công nghệ Thông tin',
        cohort: 'K30',
        className: 'CNTT K30',
        earnedCredits: 69,
        gpa4: 3.25,
        rating: 'Giỏi',
        failedCourses: 0,
        englishStatus: 'missing',
        mosStatus: 'unknown',
        debtStatus: 'clear',
        recommendedTrack: 'Công nghệ phần mềm',
        missingCourses: [
            { code: '71ENG51053', name: 'Anh văn 5 (AV5)', credits: 3, reason: 'Chưa thấy trong bảng điểm đã đạt, cần bổ sung theo lộ trình ngoại ngữ', priority: 'Cao', suggest: 'Ưu tiên hoàn tất ngoại ngữ để tránh kẹt điều kiện đầu ra' },
            { code: '71ITAI40103', name: 'Nhập môn Trí tuệ nhân tạo', credits: 3, reason: 'Cơ sở ngành bắt buộc chưa thấy trong bảng điểm', priority: 'Cao', suggest: 'Đăng ký trong học kỳ gần nhất nếu mở môn' },
            { code: '71ITSE41003', name: 'Nhập môn Công nghệ phần mềm', credits: 3, reason: 'Môn mở đầu hướng chuyên ngành Công nghệ phần mềm', priority: 'Cao', suggest: 'Nên học trước nhóm môn yêu cầu/kiểm thử/quản lý dự án phần mềm' },
            { code: '71ITSE41103', name: 'Kỹ thuật lấy yêu cầu', credits: 3, reason: 'Môn chuyên ngành Công nghệ phần mềm chưa học', priority: 'Trung bình', suggest: 'Học sau Nhập môn Công nghệ phần mềm' },
            { code: '71ITSE41403', name: 'Lập trình Web nâng cao', credits: 3, reason: 'Môn chuyên ngành phù hợp vì đã học Lập trình ứng dụng web', priority: 'Trung bình', suggest: 'Học sau Lập trình ứng dụng web' },
            { code: '71ITIN40304', name: 'Đồ án thực tập', credits: 4, reason: 'Học kỳ doanh nghiệp/thực tập chưa hoàn thành', priority: 'Cao', suggest: 'Chuẩn bị sau khi học đủ nhóm cơ sở ngành và chuyên ngành' },
            { code: '71ITGR40206', name: 'Đồ án tốt nghiệp', credits: 6, reason: 'Học phần tốt nghiệp cuối khóa chưa hoàn thành', priority: 'Cao', suggest: 'Đăng ký sau thực tập và đủ điều kiện theo khoa' }
        ],
        notes: 'Nên hoàn tất Anh văn 5 và Nhập môn AI trước, sau đó đi theo hướng Công nghệ phần mềm.',
        forecast: 'Còn khoảng 57 TC, dự kiến cần 4 học kỳ nếu học đều 15–18 TC/học kỳ.'
    },
    '2474802010458': {
        id: '2474802010458',
        name: 'Trương Trần Thanh Phương',
        major: 'Công nghệ Thông tin',
        cohort: 'K30',
        className: 'CNTT K30',
        earnedCredits: 72,
        gpa4: 3.24,
        rating: 'Giỏi',
        failedCourses: 0,
        englishStatus: 'missing',
        mosStatus: 'unknown',
        debtStatus: 'clear',
        recommendedTrack: 'Công nghệ phần mềm',
        missingCourses: [
            { code: '71ITAI40103', name: 'Nhập môn Trí tuệ nhân tạo', credits: 3, reason: 'Cơ sở ngành bắt buộc chưa thấy trong bảng điểm', priority: 'Cao', suggest: 'Nên học trong học kỳ gần nhất nếu mở môn' },
            { code: '71ITSE41003', name: 'Nhập môn Công nghệ phần mềm', credits: 3, reason: 'Môn mở đầu hướng chuyên ngành Công nghệ phần mềm', priority: 'Cao', suggest: 'Nên học trước các môn chuyên ngành phần mềm phía sau' },
            { code: '71ITSE41103', name: 'Kỹ thuật lấy yêu cầu', credits: 3, reason: 'Môn chuyên ngành Công nghệ phần mềm chưa học', priority: 'Trung bình', suggest: 'Học sau Nhập môn Công nghệ phần mềm' },
            { code: '71ITSE41203', name: 'Kiểm thử phần mềm', credits: 3, reason: 'Môn chuyên ngành Công nghệ phần mềm chưa học', priority: 'Trung bình', suggest: 'Có thể học cùng nhóm môn năm 3' },
            { code: '71ITSE41503', name: 'Quản lý dự án phần mềm', credits: 3, reason: 'Môn chuyên ngành cuối hướng phần mềm chưa học', priority: 'Trung bình', suggest: 'Học sau Nhập môn Công nghệ phần mềm' },
            { code: '71ITIN40304', name: 'Đồ án thực tập', credits: 4, reason: 'Học kỳ doanh nghiệp/thực tập chưa hoàn thành', priority: 'Cao', suggest: 'Chuẩn bị sau khi hoàn tất phần lớn môn chuyên ngành' },
            { code: '71ITGR40206', name: 'Đồ án tốt nghiệp', credits: 6, reason: 'Học phần tốt nghiệp cuối khóa chưa hoàn thành', priority: 'Cao', suggest: 'Đăng ký sau thực tập và đủ điều kiện theo khoa' }
        ],
        notes: 'Học lực tốt, nên giữ nhịp học chuyên ngành phần mềm và cập nhật MOS để không bị thiếu điều kiện xét tốt nghiệp.',
        forecast: 'Còn khoảng 54 TC, dự kiến cần 3 học kỳ chính + thực tập/đồ án nếu học 15–18 TC/học kỳ.'
    }
};
let state = {
    earnedCredits: 0,
    failedCourses: 0,
    englishStatus: 'missing',
    mosStatus: 'unknown',
    debtStatus: 'unknown',
    currentStudent: null,
    knowledgeText: ''
};

function escapeHTML(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function clamp(value, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return min;
    return Math.min(max, Math.max(min, number));
}

function statusText(status) {
    if (status === 'done') return 'Đã đạt';
    if (status === 'missing') return 'Chưa đạt';
    return 'Chưa cập nhật';
}

function debtText(status) {
    if (status === 'clear') return 'Đã hoàn tất';
    if (status === 'pending') return 'Cần kiểm tra';
    return 'Chưa cập nhật';
}

function statusClass(status) {
    if (status === 'done' || status === 'clear') return 'pass';
    if (status === 'missing' || status === 'pending') return 'fail';
    return 'warn';
}

function renderDemoList() {
    // Không hiển thị danh sách MSSV mẫu để người dùng tự nhập MSSV.
}


function readStateFromForm() {
    state.earnedCredits = clamp($('#earnedCredits')?.value || 0, 0, TARGET_CREDITS);
    state.failedCourses = clamp($('#failedCourses')?.value || 0, 0, 60);
    state.englishStatus = $('#englishStatus')?.value || 'missing';
    state.mosStatus = $('#mosStatus')?.value || 'unknown';

    if (!state.currentStudent) {
        state.debtStatus = 'unknown';
    }
}

function buildChecks() {
    const missingCredits = Math.max(TARGET_CREDITS - state.earnedCredits, 0);
    const creditStatus = missingCredits === 0 ? 'pass' : state.earnedCredits > 0 ? 'warn' : 'fail';
    const failedStatus = state.failedCourses === 0 ? 'pass' : 'fail';

    return [
        {
            key: 'credits',
            title: 'Tín chỉ tích lũy',
            desc: missingCredits === 0
                ? `Sinh viên đã đạt mốc ${TARGET_CREDITS} tín chỉ.`
                : `Còn thiếu ${missingCredits} tín chỉ so với mốc ${TARGET_CREDITS} tín chỉ.`,
            status: creditStatus,
            pill: missingCredits === 0 ? 'Đạt' : `Thiếu ${missingCredits} TC`,
            icon: 'fa-layer-group'
        },
        {
            key: 'english',
            title: 'Ngoại ngữ đầu ra',
            desc: state.englishStatus === 'done'
                ? 'Đã có chứng chỉ hoặc đạt chuẩn ngoại ngữ đầu ra.'
                : state.englishStatus === 'missing'
                    ? 'Cần bổ sung chứng chỉ ngoại ngữ đầu ra theo quy định.'
                    : 'Chưa có dữ liệu, cần cập nhật trạng thái ngoại ngữ.',
            status: statusClass(state.englishStatus),
            pill: statusText(state.englishStatus),
            icon: 'fa-language'
        },
        {
            key: 'mos',
            title: 'Tin học văn phòng / MOS',
            desc: state.mosStatus === 'done'
                ? 'Đã đạt chuẩn tin học văn phòng/MOS.'
                : state.mosStatus === 'missing'
                    ? 'Cần hoàn tất chuẩn tin học văn phòng/MOS.'
                    : 'Chưa có dữ liệu, cần cập nhật trạng thái tin học/MOS.',
            status: statusClass(state.mosStatus),
            pill: statusText(state.mosStatus),
            icon: 'fa-computer'
        },
        {
            key: 'failed',
            title: 'Môn chưa đạt / học lại',
            desc: state.failedCourses === 0
                ? 'Không ghi nhận môn chưa đạt trong dữ liệu hiện tại.'
                : `Sinh viên có ${state.failedCourses} môn cần xử lý trước khi xét tốt nghiệp.`,
            status: failedStatus,
            pill: state.failedCourses === 0 ? 'Ổn' : `${state.failedCourses} môn`,
            icon: state.failedCourses === 0 ? 'fa-circle-check' : 'fa-triangle-exclamation'
        },
        {
            key: 'debt',
            title: 'Công nợ / hồ sơ học vụ',
            desc: state.debtStatus === 'clear'
                ? 'Công nợ và hồ sơ học vụ trong dữ liệu demo đang ổn.'
                : state.debtStatus === 'pending'
                    ? 'Cần kiểm tra công nợ hoặc hồ sơ học vụ trước khi xét tốt nghiệp.'
                    : 'Chưa có dữ liệu công nợ/hồ sơ học vụ.',
            status: statusClass(state.debtStatus),
            pill: debtText(state.debtStatus),
            icon: state.debtStatus === 'clear' ? 'fa-file-circle-check' : 'fa-file-circle-exclamation'
        }
    ];
}

function getForecastText() {
    const student = state.currentStudent;
    const missingCredits = Math.max(TARGET_CREDITS - state.earnedCredits, 0);
    const checks = buildChecks();
    const passCount = checks.filter(item => item.status === 'pass').length;

    if (student?.forecast) return student.forecast;
    if (passCount === checks.length) return 'Có thể xét đợt gần nhất';
    if (missingCredits > 0) return `Cần khoảng ${Math.ceil(missingCredits / AVG_CREDITS_PER_TERM)} học kỳ`;
    return 'Cần bổ sung điều kiện';
}

function getProfileStatusClass() {
    const checks = buildChecks();
    const failCount = checks.filter(item => item.status === 'fail').length;
    const warnCount = checks.filter(item => item.status === 'warn').length;
    const missingCredits = Math.max(TARGET_CREDITS - state.earnedCredits, 0);

    if (failCount === 0 && warnCount === 0) return { label: 'Đủ điều kiện sơ bộ', className: 'ready' };
    if (missingCredits > 30) return { label: 'Đang học tiếp / Chưa đủ điều kiện', className: 'risk' };
    if (failCount <= 1) return { label: 'Cần bổ sung nhẹ', className: 'warning' };
    return { label: 'Chưa đủ điều kiện', className: 'risk' };
}

function renderDashboard() {
    readStateFromForm();

    const checks = buildChecks();
    const passCount = checks.filter(item => item.status === 'pass').length;
    const missingCredits = Math.max(TARGET_CREDITS - state.earnedCredits, 0);
    const percent = Math.round((state.earnedCredits / TARGET_CREDITS) * 100);

    $('#creditSummary').textContent = `${state.earnedCredits}/${TARGET_CREDITS}`;
    $('#missingSummary').textContent = `${missingCredits} TC`;
    $('#conditionSummary').textContent = `${passCount}/5`;
    $('#creditPercent').textContent = `${percent}%`;
    $('#creditProgress').style.width = `${percent}%`;
    $('#forecastSummary').textContent = getForecastText();

    const note = missingCredits === 0
        ? 'Tín chỉ đã đạt mốc tối thiểu. Hãy kiểm tra thêm chứng chỉ, môn chưa đạt và công nợ/hồ sơ.'
        : `Còn thiếu ${missingCredits} tín chỉ. Nếu trung bình 15–18 tín chỉ/học kỳ, cần khoảng ${Math.ceil(missingCredits / AVG_CREDITS_PER_TERM)} học kỳ để hoàn tất phần tín chỉ.`;
    $('#creditNote').textContent = note;

    const checklist = $('#checklist');
    checklist.innerHTML = '';
    checks.forEach(item => {
        const row = document.createElement('div');
        row.className = `check-item ${item.status}`;
        row.innerHTML = `
            <div class="check-icon"><i class="fas ${item.icon}"></i></div>
            <div>
                <div class="check-title">${escapeHTML(item.title)}</div>
                <div class="check-desc">${escapeHTML(item.desc)}</div>
            </div>
            <span class="status-pill">${escapeHTML(item.pill)}</span>
        `;
        checklist.appendChild(row);
    });

    renderProfile();
    renderMissingCourses();
    renderTimeline();
}

function renderProfile() {
    const card = $('#studentProfileCard');
    const student = state.currentStudent;
    if (!card || !student) {
        if (card) card.hidden = true;
        return;
    }

    card.hidden = false;
    $('#profileName').textContent = student.name;
    $('#profileMeta').textContent = `${student.id} · ${student.className} · ${student.major} · ${student.cohort} · GPA ${student.gpa4 ?? '—'} · ${student.rating ?? '—'} · Hướng gợi ý: ${student.recommendedTrack || 'chưa chọn'}`;

    const status = getProfileStatusClass();
    const badge = $('#profileStatus');
    badge.textContent = status.label;
    badge.className = `student-status-badge ${status.className}`;
}

function renderMissingCourses() {
    const section = $('#missingSection');
    const list = $('#missingCoursesList');
    const count = $('#missingCourseCount');
    const student = state.currentStudent;

    if (!section || !list || !count) return;

    if (!student) {
        section.hidden = true;
        list.innerHTML = '';
        return;
    }

    const courses = student.missingCourses || [];
    section.hidden = false;
    count.textContent = `${courses.length} môn`;

    if (courses.length === 0) {
        list.innerHTML = `
            <div class="course-missing-card">
                <div>
                    <strong>Không có môn còn thiếu trong dữ liệu demo</strong>
                    <p>Sinh viên đã hoàn tất các học phần trong hồ sơ mẫu. Vẫn cần kiểm tra chứng chỉ, công nợ và thông báo xét tốt nghiệp chính thức.</p>
                </div>
                <span class="course-badge warn">Đã ổn</span>
            </div>
        `;
        return;
    }

    list.innerHTML = courses.map(course => `
        <article class="course-missing-card">
            <div>
                <strong>${escapeHTML(course.code)} · ${escapeHTML(course.name)}</strong>
                <p>${escapeHTML(course.credits)} tín chỉ · ${escapeHTML(course.reason)}</p>
                <p><b>Gợi ý:</b> ${escapeHTML(course.suggest)}</p>
            </div>
            <span class="course-badge ${course.priority === 'Trung bình' ? 'warn' : ''}">${escapeHTML(course.priority)}</span>
        </article>
    `).join('');
}

function renderTimeline() {
    const section = $('#timelineSection');
    const list = $('#timelineList');
    const student = state.currentStudent;
    if (!section || !list) return;

    if (!student) {
        section.hidden = true;
        list.innerHTML = '';
        return;
    }

    section.hidden = false;
    const missingCredits = Math.max(TARGET_CREDITS - state.earnedCredits, 0);
    const steps = [];

    if (student.missingCourses?.length) {
        steps.push({ title: 'Xử lý môn còn thiếu/chưa đạt', desc: `Ưu tiên ${student.missingCourses[0].name}. Sau đó đăng ký các học phần còn lại theo thứ tự tiên quyết.` });
    }
    if (missingCredits > 0) {
        steps.push({ title: 'Bổ sung tín chỉ', desc: `Cần thêm ${missingCredits} tín chỉ. Nên chia khoảng ${Math.ceil(missingCredits / AVG_CREDITS_PER_TERM)} học kỳ để không quá tải.` });
    }
    if (state.englishStatus !== 'done') {
        steps.push({ title: 'Hoàn tất ngoại ngữ đầu ra', desc: 'Đăng ký thi/nộp chứng chỉ ngoại ngữ theo chuẩn đầu ra của trường.' });
    }
    if (state.mosStatus !== 'done') {
        steps.push({ title: 'Hoàn tất tin học/MOS', desc: 'Kiểm tra chuẩn tin học áp dụng cho khóa và bổ sung chứng nhận nếu còn thiếu.' });
    }
    if (state.debtStatus !== 'clear') {
        steps.push({ title: 'Kiểm tra công nợ và hồ sơ', desc: 'Rà soát công nợ, thông tin cá nhân, hồ sơ sinh viên trước đợt xét tốt nghiệp.' });
    }
    steps.push({ title: 'Dự kiến tốt nghiệp', desc: getForecastText() });

    list.innerHTML = steps.map((step, index) => `
        <div class="timeline-step">
            <div class="timeline-dot">${index + 1}</div>
            <div class="timeline-content">
                <strong>${escapeHTML(step.title)}</strong>
                <p>${escapeHTML(step.desc)}</p>
            </div>
        </div>
    `).join('');
}

function lookupStudent() {
    const raw = ($('#studentIdInput')?.value || '').trim();
    if (!raw) {
        addMessage('bot', '**Chưa nhập MSSV.** Bạn nhập MSSV vào ô tra cứu rồi bấm **Tra cứu**.');
        return;
    }

    const student = demoStudents[raw];
    if (!student) {
        state.currentStudent = null;
        state.debtStatus = 'unknown';
        renderDashboard();
        addMessage('bot', `**Không tìm thấy MSSV ${raw}.**\n\nVui lòng kiểm tra lại MSSV hoặc cập nhật thêm dữ liệu sinh viên trong hệ thống.`);
        return;
    }

    state.currentStudent = student;
    $('#earnedCredits').value = student.earnedCredits;
    $('#failedCourses').value = student.failedCourses || 0;
    $('#englishStatus').value = student.englishStatus;
    $('#mosStatus').value = student.mosStatus;
    state.debtStatus = student.debtStatus;

    renderDashboard();
    addMessage('bot', buildStudentSummary(student));
}

function buildStudentSummary(student) {
    const missingCredits = Math.max(TARGET_CREDITS - student.earnedCredits, 0);
    const missingCourses = student.missingCourses || [];
    const issues = collectIssues();

    return `**Đã tra cứu MSSV ${student.id} · ${student.name}**\n\n` +
        `**Tổng quan:**\n` +
        `- GPA hệ 4: ${student.gpa4 ?? '—'} · Xếp loại: ${student.rating ?? '—'}\n` +
        `- Tín chỉ: ${student.earnedCredits}/${TARGET_CREDITS} · còn thiếu ${missingCredits} TC\n` +
        `- Môn còn thiếu/chưa đạt trong dữ liệu demo: ${missingCourses.length} mục\n` +
        `- Hướng gợi ý: ${student.recommendedTrack || 'chưa xác định'}\n` +
        `- Ngoại ngữ: ${statusText(student.englishStatus)}\n` +
        `- Tin học/MOS: ${statusText(student.mosStatus)}\n` +
        `- Công nợ/hồ sơ: ${debtText(student.debtStatus)}\n\n` +
        `**Kết luận:** ${issues.length ? `Chưa đủ điều kiện vì còn: ${issues.join(', ')}.` : 'Đủ điều kiện sơ bộ để xét tốt nghiệp.'}\n\n` +
        `**Dự kiến:** ${getForecastText()}\n\n` +
        `**Ghi chú:** ${student.notes || 'Dữ liệu demo, cần đối chiếu học vụ chính thức.'}`;
}

function collectIssues() {
    const missingCredits = Math.max(TARGET_CREDITS - state.earnedCredits, 0);
    const issues = [];

    if (missingCredits > 0) issues.push(`thiếu ${missingCredits} tín chỉ`);
    if (state.failedCourses > 0) issues.push(`${state.failedCourses} môn còn thiếu/chưa đạt`);
    if (state.englishStatus !== 'done') issues.push('chưa đạt ngoại ngữ đầu ra');
    if (state.mosStatus !== 'done') issues.push('chưa đạt tin học/MOS');
    if (state.debtStatus !== 'clear') issues.push('cần kiểm tra công nợ/hồ sơ');

    return issues;
}

function addMessage(type, text) {
    const messages = $('#miniMessages');
    if (!messages) return;

    const node = document.createElement('div');
    node.className = type === 'user' ? 'user-msg' : 'bot-msg';

    if (type === 'bot') {
        node.innerHTML = formatBotText(text);
    } else {
        node.textContent = text;
    }

    messages.appendChild(node);
    const chatbox = $('#miniChatbox');
    chatbox.scrollTop = chatbox.scrollHeight;
}

function formatBotText(text) {
    const safe = escapeHTML(text);
    return safe
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

function graduationReply(question) {
    readStateFromForm();
    const student = state.currentStudent;
    const lower = question.toLowerCase();
    const issues = collectIssues();
    const missingCredits = Math.max(TARGET_CREDITS - state.earnedCredits, 0);

    if (!student && /\d{8,}/.test(question)) {
        const foundId = question.match(/\d{8,}/)?.[0];
        $('#studentIdInput').value = foundId;
        lookupStudent();
        return '';
    }

    if (!student) {
        return `**Chưa có hồ sơ sinh viên.**\n\nBạn nhập MSSV ở ô bên trái trước, rồi mình sẽ phân tích tín chỉ, chứng chỉ, môn còn thiếu và dự kiến tốt nghiệp.`;
    }

    if (lower.includes('thiếu') || lower.includes('chưa đạt') || lower.includes('còn gì')) {
        if (!issues.length) {
            return `**${student.name} đang đủ điều kiện sơ bộ.**\n\nKhông ghi nhận môn còn thiếu, chứng chỉ còn thiếu hay công nợ trong dữ liệu demo. Cần đối chiếu lại với hệ thống học vụ chính thức trước khi nộp hồ sơ.`;
        }
        return `**${student.name} còn thiếu:**\n- ${issues.join('\n- ')}\n\n**Môn cần xử lý:**\n${formatCourseBullet(student.missingCourses)}\n\n**Gợi ý:** Ưu tiên môn chưa đạt/học lại và chứng chỉ đầu ra vì đây là các điểm dễ làm kẹt xét tốt nghiệp.`;
    }

    if (lower.includes('khi nào') || lower.includes('bao giờ') || lower.includes('tốt nghiệp') || lower.includes('tot nghiep')) {
        return `**Dự kiến tốt nghiệp của ${student.name}:** ${getForecastText()}\n\n**Lý do:**\n- Tín chỉ hiện tại: ${state.earnedCredits}/${TARGET_CREDITS}\n- Còn thiếu tín chỉ: ${missingCredits}\n- Điều kiện còn vướng: ${issues.length ? issues.join(', ') : 'không có trong dữ liệu demo'}\n\nDự báo này là demo, cần đối chiếu lịch mở môn và đợt xét tốt nghiệp thật của trường.`;
    }

    if (lower.includes('môn') || lower.includes('mon') || lower.includes('ưu tiên') || lower.includes('uu tien')) {
        return `**Môn nên ưu tiên:**\n${formatCourseBullet(student.missingCourses)}\n\nNếu có môn học lại, hãy ưu tiên môn đó trước. Sau đó mới đến thực tập, đồ án hoặc các môn chuyên ngành cuối khóa.`;
    }

    return buildStudentSummary(student);
}

function formatCourseBullet(courses = []) {
    if (!courses.length) return '- Không có môn còn thiếu trong dữ liệu demo.';
    return courses.map(course => `- ${course.code} · ${course.name} (${course.credits} TC): ${course.reason}`).join('\n');
}

function sendChat(promptFromButton) {
    const input = $('#miniInput');
    const text = (promptFromButton || input.value || '').trim();
    if (!text) return;

    addMessage('user', text);
    input.value = '';

    setTimeout(() => {
        const reply = graduationReply(text);
        if (reply) addMessage('bot', reply);
    }, 220);
}

function clearChatGreeting() {
    const messages = $('#miniMessages');
    if (!messages) return;
    messages.innerHTML = `
        <div class="bot-msg">
            <strong>Đã làm mới.</strong><br>
            Hãy nhập MSSV ở bên trái để kiểm tra lại tình trạng tốt nghiệp.
        </div>
    `;
}

function bindEvents() {
    ['#earnedCredits', '#failedCourses', '#englishStatus', '#mosStatus'].forEach(selector => {
        const el = $(selector);
        if (el) {
            el.addEventListener('input', () => {
                state.currentStudent = null;
                state.debtStatus = 'unknown';
                renderDashboard();
            });
        }
    });

    $('#lookupBtn')?.addEventListener('click', lookupStudent);
    $('#studentIdInput')?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') lookupStudent();
    });

    $('#resetBtn')?.addEventListener('click', () => {
        $('#studentIdInput').value = '';
        $('#earnedCredits').value = '';
        $('#failedCourses').value = '';
        $('#englishStatus').value = 'missing';
        $('#mosStatus').value = 'unknown';
        state.currentStudent = null;
        state.debtStatus = 'unknown';
        renderDashboard();
        clearChatGreeting();
    });

    $('#miniSendBtn')?.addEventListener('click', () => sendChat());
    $('#miniInput')?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') sendChat();
    });

    document.querySelectorAll('[data-prompt]').forEach(button => {
        button.addEventListener('click', () => sendChat(button.dataset.prompt));
    });
}

function loadKnowledge() {
    fetch('/VLU-Chatbot/knowledge/khungK30.txt')
        .then(res => {
            if (!res.ok) throw new Error('Không tìm thấy khung K30');
            return res.text();
        })
        .then(text => {
            state.knowledgeText = text;
            $('#knowledgeContent').textContent = text;
        })
        .catch(() => {
            $('#knowledgeContent').textContent = 'Chưa tải được file khung K30. Bạn vẫn có thể dùng bộ kiểm tra demo theo MSSV phía trên.';
        });
}

document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    renderDemoList();
    loadKnowledge();
    renderDashboard();
});
