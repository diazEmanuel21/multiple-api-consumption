// Función para cargar un archivo HTML en un contenedor
const loadHTML = ({ containerId, filePath }) => {
    return fetch(filePath)
        .then((response) => {
            if (response.ok) return response.text();
            throw new Error("Error al cargar el archivo: " + filePath);
        })
        .then((html) => {
            document.getElementById(containerId).innerHTML = html;
        })
        .catch((error) => console.error(error));
};

// Función para cargar dinámicamente un css
const loadCSS = (cssPath) => {
    const existingLink = document.querySelector(`link[href="${cssPath}"]`);
    if (!existingLink) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cssPath;
        document.head.appendChild(link);
    }
};

// Función para cargar dinámicamente un script
const loadScript = (scriptPath) => {
    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${scriptPath}"]`);
        if (existingScript) {
            existingScript.remove(); // Elimina el script anterior para evitar conflictos
        }
        const script = document.createElement("script");
        script.src = scriptPath;
        script.async = true; // Permite carga asíncrona
        script.onload = resolve; // Llama a resolve cuando el script se carga
        script.onerror = reject; // Llama a reject si ocurre un error
        document.body.appendChild(script); // Agrega el script al DOM
    });
};

// Función para cambiar vistas y manejar scripts
const changeViewsByDataView = async ({ view = 'home' }) => {
    if (view) {
        try {
            // Carga el HTML del módulo
            await loadHTML({ containerId: "root", filePath: `modules/${view}/${view}.html` });

            // Carga el script del módulo
            await loadScript(`modules/${view}/${view}.js`);

            // Carga la hoja de estilo del módulo
            loadCSS(`modules/${view}/${view}.css`);

            console.log(`Vista, script y estilos cargados para el módulo: ${view}`);
        } catch (error) {
            console.error("Error al cambiar la vista:", error);
        }
    }
};

// Cargar el nav
loadHTML({ containerId: "nav-container", filePath: "layout/nav.html" });

// Inicializa en el home
changeViewsByDataView({ view: 'home' });

// Carga footer
loadHTML({ containerId: "footer-container", filePath: "layout/footer.html" });