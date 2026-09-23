const Conversation = require('../models/Conversation');

const POPULATE_FIELDS = 'username email avatarUrl isOnline lastSeen bio createdAt';

// GET /api/conversations
const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', POPULATE_FIELDS)
      .populate('admins', '_id')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 });

    return res.status(200).json({ conversations });
  } catch (err) {
    next(err);
  }
};

// POST /api/conversations — start or find a 1:1 conversation
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
      isGroup: false,
      participants: { $all: [req.user._id, userId], $size: 2 },
    })
      .populate('participants', POPULATE_FIELDS)
      .populate('lastMessage');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, userId],
        isGroup: false,
      });
      conversation = await conversation.populate('participants', POPULATE_FIELDS);
    }

    return res.status(200).json({ conversation });
  } catch (err) {
    next(err);
  }
};

// POST /api/conversations/group
// Body: { name, description?, participantIds: [] }
const createGroup = async (req, res, next) => {
  try {
    const { name, description = '', participantIds = [] } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Group name is required' });
    }
    if (!Array.isArray(participantIds) || participantIds.length < 1) {
      return res.status(400).json({ message: 'Select at least one other member' });
    }

    const uniqueParticipants = Array.from(new Set([String(req.user._id), ...participantIds.map(String)]));

    const conversation = await Conversation.create({
      participants: uniqueParticipants,
      isGroup: true,
      groupName: name.trim(),
      groupDescription: description.trim(),
      admins: [req.user._id],
      createdBy: req.user._id,
    });

    const populated = await conversation.populate('participants', POPULATE_FIELDS);

    return res.status(201).json({ conversation: populated });
  } catch (err) {
    next(err);
  }
};

// Helper — loads a group conversation and checks the requester is a participant.
async function loadGroup(id, userId) {
  const conversation = await Conversation.findById(id);
  if (!conversation || !conversation.isGroup) return { error: 'not_found' };
  if (!conversation.participants.some((p) => p.equals(userId))) return { error: 'forbidden' };
  return { conversation };
}

function isAdmin(conversation, userId) {
  return conversation.admins.some((a) => a.equals(userId));
}

// PATCH /api/conversations/:id/group — admin only. Body: { name?, description? }
const updateGroup = async (req, res, next) => {
  try {
    const { conversation, error } = await loadGroup(req.params.id, req.user._id);
    if (error === 'not_found') return res.status(404).json({ message: 'Group not found' });
    if (error === 'forbidden') return res.status(403).json({ message: 'Not a member of this group' });
    if (!isAdmin(conversation, req.user._id)) return res.status(403).json({ message: 'Only admins can edit group settings' });

    const { name, description } = req.body;
    if (name !== undefined) {
      if (!name.trim()) return res.status(400).json({ message: 'Group name cannot be empty' });
      conversation.groupName = name.trim();
    }
    if (description !== undefined) {
      conversation.groupDescription = description.trim();
    }

    await conversation.save();
    const populated = await conversation.populate('participants', POPULATE_FIELDS);
    return res.status(200).json({ conversation: populated });
  } catch (err) {
    next(err);
  }
};

// POST /api/conversations/:id/group/avatar — admin only, multipart "avatar" field
const uploadGroupAvatarHandler = async (req, res, next) => {
  try {
    const { conversation, error } = await loadGroup(req.params.id, req.user._id);
    if (error === 'not_found') return res.status(404).json({ message: 'Group not found' });
    if (error === 'forbidden') return res.status(403).json({ message: 'Not a member of this group' });
    if (!isAdmin(conversation, req.user._id)) return res.status(403).json({ message: 'Only admins can change the group photo' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    conversation.groupAvatarUrl = `/uploads/groups/${req.file.filename}`;
    await conversation.save();
    const populated = await conversation.populate('participants', POPULATE_FIELDS);
    return res.status(200).json({ conversation: populated });
  } catch (err) {
    next(err);
  }
};

// POST /api/conversations/:id/members — admin only. Body: { userId }
const addMember = async (req, res, next) => {
  try {
    const { conversation, error } = await loadGroup(req.params.id, req.user._id);
    if (error === 'not_found') return res.status(404).json({ message: 'Group not found' });
    if (error === 'forbidden') return res.status(403).json({ message: 'Not a member of this group' });
    if (!isAdmin(conversation, req.user._id)) return res.status(403).json({ message: 'Only admins can add members' });

    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId is required' });
    if (conversation.participants.some((p) => p.equals(userId))) {
      return res.status(409).json({ message: 'User is already a member' });
    }

    conversation.participants.push(userId);
    await conversation.save();
    const populated = await conversation.populate('participants', POPULATE_FIELDS);
    return res.status(200).json({ conversation: populated });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/conversations/:id/members/:userId
// A user can always remove themselves (leave). Removing someone else requires admin.
const removeMember = async (req, res, next) => {
  try {
    const { conversation, error } = await loadGroup(req.params.id, req.user._id);
    if (error === 'not_found') return res.status(404).json({ message: 'Group not found' });
    if (error === 'forbidden') return res.status(403).json({ message: 'Not a member of this group' });

    const { userId } = req.params;
    const isSelf = String(req.user._id) === userId;

    if (!isSelf && !isAdmin(conversation, req.user._id)) {
      return res.status(403).json({ message: 'Only admins can remove other members' });
    }

    conversation.participants = conversation.participants.filter((p) => !p.equals(userId));
    conversation.admins = conversation.admins.filter((a) => !a.equals(userId));

    // If the group has no admins left but still has members, promote the
    // longest-standing remaining member so the group isn't stuck unmanaged.
    if (conversation.admins.length === 0 && conversation.participants.length > 0) {
      conversation.admins.push(conversation.participants[0]);
    }

    await conversation.save();

    if (conversation.participants.length === 0) {
      await Conversation.findByIdAndDelete(conversation._id);
      return res.status(200).json({ deleted: true });
    }

    const populated = await conversation.populate('participants', POPULATE_FIELDS);
    return res.status(200).json({ conversation: populated });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getConversations,
  startConversation,
  createGroup,
  updateGroup,
  uploadGroupAvatarHandler,
  addMember,
  removeMember,
};