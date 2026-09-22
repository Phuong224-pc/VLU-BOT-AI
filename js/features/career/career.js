const interests = [
    { id: 'ui', label: 'Thích giao diện đẹp', icon: 'fa-palette' },
    { id: 'logic', label: 'Thích xử lý logic', icon: 'fa-code' },
    { id: 'data', label: 'Thích dữ liệu / AI', icon: 'fa-brain' },
    { id: 'mobile', label: 'Thích app điện thoại', icon: 'fa-mobile-screen' },
    { id: 'security', label: 'Thích bảo mật', icon: 'fa-shield-halved' },
    { id: 'analysis', label: 'Thích phân tích yêu cầu', icon: 'fa-diagram-project' },
    { id: 'testing', label: 'Thích kiểm thử', icon: 'fa-bug' },
    { id: 'system', label: 'Thích hệ thống / server', icon: 'fa-server' }
];

const skills = [
    { id: 'htmlcss', label: 'HTML/CSS' },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'react', label: 'React/Vue' },
    { id: 'java', label: 'Java/C#' },
    { id: 'node', label: 'Node.js' },
    { id: 'database', label: 'SQL/CSDL' },
    { id: 'python', label: 'Python' },
    { id: 'git', label: 'Git/GitHub' },
    { id: 'figma', label: 'Figma' },
    { id: 'testcase', label: 'Test case' },
    { id: 'communication', label: 'Giao tiếp' },
    { id: 'english', label: 'Tiếng Anh' }
];

