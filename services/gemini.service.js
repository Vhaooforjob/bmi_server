require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

function buildSystemPrompt({ persona, context }) {
    const c = context || {};
    return `
    ${persona || 'Bạn là chuyên gia dinh dưỡng, trả lời chính xác, dễ hiểu, tiếng Việt.'}
    Chủ đề chính: BMI, BMR, TDEE, dinh dưỡng, vận động an toàn. Không chẩn đoán bệnh.

    Thông tin người dùng (nếu có):
    - Giới tính: ${c.sex ?? 'n/a'}
    - Tuổi: ${c.age_years ?? 'n/a'}
    - Chiều cao: ${c.height_cm ?? 'n/a'} cm
    - Cân nặng: ${c.weight_kg ?? 'n/a'} kg
    - BMI: ${c.bmi ?? 'n/a'}
    - BMR: ${c.bmr_kcal ?? 'n/a'} kcal
    - TDEE: ${c.tdee_kcal ?? 'n/a'} kcal
    - Hoạt động: ${c.activity ?? 'sedentary'}
    - Mục tiêu: ${c.goal ?? 'keep'}
    - Chế độ ăn: ${c.diet ?? 'none'}
    - Dị ứng: ${(c.allergies || []).join(', ') || 'none'}

    Hãy trả lời ngắn gọn, có số ví dụ khi cần, và gợi ý thực đơn/bài tập an toàn theo bối cảnh trên.
    `;
}

async function chatWithHistory({ model = DEFAULT_MODEL, persona, context, history = [], message }) {
    const m = genAI.getGenerativeModel({ model });
    const hist = [];

    hist.push({ role: 'user', parts: [{ text: buildSystemPrompt({ persona, context }) }] });

    history.forEach(h => {
    if (h.role === 'user')  hist.push({ role: 'user',  parts: [{ text: h.text }] });
    if (h.role === 'model') hist.push({ role: 'model', parts: [{ text: h.text }] });
    });

    const chat = m.startChat({ history: hist });
    const result = await chat.sendMessage(message);
    const text = result.response.text();
    return { text, raw: result };
}

module.exports = { chatWithHistory, DEFAULT_MODEL };
