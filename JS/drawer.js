$(document).on('click', '#open-drawer-btn', () => {
  const drawer = $('#drawer');
  const drawerOverlay = $('#drawer-overlay');

  if (drawer.hasClass('show')) return;
  drawer.addClass('show');
  drawerOverlay.addClass('show').removeClass('hide-element');
});

$(document).on('click', '#close-drawer-btn', () => {
  const drawer = $('#drawer');
  const drawerOverlay = $('#drawer-overlay');

  drawer.removeClass('show');
  drawerOverlay.removeClass('show');
  setTimeout(() => drawerOverlay.addClass('hide-element'), 300);
});

$(document).on('click', '#drawer-overlay', () => {
  const drawer = $('#drawer');
  const drawerOverlay = $('#drawer-overlay');

  drawer.removeClass('show');
  drawerOverlay.removeClass('show');
  setTimeout(() => drawerOverlay.addClass('hide-element'), 300);
});

$(document).on('keydown', (e) => {
  if (e.key === 'Escape') {
      const drawer = $('#drawer');
      const drawerOverlay = $('#drawer-overlay');

      drawer.removeClass('show');
      drawerOverlay.removeClass('show');
      setTimeout(() => drawerOverlay.addClass('hide-element'), 300);
  }
});
