const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

async function enviarPregunta() {
    const texto = userInput.value.trim();
    if (!texto) return;

    // 1. Pintar mensaje del usuario
    appendMessage('user', texto);
    userInput.value = '';

    // 2. Llamar al backend (tu server de Node.js)
    try {
        const response = await fetch('http://localhost:3000/ask-pokemon', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: texto })
        });

        const data = await response.json();
        
        // 3. Pintar respuesta de Oak
        appendMessage('oak', data.reply);
    } catch (error) {
        appendMessage('oak', "Error de conexión. ¿Has encendido el servidor Node?");
    }
}

function appendMessage(sender, text) {
    const div = document.createElement('div');
    div.classList.add('msg', `${sender}-msg`);
    div.innerHTML = `<span class="label">${sender === 'oak' ? 'OAK' : 'TU'}</span>${text}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll hacia abajo
}

sendBtn.addEventListener('click', enviarPregunta);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enviarPregunta();
});

/* ====== LÓGICA DEL MENÚ (Funciona en todas las páginas) ====== */
function inicializarMenu() {
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('header nav'); // Usamos el selector de etiqueta si no tienes ID

    if (menuToggle && navMenu) {
        menuToggle.onclick = function() {
            menuToggle.classList.toggle('is-active');
            navMenu.classList.toggle('active');
        };

        const links = navMenu.querySelectorAll('a');
        links.forEach(link => {
            link.onclick = () => {
                menuToggle.classList.remove('is-active');
                navMenu.classList.remove('active');
            };
        });
    }
}

// Inicializar menú siempre
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarMenu);
} else {
    inicializarMenu();
}