const tracks = [
    {
        id: 'frontend',
        name: 'Frontend Developer',
        icon: 'fa-laptop-code',
        desc: 'Phù hợp nếu bạn thích giao diện, trải nghiệm người dùng và muốn thấy sản phẩm trực quan nhanh.',
        interests: ['ui'],
        skills: ['htmlcss', 'javascript', 'react', 'figma', 'git'],
        tags: ['HTML/CSS', 'JavaScript', 'React/Vue', 'UI responsive'],
        roadmap: [
            ['Nền tảng', 'Ôn HTML/CSS, JavaScript ES6, DOM, responsive layout.'],
            ['Framework', 'Làm 1 project React/Vue có routing, component, form validation.'],
            ['Portfolio', 'Deploy lên GitHub Pages/Firebase và viết README rõ ràng.']
        ],
        project: 'Website quản lý học tập hoặc trang giới thiệu ngành học có đăng nhập giả lập.'
    },
    {
        id: 'backend',
        name: 'Backend Developer',
        icon: 'fa-server',
        desc: 'Phù hợp nếu bạn thích xử lý logic, database, API và nghiệp vụ phía sau hệ thống.',
        interests: ['logic', 'system'],
        skills: ['java', 'node', 'database', 'git'],
        tags: ['REST API', 'Database', 'Auth', 'Node/Java'],
        roadmap: [
            ['Nền tảng', 'Ôn CSDL, SQL, HTTP, REST API và mô hình client-server.'],
            ['Thực hành', 'Xây API CRUD có đăng nhập, phân quyền và lưu database.'],
            ['Chuẩn hóa', 'Viết tài liệu API, xử lý lỗi, deploy backend cơ bản.']
        ],
        project: 'API quản lý môn học/sinh viên có đăng nhập, phân quyền admin và database.'
    },
    {
        id: 'data-ai',
        name: 'AI / Data Analyst',
        icon: 'fa-brain',
        desc: 'Phù hợp nếu bạn thích dữ liệu, thống kê, Python và muốn phân tích hoặc xây mô hình AI cơ bản.',
        interests: ['data'],
        skills: ['python', 'database', 'english', 'git'],
        tags: ['Python', 'Pandas', 'SQL', 'Machine Learning'],
        roadmap: [
            ['Dữ liệu', 'Học Python, Pandas, trực quan hóa dữ liệu và SQL căn bản.'],
            ['Phân tích', 'Làm notebook phân tích bộ dữ liệu thật, có biểu đồ và nhận xét.'],
            ['AI cơ bản', 'Thử mô hình phân loại/dự đoán đơn giản và giải thích kết quả.']
        ],
        project: 'Dashboard phân tích điểm học tập hoặc dự đoán kết quả qua dữ liệu mẫu tự tạo.'
    },
    {
        id: 'mobile',
        name: 'Mobile Developer',
        icon: 'fa-mobile-screen-button',
        desc: 'Phù hợp nếu bạn thích app điện thoại, trải nghiệm người dùng trên mobile và sản phẩm thực tế.',
        interests: ['mobile', 'ui'],
        skills: ['javascript', 'java', 'database', 'git'],
        tags: ['Flutter/React Native', 'Mobile UI', 'API', 'Firebase'],
        roadmap: [
            ['Nền tảng', 'Nắm layout mobile, state, navigation và gọi API.'],
            ['Ứng dụng', 'Làm app có đăng nhập, danh sách dữ liệu và lưu trạng thái.'],
            ['Hoàn thiện', 'Tối ưu UI, validate form, build bản demo để trình bày.']
        ],
        project: 'App checklist học tập hoặc app tra cứu môn học có lưu tiến độ.'
    },
    {
        id: 'qa',
        name: 'QA / Tester',
        icon: 'fa-bug',
        desc: 'Phù hợp nếu bạn cẩn thận, thích tìm lỗi, viết test case và kiểm tra chất lượng sản phẩm.',
        interests: ['testing', 'analysis'],
        skills: ['testcase', 'communication', 'database', 'git'],
        tags: ['Test case', 'Bug report', 'Manual test', 'Automation basic'],
        roadmap: [
            ['Nền tảng', 'Học quy trình test, test case, test plan và bug report.'],
            ['Thực hành', 'Test một website/app, ghi lỗi có ảnh, bước tái hiện, mức độ nghiêm trọng.'],
            ['Mở rộng', 'Tìm hiểu Postman, API testing và automation cơ bản.']
        ],
        project: 'Bộ test case cho website chatbot hoặc trang quản lý sinh viên.'
    },
    {
        id: 'ba',
        name: 'Business Analyst',
        icon: 'fa-diagram-project',
        desc: 'Phù hợp nếu bạn thích phân tích yêu cầu, giao tiếp với người dùng và viết tài liệu nghiệp vụ.',
        interests: ['analysis'],
        skills: ['communication', 'figma', 'database', 'english'],
        tags: ['Requirement', 'User story', 'BPMN', 'Wireframe'],
        roadmap: [
            ['Nền tảng', 'Học cách lấy yêu cầu, user story, use case và BPMN.'],
            ['Tài liệu', 'Viết SRS/BRD ngắn cho một hệ thống quen thuộc.'],
            ['Trình bày', 'Vẽ wireframe, luồng nghiệp vụ và demo logic cho team dev.']
        ],
        project: 'Tài liệu phân tích hệ thống đăng ký môn học hoặc quản lý học vụ.'
    },
    {
        id: 'security',
        name: 'Cybersecurity Basic',
        icon: 'fa-shield-halved',
        desc: 'Phù hợp nếu bạn quan tâm bảo mật, hệ thống, mạng máy tính và an toàn dữ liệu.',
        interests: ['security', 'system'],
        skills: ['database', 'python', 'git', 'english'],
        tags: ['Network', 'Web security', 'Linux', 'Python'],
        roadmap: [
            ['Nền tảng', 'Ôn mạng máy tính, HTTP, Linux command và bảo mật web cơ bản.'],
            ['Thực hành', 'Làm lab OWASP Top 10 ở môi trường hợp pháp.'],
            ['Portfolio', 'Viết report bảo mật mẫu, khuyến nghị fix lỗi rõ ràng.']
        ],
        project: 'Checklist kiểm tra bảo mật cơ bản cho website đăng nhập/demo.'
    }
];

const $ = (selector) => document.querySelector(selector);

let careerState = {
    currentStudent: null
};

function escapeHTML(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function selectedValues(name) {
    return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value);
}

