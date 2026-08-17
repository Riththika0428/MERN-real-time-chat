const User = require('../../models/User');
const Conversation = require('../../models/Conversation');

const notifyContacts = async (io, userId, event) => {
  const conversations = await Conversation.find({ participants: userId }).select('participants');
  const contactIds = new Set();
  conversations.forEach((c) => {
    c.participants.forEach((p) => {
      if (!p.equals(userId)) contactIds.add(String(p));
    });
  });

  contactIds.forEach((contactId) => {
    io.to(`user:${contactId}`).emit(event, { userId });
  });
};

const registerPresenceHandlers = (io, socket) => {
  socket.join(`user:${socket.user._id}`);

  User.findByIdAndUpdate(socket.user._id, { isOnline: true }).exec();
  notifyContacts(io, socket.user._id, 'user_online');

  socket.on('disconnecting', async () => {
    const room = io.sockets.adapter.rooms.get(`user:${socket.user._id}`);
    const remaining = room ? room.size - 1 : 0;

    if (remaining <= 0) {
      await User.findByIdAndUpdate(socket.user._id, {
        isOnline: false,
        lastSeen: new Date(),
      });
      notifyContacts(io, socket.user._id, 'user_offline');
    }
  });
};

module.exports = registerPresenceHandlers;