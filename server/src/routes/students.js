import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getStudentsData = () => {
  try {
    const filePath = path.join(__dirname, '../data/students.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    console.error("Lỗi đọc students.json:", err.message);
  }
  return {};
};

// Lấy danh sách tóm tắt tất cả sinh viên demo
router.get('/', (req, res) => {
  const students = getStudentsData();
  const summary = Object.values(students).map(s => ({
    mssv: s.mssv,
    name: s.name,
    cohort: s.cohort,
    major: s.major,
    className: s.className,
    gpa4: s.officialCumulativeGpa4,
    credits: s.officialCumulativeCredits,
    rating: s.officialRating
  }));
  res.json({ success: true, data: summary });
});

// Tra cứu chi tiết điểm và môn học theo MSSV
router.get('/:mssv', (req, res) => {
  const { mssv } = req.params;
  const students = getStudentsData();
  const student = students[mssv.trim()];

  if (!student) {
    return res.status(404).json({
      success: false,
      error: `Không tìm thấy sinh viên với MSSV: ${mssv}. Bạn có thể thử các MSSV demo: 2474802010414, 2474802010118, 2474802010419, 2474802010071, 2474802010458.`
    });
  }

  res.json({ success: true, data: student });
});

export default router;
