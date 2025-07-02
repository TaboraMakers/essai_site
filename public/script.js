// public/script.js
const socket = io();

// Obtenir les éléments du DOM
const chatForm = document.getElementById('chat-form');
const msgInput = document.getElementById('msg');
const chatMessages = document.getElementById('chat-messages');

// Demander le pseudo à l'utilisateur
const username = prompt("Quel est votre pseudo ?") || "Anonyme";
socket.emit('new user', username);

// Envoi du message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = msgInput.value.trim();
    if (!msg) {
        return false;
    }
    socket.emit('chat message', msg);
    msgInput.value = '';
    msgInput.focus();
});

// Recevoir les messages du serveur
socket.on('chat message', (data) => {
    outputMessage(data);
    // Scroller vers le bas
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Fonction pour afficher le message dans le DOM
function outputMessage(data) {
    const div = document.createElement('div');
    div.classList.add('message');

    // Vérifier si le message est de moi pour ajouter la bonne classe
    if (data.user === username) {
        div.classList.add('my-message');
    }

    // Créer la structure interne de la bulle
    div.innerHTML = `
        <p class="meta">${data.user}</p>
        <p class="text">${data.msg}</p>`;
    
    chatMessages.appendChild(div);
}