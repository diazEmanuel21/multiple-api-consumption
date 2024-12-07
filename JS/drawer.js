const drawer = $('#drawer');
const drawerOverlay = $('#drawer-overlay');

// Abrir Drawer
const openDrawer = () => {
  if (drawer.hasClass('show')) return;
  drawer.addClass('show');
  drawerOverlay.addClass('show');
  drawerOverlay.removeClass('hide-element');
};

// Cerrar Drawer
const closeDrawer = () => {
  drawer.removeClass('show');
  drawerOverlay.removeClass('show');
  setTimeout(() => drawerOverlay.addClass('hide-element'), 300);
};

// Eventos
$('#open-drawer-btn').on('click', openDrawer);
$('#close-drawer-btn').on('click', closeDrawer);
drawerOverlay.on('click', closeDrawer);

// Cerrar con tecla ESC
$(document).on('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDrawer();
  }
});