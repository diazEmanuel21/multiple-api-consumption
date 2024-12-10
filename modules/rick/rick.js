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
                renderPagination(response.info.count, limit, offset);
            },
            error: (error) => {
                console.error("Error fetching characters:", error);
            },
        });
    };

    // Function to render characters
    const renderCharacters = (characters) => {
        charactersContainer.empty();
        characters.forEach((character) => {
            const characterCard = `
                <div class="character-card">
                    <img src="${character.image}" alt="${character.name}">
                    <div class="info">
                        <h2>${character.name}</h2>
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
        fetchAndRenderCharacters(limit, currentOffset);
    });
})();
