const pokedex = document.getElementById('pokedex');
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

async function fetchPokemon(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await res.json();
  return data;
}

async function loadFavoritos() {
  pokedex.innerHTML = '';

  if (favoritos.length === 0) {
    pokedex.innerHTML = '<p>No tienes Pokémon favoritos aún 💔</p>';
    return;
  }

  for (const id of favoritos) {
    const pokemon = await fetchPokemon(id);
    const types = pokemon.types.map(t => t.type.name);

    const card = document.createElement('article');
    card.classList.add('pokemon-card');
    card.innerHTML = `
      <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <div class="pokemon-types">
        ${types.map(t => `<span class="type ${t}">${t}</span>`).join('')}
      </div>
      <button class="fav-btn" data-id="${pokemon.id}">💔 Quitar</button>
    `;
    pokedex.appendChild(card);
  }

  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', removeFavorito);
  });
}

function removeFavorito(e) {
  const id = parseInt(e.target.dataset.id);
  favoritos = favoritos.filter(favId => favId !== id);
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  loadFavoritos();
}

loadFavoritos();
