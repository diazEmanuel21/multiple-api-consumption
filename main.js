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
        asideMenu
            .removeClass('hide-element animate__bounceOutUp') // Asegura que no haya clases conflictivas
            .addClass('animate__animated animate__bounceInDown');

        // Elimina la clase de animación al terminar
        asideMenu.one('animationend', () => {
            asideMenu.removeClass('animate__animated animate__bounceInDown');
        });
    } else {
        asideMenu
            .addClass('animate__animated animate__bounceOutUp')
            .one('animationend', () => {
                asideMenu.addClass('hide-element').removeClass('animate__animated animate__bounceOutUp');
            });
    };
}