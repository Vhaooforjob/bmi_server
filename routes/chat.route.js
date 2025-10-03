const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/chat.controller');

router.post('/conversations', ctrl.createConversation);

router.post('/conversations/:conversationId/messages', ctrl.sendMessage);
router.get('/conversations/:conversationId/messages', ctrl.listMessages);

router.get('/conversations', ctrl.listConversations);
router.put('/conversations/:conversationId', ctrl.renameConversation);
router.delete('/conversations/:conversationId', ctrl.deleteConversation);

module.exports = router;