function formatBotText(text) {
    return escapeHTML(text)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

function createChip(item, name) {
    const label = document.createElement('label');
    label.className = 'choice-chip';
    label.innerHTML = `
        <input type="checkbox" name="${name}" value="${item.id}">
        ${item.icon ? `<i class="fas ${item.icon}"></i>` : ''}
        <span>${escapeHTML(item.label)}</span>
    `;
    return label;
}

function renderChoices() {
    const interestBox = $('#interestChoices');
    const skillBox = $('#skillChoices');
    interests.forEach(item => interestBox.appendChild(createChip(item, 'interest')));
    skills.forEach(item => skillBox.appendChild(createChip(item, 'skill')));
}








function getProfile() {
    return {
        year: $('#studentYear')?.value || 'unknown',
        codingLevel: $('#codingLevel')?.value || 'beginner',
        interests: selectedValues('interest'),
        skills: selectedValues('skill')
    };
}

function scoreTracks(profile) {
    const codingBonus = {
        beginner: 0,
        basic: 4,
        intermediate: 8,
        advanced: 12
    }[profile.codingLevel] || 0;

    return tracks.map(track => {
        let score = 0;
        track.interests.forEach(item => {
            if (profile.interests.includes(item)) score += 18;
        });
        track.skills.forEach(item => {
            if (profile.skills.includes(item)) score += 10;
        });
        if (track.id === 'qa' || track.id === 'ba') score += profile.skills.includes('communication') ? 8 : 0;
        if (track.id === 'frontend' && profile.skills.includes('figma')) score += 8;
        if (track.id === 'backend' && profile.skills.includes('database')) score += 8;
        if (track.id === 'data-ai' && profile.skills.includes('python')) score += 10;
        score += codingBonus;
        return { ...track, score: Math.min(100, score) };
    }).sort((a, b) => b.score - a.score);
}


function renderResults() {
    const profile = getProfile();
    const hasProfile = profile.interests.length > 0 || profile.skills.length > 0;
    const ranked = hasProfile
        ? scoreTracks(profile)
        : tracks.map(track => ({ ...track, score: 0 }));
    const results = $('#trackResults');
    results.innerHTML = '';

    const skillCount = $('#skillCount');
    const topTrackName = $('#topTrackName');
    if (skillCount) skillCount.textContent = profile.skills.length;
    if (topTrackName) topTrackName.textContent = hasProfile ? ranked[0].name : 'Chưa chọn';

    ranked.slice(0, 4).forEach((track, index) => {
        const card = document.createElement('article');
        card.className = `track-card ${hasProfile && index === 0 ? 'top' : ''}`;
        card.innerHTML = `
            <div class="track-head">
                <h3 class="track-title"><i class="fas ${track.icon}"></i>${escapeHTML(track.name)}</h3>
                <span class="score-pill">${hasProfile ? `${track.score}% phù hợp` : '0% phù hợp'}</span>
            </div>
            <p>${escapeHTML(track.desc)}</p>
            <div class="track-tags">${track.tags.map(tag => `<span>${escapeHTML(tag)}</span>`).join('')}</div>
        `;
        results.appendChild(card);
    });

    renderRoadmap(hasProfile ? ranked[0] : null);
}


function renderRoadmap(track) {
    const box = $('#roadmapOutput');
    box.innerHTML = '';

    if (!track) {
        box.innerHTML = `
            <div class="roadmap-empty">
                Chọn ít nhất một sở thích hoặc kỹ năng bên trái để hệ thống gợi ý lộ trình 90 ngày phù hợp.
            </div>
        `;
        return;
    }

    track.roadmap.forEach((step, index) => {
        const row = document.createElement('div');
        row.className = 'roadmap-step';
        row.innerHTML = `
            <span>${index + 1}</span>
            <div>
                <strong>${escapeHTML(step[0])}</strong>
                <p>${escapeHTML(step[1])}</p>
            </div>
        `;
        box.appendChild(row);
    });
}

function addMessage(type, text) {
    const messages = $('#miniMessages');
    const node = document.createElement('div');
    node.className = type === 'user' ? 'user-msg' : 'bot-msg';
    node[type === 'user' ? 'textContent' : 'innerHTML'] = type === 'user' ? text : formatBotText(text);
    messages.appendChild(node);
    const chatbox = $('#miniChatbox');
    chatbox.scrollTop = chatbox.scrollHeight;
}

const trackAliases = {
    frontend: ['frontend', 'front end', 'giao diện', 'giao dien', 'ui', 'ux', 'html', 'css', 'javascript', 'react', 'vue'],
    backend: ['backend', 'back end', 'server', 'api', 'database', 'cơ sở dữ liệu', 'co so du lieu', 'csdl', 'node', 'java', 'spring'],
    'data-ai': ['ai', 'data', 'analyst', 'data analyst', 'dữ liệu', 'du lieu', 'python', 'pandas', 'sql', 'machine learning', 'ml', 'trí tuệ nhân tạo', 'tri tue nhan tao'],
    mobile: ['mobile', 'app điện thoại', 'app dien thoai', 'android', 'ios', 'flutter', 'react native'],
    qa: ['qa', 'tester', 'testing', 'kiểm thử', 'kiem thu', 'test case', 'bug'],
    ba: ['ba', 'business analyst', 'phân tích yêu cầu', 'phan tich yeu cau', 'nghiệp vụ', 'nghiep vu', 'bpmn', 'wireframe'],
    security: ['security', 'cyber', 'cybersecurity', 'bảo mật', 'bao mat', 'network', 'linux']
};

const skillAliases = {
    htmlcss: ['html', 'css', 'html/css'],
    javascript: ['javascript', 'js'],
    react: ['react', 'vue'],
    java: ['java', 'c#', 'spring'],
    node: ['node', 'nodejs', 'node.js'],
    database: ['sql', 'database', 'cơ sở dữ liệu', 'co so du lieu', 'csdl'],
    python: ['python', 'pandas', 'machine learning', 'ml'],
    git: ['git', 'github'],
    figma: ['figma', 'ui', 'ux'],
    testcase: ['test case', 'testing', 'tester', 'qa'],
    communication: ['giao tiếp', 'giao tiep', 'phân tích yêu cầu', 'phan tich yeu cau', 'ba'],
    english: ['english', 'tiếng anh', 'tieng anh']
};

function normalizeText(text) {
    return String(text || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd');
}

function includesAny(rawText, aliases) {
    const normalized = normalizeText(rawText);
    return aliases.some(alias => normalized.includes(normalizeText(alias)));
}

function findTrackFromQuestion(question) {
    for (const [trackId, aliases] of Object.entries(trackAliases)) {
        if (includesAny(question, aliases)) {
            return tracks.find(track => track.id === trackId);
        }
    }
    return null;
}

function inferSkillsFromQuestion(question) {
    const found = [];
    Object.entries(skillAliases).forEach(([skillId, aliases]) => {
        if (includesAny(question, aliases)) found.push(skillId);
    });
    return found;
}

function inferInterestsFromTrack(track) {
    return track ? [...track.interests] : [];
}

function uniqueValues(values) {
    return [...new Set(values.filter(Boolean))];
}

function makeTemporaryProfile(profile, question, explicitTrack) {
    const inferredSkills = inferSkillsFromQuestion(question);
    const inferredInterests = inferInterestsFromTrack(explicitTrack);

    return {
        ...profile,
        interests: uniqueValues([...profile.interests, ...inferredInterests]),
        skills: uniqueValues([...profile.skills, ...inferredSkills])
    };
}

function describeTrack(track) {
    return `**${track.name}**\n${track.desc}\n\n**Stack nên tập trung:** ${track.tags.join(', ')}.\n\n**Lộ trình 90 ngày:**\n1. ${track.roadmap[0][1]}\n2. ${track.roadmap[1][1]}\n3. ${track.roadmap[2][1]}\n\n**Project gợi ý:** ${track.project}`;
}

function careerReply(question) {
    const profile = getProfile();
    const explicitTrack = findTrackFromQuestion(question);
    const tempProfile = makeTemporaryProfile(profile, question, explicitTrack);
    const hasProfile = tempProfile.interests.length || tempProfile.skills.length;
    const ranked = scoreTracks(tempProfile);
    const top = explicitTrack || ranked[0];
    const lower = normalizeText(question);

    if (explicitTrack && !lower.includes('so sanh')) {
        return describeTrack(explicitTrack);
    }

    if (!hasProfile) {
        return `**Bạn chưa chọn sở thích/kỹ năng.**\n\nHãy tích vài lựa chọn bên trái hoặc hỏi trực tiếp một hướng như **Frontend**, **Backend**, **AI/Data**, **QA**, **BA**, **Mobile**.`;
    }

    if (lower.includes('project') || lower.includes('du an') || lower.includes('thuc tap')) {
        return `**Project nên làm cho hướng ${top.name}:**\n${top.project}\n\n**Mẹo trình bày:** Đưa code lên GitHub, viết README có mục mô tả, chức năng chính, công nghệ dùng và ảnh demo.`;
    }

    if (lower.includes('90') || lower.includes('hoc gi') || lower.includes('lo trinh')) {
        return `**Lộ trình 90 ngày cho ${top.name}:**\n1. ${top.roadmap[0][1]}\n2. ${top.roadmap[1][1]}\n3. ${top.roadmap[2][1]}\n\n**Ưu tiên:** Học ít nhưng làm ra sản phẩm hoàn chỉnh, có demo và GitHub.`;
    }

    if (lower.includes('python')) {
        const dataTrack = tracks.find(track => track.id === 'data-ai');
        return `**Python phù hợp nhất với hướng AI / Data Analyst.**\n\nBạn có thể đi theo lộ trình: Python cơ bản → Pandas → SQL → trực quan hóa dữ liệu → Machine Learning cơ bản.\n\n**Project nên làm:** ${dataTrack.project}\n\nNếu bạn thích xử lý hệ thống hơn, Python cũng hỗ trợ Backend, Automation hoặc Security.`;
    }

    return `**Hướng phù hợp nhất hiện tại:** ${top.name} (${top.score}% phù hợp).\n\n**Vì sao:** Dựa trên sở thích/kỹ năng bạn đã chọn hoặc nội dung bạn vừa hỏi, hướng này đang khớp nhất với profile hiện tại.\n\n**Top 3 gợi ý:**\n- ${ranked[0].name}: ${ranked[0].score}%\n- ${ranked[1].name}: ${ranked[1].score}%\n- ${ranked[2].name}: ${ranked[2].score}%\n\nBạn có thể chọn thêm kỹ năng bên trái để kết quả chính xác hơn.`;
}

function sendChat(promptFromButton) {
    const input = $('#miniInput');
    const text = (promptFromButton || input.value || '').trim();
    if (!text) return;

    addMessage('user', text);
    input.value = '';

    setTimeout(() => {
        addMessage('bot', careerReply(text));
    }, 250);
}

function resetChatWelcome() {
    const messages = $('#miniMessages');
    if (!messages) return;
    messages.innerHTML = `
        <div class="bot-msg">
            <strong class="welcome-title">Xin chào!</strong>
            <span>Hãy chọn sở thích/kỹ năng bên trái. Mình sẽ gợi ý hướng nghề, kỹ năng còn thiếu, lộ trình 90 ngày và project nên làm.</span>
        </div>
    `;
}

function bindEvents() {
    document.addEventListener('change', (event) => {
        if (event.target.matches('input[name="interest"], input[name="skill"], #studentYear, #codingLevel')) {
            renderResults();
        }
    });

    $('#resetBtn')?.addEventListener('click', () => {
        document.querySelectorAll('input[type="checkbox"]').forEach(input => input.checked = false);
        $('#studentYear').value = 'unknown';
        $('#codingLevel').value = 'beginner';
        renderResults();
        resetChatWelcome();
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
    fetch('/VLU-Chatbot/knowledge/curriculum-IT.txt')
        .then(res => {
            if (!res.ok) throw new Error('Không tìm thấy curriculum-IT.txt');
            return res.text();
        })
        .then(text => {
            $('#knowledgeContent').textContent = text;
        })
        .catch(() => {
            $('#knowledgeContent').textContent = 'Chưa tải được file cẩm nang ngành CNTT. Bạn vẫn có thể dùng bộ gợi ý hướng nghề ở trên.';
        });
}

document.addEventListener('DOMContentLoaded', () => {
    renderChoices();
    bindEvents();
    renderResults();
    loadKnowledge();
});
