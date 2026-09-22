import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Save, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  Sliders, 
  RotateCcw,
  Bot
} from 'lucide-react';
import { api } from '../services/api';
import { authService } from '../services/firebase';

export default function AdminPage() {
  const [prompts, setPrompts] = useState({
    default: '',
    roadmap: '',
    results: '',
    graduation: '',
    future: '',
    advisor: ''
  });
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [systemHealth, setSystemHealth] = useState(null);

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    // Nạp prompts từ API
    api.getAdminPrompts()
      .then(res => {
        if (res.success) {
          setPrompts(res.data);
        }
      })
      .catch(err => console.error("Lỗi nạp prompts:", err))
      .finally(() => setLoading(false));

    // Nạp health
    api.checkHealth()
      .then(data => setSystemHealth(data))
      .catch(() => setSystemHealth({ status: 'offline' }));
  }, []);

  const handlePromptChange = (key, value) => {
    setPrompts(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    try {
      await api.updateAdminPrompts(prompts);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(`Lỗi lưu prompt: ${err.message}`);
    }
  };

  const promptLabels = [
    { key: 'default', title: '1. AI Trợ Lý Sinh Viên (Trang Chủ)', desc: 'Quy chuẩn trả lời trọng tâm, mạch lạc cho mọi câu hỏi chung.' },
    { key: 'advisor', title: '2. Cố Vấn Lộ Trình Học Tập (Advisor)', desc: 'Chuyên gia đọc bảng điểm, kiểm tra tiên quyết K30 CNTT.' },
    { key: 'roadmap', title: '3. Lộ Trình Cá Nhân Hóa (Roadmap)', desc: 'Tư vấn danh mục 126 tín chỉ K30 và phân bổ theo học kỳ.' },
    { key: 'results', title: '4. Phân Tích Kết Quả Học Tập (GPA)', desc: 'Quy đổi điểm hệ 4, hệ 10, cảnh báo điểm F/D và học vụ.' },
    { key: 'graduation', title: '5. Cố Vấn Tốt Nghiệp (Graduation)', desc: 'Kiểm tra 5 chuẩn: Tín chỉ, TOEIC/IELTS, MOS, GDQP, Thể chất.' },
    { key: 'future', title: '6. Định Hướng Nghề Nghiệp (Career)', desc: 'Gợi ý stack Frontend/Backend/AI và lộ trình thực chiến 90 ngày.' }
  ];

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
              Quản Trị Hệ Thống & Cấu Hình Prompt AI
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Quản lý và tinh chỉnh các tập lệnh tư duy (System Prompts) của 6 chuyên gia AI VLU
            </p>
          </div>
        </div>

        <div className="badge badge-orange" style={{ fontSize: '13px', padding: '6px 14px' }}>
          Admin: {currentUser?.name || 'Võ Ngọc Duy / Trương Trần Thanh Phương'}
        </div>
      </div>

      {/* Analytics KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="vlu-card">
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Số Chuyên Gia AI</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--vlu-red)' }}>6 Modules</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Chat, Advisor, Roadmap, GPA, Tốt nghiệp, Nghề nghiệp</div>
        </div>

        <div className="vlu-card">
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Mô Hình Cốt Lõi</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#3b82f6' }}>Llama 3.3 70B</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Groq Cloud Engine & Vision Preview</div>
        </div>

        <div className="vlu-card">
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Trạng Thái Backend</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: systemHealth?.status === 'ok' ? '#16a34a' : '#ef4444' }}>
            {systemHealth?.status === 'ok' ? 'Đang hoạt động' : 'Đang kết nối...'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Express API Gateway Port 5000</div>
        </div>
      </div>

      {/* Prompt Configuration Form */}
      <div className="vlu-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={20} color="var(--vlu-red)" />
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
              Cấu Hình System Prompts Chuyên Gia
            </h2>
          </div>

          {saveSuccess && (
            <div style={{ color: '#16a34a', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              <CheckCircle2 size={16} /> Đã cập nhật thành công!
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Đang nạp cấu hình prompts...</div>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {promptLabels.map(p => (
              <div key={p.key} style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>{p.title}</label>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{p.desc}</p>
                </div>
                <textarea
                  rows={4}
                  value={prompts[p.key] || ''}
                  onChange={(e) => handlePromptChange(p.key, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    lineHeight: 1.5,
                    resize: 'vertical'
                  }}
                />
              </div>
            ))}

            <button type="submit" className="btn-vlu-primary" style={{ padding: '12px 24px', justifyContent: 'center', alignSelf: 'flex-end' }}>
              <Save size={18} /> Lưu tất cả thay đổi
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
