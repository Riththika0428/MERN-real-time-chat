const User = require('../models/User');

// GET /api/users/search?q=someterm
const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: 'Query param "q" is required' });
    }

    const regex = new RegExp(q.trim(), 'i');

    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [{ username: regex }, { email: regex }],
    })
      .select('username email avatarUrl isOnline lastSeen bio createdAt')
      .limit(20);

    return res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/me
// Body: { username?, bio? } — only updates fields that are provided.
const updateMe = async (req, res, next) => {
  try {
    const { username, bio } = req.body;

    if (username !== undefined) {
      const trimmed = username.trim();
      if (trimmed.length < 3 || trimmed.length > 30) {
        return res.status(400).json({ message: 'Username must be 3-30 characters' });
      }
      const existing = await User.findOne({ username: trimmed, _id: { $ne: req.user._id } });
      if (existing) {
        return res.status(409).json({ message: 'Username already taken' });
      }
      req.user.username = trimmed;
    }

    if (bio !== undefined) {
      if (bio.length > 160) {
        return res.status(400).json({ message: 'Bio must be 160 characters or fewer' });
      }
      req.user.bio = bio;
    }

    await req.user.save();
    return res.status(200).json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

// POST /api/users/me/avatar
// multipart/form-data with a single field named "avatar" (handled by multer in the route).
const uploadAvatarHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    req.user.avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await req.user.save();

    return res.status(200).json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

module.exports = { searchUsers, updateMe, uploadAvatarHandler };