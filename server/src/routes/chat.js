import express from 'express';
import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Đọc curriculum để nạp context cho AI nếu cần
let curriculumKnowledge = "";
try {
  const k30Path = path.join(__dirname, '../data/khungK30.json');
  if (fs.existsSync(k30Path)) {
    const data = JSON.parse(fs.readFileSync(k30Path, 'utf8'));
    curriculumKnowledge = JSON.stringify(data);
  }
} catch (err) {
  console.error("Lỗi nạp tri thức K30:", err.message);
}

// Đọc system prompts mặc định
let systemPrompts = {};
try {
  const promptsPath = path.join(__dirname, '../data/prompts.json');
  if (fs.existsSync(promptsPath)) {
    systemPrompts = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
  }
} catch (err) {
  console.error("Lỗi nạp prompts:", err.message);
}

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY chưa được cấu hình trong .env");
  return new Groq({ apiKey });
}

router.post('/', async (req, res) => {
  try {
    const { messages = [], mode = 'default', image = null, systemPromptOverride } = req.body;

    let baseSystemPrompt = systemPromptOverride || systemPrompts[mode] || systemPrompts['default'];

    // Nếu ở chế độ advisor hoặc roadmap, bổ sung thông tin khung K30
    if (mode === 'advisor' || mode === 'roadmap') {
      baseSystemPrompt += `\n\n[DỮ LIỆU THAM CHIẾU KHUNG CTĐT K30 CNTT VĂN LANG 126 TÍN CHỈ]:\n${curriculumKnowledge.slice(0, 8000)}`;
    }

    const groqMessages = [
      { role: "system", content: baseSystemPrompt }
    ];

    // Xử lý tin nhắn người dùng và hình ảnh (nếu có)
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const isLast = i === messages.length - 1;

      if (isLast && image && image.data) {
        // Hỗ trợ Groq Vision
        groqMessages.push({
          role: "user",
          content: [
            { type: "text", text: msg.content || "Hãy phân tích hình ảnh này giúp tôi:" },
            {
              type: "image_url",
              image_url: {
                url: image.data.startsWith('data:') ? image.data : `data:${image.mimeType || 'image/jpeg'};base64,${image.data}`
              }
            }
          ]
        });
      } else {
        groqMessages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      }
    }

    // Chọn model phù hợp - đồng bộ với code gốc js/chat.js
    const model = (image && image.data)
      ? "openai/gpt-oss-120b"
      : "openai/gpt-oss-120b";

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      model,
      messages: groqMessages,
      temperature: 0.5,
      max_tokens: 2048,
      top_p: 0.95
    });

    const reply = completion.choices[0]?.message?.content || "Xin lỗi, không nhận được phản hồi từ mô hình AI.";

    res.json({
      success: true,
      reply,
      model,
      usage: completion.usage
    });

  } catch (error) {
    console.error("Lỗi Groq API:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Lỗi xử lý AI Core"
    });
  }
});

export default router;
