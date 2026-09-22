import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { authService } from '../services/firebase';

export default function AuthModal({ isOpen, onClose }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLoginTab) {
      if (!email || !password) {
        setError('Vui lòng điền đầy đủ email và mật khẩu.');
        return;
      }
      authService.login(email, password);
      onClose();
    } else {
      if (!fullName || !email || !password) {
        setError('Vui lòng điền đầy đủ các thông tin.');
        return;
      }
      if (password !== confirmPass) {
        setError('Mật khẩu xác nhận không khớp.');
        return;
      }
      authService.register(fullName, email, password);
      onClose();
    }
  };

  const handleMicrosoftLogin = () => {
    authService.loginMicrosoft();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
          <button
            onClick={() => { setIsLoginTab(true); setError(''); }}
            style={{
              flex: 1,
              padding: '12px',
              background: 'none',
              border: 'none',
              borderBottom: isLoginTab ? '2px solid var(--vlu-red)' : 'none',
              color: isLoginTab ? 'var(--vlu-red)' : 'var(--text-muted)',
              fontWeight: isLoginTab ? 700 : 500,
              cursor: 'pointer',
              fontSize: '15px'
            }}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => { setIsLoginTab(false); setError(''); }}
            style={{
              flex: 1,
              padding: '12px',
              background: 'none',
              border: 'none',
              borderBottom: !isLoginTab ? '2px solid var(--vlu-red)' : 'none',
              color: !isLoginTab ? 'var(--vlu-red)' : 'var(--text-muted)',
              fontWeight: !isLoginTab ? 700 : 500,
              cursor: 'pointer',
              fontSize: '15px'
            }}
          >
            Đăng ký tài khoản
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#ef4444',
            fontSize: '13px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {!isLoginTab && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Họ và tên</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input 
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-main)',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              {isLoginTab ? "Email hoặc MSSV" : "Email sinh viên Văn Lang"}
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                placeholder="ten.mssv@vanlanguni.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-main)',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-main)',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {!isLoginTab && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Xác nhận mật khẩu</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input 
                  type="password"
                  placeholder="••••••••"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-main)',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn-vlu-primary" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
          >
            {isLoginTab ? "Đăng nhập ngay" : "Tạo tài khoản mới"}
          </button>
        </form>

        <div style={{ textAlign: 'center', margin: '16px 0', color: 'var(--text-muted)', fontSize: '12px', position: 'relative' }}>
          <span>hoặc</span>
        </div>

        <button
          type="button"
          onClick={handleMicrosoftLogin}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '10px',
            background: '#2f2f2f',
            color: '#ffffff',
            border: '1px solid #444',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500
          }}
        >
          <i className="fab fa-windows" style={{ color: '#00a4ef' }}></i>
          <span>Đăng nhập bằng Mail Trường (Microsoft)</span>
        </button>
      </div>
    </div>
  );
}
