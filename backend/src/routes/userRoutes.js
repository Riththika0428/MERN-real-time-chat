const express = require('express');
const { searchUsers, updateMe, uploadAvatarHandler } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');

const router = express.Router();

router.get('/search', protect, searchUsers);
router.patch('/me', protect, updateMe);
router.post('/me/avatar', protect, uploadAvatar.single('avatar'), uploadAvatarHandler);

module.exports = router;