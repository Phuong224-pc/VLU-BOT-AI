import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  UploadCloud, 
  Image as ImageIcon, 
  X, 
  Route, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';
import { marked } from 'marked';
import prism from 'prismjs';
import { api } from '../services/api';

export default function AdvisorPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 **Xin chào! Mình là Cố vấn lộ trình học tập Khoa CNTT - Đại học Văn Lang.**\n\nBạn có thể:\n- 📸 **Tải lên ảnh chụp bảng điểm** để mình đọc điểm, tính tín chỉ tích lũy và kiểm tra môn còn thiếu.\n- 🔍 **Hỏi điều kiện tiên quyết** của bất kỳ môn học nào (ví dụ: *"Tôi muốn học Lập trình Web thì cần pass môn gì trước?"*).\n- 🚀 **Gợi ý môn học kỳ tiếp theo** theo đúng chuyên ngành của bạn (Kỹ thuật phần mềm, Trí tuệ nhân tạo, Công nghệ dữ liệu).`,
      timestamp: 'Hệ thống'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    prism.highlightAll();
  }, [messages, loading]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedImage({
        name: file.name,
        mimeType: file.type,
        data: event.target.result
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSend = async (customText = null) => {
    const textToSend = (customText || input).trim();
    if (!textToSend && !attachedImage) return;

    const userMsg = {
      role: 'user',
      content: textToSend || 'Đây là ảnh bảng điểm của tôi. Nhờ AI phân tích các môn đã đạt, số tín chỉ tích lũy và gợi ý môn nên học kỳ tới.',
      image: attachedImage?.data || null,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    const currentImg = attachedImage;
    setAttachedImage(null);
    setLoading(true);

    try {
      const response = await api.chat({
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        mode: 'advisor',
        image: currentImg
      });

      const botReply = {
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([...newMessages, botReply]);
    } catch (err) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: `⚠️ Lỗi phân tích: ${err.message}. Vui lòng thử lại!`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (q) => {
    setInput(q);
    handleSend(q);
  };

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(196, 18, 48, 0.08) 0%, rgba(30, 41, 59, 0.04) 100%)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--vlu-red)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Route size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
              Cố vấn lộ trình học tập AI
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Đọc ảnh bảng điểm, đối chiếu Khung CTĐT K30 CNTT (126 tín chỉ) và kiểm tra điều kiện tiên quyết
            </p>
          </div>
        </div>

        <div className="badge badge-red" style={{ padding: '6px 14px', fontSize: '13px' }}>
          <Sparkles size={14} /> Khóa 30 - CNTT
        </div>
      </div>

      {/* Quick Prompts */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '16px' }}>
        <button
          onClick={() => handleQuickQuestion("Tôi muốn học Các nền tảng phát triển phần mềm, kiểm tra điều kiện học trước giúp tôi.")}
          className="btn-secondary"
          style={{ fontSize: '12px', padding: '6px 12px', whiteSpace: 'nowrap' }}
        >
          🔍 Môn: Các nền tảng phát triển phần mềm
        </button>
        <button
          onClick={() => handleQuickQuestion("Tôi muốn học Lập trình ứng dụng Web, cần điều kiện tiên quyết gì?")}
          className="btn-secondary"
          style={{ fontSize: '12px', padding: '6px 12px', whiteSpace: 'nowrap' }}
        >
          🔍 Môn: Lập trình ứng dụng Web
        </button>
        <button
          onClick={() => handleQuickQuestion("Gợi ý môn nên học kỳ tới cho chuyên ngành Kỹ thuật Phần mềm.")}
          className="btn-secondary"
          style={{ fontSize: '12px', padding: '6px 12px', whiteSpace: 'nowrap' }}
        >
          🚀 Gợi ý môn kỳ tới: Phần mềm
        </button>
      </div>

      {/* Messages area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        minHeight: '380px'
      }}>
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div 
              key={idx}
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: isUser ? 'flex-end' : 'flex-start'
              }}
            >
              {!isUser && (
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'var(--vlu-red-light)',
                  border: '1px solid rgba(196, 18, 48, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Route size={18} color="var(--vlu-red)" />
                </div>
              )}

              <div style={{
                maxWidth: '82%',
                background: isUser ? 'var(--vlu-red)' : 'var(--bg-card)',
                color: isUser ? 'white' : 'var(--text-main)',
                padding: '14px 18px',
                borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                border: isUser ? 'none' : '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {msg.image && (
                  <div style={{ marginBottom: '10px' }}>
                    <img src={msg.image} alt="Bảng điểm" style={{ maxHeight: '200px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                  </div>
                )}

                {isUser ? (
                  <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>{msg.content}</div>
                ) : (
                  <div 
                    className="markdown-body"
                    dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }}
                  />
                )}
                <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '6px', textAlign: isUser ? 'right' : 'left' }}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            <Route size={20} color="var(--vlu-red)" />
            <span>AI đang đối chiếu Khung CTĐT K30 và phân tích dữ liệu bảng điểm...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Upload & Input box */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '12px'
      }}>
        {attachedImage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--vlu-red-light)',
            border: '1px solid rgba(196, 18, 48, 0.2)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={attachedImage.data} alt="Thumbnail" style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--vlu-red)' }}>Đã đính kèm ảnh bảng điểm</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{attachedImage.name}</div>
              </div>
            </div>
            <button 
              onClick={() => setAttachedImage(null)}
              style={{ background: 'none', border: 'none', color: 'var(--vlu-red)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary"
            style={{ padding: '8px 12px', flexShrink: 0 }}
            title="Tải ảnh bảng điểm"
          >
            <UploadCloud size={18} color="var(--vlu-red)" />
            <span style={{ fontSize: '13px' }}>Tải ảnh bảng điểm</span>
          </button>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Hỏi môn muốn học hoặc gửi ảnh bảng điểm để cố vấn..."
            rows={1}
            style={{
              flex: 1,
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 12px',
              outline: 'none',
              background: 'var(--bg-primary)',
              color: 'var(--text-main)',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'none'
            }}
          />

          <button
            onClick={() => handleSend()}
            disabled={(!input.trim() && !attachedImage) || loading}
            className="btn-vlu-primary"
            style={{ flexShrink: 0, padding: '9px 16px' }}
          >
            <Send size={16} />
            <span>Gửi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
