const pokedex = document.getElementById('pokedex');
const searchInput = document.getElementById('search');
const typeFilter = document.getElementById('type-filter');
const weightFilter = document.getElementById('max-weight');
const loadMoreBtn = document.getElementById('load-more');

let offset = 1;
const limit = 20;
let allPokemon = [];

// Cargar tipos en el filtro
async function loadTypes() {
  const res = await fetch('https://pokeapi.co/api/v2/type/');
  const data = await res.json();
  data.results.forEach(t => {
    const option = document.createElement('option');
    option.value = t.name;
    option.textContent = t.name;
    typeFilter.appendChild(option);
  });
}

// Fetch Pokémon por id
async function fetchPokemon(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await res.json();
  return data;
}

// Cargar un lote de Pokémon
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
    const weight = pokemon.weight / 10;

    const matchesName = pokemon.name.includes(nameTerm);
    const matchesType = typeTerm === '' || types.includes(typeTerm);
    const matchesWeight = weight <= weightTerm;

    if (matchesName && matchesType && matchesWeight) {
      const card = document.createElement('article');
      card.classList.add('pokemon-card');

      const isFav = favoritos.includes(pokemon.id);

      card.innerHTML = `
        <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <img loading="lazy" src="${pokemon.sprites.front_default}" alt="Imagen del Pokémon ${pokemon.name}, tipo ${types.join(', ')}">
        <div class="pokemon-types">
          ${types.map(t => `<span class="type ${t}">${t}</span>`).join('')}
        </div>
        <p>Peso: ${weight} kg</p>
        <p>Altura: ${pokemon.height / 10} m</p>
        <button class="fav-btn" data-id="${pokemon.id}">
          ${isFav ? '💖 Quitar' : '🤍 Favorito'} 
        </button>
      `;

      pokedex.appendChild(card);
    }
  });

  // Agregar eventos a los botones de favorito
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', toggleFavorito);
  });
}

function toggleFavorito(e) {
  const id = parseInt(e.target.dataset.id);
  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(favId => favId !== id);
  } else {
    favoritos.push(id);
  }

  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  displayPokemon(); // Actualiza los botones
}


// Event listeners
searchInput.addEventListener('input', displayPokemon);
typeFilter.addEventListener('change', displayPokemon);
weightFilter.addEventListener('input', displayPokemon);
loadMoreBtn.addEventListener('click', loadPokemonBatch);

// Inicializar
loadTypes();
loadPokemonBatch();
