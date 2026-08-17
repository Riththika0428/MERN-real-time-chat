const Message = require('../../models/Message');
const Conversation = require('../../models/Conversation');

const registerMessageHandlers = (io, socket) => {
  socket.on('send_message', async (payload, callback) => {
    try {
      const { conversationId, text = '', attachmentUrl = '', attachmentType = '' } = payload;

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return callback?.({ error: 'Conversation not found' });
      }
      if (!conversation.participants.some((p) => p.equals(socket.user._id))) {
        return callback?.({ error: 'Not a participant in this conversation' });
      }
      if (!text.trim() && !attachmentUrl) {
        return callback?.({ error: 'Message must have text or an attachment' });
      }

      const message = await Message.create({
        conversation: conversationId,
        sender: socket.user._id,
        text,
        attachmentUrl,
        attachmentType,
      });

      conversation.lastMessage = message._id;
      conversation.lastMessageAt = message.createdAt;
      await conversation.save();

      const populated = await message.populate('sender', 'username avatarUrl');

      io.to(`conversation:${conversationId}`).emit('receive_message', populated);

      callback?.({ success: true, message: populated });
    } catch (err) {
      console.error('send_message error:', err.message);
      callback?.({ error: 'Failed to send message' });
    }
  });

  socket.on('join_conversation', async (conversationId) => {
    const conversation = await Conversation.findById(conversationId);
    if (conversation && conversation.participants.some((p) => p.equals(socket.user._id))) {
      socket.join(`conversation:${conversationId}`);
    }
  });

  socket.on('leave_conversation', (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
  });
};

module.exports = registerMessageHandlers;