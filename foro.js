// ====== DATOS INICIALES DE RESPUESTAS ======
let respuestas = {
    "Mejores Pokémon para gimnasio": [
        "Yo recomiendo usar tipo planta contra los de agua.",
        "También los Pokémon de tipo roca pueden ser útiles."
    ],
    "Pokemon mas fuerte": [
        "Mewtwo es realmente fuerte, pero depende del moveset.",
        "Rayquaza es increíble en batallas aéreas."
    ],
    "Cuantos pokemon tipo electrico hay?": [
        "Hay muchos, pero Pikachu sigue siendo el más famoso.",
        "Zapdos es legendario y tipo eléctrico."
    ]
};

// ====== CARGAR DATOS DESDE LOCALSTORAGE ======
const storedRespuestas = localStorage.getItem("respuestas");
if(storedRespuestas){
    respuestas = JSON.parse(storedRespuestas);
}

// Likes guardados: { "titulo-index": {numLikes, likeHecho} }
let likesEstado = JSON.parse(localStorage.getItem("likesEstado")) || {};

// ====== FUNCION PARA ACTUALIZAR EL NUMERO DE RESPUESTAS ======
function actualizarNumeroRespuestas() {
    const temas = document.querySelectorAll(".tema");
    temas.forEach(tema => {
        const titulo = tema.querySelector(".titulo").textContent;
        const info = tema.querySelector(".info");
        const numRespuestas = respuestas[titulo] ? respuestas[titulo].length : 0;
        info.textContent = `• ${numRespuestas} respuesta${numRespuestas !== 1 ? 's' : ''}`;
    });
}

// Llamada inicial
actualizarNumeroRespuestas();

// ====== FUNCION PARA CREAR UNA RESPUESTA CON LIKE ======
function crearRespuestaTexto(texto, titulo, index) {
    const li = document.createElement("li");
    li.classList.add("respuesta-item");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";

    // Texto de la respuesta
    const textoSpan = document.createElement("span");
    textoSpan.textContent = texto;
    li.appendChild(textoSpan);

    // Contenedor de like
    const likeContainer = document.createElement("span");
    likeContainer.classList.add("like-container");
    likeContainer.style.display = "flex";
    likeContainer.style.alignItems = "center";
    likeContainer.style.gap = "0.2rem";

    // Corazón
    const corazon = document.createElement("span");
    corazon.classList.add("corazon");
    corazon.textContent = "❤️";

    // Número de likes
    const likes = document.createElement("span");
    likes.classList.add("num-likes");

    // ID único
    const respuestaID = `${titulo}-${index}`;

    // Inicializar estado del like
    if(!likesEstado[respuestaID]){
        const randomLikes = Math.floor(Math.random() * 100);
        likesEstado[respuestaID] = {
            numLikes: randomLikes,
            likeHecho: false
        };
        localStorage.setItem("likesEstado", JSON.stringify(likesEstado));
    }

    //Extraer los valores 
    let numLikes = likesEstado[respuestaID].numLikes;
    let likeHecho = likesEstado[respuestaID].likeHecho;

    likes.textContent = ` ${numLikes}`;
    if(likeHecho) corazon.classList.add("like-hecho");

    // Click para alternar like
    corazon.addEventListener("click", e => {
        e.stopPropagation();

        if(likeHecho){
            // Quitar like
            numLikes -= 1;
            likeHecho = false;
            corazon.classList.remove("like-hecho");
        } else {
            // Dar like
            numLikes += 1;
            likeHecho = true;
            corazon.classList.add("like-hecho");
            corazon.style.transform = "scale(1.3)";
            setTimeout(() => corazon.style.transform = "scale(1.2)", 150);
        }

        likes.textContent = ` ${numLikes}`;

        // Guardar en localStorage
        likesEstado[respuestaID] = { numLikes, likeHecho };
        localStorage.setItem("likesEstado", JSON.stringify(likesEstado));
    });

    likeContainer.appendChild(corazon);
    likeContainer.appendChild(likes);
    li.appendChild(likeContainer);

    return li;
}

// ====== GESTION DE CLICK EN LOS TEMAS ======
const temas = document.querySelectorAll(".tema");

temas.forEach(tema => {
    tema.addEventListener("click", () => {
        const existingList = tema.querySelector(".respuestas");

        // Si ya estaba abierto, cerramos
        if(existingList){
            existingList.remove();
            const formExistente = tema.querySelector(".nueva-respuesta-form");
            if(formExistente) formExistente.remove();
            tema.classList.remove("activo");
            return;
        }

        // Cerramos otros temas abiertos
        temas.forEach(t => {
            t.classList.remove("activo");
            const lista = t.querySelector(".respuestas");
            if(lista) lista.remove();
            const form = t.querySelector(".nueva-respuesta-form");
            if(form) form.remove();
        });

        // Abrimos este tema
        const titulo = tema.querySelector(".titulo").textContent;
        const listaRespuestas = respuestas[titulo] || [];

        // Crear lista de respuestas
        const ul = document.createElement("ul");
        ul.classList.add("respuestas");

        listaRespuestas.forEach((resp, idx) => {
            const li = crearRespuestaTexto(resp, titulo, idx);
            ul.appendChild(li);
        });

        tema.appendChild(ul);

        // Crear formulario nueva respuesta
        const form = document.createElement("form");
        form.classList.add("nueva-respuesta-form");
        form.innerHTML = `
            <input type="text" placeholder="Escribe tu respuesta..." required>
            <button type="submit">Responder</button>
        `;
        tema.appendChild(form);

        form.addEventListener("click", e => e.stopPropagation());

        // Enviar nueva respuesta
        form.addEventListener("submit", e => {
            e.preventDefault();
            const input = form.querySelector("input");
            const nuevoTexto = input.value.trim();
            if(nuevoTexto === "") return;

            // Añadir al array
            if(!respuestas[titulo]) respuestas[titulo] = [];
            respuestas[titulo].push(nuevoTexto);

            // Guardar en localStorage
            localStorage.setItem("respuestas", JSON.stringify(respuestas));

            // Añadir visualmente
            const li = crearRespuestaTexto(nuevoTexto, titulo, respuestas[titulo].length - 1);
            ul.appendChild(li);

            input.value = "";

            // Actualizar contador
            const info = tema.querySelector(".info");
            const numRespuestas = respuestas[titulo].length;
            info.textContent = `• ${numRespuestas} respuesta${numRespuestas !== 1 ? 's' : ''}`;
        });

        // Marcar tema activo
        tema.classList.add("activo");
    });
});
