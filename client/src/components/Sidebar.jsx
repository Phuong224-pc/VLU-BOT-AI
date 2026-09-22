import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  MessageSquarePlus, 
  Map, 
  Compass, 
  GraduationCap, 
  Calculator, 
  IdCard, 
  ShieldAlert, 
  HelpCircle, 
  Trash2, 
  ChevronDown, 
  UserCheck, 
  UserCircle, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Route,
  Pin,
  PinOff
} from 'lucide-react';
import { authService } from '../services/firebase';

export default function Sidebar({ 
  isCollapsed, 
  setIsCollapsed, 
  chatSessions, 
  activeChatId, 
  onSelectChat, 
  onNewChat, 
  onDeleteChat,
  onOpenAuth,
  onOpenHelp 
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [academicMenuOpen, setAcademicMenuOpen] = useState(true);
  const [pinnedChats, setPinnedChats] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vlu_pinned_chats') || '[]'); }
    catch { return []; }
  });

  const togglePin = (e, sessionId) => {
    e.stopPropagation();
    setPinnedChats(prev => {
      const next = prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId];
      localStorage.setItem('vlu_pinned_chats', JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    return authService.onAuthChange((user) => {
      setCurrentUser(user);
    });
  }, []);

  const handleLogout = () => {
    authService.logout();
    setShowUserMenu(false);
  };

  const navItems = [
    { path: '/advisor', label: 'Cố vấn lộ trình', icon: Route, title: 'AI Cố vấn bảng điểm K30' },
    { path: '/roadmap', label: 'Lộ trình cá nhân hóa', icon: Map, title: 'Khung đào tạo 126 tín chỉ' },
    { path: '/gpa', label: 'Kết quả học tập', icon: Calculator, title: 'Xem điểm, GPA & môn nợ' },
    { path: '/graduation', label: 'Dự báo tốt nghiệp', icon: GraduationCap, title: 'Tiến độ và điều kiện tốt nghiệp' },
    { path: '/career', label: 'Định hướng tương lai', icon: Compass, title: 'Gợi ý nghề nghiệp & stack' },
    { path: '/profile', label: 'Hồ sơ sinh viên', icon: IdCard, title: 'Thông tin cá nhân', requireAuth: true },
  ];

  return (
    <aside 
      style={{
        width: isCollapsed ? '72px' : '280px',
        backgroundColor: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 50,
        position: 'relative'
      }}
    >
      {/* Brand Header */}
      <div 
        style={{
          padding: '16px 14px',
          borderBottom: '1px solid var(--sidebar-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/')}
        title="Quay về Chatbot VLU"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <img 
            src="/img/logovanlang.png" 
            alt="VLU Logo" 
            style={{ width: '38px', height: '38px', objectFit: 'contain', flexShrink: 0 }} 
          />
          {!isCollapsed && (
            <div>
              <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--vlu-red)', letterSpacing: '-0.3px' }}>
                VLU ASSISTANT
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Trợ lý thông minh sinh viên
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Auth Bar */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--sidebar-border)', position: 'relative' }}>
        {currentUser ? (
          <div>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'space-between',
                padding: '8px 10px',
                background: 'var(--vlu-red-light)',
                border: '1px solid rgba(196, 18, 48, 0.2)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--vlu-red)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                <UserCheck size={18} />
                {!isCollapsed && (
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentUser.name || currentUser.email}
                  </span>
                )}
              </div>
              {!isCollapsed && <ChevronDown size={14} />}
            </button>

            {showUserMenu && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '12px',
                  right: '12px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '6px',
                  zIndex: 100,
                  marginTop: '4px'
                }}
              >
                <button
                  onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    background: 'none',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={(e) => e.target.style.background = 'none'}
                >
                  <IdCard size={15} /> Hồ sơ cá nhân
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    background: 'none',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ef4444',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={(e) => e.target.style.background = 'none'}
                >
                  <LogOut size={15} /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '8px',
              padding: '8px 12px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500
            }}
          >
            <UserCircle size={18} />
            {!isCollapsed && <span>Đăng nhập / Đăng ký</span>}
          </button>
        )}
      </div>

      {/* New Chat Button */}
      <div style={{ padding: '12px' }}>
        <button
          onClick={onNewChat}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'center',
            gap: '8px',
            padding: '10px',
            background: 'var(--vlu-red)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            transition: 'var(--transition)'
          }}
          title="Tạo phiên chat mới"
        >
          <MessageSquarePlus size={18} />
          {!isCollapsed && <span>Đoạn chat mới</span>}
        </button>
      </div>

      {/* Navigation Links Scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
        {/* Module Lộ trình & Chuyên đề */}
        <div style={{ marginBottom: '12px' }}>
          {!isCollapsed && (
            <div 
              onClick={() => setAcademicMenuOpen(!academicMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 8px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                letterSpacing: '0.5px',
                cursor: 'pointer'
              }}
            >
              <span>Lộ trình & Học vụ</span>
              <ChevronDown size={14} style={{ transform: academicMenuOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
            </div>
          )}

          {(academicMenuOpen || isCollapsed) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={item.title}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-sm)',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: active ? 600 : 500,
                      color: active ? 'var(--vlu-red)' : 'var(--text-main)',
                      background: active ? 'var(--vlu-red-light)' : 'transparent',
                      transition: 'var(--transition)',
                      justifyContent: isCollapsed ? 'center' : 'flex-start'
                    }}
                  >
                    <Icon size={18} color={active ? 'var(--vlu-red)' : 'var(--text-secondary)'} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>

        {/* Admin Link if admin */}
        {(currentUser?.role === 'admin' || !isCollapsed) && (
          <div style={{ marginBottom: '14px', paddingTop: '8px', borderTop: '1px solid var(--sidebar-border)' }}>
            <NavLink
              to="/admin"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                color: '#f59e0b',
                background: isActive ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                justifyContent: isCollapsed ? 'center' : 'flex-start'
              })}
              title="Quản lý hệ thống Admin"
            >
              <ShieldAlert size={18} />
              {!isCollapsed && <span>Quản trị hệ thống</span>}
            </NavLink>
          </div>
        )}

        {/* Chat History */}
        {!isCollapsed && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px', padding: '6px 8px' }}>
              Lịch sử trò chuyện
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {chatSessions && chatSessions.length > 0 ? (
                [...chatSessions]
                  .sort((a, b) => {
                    const aPin = pinnedChats.includes(a.id);
                    const bPin = pinnedChats.includes(b.id);
                    if (aPin && !bPin) return -1;
                    if (!aPin && bPin) return 1;
                    return 0;
                  })
                  .map((session) => {
                    const isPinned = pinnedChats.includes(session.id);
                    return (
                      <div
                        key={session.id}
                        onClick={() => onSelectChat(session.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          fontSize: '13px',
                          background: session.id === activeChatId ? 'var(--bg-tertiary)' : 'transparent',
                          color: session.id === activeChatId ? 'var(--vlu-red)' : 'var(--text-secondary)',
                          borderLeft: isPinned ? '2px solid var(--vlu-red)' : '2px solid transparent',
                          transition: 'all 0.15s'
                        }}
                      >
                        {isPinned && (
                          <Pin size={11} style={{ color: 'var(--vlu-red)', flexShrink: 0, marginRight: '4px' }} />
                        )}
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                          {session.title || 'Cuộc trò chuyện'}
                        </span>
                        <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                          <button
                            onClick={(e) => togglePin(e, session.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: isPinned ? 'var(--vlu-red)' : 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '4px',
                              borderRadius: '4px',
                              opacity: 0.7
                            }}
                            title={isPinned ? 'Bỏ ghim' : 'Ghim cuộc trò chuyện'}
                          >
                            {isPinned ? <PinOff size={12} /> : <Pin size={12} />}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onDeleteChat(session.id); }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '4px',
                              borderRadius: '4px'
                            }}
                            title="Xóa phiên chat này"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div style={{ padding: '8px', fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Chưa có lịch sử hội thoại
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer System Menu */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--sidebar-border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button
          onClick={onOpenHelp}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 10px',
            background: 'none',
            border: 'none',
            borderRadius: '6px',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            cursor: 'pointer',
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}
          title="Trợ giúp & Hướng dẫn"
        >
          <HelpCircle size={18} />
          {!isCollapsed && <span>Trợ giúp & Hướng dẫn</span>}
        </button>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 10px',
            background: 'none',
            border: 'none',
            borderRadius: '6px',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            cursor: 'pointer',
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}
          title={isCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!isCollapsed && <span>Thu gọn thanh bên</span>}
        </button>
      </div>
    </aside>
  );
}
