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
                <div class="anime-card">
                    <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                    <div class="info">
                        <h2>${anime.title}</h2>
                        <p>Score: ${anime.score || "N/A"}</p>
                        <p>Episodes: ${anime.episodes || "N/A"}</p>
                    </div>
                </div>
            `;
            animeContainer.append(animeCard);
        });
    };

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



