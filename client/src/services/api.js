const API_BASE = '/api';

export const api = {
  // Gửi tin nhắn đến AI
  async chat({ messages, mode = 'default', image = null, systemPromptOverride = null }) {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, mode, image, systemPromptOverride })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Lỗi máy chủ (${res.status})`);
    }
    return res.json();
  },

  // Lấy toàn bộ khung chương trình K30
  async getCurriculum() {
    const res = await fetch(`${API_BASE}/curriculum`);
    return res.json();
  },
//sfsf
  // Tìm kiếm môn học
  async searchCourses(query) {
    const res = await fetch(`${API_BASE}/curriculum/search?q=${encodeURIComponent(query)}`);
    return res.json();
  },

  // Lấy danh sách tóm tắt sinh viên demo
  async getStudents() {
    const res = await fetch(`${API_BASE}/students`);
    return res.json();
  },

  // Tra cứu chi tiết theo MSSV
  async getStudentByMssv(mssv) {
    const res = await fetch(`${API_BASE}/students/${encodeURIComponent(mssv)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Không tìm thấy sinh viên ${mssv}`);
    }
    return res.json();
  },

  // Lấy danh sách System Prompts
  async getAdminPrompts() {
    const res = await fetch(`${API_BASE}/admin/prompts`);
    return res.json();
  },

  // Cập nhật System Prompts
  async updateAdminPrompts(prompts) {
    const res = await fetch(`${API_BASE}/admin/prompts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prompts)
    });
    return res.json();
  },

  // OCR ảnh hồ sơ sinh viên (CCCD, thẻ SV, học bạ)
  async extractProfileFromImage(imageData, mimeType = 'image/jpeg') {
    const res = await fetch(`${API_BASE}/profile/extract-from-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: { data: imageData, mimeType } })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Lỗi OCR (${res.status})`);
    }
    return res.json();
  },

  // Kiểm tra sức khỏe hệ thống
  async checkHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  }
};
