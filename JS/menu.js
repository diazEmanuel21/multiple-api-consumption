// Referencias
const menuOverlay = $('<div id="menu-overlay" class="menu-overlay hide-element"></div>');
$('body').append(menuOverlay); // Agregar overlay al DOM

// Mostrar el menú
const showBurgerMenu = () => {
    const asideMenu = $('#aside-menu');
    const containerRouterElements = $('#container-nav-elements');
    const navRouterElements = $('#nav-router-items');

    const childrensContainerRouterElements = containerRouterElements.children().length;

    // Verificar si tiene hijos
    if (childrensContainerRouterElements === 0) {
        containerRouterElements.append(navRouterElements.html());
    }

    // Mostrar menú y overlay
    asideMenu
        .removeClass('hide-element animate__slideOutRight')
        .addClass('animate__animated animate__slideInRight show');

    menuOverlay
        .removeClass('hide-element')
        .addClass('show');
};

// Ocultar el menú
const hideBurgerMenu = () => {
    const asideMenu = $('#aside-menu');

    asideMenu
        .removeClass('animate__slideInRight show')
        .addClass('animate__slideOutRight')
        .one('animationend', () => {
            asideMenu.addClass('hide-element').removeClass('animate__slideOutRight');
        });

    menuOverlay
        .removeClass('show')
        .addClass('hide-element');
};

// Manejar clics en el overlay para cerrar el menú
menuOverlay.on('click', hideBurgerMenu);

// Manejar teclas como Escape para cerrar el menú
$(document).on('keydown', (e) => {
    if (e.key === 'Escape') {
        hideBurgerMenu();
    }
});

// Mostrar menú al hacer clic en el botón
$('#burger-button').on('click', showBurgerMenu);