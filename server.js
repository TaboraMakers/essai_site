// server.js
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log(`Un utilisateur est connecté : ${socket.id}`);

    // 1. Envoyer à l'utilisateur son propre ID pour qu'il puisse générer un lien d'invitation
    socket.emit('your id', socket.id);

    // 2. Un utilisateur (socket) demande à rejoindre un autre (inviteId)
    socket.on('join request', (inviteId) => {
        const roomName = createRoomName(socket.id, inviteId);
        
        // On fait rejoindre les deux utilisateurs au même salon
        const hostSocket = io.sockets.sockets.get(inviteId);
        if (hostSocket) {
            hostSocket.join(roomName);
            socket.join(roomName);

            // 3. On informe les deux qu'ils peuvent commencer à discuter
            io.to(roomName).emit('start chat', roomName);
            console.log(`Salon ${roomName} créé pour ${socket.id} et ${inviteId}`);
        } else {
            // Gérer le cas où l'hôte n'est plus connecté
            console.log(`Tentative de connexion à un hôte inexistant: ${inviteId}`);
        }
    });

    // 4. Recevoir un message privé et le renvoyer uniquement aux membres du salon
    socket.on('private message', (data) => {
        // On envoie le message à tout le monde dans le salon, SAUF à l'expéditeur
        // car il l'affiche déjà lui-même.
        socket.to(data.room).emit('private message', { msg: data.msg });
    });

    socket.on('disconnect', () => {
        console.log(`Utilisateur déconnecté : ${socket.id}`);
    });
});

// Fonction pour créer un nom de salon unique et constant pour une paire d'utilisateurs
function createRoomName(id1, id2) {
    return [id1, id2].sort().join('-');
}

server.listen(PORT, () => {
  console.log(`Le serveur écoute sur le port ${PORT}`);
});