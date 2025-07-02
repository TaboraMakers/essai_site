// server.js
// ... (tout le début du code reste pareil)

io.on('connection', (socket) => {
  
  socket.on('new user', (username) => {
    socket.username = username;
    console.log(`${username} est connecté`);
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      console.log(`${socket.username} s'est déconnecté`);
    }
  });

  // Quand le serveur reçoit un message
  socket.on('chat message', (msg) => {
    // Le renvoyer à tout le monde avec le nom d'utilisateur et le message
    io.emit('chat message', { user: socket.username, msg: msg });
  });
});

// ... (la fin du code reste pareille)