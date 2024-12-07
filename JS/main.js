const showBurgerMenu = () => {
    const asideMenu = $('#aside-menu');
    const containerRouterElements = $('#container-nav-elements');
    const navRouterElements = $('#nav-router-items');

    const childrensContainerRouterElements = containerRouterElements.children().length;

    // Verificar si tiene hijos
    if (childrensContainerRouterElements === 0) {
        containerRouterElements.append(navRouterElements.html());
    };
    /* Ocultar / mostrar */
    if (asideMenu.hasClass('hide-element')) {
        showMenu(asideMenu);
    } else {
        hideMenu(asideMenu);
    };
}

// Función para mostrar el menú
const showMenu = (asideMenu) => {
    asideMenu
        .removeClass('hide-element animate__bounceOutUp')
        .addClass('animate__animated animate__bounceInDown');

    // Elimina la clase de animación al terminar
    asideMenu.one('animationend', () => {
        asideMenu.removeClass('animate__animated animate__bounceInDown');
    });
};

// Función para ocultar el menú
const hideMenu = (asideMenu) => {
    asideMenu
        .addClass('animate__animated animate__bounceOutUp')
        .one('animationend', () => {
            asideMenu.addClass('hide-element').removeClass('animate__animated animate__bounceOutUp');
        });
};

// Manejar clics fuera del menú o en elementos específicos
const handleOutsideClick = () => {
    const asideMenu = $('#aside-menu');
    hideMenu(asideMenu);
};