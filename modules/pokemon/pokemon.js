(() => {
    const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
    let currentOffset = 0; // Para paginación dinámica

    // Colores de los tipos
    const typeColors = {
        normal: "#A8A878",
        fire: "#F08030",
        water: "#6890F0",
        electric: "#F8D030",
        grass: "#78C850",
        ice: "#98D8D8",
        fighting: "#C03028",
        poison: "#A040A0",
        ground: "#E0C068",
        flying: "#A890F0",
        psychic: "#F85888",
        bug: "#A8B820",
        rock: "#B8A038",
        ghost: "#705898",
        dragon: "#7038F8",
        dark: "#705848",
        steel: "#B8B8D0",
        dark: "#EE99AC",
    };


    /**
     * Función para actualizar la interfaz de usuario con los datos del Pokémon.
     * @param {Object} pokemon - Datos del Pokémon.
     * @returns {string} - HTML de la tarjeta del Pokémon.
     */
    const updateUI = (pokemon) => {
        const mainColor = typeColors[pokemon.types[0].type.name];
        // Crear burbujas de tipo
        const typesHTML = pokemon.types.map((type) => createTypeElement(type.type.name)).join("");

        return `
            <div id="pokedex" class="card pokemon-card" style="background-color: ${mainColor};">
                <div id="top">
                    <div id="top-bar">
                        <h6>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h6>
                        <span id="number">#${pokemon.id.toString().padStart(3, "0")}</span>
                    </div>
                    <div id="poke-image-placeholder">
                        <img src="${pokemon.sprites.front_default}" id="pokemon-image" alt="${pokemon.name}">
                    </div>
                </div>
                <div id="data">
                    <div id="types">${typesHTML}</div>
                    <div class="description-pokemon">
                        <h4 id="base-data" style="color: ${mainColor};">About</h4>
                        <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
                        <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
                        <p><strong>Habilidades:</strong> ${pokemon.abilities.map((a) => a.ability.name).join(", ")}</p>
                    </div>
                </div>
            </div>
        `;
    };

    /**
     * Función para crear los elementos de tipo (burbujas de tipo).
     * @param {string} typeName - Nombre del tipo.
     * @returns {string} - HTML del elemento tipo.
     */
    const createTypeElement = (typeName) => {
        const color = typeColors[typeName];
        return `<span class="type" style="background-color: ${color}">${typeName}</span>`;
    };

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
                const pokemonPromises = pokemonList.map((pokemon) => fetchPokemonDetails(pokemon.url));

                // Esperar a que todas las solicitudes de detalles se completen
                Promise.all(pokemonPromises).then((pokemonDetailsList) => {
                    pokemonDetailsList.forEach((pokemon) => {
                        $container.append(updateUI(pokemon));
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
})();