const ChatConversation = require('../models/chatConversation.model');
const ChatMessage = require('../models/chatMessage.model');
const { chatWithHistory, DEFAULT_MODEL } = require('./gemini.service');

let KcalRecord;
    try { KcalRecord = require('../models/kcalRecord.model'); } catch (_) {}

    async function buildContextSnapshot(userId, extra = {}) {
    const snap = { ...extra };
    if (userId && KcalRecord) {
        const r = await KcalRecord.findOne({ userId }).lean();
        if (r) Object.assign(snap, {
        height_cm: r.height_cm, weight_kg: r.weight_kg, age_years: r.age_years,
        sex: r.sex, activity: r.activity, goal: extra.goal || 'keep',
        bmi: r.bmi, bmr_kcal: r.bmr_kcal, tdee_kcal: r.tdee_kcal
        });
    }
    return snap;
    }

    class ChatService {
    static async createConversation({ userId, title, persona, model, contextExtra }) {
        const contextSnapshot = await buildContextSnapshot(userId, contextExtra);
        const conv = await ChatConversation.create({
        userId,
        title: title || 'Tư vấn sức khỏe',
        persona,
        model: model || DEFAULT_MODEL,
        contextSnapshot
        });
        await ChatMessage.create({ conversationId: conv._id, role: 'system', text: `__SYSTEM__ ${conv.persona}` });
        return conv;
    }

    static async sendMessage({ conversationId, userId, message }) {
        const conv = await ChatConversation.findOne({ _id: conversationId, userId });
        if (!conv) throw new Error('Conversation not found');

        const historyDocs = await ChatMessage.find({ conversationId }).sort({ createdAt: 1 }).lean();
        const history = historyDocs.filter(m => m.role !== 'system').map(m => ({ role: m.role, text: m.text }));

        const { text } = await chatWithHistory({
        model: conv.model,
        persona: conv.persona,
        context: conv.contextSnapshot,
        history,
        message
        });

        await ChatMessage.create({ conversationId, role: 'user',  text: message });
        const botMsg = await ChatMessage.create({ conversationId, role: 'model', text });
        
        await ChatConversation.updateOne({ _id: conv._id }, { $set: { updatedAt: new Date() } });
        return botMsg;
    }

    static async listConversations(userId) {
        return ChatConversation.find({ userId }).sort({ updatedAt: -1 }).lean();
    }

    static async listMessages(conversationId, userId, { limit = 100, skip = 0 } = {}) {
        await ChatConversation.findOne({ _id: conversationId, userId }).orFail();
        return ChatMessage.find({ conversationId }).sort({ createdAt: 1 }).skip(skip).limit(limit).lean();
    }

    static async renameConversation(conversationId, userId, title) {
        await ChatConversation.updateOne({ _id: conversationId, userId }, { $set: { title } }).orFail();
        return true;
    }

    static async deleteConversation(conversationId, userId) {
        await ChatConversation.findOneAndDelete({ _id: conversationId, userId }).orFail();
        await ChatMessage.deleteMany({ conversationId });
        return true;
    }
}

module.exports = ChatService;
