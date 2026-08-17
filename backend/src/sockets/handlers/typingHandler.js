const registerTypingHandlers = (io, socket) => {
  socket.on('typing', ({ conversationId }) => {
    socket.to(`conversation:${conversationId}`).emit('typing', {
      conversationId,
      userId: socket.user._id,
    });
  });

  socket.on('stop_typing', ({ conversationId }) => {
    socket.to(`conversation:${conversationId}`).emit('stop_typing', {
      conversationId,
      userId: socket.user._id,
    });
  });
};

module.exports = registerTypingHandlers;