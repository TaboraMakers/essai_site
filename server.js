// server.js
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Sert les fichiers statiques du dossier 'public'
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Logique du chat en temps réel
io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté');

  socket.on('disconnect', () => {
    console.log('Un utilisateur s\'est déconnecté');
  });

  // Quand le serveur reçoit un message d'un client...
  socket.on('chat message', (msg) => {
    // ...il le renvoie à TOUS les clients connectés
    io.emit('chat message', msg);
  });
});

server.listen(PORT, () => {
  console.log(`Le serveur écoute sur le port ${PORT}`);
});