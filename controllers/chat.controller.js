const ChatService = require('../services/chat.service');

exports.createConversation = async (req, res) => {
    try {
        const userId = req.user?._id || req.body.userId; 
        const { title, persona, model, contextExtra } = req.body;
        const conv = await ChatService.createConversation({ userId, title, persona, model, contextExtra });
        res.json({ success: true, data: conv });
    } catch (e) {
        res.status(400).json({ success: false, message: e.message });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const userId = req.user?._id || req.body.userId;
        const { conversationId } = req.params;
        const { message } = req.body;
        if (!message) return res.status(400).json({ success: false, message: 'message is required' });
        const botMsg = await ChatService.sendMessage({ conversationId, userId, message });
        res.json({ success: true, answer: botMsg.text });
    } catch (e) {
        res.status(400).json({ success: false, message: e.message });
    }
};

exports.listConversations = async (req, res) => {
    try {
        const userId = req.user?._id || req.query.userId;
        const items = await ChatService.listConversations(userId);
        res.json({ success: true, data: items });
    } catch (e) {
        res.status(400).json({ success: false, message: e.message });
    }
};

exports.listMessages = async (req, res) => {
    try {
        const userId = req.user?._id || req.query.userId;
        const { conversationId } = req.params;
        const { limit, skip } = req.query;
        const items = await ChatService.listMessages(conversationId, userId, { 
        limit: Number(limit) || 100, 
        skip: Number(skip) || 0 
        });
        res.json({ success: true, data: items });
    } catch (e) {
        res.status(400).json({ success: false, message: e.message });
    }
};

exports.renameConversation = async (req, res) => {
    try {
        const userId = req.user?._id || req.body.userId;
        const { conversationId } = req.params;
        const { title } = req.body;
        await ChatService.renameConversation(conversationId, userId, title);
        res.json({ success: true });
    } catch (e) {
        res.status(400).json({ success: false, message: e.message });
    }
};

exports.deleteConversation = async (req, res) => {
    try {
        const userId = req.user?._id || req.body.userId;
        const { conversationId } = req.params;
        await ChatService.deleteConversation(conversationId, userId);
        res.json({ success: true });
    } catch (e) {
        res.status(400).json({ success: false, message: e.message });
    }
};
