import React, { useState, useEffect, useRef } from 'react';
import {
  IdCard, User, Mail, Phone, MapPin, Calendar, Award, Camera,
  UploadCloud, CheckCircle2, FileText, Edit3, Save, X, Plus,
  Trash2, Download, BookOpen, Star, Shield, Loader2, Sparkles,
  GraduationCap, Briefcase, Image as ImageIcon, AlertCircle,
  ChevronRight, Globe, Users, Clock, BadgeCheck
} from 'lucide-react';
import { authService } from '../services/firebase';
import { api } from '../services/api';

const PROFILE_KEY = 'vlu_student_profile';
const ACTIVITIES_KEY = 'vlu_student_activities';
const CERTS_KEY = 'vlu_student_certs';
const DOCS_KEY = 'vlu_student_docs';

const DEFAULT_PROFILE = {
  fullName: "Trương Trần Thanh Phương",
  mssv: "2474802010458",
  cohort: "2024 - 2028",
  className: "K30 CNTT",
  faculty: "Khoa Công Nghệ Thông Tin",
  major: "Kỹ thuật Phần mềm",
  status: "Đang học (Chính quy)",
  email: "phuong.2474802010458@vanlanguni.vn",
  phone: "0901 234 567",
  dob: "02/01/2006",
  gender: "Nam",
  ethnicity: "Kinh",
  nationality: "Việt Nam",
  address: "Quận Bình Thạnh, TP. Hồ Chí Minh",
  idNumber: "",
  trainingCourse: "K30"
};

const DEFAULT_ACTIVITIES = [
  { id: 1, type: 'activity', name: 'CLB Kỹ thuật phần mềm VLU', role: 'Thành viên', year: '2024', icon: '💻' },
  { id: 2, type: 'skill', name: 'ReactJS / Next.js', level: 'Trung cấp', icon: '⚛️' },
  { id: 3, type: 'skill', name: 'Python / AI & ML', level: 'Cơ bản', icon: '🐍' },
];

const DEFAULT_CERTS = [
  { id: 1, name: 'TOEIC', score: '', issuer: 'IIG Vietnam', date: '', status: 'Chưa có' },
  { id: 2, name: 'MOS Word/Excel', score: '', issuer: 'Microsoft', date: '', status: 'Chưa có' },
  { id: 3, name: 'Giáo dục quốc phòng', score: '', issuer: 'VLU', date: '', status: 'Chưa hoàn thành' },
];

// ───────────────────────────────────────────────
// Tabs
// ───────────────────────────────────────────────
const TABS = [
  { key: 'info', label: 'Thông tin cá nhân', icon: User },
  { key: 'activities', label: 'Hoạt động & Kỹ năng', icon: Star },
  { key: 'certs', label: 'Chứng chỉ', icon: Award },
  { key: 'docs', label: 'Minh chứng', icon: FileText },
];

