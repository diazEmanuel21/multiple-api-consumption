(() => {
    const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
    const IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/ID_IMAGE_CUSTOM.svg"
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

    const statNameMapping = {
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SATK",
        "special-defense": "SDEF",
        speed: "SPD",
    };


    const createStatElement = ({ base_stat, stat }, mainColor) => {
        const displayName = statNameMapping[stat.name] || stat.name.toUpperCase();
        return `
            <div class="stats-wrap" data-stat="${stat.name}">
                <p class="body3-fonts stats" style="color: ${mainColor};">${displayName}</p>
                <p class="body3-fonts">${base_stat}</p>
                <progress value="${base_stat}" max="100" class="progress-bar" style="--progress-color: ${mainColor};"></progress>
            </div>
        `;
    };

    const createStatsHTML = (stats, mainColor) => {
        return stats.map(stat => createStatElement(stat, mainColor)).join("");
    };

    const createAbilityHTML = (abilities) => abilities.map(({ ability }) => `<p class="body3-fonts abilities-pokemon">${ability.name},</p>`).join("");

    /**
     * Función para actualizar la interfaz de usuario con los datos del Pokémon.
     * @param {Object} pokemon - Datos del Pokémon.
     * @returns {string} - HTML de la tarjeta del Pokémon.
     */
    const updateUI = (pokemon) => {
        const mainColor = typeColors[pokemon.types[0].type.name];
        const idPokemon = pokemon.id.toString().padStart(3, "0");
        const typesHTML = pokemon.types
            .map((type) => createTypeElement(type.type.name))
            .join("");

        return `
            <div id="pokedex" class="card pokemon-card" style="background-color: ${mainColor};">
                <div id="top">
                    <div id="top-bar">
                        <h6 class="pokemon-name">${pokemon.name}</h6>
                        <span id="number">#${idPokemon}</span>
                    </div>
                    <div id="poke-image-placeholder">
                        <img src="${IMG_URL.replace(
            "ID_IMAGE_CUSTOM",
            pokemon.id
        )}" id="pokemon-image" alt="${pokemon.name}">
                    </div>
                </div>
                <div class="detail-card-detail-wrapper">
                    <div id="types" class="power-wrapper">${typesHTML}</div>
                    <div class="pokemon-detail-wrapper">
                        <div class="pokemon-detail-wrap">
                            <div class="pokemon-detail">
                                <i class="fa-solid fa-weight-hanging"></i>
                                <p class="body3-fonts weight">${pokemon.weight / 10} kg</p>
                            </div>
                            <p class="caption-fonts">Weight</p>
                        </div>
                        <div class="pokemon-detail-wrap">
                            <div class="pokemon-detail">
                                <i class="fa-solid fa-ruler-vertical"></i>
                                <p class="body3-fonts height">${pokemon.height / 10} m</p>
                            </div>
                            <p class="caption-fonts">Height</p>
                        </div>
                        <div class="pokemon-detail-wrap">
                            <div class="pokemon-detail move">
                                ${createAbilityHTML(pokemon.abilities)}
                            </div>
                            <p class="caption-fonts">Move</p>
                        </div>
                    </div>
                    <p class="body3-fonts pokemon-description"></p>
                    <div class="stats-wrapper">
                        ${createStatsHTML(pokemon.stats, mainColor)}
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

                renderSearch(); //Renderizar el search
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
     * Función para buscar.
     */
    const filterCards = () => {
        const $containerCards = $("#pokemon-container");
        const query = $("#search-input").val().toLowerCase();

        // Filtrar las tarjetas que coincidan con el texto ingresado
        $containerCards.children(".card").each(function () {
            const $card = $(this);
            const name = $card.find(".pokemon-name").text().toLowerCase();

            $card.toggle(name.includes(query)); // Mostrar u ocultar las tarjetas
        });
    };

    /**
     * Función para crear y manejar el buscador dinámico.
     */
    function renderSearch() {
        const searchContainer = $("#search-container");
        const currentModule = "pokemon";
        const childrenSearch = searchContainer.children().length;

        if (childrenSearch > 0) return;

        // Crear el HTML del buscador dinámicamente
        searchContainer.append(`
            <div class="navbar-item">
                <div class="field has-addons">
                    <p class="control">
                        <input id="search-input" class="input" type="search" placeholder="Find an ${currentModule}">
                    </p>
                    <p class="control">
                        <button id="search-button" class="button is-primary">
                            <i class="fa-solid fa-magnifying-glass"></i>
                            <span>Search</span>
                        </button>
                    </p>
                </div>
            </div>
        `);

        // Asignar el evento al input y al botón
        $("#search-input").on("input", filterCards);
        $("#search-button").on("click", filterCards);
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
            $pagination.append(`<button class="button is-danger is-dark" id="prev-page">Anterior</button>`);
        }

        // Botón de página siguiente
        if (offset + limit < total) {
            $pagination.append(`<button class="button is-danger is-dark" id="next-page">Siguiente</button>`);
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
        fetchAndRenderPokemon(10, 0);
    });
})();