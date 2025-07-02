// public/script.js
const socket = io(); // Se connecte au serveur

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    // Envoie le message au serveur
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

// Quand on reçoit un message du serveur
socket.on('chat message', function(msg) {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});