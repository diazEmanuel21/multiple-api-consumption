$(document).ready(function () {
    // URL de la API para obtener los primeros 20 Pokémon
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=20';
  
    // Función para cargar los datos de los Pokémon
    function loadPokemon() {
      $.ajax({
        url: apiUrl,
        method: 'GET',
        success: function (response) {
          const pokemonResults = response.results; // Lista de Pokémon
          pokemonResults.forEach((pokemon) => {
            // Realiza una nueva solicitud para obtener más detalles de cada Pokémon
            $.ajax({
              url: pokemon.url,
              method: 'GET',
              success: function (details) {
                renderPokemon(details); // Renderiza cada Pokémon en la lista
              },
              error: function () {
                console.error('Error al obtener los detalles del Pokémon.');
              },
            });
          });
        },
        error: function () {
          console.error('Error al obtener los datos de la API.');
        },
      });
    }
  
    // Función para renderizar un Pokémon
    function renderPokemon(pokemon) {
      const pokemonHtml = `
        <div class="pokemonCard">
          <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
          <h3>${pokemon.name.toUpperCase()}</h3>
          <p>ID: ${pokemon.id}</p>
          <p>Tipo: ${pokemon.types.map((type) => type.type.name).join(', ')}</p>
        </div>
      `;
      $('#pokemonList').append(pokemonHtml); // Agrega la tarjeta al contenedor
    }
  
    // Llama a la función para cargar los Pokémon al iniciar
    loadPokemon();
  });
  