// ====== DATOS DE RESPUESTAS ======
const respuestas = {
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

// Llamada inicial al cargar la página
actualizarNumeroRespuestas();

// ====== FUNCION PARA CREAR UNA RESPUESTA CON LIKE ======
function crearRespuestaTexto(texto) {
    const li = document.createElement("li");
    li.classList.add("respuesta-item");
    li.textContent = texto;

    // Contenedor de like
    const likeContainer = document.createElement("span");
    likeContainer.classList.add("like-container");

    // Corazón
    const corazon = document.createElement("span");
    corazon.classList.add("corazon");
    corazon.textContent = "❤️";

    // Número de likes aleatorio inicial
    const likes = document.createElement("span");
    likes.classList.add("num-likes");
    let numLikes = Math.floor(Math.random() * 100); // entre 0 y 99
    likes.textContent = ` ${numLikes}`;

    //Controlar si ya se hizo click o no
    let likeHecho = false;

    // Al hacer click en el corazón
    corazon.addEventListener("click", e => {
        e.stopPropagation(); // evitar cerrar el tema
        numLikes += 1;
        likes.textContent = ` ${numLikes}`;
        likeHecho = true;
        corazon.style.opacity = 0.6;
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

        // Si ya estaba abierto, lo cerramos
        if (existingList) {
            existingList.remove();
            const formExistente = tema.querySelector(".nueva-respuesta-form");
            if (formExistente) formExistente.remove();
            tema.classList.remove("activo");
            return;
        }

        // Cerramos otros temas abiertos
        temas.forEach(t => {
            t.classList.remove("activo");
            const lista = t.querySelector(".respuestas");
            if (lista) lista.remove();
            const form = t.querySelector(".nueva-respuesta-form");
            if (form) form.remove();
        });

        // Abrimos este tema
        const titulo = tema.querySelector(".titulo").textContent;
        const listaRespuestas = respuestas[titulo] || [];

        // Crear la lista de respuestas
        const ul = document.createElement("ul");
        ul.classList.add("respuestas");
        listaRespuestas.forEach(resp => {
            const li = crearRespuestaTexto(resp);
            ul.appendChild(li);
        });
        tema.appendChild(ul);

        // Crear formulario para nueva respuesta
        const form = document.createElement("form");
        form.classList.add("nueva-respuesta-form");
        form.innerHTML = `
            <input type="text" placeholder="Escribe tu respuesta..." required>
            <button type="submit">Responder</button>
        `;
        tema.appendChild(form);

        // Evitar que el click en el formulario cierre el tema
        form.addEventListener("click", e => {
            e.stopPropagation();
        });

        // Enviar nueva respuesta
        form.addEventListener("submit", e => {
            e.preventDefault();
            const input = form.querySelector("input");
            const nuevoTexto = input.value.trim();
            if (nuevoTexto === "") return;

            // Añadir al array de respuestas
            if (!respuestas[titulo]) respuestas[titulo] = [];
            respuestas[titulo].push(nuevoTexto);

            // Añadir a la lista visual
            const li = crearRespuestaTexto(nuevoTexto);
            ul.appendChild(li);

            // Limpiar input
            input.value = "";

            // Actualizar contador
            const info = tema.querySelector(".info");
            const numRespuestas = respuestas[titulo].length;
            info.textContent = `• ${numRespuestas} respuesta${numRespuestas !== 1 ? 's' : ''}`;
        });

        // Marcamos el tema como activo
        tema.classList.add("activo");
    });
});
