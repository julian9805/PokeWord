
/* ====== ELEMENTOS GLOBALES ====== */
const pokedex = document.getElementById('pokedex');
const searchInput = document.getElementById('search');
const typeFilter = document.getElementById('type-filter');
const weightFilter = document.getElementById('max-weight');
const loadMoreBtn = document.getElementById('load-more');

let offset = 1;
const limit = 20;
let allPokemon = [];

const typeColors = {
    fire: '#ff9c54', water: '#4e9aff', grass: '#78cd54', electric: '#f7d02c',
    psychic: '#ff5587', ice: '#96d9d6', dragon: '#6f35fc', dark: '#705746',
    fairy: '#d685ad', normal: '#a8a77a', fighting: '#c22e28', flying: '#a98ff3',
    poison: '#a33ea1', ground: '#e2bf65', rock: '#b6a136', bug: '#a6b91a',
    ghost: '#735797', steel: '#b7b7ce'
};

/* ====== LÓGICA DE POKEDEX (Solo si existen los elementos) ====== */
if (pokedex) {
    async function loadTypes() {
        try {
            const res = await fetch('https://pokeapi.co/api/v2/type/');
            const data = await res.json();
            data.results.forEach(t => {
                const option = document.createElement('option');
                option.value = t.name;
                option.textContent = t.name;
                typeFilter.appendChild(option);
            });
        } catch (e) { console.error("Error cargando tipos"); }
    }

    async function fetchPokemon(id) {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        return await res.json();
    }

    async function loadPokemonBatch() {
        for (let i = offset; i < offset + limit; i++) {
            const pokemon = await fetchPokemon(i);
            allPokemon.push(pokemon);
        }
        offset += limit;
        displayPokemon();
    }

    function displayPokemon() {
        pokedex.innerHTML = '';
        const nameTerm = searchInput.value.toLowerCase();
        const typeTerm = typeFilter.value;
        const weightTerm = weightFilter.value ? parseFloat(weightFilter.value) : Infinity;
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

        allPokemon.forEach(pokemon => {
            const types = pokemon.types.map(t => t.type.name);
            const mainType = types[0];
            const weight = pokemon.weight / 10;
            const height = pokemon.height / 10;

            if (pokemon.name.includes(nameTerm) && (typeTerm === '' || types.includes(typeTerm)) && weight <= weightTerm) {
                const card = document.createElement('article');
                card.classList.add('pokemon-card');
                card.style.boxShadow = `0 8px 20px rgba(0, 0, 0, 0.1), inset 0 0 0 3px ${typeColors[mainType] || '#2a75bb'}`;
                const isFav = favoritos.includes(pokemon.id);

                card.innerHTML = `
                    <div class="img-container">
                        <img loading="lazy" src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" alt="${pokemon.name}">
                    </div>
                    <h3>${pokemon.name}</h3>
                    <div class="pokemon-types">${types.map(t => `<span class="type-badge" style="background-color: ${typeColors[t] || '#777'}">${t}</span>`).join('')}</div>
                    <div class="pokemon-info"><span>${weight} kg</span><span>${height} m</span></div>
                    <button class="fav-btn" data-id="${pokemon.id}" style="background-color: ${isFav ? '#ff5587' : '#fac800'}">
                        ${isFav ? '💖 Quitar' : '🤍 Favorito'} 
                    </button>`;
                pokedex.appendChild(card);
            }
        });

        document.querySelectorAll('.fav-btn').forEach(btn => btn.onclick = toggleFavorito);
    }

    function toggleFavorito(e) {
        const id = parseInt(e.target.dataset.id);
        let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        favoritos = favoritos.includes(id) ? favoritos.filter(f => f !== id) : [...favoritos, id];
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        displayPokemon();
    }

    // Event Listeners de Pokedex
    searchInput.addEventListener('input', displayPokemon);
    typeFilter.addEventListener('change', displayPokemon);
    weightFilter.addEventListener('input', displayPokemon);
    loadMoreBtn.addEventListener('click', loadPokemonBatch);

    loadTypes();
    loadPokemonBatch();
}

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