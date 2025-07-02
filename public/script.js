// public/script.js
const socket = io();

// Éléments du DOM
const invitationBox = document.getElementById('invitation-box');
const chatContainer = document.getElementById('chat-container');
const inviteLinkInput = document.getElementById('invite-link');
const copyButton = document.getElementById('copy-button');

const chatForm = document.getElementById('chat-form');
const msgInput = document.getElementById('msg');
const chatMessages = document.getElementById('chat-messages');

let myRoomId = null;

// --- GESTION DE L'INVITATION ---

// 1. Le serveur nous envoie notre ID unique
socket.on('your id', (id) => {
    const inviteURL = `${window.location.origin}?invite=${id}`;
    inviteLinkInput.value = inviteURL;
});

// 2. Copier le lien d'invitation
copyButton.addEventListener('click', () => {
    inviteLinkInput.select();
    document.execCommand('copy');
    alert('Lien copié dans le presse-papiers !');
});

// 3. Vérifier si on a rejoint via un lien d'invitation
const urlParams = new URLSearchParams(window.location.search);
const inviteId = urlParams.get('invite');

if (inviteId) {
    // Si oui, on dit au serveur qu'on veut rejoindre cette personne
    socket.emit('join request', inviteId);
}

// 4. Le serveur confirme que la conversation peut commencer
socket.on('start chat', (room) => {
    myRoomId = room;
    invitationBox.style.display = 'none';
    chatContainer.style.display = 'flex';
    outputSystemMessage('Votre ami a rejoint la conversation !');
});

// --- GESTION DU CHAT ---

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = msgInput.value.trim();
    if (msg && myRoomId) {
        socket.emit('private message', { room: myRoomId, msg: msg });
        outputMessage({ msg: msg }, true); // Affiche notre propre message immédiatement
        msgInput.value = '';
        msgInput.focus();
    }
});

// 5. Recevoir un message privé
socket.on('private message', (data) => {
    outputMessage(data, false);
});

// --- FONCTIONS D'AFFICHAGE ---

function outputMessage(data, isMe) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.classList.add(isMe ? 'my-message' : 'other-message');
    div.innerHTML = `<p class="text">${data.msg}</p>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function outputSystemMessage(message) {
    const div = document.createElement('div');
    div.classList.add('system-message');
    div.textContent = message;
    chatMessages.appendChild(div);
}