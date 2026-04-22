// ====== DATOS INICIALES ======
let respuestas = JSON.parse(localStorage.getItem("respuestas")) || {
    "Mejores Pokémon para gimnasio": ["Yo recomiendo usar tipo planta contra los de agua.", "También los Pokémon de tipo roca pueden ser útiles."],
    "Pokemon mas fuerte": ["Mewtwo es realmente fuerte, pero depende del moveset.", "Rayquaza es increíble en batallas aéreas."],
    "Cuantos pokemon tipo electrico hay?": ["Hay muchos, pero Pikachu sigue siendo el más famoso.", "Zapdos es legendario y tipo eléctrico."]
};

let likesEstado = JSON.parse(localStorage.getItem("likesEstado")) || {};

// ====== FUNCIONES DE PERSISTENCIA ======
function guardarDatos() {
    localStorage.setItem("respuestas", JSON.stringify(respuestas));
    localStorage.setItem("likesEstado", JSON.stringify(likesEstado));
}

// ====== LOGICA DE RENDERIZADO ======
function renderizarTemas() {
    const contenedor = document.getElementById("temas-foro");
    // Limpiamos los temas existentes (menos el encabezado)
    const temasExistentes = contenedor.querySelectorAll(".tema");
    temasExistentes.forEach(t => t.remove());

    // Creamos todos los temas desde el objeto 'respuestas'
    Object.keys(respuestas).forEach(titulo => {
        const div = document.createElement("div");
        div.className = "tema";
        div.innerHTML = `<p class="titulo">${titulo}</p><p class="info"></p>`;
        
        div.onclick = (e) => abrirTema(div, titulo);
        contenedor.appendChild(div);
    });
    actualizarContadores();
}

// ====== LOGICA DE INTERACCION ======
function abrirTema(temaElemento, titulo) {
    // Si ya está abierto, lo cerramos
    if (temaElemento.classList.contains("activo")) {
        temaElemento.classList.remove("activo");
        temaElemento.querySelector(".respuestas")?.remove();
        temaElemento.querySelector(".nueva-respuesta-form")?.remove();
        return;
    }

    // Cerramos otros temas primero
    document.querySelectorAll(".tema").forEach(t => {
        t.classList.remove("activo");
        t.querySelector(".respuestas")?.remove();
        t.querySelector(".nueva-respuesta-form")?.remove();
    });

    temaElemento.classList.add("activo");

    const ul = document.createElement("ul");
    ul.className = "respuestas";
    
    respuestas[titulo].forEach((resp, idx) => ul.appendChild(crearRespuestaTexto(resp, titulo, idx)));
    
    const form = document.createElement("form");
    form.className = "nueva-respuesta-form";
    // IMPORTANTE: e.stopPropagation() evita que el clic en el form cierre el tema
    form.onclick = (e) => e.stopPropagation(); 
    form.innerHTML = `<input type="text" placeholder="Escribe tu respuesta..." required><button type="submit">Responder</button>`;
    
    form.onsubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const input = form.querySelector("input");
        respuestas[titulo].push(input.value);
        ul.appendChild(crearRespuestaTexto(input.value, titulo, respuestas[titulo].length - 1));
        input.value = "";
        guardarDatos();
        actualizarContadores();
    };

    temaElemento.append(ul, form);
}

function crearRespuestaTexto(texto, titulo, index) {
    const li = document.createElement("li");
    li.className = "respuesta-item";
    const id = `${titulo}-${index}`;
    
    if (!likesEstado[id]) likesEstado[id] = { numLikes: 0, likeHecho: false };

    li.innerHTML = `<span>${texto}</span>
        <span class="like-container">
            <span class="corazon ${likesEstado[id].likeHecho ? 'like-hecho' : ''}">❤️</span>
            <span class="num-likes">${likesEstado[id].numLikes}</span>
        </span>`;

    li.querySelector('.corazon').onclick = (e) => {
        e.stopPropagation();
        likesEstado[id].likeHecho = !likesEstado[id].likeHecho;
        likesEstado[id].numLikes += likesEstado[id].likeHecho ? 1 : -1;
        li.querySelector('.num-likes').textContent = likesEstado[id].numLikes;
        li.querySelector('.corazon').classList.toggle('like-hecho');
        guardarDatos();
    };
    return li;
}

function actualizarContadores() {
    document.querySelectorAll(".tema").forEach(tema => {
        const titulo = tema.querySelector(".titulo").textContent;
        const num = respuestas[titulo]?.length || 0;
        tema.querySelector(".info").textContent = `• ${num} respuesta${num !== 1 ? 's' : ''}`;
    });
}

// ====== NUEVO TEMA ======
document.querySelector("#nuevo-tema form").onsubmit = (e) => {
    e.preventDefault();
    const titulo = e.target.querySelector("input").value;
    const msg = e.target.querySelector("textarea").value;
    
    respuestas[titulo] = [msg];
    guardarDatos();
    renderizarTemas(); // Re-renderizamos para incluir el nuevo tema
    e.target.reset();
};

// INICIO
renderizarTemas();

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