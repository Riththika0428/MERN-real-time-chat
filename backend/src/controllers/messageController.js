const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

const getMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 30;

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    if (!conversation.participants.some((p) => p.equals(req.user._id))) {
      return res.status(403).json({ message: 'Not a participant in this conversation' });
    }

    const messages = await Message.find({ conversation: id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('sender', 'username avatarUrl');

    return res.status(200).json({ messages: messages.reverse(), page });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMessages };