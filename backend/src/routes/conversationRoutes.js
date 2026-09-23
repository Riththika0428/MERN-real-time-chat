const express = require('express');
const {
  getConversations,
  startConversation,
  createGroup,
  updateGroup,
  uploadGroupAvatarHandler,
  addMember,
  removeMember,
} = require('../controllers/conversationController');
const { getMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const { uploadGroupAvatar } = require('../middleware/upload');

const router = express.Router();

router.get('/', protect, getConversations);
router.post('/', protect, startConversation);
router.post('/group', protect, createGroup);
router.patch('/:id/group', protect, updateGroup);
router.post('/:id/group/avatar', protect, uploadGroupAvatar.single('avatar'), uploadGroupAvatarHandler);
router.post('/:id/members', protect, addMember);
router.delete('/:id/members/:userId', protect, removeMember);
router.get('/:id/messages', protect, getMessages);

module.exports = router;