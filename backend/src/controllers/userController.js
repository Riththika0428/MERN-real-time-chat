const User = require('../models/User');

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
      .select('username email avatarUrl isOnline lastSeen')
      .limit(20);

    return res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

module.exports = { searchUsers };