// ───────────────────────────────────────────────
// Editable Field Component
// ───────────────────────────────────────────────
function EditableField({ label, value, fieldKey, onSave, multiline = false, icon: Icon }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const commit = () => { onSave(fieldKey, draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
        {Icon && <Icon size={11} />} {label}
      </div>
      {editing ? (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
          {multiline ? (
            <textarea
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              rows={2}
              style={{
                flex: 1, padding: '6px 8px', borderRadius: '6px',
                border: '1.5px solid var(--vlu-red)', background: 'var(--bg-primary)',
                color: 'var(--text-main)', fontSize: '13px', fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          ) : (
            <input
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel(); }}
              style={{
                flex: 1, padding: '6px 8px', borderRadius: '6px',
                border: '1.5px solid var(--vlu-red)', background: 'var(--bg-primary)',
                color: 'var(--text-main)', fontSize: '13px'
              }}
            />
          )}
          <button onClick={commit} style={{ padding: '6px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            <Save size={14} />
          </button>
          <button onClick={cancel} style={{ padding: '6px', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer' }}>
            <X size={14} />
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', minHeight: '28px' }}>
          <strong style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.4 }}>{value || <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Chưa có thông tin</span>}</strong>
          <button
            onClick={() => setEditing(true)}
            title="Chỉnh sửa"
            style={{
              flexShrink: 0, padding: '4px', background: 'transparent',
              border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
              borderRadius: '4px', transition: 'color 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--vlu-red)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <Edit3 size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────
// OCR Banner
// ───────────────────────────────────────────────
function OcrBanner({ fields, onApply, onDismiss }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
      border: '1.5px solid #10b981', borderRadius: '12px', padding: '16px 20px',
      marginBottom: '20px', animation: 'slideIn 0.3s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <Sparkles size={18} color="#059669" />
        <strong style={{ color: '#059669', fontSize: '14px' }}>AI đã trích xuất được thông tin từ ảnh!</strong>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', marginBottom: '14px' }}>
        {Object.entries(fields).map(([k, v]) => (
          <div key={k} style={{ fontSize: '12px', background: 'white', padding: '6px 10px', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
            <span style={{ color: '#6b7280' }}>{FIELD_LABELS[k] || k}: </span>
            <strong style={{ color: '#065f46' }}>{v}</strong>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={onApply} style={{
          padding: '8px 16px', background: '#059669', color: 'white',
          border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
          fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          <CheckCircle2 size={15} /> Áp dụng vào hồ sơ
        </button>
        <button onClick={onDismiss} style={{
          padding: '8px 16px', background: 'transparent', color: '#6b7280',
          border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '13px'
        }}>
          Bỏ qua
        </button>
      </div>
    </div>
  );
}

const FIELD_LABELS = {
  fullName: 'Họ tên', mssv: 'MSSV', dob: 'Ngày sinh', gender: 'Giới tính',
  email: 'Email', phone: 'Điện thoại', ethnicity: 'Dân tộc', nationality: 'Quốc tịch',
  address: 'Địa chỉ', faculty: 'Khoa', major: 'Ngành', className: 'Lớp',
  cohort: 'Niên khóa', idNumber: 'Số CCCD', trainingCourse: 'Khóa đào tạo'
};

// ───────────────────────────────────────────────
// MAIN COMPONENT
// ───────────────────────────────────────────────
export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem('vlu_avatar') || null);
  const [activeTab, setActiveTab] = useState('info');

  // Profile state
  const [profile, setProfile] = useState(() => {
    try { return { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}') }; }
    catch { return DEFAULT_PROFILE; }
  });

  // Activities & skills
  const [activities, setActivities] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ACTIVITIES_KEY)) || DEFAULT_ACTIVITIES; }
    catch { return DEFAULT_ACTIVITIES; }
  });

  // Certificates
  const [certs, setCerts] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CERTS_KEY)) || DEFAULT_CERTS; }
    catch { return DEFAULT_CERTS; }
  });

  // Documents
  const [docs, setDocs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DOCS_KEY)) || []; }
    catch { return []; }
  });

  // OCR states
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [ocrError, setOcrError] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);

  // New item forms
  const [newActivity, setNewActivity] = useState({ type: 'skill', name: '', level: '', role: '', year: '', icon: '⭐' });
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newCert, setNewCert] = useState({ name: '', score: '', issuer: '', date: '', status: '' });
  const [showAddCert, setShowAddCert] = useState(false);
  const [editingCertId, setEditingCertId] = useState(null);

  useEffect(() => {
    return authService.onAuthChange((user) => {
      setCurrentUser(user);
      if (user?.name) setProfile(prev => ({ ...prev, fullName: user.name, email: user.email }));
    });
  }, []);

  // Persist to localStorage
  useEffect(() => { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities)); }, [activities]);
  useEffect(() => { localStorage.setItem(CERTS_KEY, JSON.stringify(certs)); }, [certs]);
  useEffect(() => { localStorage.setItem(DOCS_KEY, JSON.stringify(docs)); }, [docs]);

  const showSaved = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  // ─── Avatar change ───
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarUrl(ev.target.result);
      localStorage.setItem('vlu_avatar', ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  // ─── Profile field save ───
  const handleFieldSave = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
    showSaved();
  };

  // ─── OCR upload ───
  const handleOcrUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOcrLoading(true);
    setOcrError(null);
    setOcrResult(null);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const result = await api.extractProfileFromImage(ev.target.result, file.type);
          if (result.success && Object.keys(result.data).length > 0) {
            setOcrResult(result.data);
          } else {
            setOcrError('AI không trích xuất được thông tin. Vui lòng thử ảnh khác rõ hơn.');
          }
        } catch (err) {
          setOcrError(err.message);
        } finally {
          setOcrLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setOcrError(err.message);
      setOcrLoading(false);
    }
    e.target.value = '';
  };

  const applyOcrResult = () => {
    setProfile(prev => ({ ...prev, ...ocrResult }));
    setOcrResult(null);
    showSaved();
  };

  // ─── Activities ───
  const addActivity = () => {
    if (!newActivity.name.trim()) return;
    setActivities(prev => [...prev, { ...newActivity, id: Date.now() }]);
    setNewActivity({ type: 'skill', name: '', level: '', role: '', year: '', icon: '⭐' });
    setShowAddActivity(false);
  };
  const removeActivity = (id) => setActivities(prev => prev.filter(a => a.id !== id));

  // ─── Certs ───
  const addCert = () => {
    if (!newCert.name.trim()) return;
    setCerts(prev => [...prev, { ...newCert, id: Date.now() }]);
    setNewCert({ name: '', score: '', issuer: '', date: '', status: '' });
    setShowAddCert(false);
  };
  const removeCert = (id) => setCerts(prev => prev.filter(c => c.id !== id));
  const updateCert = (id, key, val) => setCerts(prev => prev.map(c => c.id === id ? { ...c, [key]: val } : c));

  // ─── Documents ───
  const handleDocUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newDocs = files.map(f => ({
      id: Date.now() + Math.random(),
      name: f.name,
      size: f.size,
      type: f.type,
      uploadedAt: new Date().toLocaleDateString('vi-VN'),
      dataUrl: null
    }));
    // Store file names only (not data URL to save localStorage space)
    setDocs(prev => [...prev, ...newDocs]);
    e.target.value = '';
  };
  const removeDoc = (id) => setDocs(prev => prev.filter(d => d.id !== id));

  // ─── Print/PDF export ───
  const handlePrint = () => window.print();

  const cardStyle = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '20px'
  };

  const btnSecondary = {
    padding: '7px 14px', background: 'var(--bg-tertiary)', color: 'var(--text-main)',
    border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer',
    fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px',
    transition: 'all 0.15s'
  };

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

      {/* ── Header ── */}
      <div style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
        borderRadius: '14px', padding: '20px 24px', marginBottom: '20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'var(--vlu-red)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <IdCard size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>Hồ Sơ Sinh Viên</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Quản lý thông tin học vụ, lý lịch, hoạt động & tài liệu cá nhân</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {savedFlash && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#16a34a', fontSize: '13px', fontWeight: 600 }}>
              <CheckCircle2 size={15} /> Đã lưu!
            </div>
          )}
          <button onClick={handlePrint} style={btnSecondary}>
            <Download size={14} /> Xuất PDF
          </button>
          <div className="badge badge-green" style={{ fontSize: '13px', padding: '6px 14px' }}>
            <CheckCircle2 size={15} /> {profile.status}
          </div>
        </div>
      </div>

      {/* ── OCR Banner ── */}
      {ocrResult && (
        <OcrBanner fields={ocrResult} onApply={applyOcrResult} onDismiss={() => setOcrResult(null)} />
      )}
      {ocrError && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px',
          padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', fontSize: '13px'
        }}>
          <AlertCircle size={16} /> {ocrError}
          <button onClick={() => setOcrError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}><X size={14} /></button>
        </div>
      )}

      {/* ── Top: Avatar Card + Quick Info ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Avatar Card */}
        <div style={{ ...cardStyle, textAlign: 'center', padding: '28px 16px' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '14px' }}>
            <div style={{
              width: '110px', height: '110px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto',
              border: '3px solid var(--vlu-red)', background: 'var(--bg-tertiary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {avatarUrl
                ? <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <User size={52} color="var(--text-muted)" />}
            </div>
            <label style={{
              position: 'absolute', bottom: '4px', right: '4px', width: '30px', height: '30px',
              borderRadius: '50%', background: 'var(--vlu-red)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }} title="Đổi ảnh đại diện">
              <Camera size={14} />
              <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
            </label>
          </div>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px' }}>{profile.fullName}</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            MSSV: <strong style={{ color: 'var(--text-main)' }}>{profile.mssv}</strong>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
            {[
              { label: 'Khoa', val: profile.faculty },
              { label: 'Ngành', val: profile.major },
              { label: 'Lớp', val: profile.className },
            ].map(r => (
              <div key={r.label} style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{r.label}:</span>
                <strong style={{ textAlign: 'right', color: 'var(--text-main)' }}>{r.val}</strong>
              </div>
            ))}
          </div>

          {/* OCR upload button */}
          <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
            <label style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              padding: '10px', border: '1.5px dashed var(--border-color)', borderRadius: '8px',
              cursor: ocrLoading ? 'not-allowed' : 'pointer', transition: 'border-color 0.15s',
              background: 'var(--bg-primary)'
            }}
              onMouseEnter={e => !ocrLoading && (e.currentTarget.style.borderColor = 'var(--vlu-red)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}
            >
              {ocrLoading
                ? <><Loader2 size={20} color="var(--vlu-red)" style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>AI đang đọc ảnh...</span></>
                : <><Sparkles size={20} color="var(--vlu-red)" />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
                    Upload CCCD/Thẻ SV<br /><span style={{ color: 'var(--vlu-red)', fontWeight: 600 }}>AI tự cập nhật hồ sơ</span>
                  </span></>
              }
              <input type="file" accept="image/*" onChange={handleOcrUpload} style={{ display: 'none' }} disabled={ocrLoading} />
            </label>
          </div>
        </div>

        {/* Right: Tab Content */}
        <div>
          {/* Tab Nav */}
          <div style={{
            display: 'flex', gap: '4px', marginBottom: '16px',
            background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
            borderRadius: '10px', padding: '4px'
          }}>
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                  flex: 1, padding: '8px 4px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                  background: active ? 'var(--vlu-red)' : 'transparent',
                  color: active ? 'white' : 'var(--text-muted)',
                  fontSize: '11px', fontWeight: active ? 700 : 500, transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                }}>
                  <Icon size={13} />
                  <span style={{ display: window.innerWidth < 600 ? 'none' : 'inline' }}>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ──── TAB: Thông tin cá nhân ──── */}
          {activeTab === 'info' && (
            <div style={cardStyle}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} color="var(--vlu-red)" /> Thông tin chi tiết
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <EditableField label="Họ và tên" value={profile.fullName} fieldKey="fullName" onSave={handleFieldSave} />
                <EditableField label="MSSV" value={profile.mssv} fieldKey="mssv" onSave={handleFieldSave} />
                <EditableField label="Ngày sinh" value={profile.dob} fieldKey="dob" onSave={handleFieldSave} icon={Calendar} />
                <EditableField label="Giới tính" value={profile.gender} fieldKey="gender" onSave={handleFieldSave} />
                <EditableField label="Niên khóa" value={profile.cohort} fieldKey="cohort" onSave={handleFieldSave} />
                <EditableField label="Khóa đào tạo" value={profile.trainingCourse} fieldKey="trainingCourse" onSave={handleFieldSave} />
                <EditableField label="Email sinh viên" value={profile.email} fieldKey="email" onSave={handleFieldSave} icon={Mail} />
                <EditableField label="Số điện thoại" value={profile.phone} fieldKey="phone" onSave={handleFieldSave} icon={Phone} />
                <EditableField label="Dân tộc" value={profile.ethnicity} fieldKey="ethnicity" onSave={handleFieldSave} icon={Users} />
                <EditableField label="Quốc tịch" value={profile.nationality} fieldKey="nationality" onSave={handleFieldSave} icon={Globe} />
                <EditableField label="Số CCCD" value={profile.idNumber} fieldKey="idNumber" onSave={handleFieldSave} icon={Shield} />
                <EditableField label="Khoa" value={profile.faculty} fieldKey="faculty" onSave={handleFieldSave} icon={BookOpen} />
                <EditableField label="Ngành" value={profile.major} fieldKey="major" onSave={handleFieldSave} />
                <EditableField label="Lớp học phần" value={profile.className} fieldKey="className" onSave={handleFieldSave} />
                <div style={{ gridColumn: 'span 2' }}>
                  <EditableField label="Địa chỉ liên hệ" value={profile.address} fieldKey="address" onSave={handleFieldSave} icon={MapPin} multiline />
                </div>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Edit3 size={11} /> Click vào biểu tượng bút chì để chỉnh sửa từng trường thông tin
              </p>
            </div>
          )}

          {/* ──── TAB: Hoạt động & Kỹ năng ──── */}
          {activeTab === 'activities' && (
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star size={15} color="var(--vlu-red)" /> Hoạt động & Kỹ năng
                </h3>
                <button onClick={() => setShowAddActivity(!showAddActivity)} style={{
                  padding: '6px 12px', background: 'var(--vlu-red)', color: 'white',
                  border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <Plus size={13} /> Thêm mới
                </button>
              </div>

              {showAddActivity && (
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Loại</label>
                      <select value={newActivity.type} onChange={e => setNewActivity(p => ({ ...p, type: e.target.value }))} style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '12px' }}>
                        <option value="skill">Kỹ năng</option>
                        <option value="activity">Hoạt động ngoại khóa</option>
                        <option value="award">Giải thưởng</option>
                        <option value="project">Dự án</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Icon (emoji)</label>
                      <input value={newActivity.icon} onChange={e => setNewActivity(p => ({ ...p, icon: e.target.value }))} style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '13px' }} />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tên *</label>
                      <input value={newActivity.name} onChange={e => setNewActivity(p => ({ ...p, name: e.target.value }))} placeholder="Ví dụ: ReactJS, CLB Robotics..." style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '12px' }} />
                    </div>
                    {newActivity.type === 'skill' && (
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Trình độ</label>
                        <select value={newActivity.level} onChange={e => setNewActivity(p => ({ ...p, level: e.target.value }))} style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '12px' }}>
                          <option value="">Chọn trình độ</option>
                          <option value="Cơ bản">Cơ bản</option>
                          <option value="Trung cấp">Trung cấp</option>
                          <option value="Nâng cao">Nâng cao</option>
                          <option value="Chuyên gia">Chuyên gia</option>
                        </select>
                      </div>
                    )}
                    {newActivity.type !== 'skill' && (
                      <>
                        <div>
                          <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Vai trò</label>
                          <input value={newActivity.role} onChange={e => setNewActivity(p => ({ ...p, role: e.target.value }))} placeholder="Thành viên, Trưởng nhóm..." style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '12px' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Năm</label>
                          <input value={newActivity.year} onChange={e => setNewActivity(p => ({ ...p, year: e.target.value }))} placeholder="2024" style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '12px' }} />
                        </div>
                      </>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={addActivity} style={{ padding: '7px 14px', background: 'var(--vlu-red)', color: 'white', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Thêm</button>
                    <button onClick={() => setShowAddActivity(false)} style={{ padding: '7px 14px', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: '7px', cursor: 'pointer', fontSize: '12px' }}>Hủy</button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activities.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px' }}>
                    Chưa có hoạt động nào. Nhấn <strong>Thêm mới</strong> để bắt đầu.
                  </div>
                )}
                {activities.map(a => (
                  <div key={a.id} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 14px', background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)', borderRadius: '10px',
                    transition: 'border-color 0.15s'
                  }}>
                    <span style={{ fontSize: '20px' }}>{a.icon || '⭐'}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{a.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {a.type === 'skill' ? `Kỹ năng • ${a.level || 'Cơ bản'}` : `${a.type === 'activity' ? 'Hoạt động' : a.type === 'award' ? 'Giải thưởng' : 'Dự án'} • ${a.role || ''} ${a.year ? `(${a.year})` : ''}`}
                      </div>
                    </div>
                    <span style={{
                      padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 600,
                      background: a.type === 'skill' ? '#dbeafe' : a.type === 'award' ? '#fef9c3' : '#f0fdf4',
                      color: a.type === 'skill' ? '#1d4ed8' : a.type === 'award' ? '#854d0e' : '#15803d'
                    }}>
                      {a.type === 'skill' ? 'Kỹ năng' : a.type === 'award' ? 'Giải thưởng' : a.type === 'project' ? 'Dự án' : 'Hoạt động'}
                    </span>
                    <button onClick={() => removeActivity(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──── TAB: Chứng chỉ ──── */}
          {activeTab === 'certs' && (
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={15} color="var(--vlu-red)" /> Chứng chỉ & Bằng cấp
                </h3>
                <button onClick={() => setShowAddCert(!showAddCert)} style={{
                  padding: '6px 12px', background: 'var(--vlu-red)', color: 'white',
                  border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <Plus size={13} /> Thêm chứng chỉ
                </button>
              </div>

              {showAddCert && (
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                    {[
                      { key: 'name', label: 'Tên chứng chỉ *', placeholder: 'TOEIC, MOS, AWS...' },
                      { key: 'score', label: 'Điểm/Kết quả', placeholder: '750, Pass...' },
                      { key: 'issuer', label: 'Nơi cấp', placeholder: 'IIG, Microsoft...' },
                      { key: 'date', label: 'Ngày cấp', placeholder: 'MM/YYYY' },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{f.label}</label>
                        <input value={newCert[f.key]} onChange={e => setNewCert(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                          style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '12px' }} />
                      </div>
                    ))}
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Trạng thái</label>
                      <select value={newCert.status} onChange={e => setNewCert(p => ({ ...p, status: e.target.value }))} style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '12px' }}>
                        <option value="">Chọn trạng thái</option>
                        <option value="Đã đạt">Đã đạt ✅</option>
                        <option value="Đang học">Đang học 📚</option>
                        <option value="Chưa có">Chưa có ⏳</option>
                        <option value="Đã nộp">Đã nộp 📋</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={addCert} style={{ padding: '7px 14px', background: 'var(--vlu-red)', color: 'white', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Thêm</button>
                    <button onClick={() => setShowAddCert(false)} style={{ padding: '7px 14px', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: '7px', cursor: 'pointer', fontSize: '12px' }}>Hủy</button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {certs.map(cert => {
                  const isEdit = editingCertId === cert.id;
                  const statusColor = cert.status === 'Đã đạt' ? { bg: '#f0fdf4', text: '#15803d', border: '#86efac' }
                    : cert.status === 'Đang học' ? { bg: '#eff6ff', text: '#1d4ed8', border: '#93c5fd' }
                    : { bg: '#fafafa', text: '#6b7280', border: '#e5e7eb' };
                  return (
                    <div key={cert.id} style={{ padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--vlu-red), #ff6b6b)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <BadgeCheck size={18} color="white" />
                        </div>
                        <div style={{ flex: 1 }}>
                          {isEdit ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                              {[
                                { key: 'name', label: 'Tên' }, { key: 'score', label: 'Điểm' },
                                { key: 'issuer', label: 'Nơi cấp' }, { key: 'date', label: 'Ngày cấp' }
                              ].map(f => (
                                <div key={f.key}>
                                  <label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{f.label}</label>
                                  <input value={cert[f.key] || ''} onChange={e => updateCert(cert.id, f.key, e.target.value)}
                                    style={{ width: '100%', padding: '4px 6px', borderRadius: '5px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '12px' }} />
                                </div>
                              ))}
                              <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Trạng thái</label>
                                <select value={cert.status || ''} onChange={e => updateCert(cert.id, 'status', e.target.value)} style={{ width: '100%', padding: '4px 6px', borderRadius: '5px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '12px' }}>
                                  <option value="Đã đạt">Đã đạt ✅</option>
                                  <option value="Đang học">Đang học 📚</option>
                                  <option value="Chưa có">Chưa có ⏳</option>
                                  <option value="Đã nộp">Đã nộp 📋</option>
                                </select>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-main)' }}>{cert.name}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                {cert.issuer && <span>{cert.issuer}</span>}
                                {cert.score && <span> • <strong style={{ color: 'var(--text-main)' }}>{cert.score}</strong></span>}
                                {cert.date && <span> • {cert.date}</span>}
                              </div>
                            </>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                          <span style={{ padding: '3px 9px', borderRadius: '20px', fontSize: '10px', fontWeight: 600, background: statusColor.bg, color: statusColor.text, border: `1px solid ${statusColor.border}` }}>
                            {cert.status || 'Chưa xác định'}
                          </span>
                          <button onClick={() => setEditingCertId(isEdit ? null : cert.id)} style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                            {isEdit ? <CheckCircle2 size={14} color="#16a34a" /> : <Edit3 size={13} />}
                          </button>
                          <button onClick={() => removeCert(cert.id)} style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ──── TAB: Minh chứng / Tài liệu ──── */}
          {activeTab === 'docs' && (
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={15} color="var(--vlu-red)" /> Tài liệu & Minh chứng
                </h3>
                <label style={{
                  padding: '6px 12px', background: 'var(--vlu-red)', color: 'white',
                  border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <Plus size={13} /> Tải lên
                  <input type="file" multiple accept=".pdf,.docx,.jpg,.jpeg,.png,.doc" onChange={handleDocUpload} style={{ display: 'none' }} />
                </label>
              </div>

              {/* Upload drop zone */}
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                padding: '24px', border: '2px dashed var(--border-color)', borderRadius: '10px',
                cursor: 'pointer', marginBottom: '16px', transition: 'border-color 0.2s',
                background: 'var(--bg-primary)'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--vlu-red)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
              >
                <UploadCloud size={28} color="var(--vlu-red)" />
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>Kéo thả hoặc nhấp để tải ảnh / PDF hồ sơ</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Hỗ trợ PDF, DOCX, JPG, PNG • Tối đa 20MB/file</div>
                <input type="file" multiple accept=".pdf,.docx,.jpg,.jpeg,.png,.doc" onChange={handleDocUpload} style={{ display: 'none' }} />
              </label>

              {docs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  Chưa có tài liệu nào được tải lên.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {docs.map(doc => {
                    const isImage = doc.type?.startsWith('image/');
                    const isPdf = doc.type === 'application/pdf';
                    const sizeKb = (doc.size / 1024).toFixed(0);
                    return (
                      <div key={doc.id} style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '10px 14px', background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)', borderRadius: '10px'
                      }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: isPdf ? '#fee2e2' : isImage ? '#dbeafe' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {isImage ? <ImageIcon size={18} color="#3b82f6" /> : <FileText size={18} color={isPdf ? '#ef4444' : '#6b7280'} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sizeKb} KB • Tải lên {doc.uploadedAt}</div>
                        </div>
                        <button onClick={() => removeDoc(doc.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── CSS for print ── */}
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media print {
          .app-shell > *:not(.main-view) { display: none !important; }
          .main-view > *:first-child { display: none !important; }
          button, label[for] { display: none !important; }
        }
      `}</style>
    </div>
  );
}
