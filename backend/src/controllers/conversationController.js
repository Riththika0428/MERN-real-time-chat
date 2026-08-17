const Conversation = require('../models/Conversation');

const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'username avatarUrl isOnline lastSeen')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 });

    return res.status(200).json({ conversations });
  } catch (err) {
    next(err);
  }
};

const startConversation = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    if (userId === String(req.user._id)) {
      return res.status(400).json({ message: 'Cannot start a conversation with yourself' });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, userId], $size: 2 },
    })
      .populate('participants', 'username avatarUrl isOnline lastSeen')
      .populate('lastMessage');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, userId],
      });
      conversation = await conversation.populate('participants', 'username avatarUrl isOnline lastSeen');
    }

    return res.status(200).json({ conversation });
  } catch (err) {
    next(err);
  }
};

module.exports = { getConversations, startConversation };