
module.exports = (io) => { // Receive io as an argument
    return (req, res, next) => {
      try {
        let onlineUsers = 0; // You might need to manage this globally
  
        io.on('connection', (socket) => {
          console.log('A user connected');
          onlineUsers++;
          io.emit('onlineUsers', onlineUsers);
  
          socket.on('disconnect', () => {
            console.log('User disconnected');
            onlineUsers--;
            io.emit('onlineUsers', onlineUsers);
          });
        });
  
        next(); // Continue to the next middleware/route handler
      } catch (error) {
        next(error);
      }
    };
  };
  