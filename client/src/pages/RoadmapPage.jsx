import React, { useState, useEffect, useMemo } from 'react';
import { 
  Map, 
  CheckSquare, 
  Square, 
  Search, 
  RotateCcw, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  Layers,
  ChevronRight,
  Bot,
  Send,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { marked } from 'marked';

const STORAGE_COMPLETED_KEY = 'vlu_roadmap_completed_courses';

export default function RoadmapPage() {
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedCodes, setCompletedCodes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COMPLETED_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  
  // Chat state
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatContainerRef = React.useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    api.getCurriculum()
      .then(res => {
        if (res.success) {
          setCurriculum(res.data);
        }
      })
      .catch(err => console.error("Lỗi nạp khung đào tạo:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleCourse = (code) => {
    setCompletedCodes(prev => {
      const isCurrentlyCompleted = prev.has(code);
      
      // Tính năng ràng buộc môn tiên quyết (nếu đang muốn đánh dấu là Đã học)
      if (!isCurrentlyCompleted) {
        const course = allCourses.find(c => c.code === code);
        if (course && course.prerequisites && course.prerequisites.length > 0) {
          const unmetPrereqs = course.prerequisites.filter(p => !prev.has(p));
          if (unmetPrereqs.length > 0) {
            const ok = window.confirm(`Môn này có học phần trước là ${unmetPrereqs.join(', ')}.\nBạn vẫn muốn đánh dấu là đã học?`);
            if (!ok) return prev; // Hủy thao tác nếu người dùng chọn Cancel
          }
        }
      }

      const next = new Set(prev);
      if (isCurrentlyCompleted) {
        next.delete(code);
      } else {
        next.add(code);
      }
      localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const handleSendChat = async (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = { role: 'user', content: chatInput.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setChatInput('');
    setIsChatLoading(true);

    try {
      // Gọi AI với mode 'roadmap' để kèm dữ liệu khung chương trình
      const res = await api.chat({
        messages: newMessages,
        mode: 'roadmap'
      });
      setMessages([...newMessages, { role: 'assistant', content: res.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: '⚠️ Lỗi: ' + err.message }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn bỏ chọn tất cả các môn đã tích?")) {
      setCompletedCodes(new Set());
      localStorage.removeItem(STORAGE_COMPLETED_KEY);
    }
  };

  // Tính toán tất cả môn học
  const allCourses = useMemo(() => {
    if (!curriculum?.sections) return [];
    const list = [];
    curriculum.sections.forEach(sec => {
      sec.courses?.forEach(c => {
        list.push({
          ...c,
          sectionName: sec.name
        });
      });
    });
    return list;
  }, [curriculum]);

  // Tính toán tổng số tín chỉ tích lũy
  const totalTargetCredits = 126;
  const earnedCredits = useMemo(() => {
    return allCourses
      .filter(c => completedCodes.has(c.code))
      .reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
  }, [allCourses, completedCodes]);

  const remainingCredits = Math.max(0, totalTargetCredits - earnedCredits);
  const percent = Math.min(100, Math.round((earnedCredits / totalTargetCredits) * 100));

  // Kích hoạt pháo giấy confetti khi đạt 100%
  useEffect(() => {
    if (percent === 100 && earnedCredits > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [percent, earnedCredits]);

  // Bộ lọc tìm kiếm
  const filteredCourses = useMemo(() => {
    return allCourses.filter(c => {
      const matchesSearch = 
        !searchQuery || 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSection = 
        selectedSection === 'all' || 
        c.sectionName === selectedSection;

      return matchesSearch && matchesSection;
    });
  }, [allCourses, searchQuery, selectedSection]);

  const sectionsList = useMemo(() => {
    if (!curriculum?.sections) return [];
    return curriculum.sections.map(s => s.name);
  }, [curriculum]);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Cột trái: Lộ trình môn học */}
      <div className="page-container fade-in" style={{ flex: 1, paddingRight: '20px', overflowY: 'auto', borderRight: '1px solid var(--border-color)' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--vlu-red)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Map size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
              Lộ Trình Học Tập Cá Nhân Hóa
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Tích chọn các môn bạn đã học để hệ thống tính toán tín chỉ và đề xuất lộ trình tối ưu
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={handleClearAll} className="btn-secondary" style={{ fontSize: '13px' }}>
            <RotateCcw size={15} /> Bỏ chọn tất cả
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="vlu-card" style={{ marginBottom: '24px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Tiến trình tích lũy: </span>
            <strong style={{ fontSize: '18px', color: 'var(--vlu-red)' }}>{earnedCredits}</strong>
            <span style={{ color: 'var(--text-muted)' }}> / {totalTargetCredits} Tín chỉ</span>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
            <span>Còn thiếu: <strong>{remainingCredits} TC</strong></span>
            <span>Tỷ lệ hoàn thành: <strong style={{ color: '#16a34a' }}>{percent}%</strong></span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          width: '100%',
          height: '12px',
          borderRadius: '9999px',
          background: 'var(--border-color)',
          overflow: 'hidden',
          marginBottom: '10px'
        }}>
          <div style={{
            width: `${percent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--vlu-red) 0%, #ff5252 50%, #16a34a 100%)',
            borderRadius: '9999px',
            transition: 'width 0.4s ease'
          }} />
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} color="var(--vlu-red)" />
          <span>Mẹo: Bạn nên ưu tiên đăng ký các môn tiên quyết cơ sở khối ngành trước để mở khóa các môn chuyên sâu kỳ sau.</span>
        </div>
      </div>

      {/* Toolbar Search & Filter */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          flex: 1,
          minWidth: '240px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 12px'
        }}>
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text"
            placeholder="Tìm theo tên môn hoặc mã học phần (ví dụ: 71ITBS10203, Lập trình)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              width: '100%',
              fontSize: '13px',
              color: 'var(--text-main)'
            }}
          />
        </div>

        {sectionsList.length > 1 && (
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-main)',
              fontSize: '13px'
            }}
          >
            <option value="all">Tất cả phân nhóm kiến thức</option>
            {sectionsList.map(sec => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>
        )}
      </div>

      {/* Courses List Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Đang nạp Khung chương trình đào tạo K30 CNTT...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '14px',
          marginBottom: '30px'
        }}>
          {filteredCourses.map(course => {
            const isCompleted = completedCodes.has(course.code);
            return (
              <div 
                key={course.code}
                onClick={() => handleToggleCourse(course.code)}
                style={{
                  background: isCompleted ? 'rgba(34, 197, 94, 0.05)' : 'var(--bg-card)',
                  border: isCompleted ? '1px solid #22c55e' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isCompleted ? '0 0 10px rgba(34, 197, 94, 0.1)' : 'var(--shadow-sm)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {course.code}
                    </span>
                    <span className={`badge ${isCompleted ? 'badge-green' : 'badge-orange'}`} style={{ fontSize: '11px' }}>
                      {course.credits} TC
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: isCompleted ? '#16a34a' : 'var(--text-main)',
                    marginBottom: '8px',
                    lineHeight: 1.4
                  }}>
                    {course.name}
                  </h3>

                  {course.prerequisites && course.prerequisites.length > 0 && (
                    <div style={{ fontSize: '11px', color: '#ea580c', marginTop: '6px' }}>
                      <strong>Tiên quyết: </strong>
                      <span>{course.prerequisites.join(', ')}</span>
                    </div>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '14px',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-color)',
                  fontSize: '12px'
                }}>
                  <span style={{ color: isCompleted ? '#16a34a' : 'var(--text-muted)' }}>
                    {isCompleted ? '✓ Đã tích lũy' : 'Chưa học'}
                  </span>
                  {isCompleted ? (
                    <CheckCircle size={18} color="#22c55e" />
                  ) : (
                    <Square size={18} color="var(--text-muted)" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>

      {/* Cột phải: Chatbot Trợ lý lộ trình */}
      <div style={{ width: '380px', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', color: 'var(--vlu-red)' }}>
            <Bot size={22} /> Trợ lý Lộ trình Học tập
          </h2>
        </div>

        {/* Thông tin nhanh */}
        <div style={{ padding: '16px 20px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Khóa 30 - CNTT</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Đã tích lũy: <strong style={{ color: 'var(--vlu-red)' }}>{earnedCredits}/{totalTargetCredits} TC</strong>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Còn thiếu: <strong style={{ color: 'var(--vlu-red)' }}>{remainingCredits} TC</strong>
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
            Chào bạn! Mình có thể tư vấn về <strong style={{ color: 'var(--vlu-red)' }}>môn học, tín chỉ, môn tiên quyết và lộ trình học tập.</strong> Bạn tích các môn đã học bên trái rồi hỏi mình nhé.
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
          <form onSubmit={handleSendChat} style={{ position: 'relative' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ví dụ: Mình nên học môn nào tiếp?"
              style={{
                width: '100%',
                padding: '14px 48px 14px 16px',
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-main)',
                outline: 'none',
                fontSize: '14px'
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
          <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Trợ lý chỉ trả lời trọng tâm về lộ trình và dữ liệu môn học của khóa đang chọn.
          </div>
        </div>
      </div>
    </div>
  );
}
