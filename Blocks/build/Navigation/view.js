/******/ (() => { // webpackBootstrap
/*!********************************!*\
  !*** ./src/navigation/view.js ***!
  \********************************/
document.addEventListener('DOMContentLoaded', function () {
  const navBlocks = document.querySelectorAll('.wp-block-custom-navigation');
  navBlocks.forEach(nav => {
    const toggleButton = nav.querySelector('.navigation-menu-toggle');
    const menu = nav.querySelector('.wp-block-navigation__container');
    if (toggleButton && menu) {
      toggleButton.addEventListener('click', () => {
        menu.classList.toggle('is-menu-open');
        toggleButton.setAttribute('aria-expanded', menu.classList.contains('is-menu-open'));
      });
    }
  });
});
/******/ })()
;
//# sourceMappingURL=view.js.map