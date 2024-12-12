(() => {
    const apiURL = "https://api.jikan.moe/v4/anime";
    const animeContainer = $("#anime-container");
    const $pagination = $("#pagination");
    let currentPage = 1;
    const limit = 20; // Anime per page

    // Function to fetch and render anime
    const fetchAndRenderAnime = (page) => {
        $.ajax({
            url: `${apiURL}?page=${page}`,
            method: "GET",
            success: (response) => {
                renderAnime(response.data);
                renderSearch()
                renderPagination(response.pagination);
            },
            error: (error) => {
                console.error("Error fetching anime:", error);
            },
        });
    };

    // Function to render anime
    const renderAnime = (animeList) => {
        animeContainer.empty();
        animeList.forEach((anime) => {
            const animeCard = `
                <div class="card anime-card">
                    <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                    <div class="info">
                        <h2 class="name-anime">${anime.title}</h2>
                        <p>Score: ${anime.score || "N/A"}</p>
                        <p>Episodes: ${anime.episodes || "N/A"}</p>
                    </div>
                </div>
            `;
            animeContainer.append(animeCard);
        });
    };

    /**
    * Función para buscar.
    */
    const filterCards = () => {
        const $containerCards = $("#anime-container");
        const query = $("#search-input").val().toLowerCase();

        // Filtrar las tarjetas que coincidan con el texto ingresado
        $containerCards.children(".card").each(function () {
            const $card = $(this);
            const name = $card.find(".name-anime").text().toLowerCase();

            $card.toggle(name.includes(query)); // Mostrar u ocultar las tarjetas
        });
    };

    /**
     * Función para crear y manejar el buscador dinámico.
     */
    function renderSearch() {
        const searchContainer = $("#search-container");
        const currentModule = "character";
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

    // Function to create pagination buttons
    const renderPagination = (pagination) => {
        $pagination.empty();

        if (pagination.current_page > 1) {
            $pagination.append(`<button class="button is-warning" id="prev-page">Anterior</button>`);
        }

        if (pagination.has_next_page) {
            $pagination.append(`<button class="button is-warning" id="next-page">Siguiente</button>`);
        }

        // Pagination Event Handlers
        $("#prev-page").on("click", () => {
            currentPage = Math.max(1, currentPage - 1);
            fetchAndRenderAnime(currentPage);
        });

        $("#next-page").on("click", () => {
            currentPage += 1;
            fetchAndRenderAnime(currentPage);
        });
    };

    // Initial Fetch
    $(document).ready(() => {
        fetchAndRenderAnime(currentPage);
    });
})();



