const express = require('express');
const { getConversations, startConversation } = require('../controllers/conversationController');
const { getMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getConversations);
router.post('/', protect, startConversation);
router.get('/:id/messages', protect, getMessages);

module.exports = router;