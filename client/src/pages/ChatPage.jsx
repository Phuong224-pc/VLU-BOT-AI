import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Plus, 
  Image as ImageIcon, 
  Sparkles, 
  Brain, 
  Globe, 
  BookOpen, 
  FileEdit, 
  X, 
  ArrowDown, 
  Calculator, 
  BookMarked, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { marked } from 'marked';
import prism from 'prismjs';
import { api } from '../services/api';

export default function ChatPage({ activeChat, onUpdateChat }) {
  const [messages, setMessages] = useState(activeChat?.messages || []);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Đồng bộ với activeChat khi chuyển session
  useEffect(() => {
    setMessages(activeChat?.messages || []);
  }, [activeChat?.id]);

  useEffect(() => {
    scrollToBottom();
    prism.highlightAll();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 150);
  };

  // Web Speech API
  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói Web Speech API.");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => (prev ? prev + ' ' + transcript : transcript));
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

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
    setAttachMenuOpen(false);
  };

  const handleSend = async (customText = null) => {
    const textToSend = (customText || input).trim();
    if (!textToSend && !attachedImage) return;

    const userMsg = {
      role: 'user',
      content: textToSend,
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
        mode: 'default',
        image: currentImg
      });

      const assistantMsg = {
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);

      if (onUpdateChat) {
        onUpdateChat(finalMessages, userMsg.content);
      }
    } catch (err) {
      const errorMsg = {
        role: 'assistant',
        content: `⚠️ Lỗi kết nối AI: ${err.message}. Vui lòng thử lại sau!`,
        isError: true,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...newMessages, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Messages Scroll Area */}
      <div 
        ref={chatContainerRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div style={{ width: '100%', maxWidth: '840px' }}>
          {messages.length === 0 ? (
            /* Welcome screen */
            <div style={{ textAlign: 'center', marginTop: '40px', animation: 'fadeIn 0.4s ease-out' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '24px',
                background: 'var(--vlu-red-light)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <img src="/img/logovanlang.png" alt="VLU" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
                <span className="gradient-text">Xin chào, sinh viên VLU!</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '500px', margin: '0 auto 28px' }}>
                Mình là Trợ lý AI trường Đại học Văn Lang. Bạn cần giải đáp quy chế, tra cứu học phí hay kiểm tra lộ trình đào tạo hôm nay?
              </p>

              {/* Suggestion Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
                textAlign: 'left'
              }}>
                <div 
                  className="vlu-card"
                  onClick={() => handleSend("Lịch đóng học phí trường Văn Lang năm 2025-2026")}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}
                >
                  <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--vlu-red)' }}>
                    <Calculator size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Học phí & Quy chế</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Thời hạn đóng, miễn giảm</div>
                  </div>
                </div>

                <div 
                  className="vlu-card"
                  onClick={() => handleSend("Khung chương trình đào tạo Khoa CNTT K30 Văn Lang")}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}
                >
                  <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                    <BookMarked size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Chương trình đào tạo</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>126 tín chỉ K30 CNTT</div>
                  </div>
                </div>

                <div 
                  className="vlu-card"
                  onClick={() => handleSend("Cẩm nang sinh viên Đại học Văn Lang mới nhất")}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}
                >
                  <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Cẩm nang sinh viên</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Quy định thi, điểm rèn luyện</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Messages List */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      justifyContent: isUser ? 'flex-end' : 'flex-start',
                      animation: 'fadeIn 0.2s ease-out'
                    }}
                  >
                    {!isUser && (
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'var(--vlu-red-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: '1px solid rgba(196, 18, 48, 0.2)'
                      }}>
                        <img src="/img/logovanlang.png" alt="Bot" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                      </div>
                    )}

                    <div style={{
                      maxWidth: '78%',
                      background: isUser ? 'var(--vlu-red)' : 'var(--bg-secondary)',
                      color: isUser ? '#ffffff' : 'var(--text-main)',
                      padding: '14px 18px',
                      borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      border: isUser ? 'none' : '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-sm)',
                      position: 'relative'
                    }}>
                      {/* Hiển thị ảnh kèm nếu có */}
                      {msg.image && (
                        <div style={{ marginBottom: '10px', borderRadius: '8px', overflow: 'hidden' }}>
                          <img src={msg.image} alt="Upload" style={{ maxHeight: '240px', maxWidth: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                        </div>
                      )}

                      {/* Content */}
                      {isUser ? (
                        <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: 1.6 }}>{msg.content}</div>
                      ) : (
                        <div 
                          className="markdown-body"
                          dangerouslySetInnerHTML={{ __html: marked.parse(msg.content || '') }}
                        />
                      )}

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '6px',
                        fontSize: '11px',
                        opacity: 0.7
                      }}>
                        <span>{msg.timestamp}</span>
                        {!isUser && (
                          <button
                            onClick={() => copyToClipboard(msg.content)}
                            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '2px 4px' }}
                            title="Sao chép nội dung"
                          >
                            <Copy size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Loading Indicator */}
              {loading && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--vlu-red-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img src="/img/logovanlang.png" alt="Bot" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                  </div>
                  <div style={{
                    padding: '12px 18px',
                    borderRadius: '18px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    color: 'var(--text-muted)'
                  }}>
                    <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--vlu-red)', animation: 'pulseGlow 1.2s infinite' }}></span>
                    <span>VLU AI đang soạn thảo câu trả lời...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          style={{
            position: 'absolute',
            bottom: '100px',
            right: '30px',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-main)'
          }}
        >
          <ArrowDown size={18} />
        </button>
      )}

      {/* Input Area */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ width: '100%', maxWidth: '840px' }}>
          {/* Image Preview if attached */}
          {attachedImage && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-tertiary)',
              marginBottom: '10px',
              border: '1px solid var(--border-color)'
            }}>
              <img src={attachedImage.data} alt="Preview" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
              <span style={{ fontSize: '12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {attachedImage.name}
              </span>
              <button
                onClick={() => setAttachedImage(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={15} />
              </button>
            </div>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '10px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px',
            position: 'relative'
          }}>
            {/* Plus button & Menu */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setAttachMenuOpen(!attachMenuOpen)}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: 'none',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-main)',
                  transition: 'var(--transition)'
                }}
                title="Tính năng mở rộng & Đính kèm"
              >
                <Plus size={18} />
              </button>

              {attachMenuOpen && (
                <div style={{
                  position: 'absolute',
                  bottom: '120%',
                  left: 0,
                  width: '230px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '6px',
                  zIndex: 100
                }}>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <ImageIcon size={16} color="var(--vlu-red)" />
                    <span>Thêm ảnh và tệp</span>
                  </div>

                  <div
                    onClick={() => {
                      setInput(prev => prev + " [Yêu cầu nghiên cứu chuyên sâu]: ");
                      setAttachMenuOpen(false);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Brain size={16} color="#8b5cf6" />
                    <span>Nghiên cứu chuyên sâu</span>
                  </div>

                  <div
                    onClick={() => {
                      setInput(prev => prev + " [Phân tích logic]: ");
                      setAttachMenuOpen(false);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Sparkles size={16} color="#f59e0b" />
                    <span>Suy nghĩ từng bước</span>
                  </div>
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*,.pdf,.txt" 
              style={{ display: 'none' }} 
            />

            {/* Main Textarea */}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Hỏi VLU Chatbot bất cứ điều gì về trường Văn Lang... (Enter để gửi)"
              rows={1}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                resize: 'none',
                fontSize: '14px',
                color: 'var(--text-main)',
                maxHeight: '140px',
                padding: '6px 4px',
                fontFamily: 'inherit'
              }}
            />

            {/* Mic & Send */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                style={{
                  background: isRecording ? 'rgba(239, 68, 68, 0.15)' : 'none',
                  border: 'none',
                  color: isRecording ? '#ef4444' : 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={isRecording ? "Đang ghi âm (Bấm để dừng)" : "Nhập bằng giọng nói"}
              >
                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={(!input.trim() && !attachedImage) || loading}
                style={{
                  background: (input.trim() || attachedImage) && !loading ? 'var(--vlu-red)' : 'var(--border-color)',
                  color: 'white',
                  border: 'none',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: (input.trim() || attachedImage) && !loading ? 'pointer' : 'default',
                  transition: 'var(--transition)'
                }}
                title="Gửi tin nhắn (Enter)"
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
            VLU Chatbot có thể đưa ra thông tin chưa cập nhật. Hãy đối chiếu lịch đào tạo chính thức trên cổng thông tin sinh viên Văn Lang.
          </div>
        </div>
      </div>
    </div>
  );
}
