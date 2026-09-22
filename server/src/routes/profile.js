import express from 'express';
import Groq from 'groq-sdk';

const router = express.Router();

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY chưa được cấu hình trong .env");
  return new Groq({ apiKey });
}

/**
 * POST /api/profile/extract-from-image
 * Body: { image: { data: string (base64 or data URL), mimeType: string } }
 * Returns: { success: true, data: { fullName, mssv, dob, email, phone, ... } }
 */
router.post('/extract-from-image', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image || !image.data) {
      return res.status(400).json({ success: false, error: 'Thiếu dữ liệu ảnh' });
    }

    const imageUrl = image.data.startsWith('data:')
      ? image.data
      : `data:${image.mimeType || 'image/jpeg'};base64,${image.data}`;

    // Dùng model vision đang hoạt động trong hệ thống (đồng bộ với chat.js)
    const VISION_MODEL = process.env.GROQ_VISION_MODEL || "openai/gpt-oss-120b";

    const prompt = `Bạn là hệ thống OCR chuyên trích xuất thông tin sinh viên từ ảnh giấy tờ (CCCD, thẻ sinh viên, học bạ, bảng điểm, hộ chiếu, v.v.).

Hãy phân tích ảnh được cung cấp và trích xuất thông tin theo định dạng JSON chính xác sau:
{
  "fullName": "Họ và tên đầy đủ",
  "mssv": "Mã số sinh viên (nếu có)",
  "dob": "Ngày tháng năm sinh (DD/MM/YYYY)",
  "gender": "Nam/Nữ",
  "email": "Email (nếu có)",
  "phone": "Số điện thoại (nếu có)",
  "ethnicity": "Dân tộc",
  "nationality": "Quốc tịch",
  "address": "Địa chỉ thường trú hoặc liên hệ",
  "faculty": "Khoa (nếu có)",
  "major": "Ngành học (nếu có)",
  "className": "Lớp/Nhóm (nếu có)",
  "cohort": "Niên khóa (nếu có)",
  "idNumber": "Số CMND/CCCD (nếu có)"
}

Quy tắc:
- Chỉ điền các trường thực sự tìm thấy trong ảnh. Để giá trị là null nếu không tìm thấy.
- Không đoán mò hay bịa đặt thông tin.
- CHỈ trả về JSON thuần túy, không có markdown, không có văn bản thêm.
- Nếu không nhận diện được bất kỳ thông tin nào, trả về: {"error": "Không thể nhận diện thông tin từ ảnh này"}`;

    const groq = getGroqClient();

    let completion;
    try {
      completion = await groq.chat.completions.create({
        model: VISION_MODEL,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: imageUrl }
              }
            ]
          }
        ],
        temperature: 0.05,
        max_tokens: 1024,
      });
    } catch (groqErr) {
      console.error('Groq API error (model:', VISION_MODEL, '):', groqErr?.message || groqErr);
      const errMsg = groqErr?.message || 'Groq API lỗi';
      const statusCode = groqErr?.status || 500;
      return res.status(statusCode).json({
        success: false,
        error: `AI Vision lỗi: ${errMsg}`
      });
    }

    const rawText = completion.choices[0]?.message?.content || '';
    console.log('[Profile OCR] Groq response:', rawText.slice(0, 300));

    // Loại bỏ markdown code block nếu có
    const cleaned = rawText
      .replace(/```(?:json)?\s*/gi, '')
      .replace(/```/g, '')
      .trim();

    // Parse JSON từ response
    let extractedData = {};
    try {
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Không tìm thấy JSON trong phản hồi');
      }
    } catch (parseErr) {
      console.error('Lỗi parse JSON từ Groq:', parseErr.message, '\nRaw:', rawText);
      return res.status(422).json({
        success: false,
        error: 'AI không thể trích xuất thông tin từ ảnh này. Vui lòng thử ảnh rõ hơn (chụp thẳng, không nghiêng, đủ ánh sáng).'
      });
    }

    if (extractedData.error) {
      return res.status(422).json({ success: false, error: extractedData.error });
    }

    // Lọc bỏ các trường null/undefined/rỗng
    const cleanData = Object.fromEntries(
      Object.entries(extractedData).filter(([, v]) => v !== null && v !== undefined && v !== '')
    );

    res.json({ success: true, data: cleanData, model: VISION_MODEL });

  } catch (error) {
    console.error('Lỗi profile OCR (unexpected):', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Lỗi hệ thống khi xử lý ảnh'
    });
  }
});

export default router;
