import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getCurriculumData = () => {
  try {
    const filePath = path.join(__dirname, '../data/khungK30.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    console.error("Lỗi đọc khungK30.json:", err.message);
  }
  return { program: "K30 CNTT", sections: [] };
};

// Lấy toàn bộ khung chương trình
router.get('/', (req, res) => {
  const data = getCurriculumData();
  res.json({ success: true, data });
});

// Tìm kiếm môn học theo tên hoặc mã môn
router.get('/search', (req, res) => {
  const query = (req.query.q || "").toLowerCase().trim();
  const data = getCurriculumData();
  
  const allCourses = [];
  data.sections?.forEach(sec => {
    sec.courses?.forEach(c => {
      allCourses.push({
        ...c,
        sectionName: sec.name
      });
    });
  });

  if (!query) {
    return res.json({ success: true, data: allCourses });
  }

  const results = allCourses.filter(c => 
    (c.code && c.code.toLowerCase().includes(query)) ||
    (c.name && c.name.toLowerCase().includes(query))
  );

  res.json({ success: true, data: results });
});

export default router;
