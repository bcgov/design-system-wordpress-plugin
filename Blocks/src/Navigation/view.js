document.addEventListener("DOMContentLoaded", function () {
	const mobileNavIcon = document.querySelector(".dswp-nav-mobile-toggle-icon");
	const mobileNavIconText = document.querySelector(
		".dswp-nav-mobile-menu-icon-text"
	);
	const mobileNavTopBar = document.querySelector(
		".dswp-nav-mobile-menu-top-bar"
	);
	const mobileNavMiddleBar = document.querySelector(
		".dswp-nav-mobile-menu-middle-bar"
	);
	const mobileNavBottomBar = document.querySelector(
		".dswp-nav-mobile-menu-bottom-bar"
	);

	// Open overlay on menu icon click
	if (mobileNavIcon) {
		mobileNavIcon.addEventListener("click", function () {
			mobileNavTopBar.classList.toggle("dswp-nav-mobile-menu-top-bar-open");
			mobileNavMiddleBar.classList.toggle(
				"dswp-nav-mobile-menu-middle-bar-open"
			);
			mobileNavBottomBar.classList.toggle(
				"dswp-nav-mobile-menu-bottom-bar-open"
			);
            console.log('first', mobileNavIconText.innerText)
			if (mobileNavIconText.innerText === "Menu") {
				mobileNavIconText.innerText = "Close menu"; // Change to 'close menu'
			} else {
				mobileNavIconText.innerText = "Menu"; // Change back to 'menu'
			}
		});
	}
});
