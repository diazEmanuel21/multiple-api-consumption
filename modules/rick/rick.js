(() => {
    const apiURL = "https://rickandmortyapi.com/api/character";
    const charactersContainer = $("#characters-container");
    const $pagination = $("#pagination");
    let currentOffset = 0;
    const limit = 20; // Characters per page

    // Function to fetch and render characters
    const fetchAndRenderCharacters = (limit, offset) => {
        $.ajax({
            url: `${apiURL}?page=${Math.ceil(offset / limit) + 1}`,
            method: "GET",
            success: (response) => {
                renderCharacters(response.results);
                renderSearch(); //Renderizar el search
                renderPagination(response.info.count, limit, offset);
                $('#loading-screen').hide();
            },
            error: (error) => {
                alert(`Error fetching characters:, ${error}`);
            },
        });
    };

    /**
        * Función para buscar.
    */
    const filterCards = () => {
        const $containerCards = $("#characters-container");
        const query = $("#search-input").val().toLowerCase();

        // Filtrar las tarjetas que coincidan con el texto ingresado
        $containerCards.children(".card").each(function () {
            const $card = $(this);
            const name = $card.find(".character-name").text().toLowerCase();

            $card.toggle(name.includes(query)); // Mostrar u ocultar las tarjetas
        });
    };

    /**
     * Función para crear y manejar el buscador dinámico.
     */
    function renderSearch() {
        // Asignar el evento al input y al botón
        $("#search-input").on("input", filterCards);
        $("#search-button").on("click", filterCards);
    }

    // Function to render characters
    const renderCharacters = (characters) => {
        charactersContainer.empty();
        characters.forEach((character) => {
            const characterCard = `
                <div class="card character-card">
                    <img src="${character.image}" alt="${character.name}">
                    <div class="info">
                        <h2 class="character-name">${character.name}</h2>
                        <p>Status: ${character.status}</p>
                        <p>Species: ${character.species}</p>
                    </div>
                </div>
            `;
            charactersContainer.append(characterCard);
        });
    };

    // Function to create pagination buttons
    function renderPagination(total, limit, offset) {
        $pagination.empty();
        if (offset > 0) {
            $pagination.append(`<button class="button is-info is-dark" id="prev-page">Anterior</button>`);
        }
        if (offset + limit < total) {
            $pagination.append(`<button class="button is-info is-dark" id="next-page">Siguiente</button>`);
        }

        // Pagination Event Handlers
        $("#prev-page").on("click", () => {
            currentOffset = Math.max(0, offset - limit);
            fetchAndRenderCharacters(limit, currentOffset);
        });

        $("#next-page").on("click", () => {
            currentOffset += limit;
            fetchAndRenderCharacters(limit, currentOffset);
        });
    }

    // Initial Fetch
    $(document).ready(() => {
        $('#loading-screen').show();
        fetchAndRenderCharacters(limit, currentOffset);
    });
})();
