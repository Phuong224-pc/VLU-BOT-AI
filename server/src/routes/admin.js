import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const promptsPath = path.join(__dirname, '../data/prompts.json');

// Lấy danh sách System Prompts
router.get('/prompts', (req, res) => {
  try {
    if (fs.existsSync(promptsPath)) {
      const data = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
      return res.json({ success: true, data });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
  res.json({ success: true, data: {} });
});

// Cập nhật System Prompts
router.post('/prompts', (req, res) => {
  try {
    const newPrompts = req.body;
    fs.writeFileSync(promptsPath, JSON.stringify(newPrompts, null, 2), 'utf8');
    res.json({ success: true, message: "Đã cập nhật System Prompts thành công!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
