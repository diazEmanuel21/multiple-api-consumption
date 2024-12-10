const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
let currentOffset = 0; // Para paginación dinámica

/**
 * Función para obtener y renderizar la lista de Pokémon con detalles adicionales.
 * @param {number} limit - Número de Pokémon por página.
 * @param {number} offset - Desplazamiento para paginar.
 */
function fetchAndRenderPokemon(limit = 10, offset = 0) {
    $.ajax({
        url: `${BASE_URL}?limit=${limit}&offset=${offset}`,
        method: "GET",
        success: function (response) {
            const pokemonList = response.results;
            const $container = $("#pokemon-container");
            $container.empty(); // Limpiar el contenedor antes de renderizar

            // Generar promesas para obtener detalles de cada Pokémon
            const pokemonPromises = pokemonList.map(pokemon => fetchPokemonDetails(pokemon.url));

            // Esperar a que todas las solicitudes de detalles se completen
            Promise.all(pokemonPromises).then(pokemonDetailsList => {
                pokemonDetailsList.forEach(pokemon => {
                    $container.append(`
                        <div class="card pokemon-card">
                            <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                            <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
                            <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
                            <p><strong>Habilidades:</strong> ${pokemon.abilities.map(a => a.ability.name).join(", ")}</p>
                        </div>
                    `);
                });
            });

            renderPagination(response.count, limit, offset); // Renderizar paginación dinámica
        },
        error: function () {
            alert("Hubo un error al cargar los Pokémon. Por favor, inténtalo nuevamente.");
        },
    });
}

/**
 * Función para obtener detalles de un Pokémon usando su URL.
 * @param {string} url - URL para obtener los detalles del Pokémon.
 * @returns {Promise}
 */
function fetchPokemonDetails(url) {
    return $.ajax({
        url: url,
        method: "GET",
    });
}

/**
 * Función para crear y manejar la paginación dinámica.
 * @param {number} total - Total de Pokémon disponibles.
 * @param {number} limit - Número de Pokémon por página.
 * @param {number} offset - Desplazamiento actual.
 */
function renderPagination(total, limit, offset) {
    const $pagination = $("#pagination");
    $pagination.empty(); // Limpiar la paginación existente

    // Botón de página anterior
    if (offset > 0) {
        $pagination.append(`<button class="button is-info is-dark" id="prev-page">Anterior</button>`);
    }

    // Botón de página siguiente
    if (offset + limit < total) {
        $pagination.append(`<button class="button is-info is-dark" id="next-page">Siguiente</button>`);
    }

    // Manejar eventos de paginación
    $("#prev-page").on("click", () => {
        currentOffset = Math.max(0, offset - limit);
        fetchAndRenderPokemon(limit, currentOffset);
    });

    $("#next-page").on("click", () => {
        currentOffset = offset + limit;
        fetchAndRenderPokemon(limit, currentOffset);
    });
}

// Inicialización
$(document).ready(function () {
    fetchAndRenderPokemon(10, 0); // Renderizar la primera página
});
