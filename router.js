// Función para cargar un archivo HTML en un contenedor
const loadHTML = ({ containerId, filePath }) => {
    fetch(filePath)
        .then((response) => {
            if (response.ok) return response.text();
            throw new Error("Error al cargar el archivo: " + filePath);
        })
        .then((html) => {
            document.getElementById(containerId).innerHTML = html;
        })
        .catch((error) => console.error(error));
};

//Función encargada de cambiar la vista dentro del child(root) del layout
const changeViewsByDataView = ({ view = 'home' }) => {
    if (view) {
        loadHTML({ containerId: "root", filePath: `views/${view}.html` });
    }
};

// Cargar el nav
loadHTML({ containerId: "nav-container", filePath: "layout/nav.html" });

//Inicializa en el home
loadHTML({ containerId: "root", filePath: "views/home.html" });

//Carga footer
loadHTML({ containerId: "footer-container", filePath: "layout/footer.html" });