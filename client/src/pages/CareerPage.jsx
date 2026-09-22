import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Code, 
  Briefcase, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Layers, 
  ChevronRight,
  RotateCcw,
  Bot,
  Send,
  Loader2,
  Map
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { marked } from 'marked';

export default function CareerPage() {
  const navigate = useNavigate();
  const [year, setYear] = useState('2');
  const [codingLevel, setCodingLevel] = useState('intermediate');
  const [selectedInterests, setSelectedInterests] = useState(['web_dev', 'qa_qc']);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatContainerRef = React.useRef(null);

  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendChat = async (e, quickText = null) => {
    if (e) e.preventDefault();
    const textToSend = quickText || chatInput;
    if (!textToSend.trim() || isChatLoading) return;

    const userMsg = { role: 'user', content: textToSend.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!quickText) setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await api.chat({
        messages: newMessages,
        mode: 'advisor' 
      });
      setMessages([...newMessages, { role: 'assistant', content: res.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: '⚠️ Lỗi: ' + err.message }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const interestsList = [
    { id: 'web_frontend', label: 'Frontend (React, Vue, CSS)', icon: '🎨' },
    { id: 'web_backend', label: 'Backend (Node.js, Express, Java)', icon: '⚙️' },
    { id: 'qa_qc', label: 'QA / QC / Software Testing', icon: '🛡️' },
    { id: 'ai_ml', label: 'Trí tuệ nhân tạo (AI / Machine Learning)', icon: '🤖' },
    { id: 'data_analyst', label: 'Phân tích dữ liệu (Data / SQL)', icon: '📊' },
    { id: 'mobile_dev', label: 'Lập trình Di động (Flutter, React Native)', icon: '📱' },
    { id: 'devops', label: 'Cloud & DevOps (Docker, AWS)', icon: '☁️' }
  ];

  const toggleInterest = (id) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setYear('2');
    setCodingLevel('intermediate');
    setSelectedInterests(['web_dev', 'qa_qc']);
  };

  // Tính toán gợi ý nghề nghiệp
  const careerRecommendations = useMemo(() => {
    const recs = [];

    if (selectedInterests.includes('qa_qc')) {
      recs.push({
        title: "Kỹ sư Đảm bảo chất lượng (QA/QC Engineer)",
        tag: "Rất phù hợp với sinh viên năm 2-3 KTPM",
        desc: "Kiểm thử phần mềm thủ công (Manual Testing), viết Test Case, Test Plan, và tự động hóa với Cypress/Selenium. Cơ hội thực tập mở rộng tại FPT Software, TMA, KMS.",
        stack: ["Postman (API Testing)", "Jira / Bugzilla", "SQL cơ bản", "Cypress / Playwright", "Selenium"],
        plan90: [
          "Tháng 1: Học vững quy trình kiểm thử phần mềm (STLC), các loại kiểm thử (Blackbox, Whitebox, Regression) và cách viết Test Case chuẩn.",
          "Tháng 2: Thực hành kiểm thử API với Postman, viết kịch bản Automation Test cơ bản với Playwright hoặc Cypress.",
          "Tháng 3: Hoàn thiện Portfolio/Project đồ án đã kiểm thử kỹ lưỡng, chuẩn bị CV tiếng Anh và phỏng vấn vị trí QA Intern."
        ]
      });
    }

    if (selectedInterests.includes('web_frontend')) {
      recs.push({
        title: "Lập trình viên Frontend (Frontend React Developer)",
        tag: "Nhu cầu tuyển dụng cao",
        desc: "Xây dựng giao diện web người dùng hiện đại, tương tác mượt mà, chuẩn UI/UX với React, Vite, TypeScript và TailwindCSS.",
        stack: ["React.js", "JavaScript (ES6+)", "TypeScript", "TailwindCSS / CSS3", "RESTful API Integration", "Git"],
        plan90: [
          "Tháng 1: Thành thạo React Hooks (useState, useEffect, useMemo), React Router và Component-driven architecture.",
          "Tháng 2: Xây dựng 2 Single Page Apps (SPA) hoàn chỉnh kết nối RESTful API hoặc Firebase.",
          "Tháng 3: Tối ưu hiệu năng web (Lighthouse), deploy Vercel/Netlify, đóng gói Portfolio GitHub và ứng tuyển Fresher."
        ]
      });
    }

    if (selectedInterests.includes('web_backend')) {
      recs.push({
        title: "Lập trình viên Backend (Backend Node.js / Java)",
        tag: "Kỹ năng nền tảng vững chắc",
        desc: "Thiết kế kiến trúc hệ thống, xây dựng RESTful APIs, quản lý cơ sở dữ liệu MySQL, PostgreSQL hoặc MongoDB, xác thực bảo mật JWT.",
        stack: ["Node.js (Express)", "Java (Spring Boot)", "MySQL / PostgreSQL", "MongoDB", "Docker cơ bản", "JWT Auth"],
        plan90: [
          "Tháng 1: Thiết kế Database Relational chuẩn 3NF, thành thạo CRUD và ORM (Prisma / Hibernate).",
          "Tháng 2: Xây dựng hệ thống Backend API đa chức năng có phân quyền người dùng (Role-based access), caching với Redis.",
          "Tháng 3: Viết tài liệu Swagger/Postman Docs, triển khai server lên Render/Railway/AWS, chuẩn bị phỏng vấn thuật toán."
        ]
      });
    }

    if (selectedInterests.includes('ai_ml')) {
      recs.push({
        title: "Kỹ sư Trí tuệ nhân tạo (AI / LLM Engineer)",
        tag: "Xu hướng tương lai dẫn đầu",
        desc: "Ứng dụng các mô hình ngôn ngữ lớn (LLM như Llama 3, Gemini, OpenAI), kỹ thuật RAG (Retrieval-Augmented Generation) và Fine-tuning.",
        stack: ["Python", "Groq Cloud API / OpenAI API", "LangChain / LlamaIndex", "Vector Database (Chroma, Pinecone)", "Hugging Face"],
        plan90: [
          "Tháng 1: Nắm vững Python nâng cao, xử lý dữ liệu với Pandas/NumPy và gọi API mô hình ngôn ngữ lớn.",
          "Tháng 2: Xây dựng hệ thống RAG chatbot tra cứu tài liệu nội bộ kết hợp Vector Database.",
          "Tháng 3: Tối ưu Prompt Engineering, tích hợp AI Assistant vào sản phẩm Web thực chiến."
        ]
      });
    }

    // Nếu chưa chọn mục nào hoặc còn trống
    if (recs.length === 0) {
      recs.push({
        title: "Lập trình viên Phần mềm Fullstack (Fullstack Web Developer)",
        tag: "Định hướng toàn diện cho SV Khoa CNTT",
        desc: "Nắm vững cả Frontend (React) và Backend (Node.js/Express) để tự mình phát triển trọn vẹn sản phẩm từ ý tưởng đến triển khai.",
        stack: ["React.js", "Node.js (Express)", "MySQL", "Git / GitHub", "Docker"],
        plan90: [
          "Tháng 1: Nắm chắc nền tảng JavaScript ES6+, HTML5/CSS3 và React căn bản.",
          "Tháng 2: Kết hợp React Frontend với Express API và Database.",
          "Tháng 3: Đưa ứng dụng lên môi trường Production, làm đẹp GitHub Profile và CV."
        ]
      });
    }

    return recs;
  }, [selectedInterests, year, codingLevel]);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Cột trái: Nội dung chính */}
      <div className="page-container fade-in" style={{ flex: 1, paddingRight: '20px', overflowY: 'auto', borderRight: '1px solid var(--border-color)' }}>
        {/* Header */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Compass size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)' }}>
                Định Hướng Nghề Nghiệp & Tương Lai
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Khảo sát sở thích, kỹ năng để AI thiết lập lộ trình phát triển và kế hoạch thực chiến 90 ngày
              </p>
            </div>
          </div>

          <button onClick={handleReset} className="btn-secondary" style={{ fontSize: '12px' }}>
            <RotateCcw size={14} /> Thiết lập lại
          </button>
        </div>

        {/* Survey Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Bạn đang là sinh viên năm mấy?
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)',
                color: 'var(--text-main)',
                fontSize: '14px'
              }}
            >
              <option value="1">Năm 1 (Mới bắt đầu tìm hiểu)</option>
              <option value="2">Năm 2 (Đang học môn cơ sở ngành)</option>
              <option value="3">Năm 3 (Chuẩn bị đi thực tập doanh nghiệp)</option>
              <option value="4">Năm 4 (Làm khóa luận & chuẩn bị tốt nghiệp)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Mức độ tự tin lập trình hiện tại
            </label>
            <select
              value={codingLevel}
              onChange={(e) => setCodingLevel(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)',
                color: 'var(--text-main)',
                fontSize: '14px'
              }}
            >
              <option value="beginner">Mới bắt đầu (Chưa nắm vững code)</option>
              <option value="basic">Biết cơ bản (Làm được bài tập trên lớp)</option>
              <option value="intermediate">Khá (Tự làm được project mini)</option>
              <option value="advanced">Tốt (Sẵn sàng phỏng vấn thực tập)</option>
            </select>
          </div>
        </div>

        {/* Interests Chips */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>
            Lĩnh vực bạn quan tâm nhất (chọn 1 hoặc nhiều):
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {interestsList.map(item => {
              const active = selectedInterests.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleInterest(item.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '20px',
                    border: active ? '1px solid var(--vlu-red)' : '1px solid var(--border-color)',
                    background: active ? 'var(--vlu-red-light)' : 'var(--bg-primary)',
                    color: active ? 'var(--vlu-red)' : 'var(--text-main)',
                    fontSize: '13px',
                    fontWeight: active ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommendations Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {careerRecommendations.map((career, idx) => (
          <div key={idx} className="vlu-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
              <div>
                <span className="badge badge-red" style={{ marginBottom: '6px' }}>{career.tag}</span>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                  {career.title}
                </h2>
              </div>

              <button
                onClick={() => navigate(`/?ask=${encodeURIComponent(`Tôi muốn tìm hiểu lộ trình chi tiết trở thành ${career.title}`)}`)}
                className="btn-vlu-primary"
                style={{ fontSize: '13px', padding: '6px 14px' }}
              >
                <Sparkles size={15} /> Hỏi AI thêm về hướng này
              </button>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              {career.desc}
            </p>

            {/* Tech Stack Required */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Code size={16} color="var(--vlu-red)" />
                <span>Stack công nghệ cốt lõi doanh nghiệp yêu cầu:</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {career.stack.map((tech, i) => (
                  <span key={i} style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--text-main)'
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* 90 Days Plan */}
            <div style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} color="#16a34a" />
                <span>Lộ trình thực chiến 90 ngày bứt phá:</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {career.plan90.map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>

      {/* Cột phải: Chatbot Trợ lý định hướng nghề nghiệp */}
      <div style={{ width: '380px', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--vlu-red)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Assistant
          </div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', color: 'var(--text-main)', fontWeight: 800 }}>
            <Bot size={22} color="var(--vlu-red)" /> Trợ lý định hướng nghề nghiệp
          </h2>
        </div>

        {/* Thông tin nhanh */}
        <div style={{ padding: '16px 20px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
            <Map size={16} color="var(--vlu-red)" /> Lộ trình 90 ngày
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
            Chọn ít nhất một sở thích hoặc kỹ năng bên trái để hệ thống gợi ý lộ trình 90 ngày phù hợp.
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
            <button onClick={() => handleSendChat(null, "Nên theo hướng nào?")} className="badge badge-red" style={{ cursor: 'pointer', background: 'transparent', border: '1px solid var(--vlu-red)', padding: '4px 10px', fontSize: '12px' }}>Nên theo hướng nào?</button>
            <button onClick={() => handleSendChat(null, "Học gì 90 ngày?")} className="badge badge-red" style={{ cursor: 'pointer', background: 'transparent', border: '1px solid var(--vlu-red)', padding: '4px 10px', fontSize: '12px' }}>Học gì 90 ngày?</button>
            <button onClick={() => handleSendChat(null, "Project thực tập")} className="badge badge-red" style={{ cursor: 'pointer', background: 'transparent', border: '1px solid var(--vlu-red)', padding: '4px 10px', fontSize: '12px' }}>Project thực tập</button>
          </div>
        </div>

        {/* Khung Chat */}
        <div 
          ref={chatContainerRef}
          style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {/* Welcome Message */}
          <div style={{
            background: 'var(--bg-primary)',
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            fontSize: '14px',
            lineHeight: 1.5,
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontWeight: 800, color: 'var(--vlu-red)', marginBottom: '12px', textAlign: 'center' }}>Xin chào!</div>
            Hãy chọn sở thích/kỹ năng bên trái. Mình sẽ gợi ý hướng nghề, kỹ năng còn thiếu, lộ trình 90 ngày và project nên làm.
          </div>

          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: '16px',
                background: msg.role === 'user' ? 'var(--vlu-red)' : 'var(--bg-primary)',
                color: msg.role === 'user' ? '#fff' : 'var(--text-main)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)',
                fontSize: '14px',
                lineHeight: 1.5,
                boxShadow: msg.role === 'user' ? '0 2px 8px rgba(196, 18, 48, 0.3)' : 'var(--shadow-sm)',
                borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px'
              }}>
                {msg.role === 'user' ? (
                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                ) : (
                  <div 
                    className="markdown-body custom-markdown"
                    dangerouslySetInnerHTML={{ __html: marked.parse(msg.content || '') }}
                  />
                )}
              </div>
            </div>
          ))}

          {isChatLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: '16px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-muted)'
              }}>
                <Loader2 size={16} className="spin" /> Đang phản hồi...
              </div>
            </div>
          )}
        </div>

        {/* Input Chat */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
          <form onSubmit={(e) => handleSendChat(e)} style={{ position: 'relative' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Hỏi về Frontend, Backend, AI/Data, QA, BA..."
              style={{
                width: '100%',
                padding: '14px 48px 14px 16px',
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-main)',
                outline: 'none',
                fontSize: '13px'
              }}
            />
            <button
              type="submit"
              disabled={isChatLoading || !chatInput.trim()}
              style={{
                position: 'absolute',
                right: '6px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'var(--vlu-red)',
                border: 'none',
                color: 'white',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: (isChatLoading || !chatInput.trim()) ? 'not-allowed' : 'pointer',
                opacity: (isChatLoading || !chatInput.trim()) ? 0.5 : 1,
                transition: '0.2s'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
