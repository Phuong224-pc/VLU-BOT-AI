import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  Award, 
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { api } from '../services/api';

export default function GraduationPage() {
  const [mssvInput, setMssvInput] = useState('2474802010458');
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async (code = mssvInput) => {
    if (!code) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.getStudentByMssv(code.trim());
      if (res.success) {
        setStudent(res.data);
      }
    } catch (err) {
      setError(err.message || "Không tìm thấy dữ liệu sinh viên");
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLookup('2474802010458');
  }, []);

  const totalCredits = 126;
  const currentCredits = student?.officialCumulativeCredits || 0;
  const progressPercent = Math.min(100, Math.round((currentCredits / totalCredits) * 100));

  // Kiểm tra các môn GDQP (NAD)
  const hasGdqp = student?.courses?.some(c => c.code.startsWith('71NAD') && c.status === 'Đạt');
  // Kiểm tra GDTC (PE)
  const hasGdtc = student?.courses?.some(c => c.code.startsWith('71PE') && c.status === 'Đạt');
  // Chuẩn AV (AV4/AV5)
  const hasAvPass = student?.courses?.some(c => (c.code.includes('ENG4') || c.code.includes('ENG5')) && (c.status === 'Đạt' || c.status === 'Đạt thấp'));

  const conditions = [
    {
      id: 1,
      title: "Tích lũy tối thiểu 126 Tín chỉ Khung K30",
      status: currentCredits >= 126 ? "passed" : "in_progress",
      desc: `Hiện đã tích lũy ${currentCredits}/126 tín chỉ (${progressPercent}%)`,
      icon: Award
    },
    {
      id: 2,
      title: "Chứng chỉ Chuẩn đầu ra Ngoại ngữ (TOEIC 500+ / IELTS 5.0+)",
      status: hasAvPass ? "passed" : "pending",
      desc: hasAvPass ? "Đã hoàn thành các học phần Anh văn chuyên ngữ cơ sở" : "Cần nộp chứng chỉ trước đợt xét tốt nghiệp",
      icon: FileCheck
    },
    {
      id: 3,
      title: "Chứng chỉ Tin học Quốc tế MOS (Word, Excel, PowerPoint)",
      status: "in_progress",
      desc: "Khoa CNTT xét miễn một số phần hoặc nộp chứng chỉ chuẩn",
      icon: ShieldCheck
    },
    {
      id: 4,
      title: "Chứng chỉ Giáo dục Quốc phòng & An ninh (GDQP 1-4)",
      status: hasGdqp ? "passed" : "pending",
      desc: hasGdqp ? "Đã hoàn tất 4 học phần GDQP tại Trung tâm" : "Chưa hoàn thành đủ 4 học phần GDQP",
      icon: CheckCircle2
    },
    {
      id: 5,
      title: "Hoàn thành các học phần Giáo dục Thể chất",
      status: hasGdtc ? "passed" : "pending",
      desc: hasGdtc ? "Đã đạt các môn thể chất theo quy định" : "Cần tích lũy đủ các môn thể chất",
      icon: Activity
    }
  ];

  return (
    <div className="page-container" style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
              Dự Báo & Xét Tiến Độ Tốt Nghiệp
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Đánh giá 5 điều kiện tốt nghiệp cốt lõi và dự báo thời gian ra trường Đại học Văn Lang
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['2474802010458', '2474802010414', '2474802010071'].map(code => (
              <button
                key={code}
                onClick={() => {
                  setMssvInput(code);
                  handleLookup(code);
                }}
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '4px 10px' }}
              >
                MSSV: {code.slice(-5)}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div style={{ display: 'flex', gap: '10px', maxWidth: '540px' }}>
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 14px'
          }}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text"
              placeholder="Nhập MSSV để kiểm tra tiến độ tốt nghiệp..."
              value={mssvInput}
              onChange={(e) => setMssvInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '14px',
                color: 'var(--text-main)'
              }}
            />
          </div>

          <button onClick={() => handleLookup()} className="btn-vlu-primary">
            <Search size={16} /> Kiểm tra
          </button>
        </div>
      </div>

      {student && (
        <>
          {/* Summary Forecast Banner */}
          <div className="vlu-card" style={{
            background: 'linear-gradient(135deg, rgba(196, 18, 48, 0.06) 0%, rgba(30, 41, 59, 0.04) 100%)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <span className="badge badge-red" style={{ marginBottom: '8px' }}>
                  Dự báo thời gian ra trường
                </span>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                  Dự kiến Tốt nghiệp: <span style={{ color: 'var(--vlu-red)' }}>Đợt 1 / Năm 2028</span>
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Sinh viên: <strong>{student.name}</strong> • Niên khóa 2024 - 2028 ({student.major})
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tiến độ tích lũy tín chỉ</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#16a34a' }}>
                  {currentCredits} / {totalCredits} TC
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Còn thiếu: <strong>{totalCredits - currentCredits} tín chỉ</strong>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{
              width: '100%',
              height: '10px',
              borderRadius: '9999px',
              background: 'var(--border-color)',
              overflow: 'hidden',
              marginTop: '20px'
            }}>
              <div style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--vlu-red) 0%, #16a34a 100%)',
                borderRadius: '9999px'
              }} />
            </div>
          </div>

          {/* Conditions Checklist */}
          <div className="vlu-card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '18px' }}>
              Bảng Đánh Giá Các Điều Kiện Tốt Nghiệp Chuẩn VLU
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {conditions.map((item) => {
                const Icon = item.icon;
                const isPassed = item.status === 'passed';
                const isInProgress = item.status === 'in_progress';
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: isPassed ? 'rgba(34, 197, 94, 0.15)' : isInProgress ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isPassed ? '#16a34a' : isInProgress ? '#3b82f6' : '#ef4444'
                      }}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>
                          {item.title}
                        </h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <div>
                      {isPassed ? (
                        <span className="badge badge-green" style={{ fontSize: '12px' }}>
                          <CheckCircle2 size={14} /> Đạt tiêu chuẩn
                        </span>
                      ) : isInProgress ? (
                        <span className="badge badge-blue" style={{ fontSize: '12px' }}>
                          <Clock size={14} /> Đang hoàn thiện
                        </span>
                      ) : (
                        <span className="badge badge-orange" style={{ fontSize: '12px' }}>
                          <AlertCircle size={14} /> Cần bổ sung
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
