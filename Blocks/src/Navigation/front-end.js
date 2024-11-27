document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.querySelector('.dswp-navigation-overlay-menu-icon-container');
    const overlay = document.querySelector('.fullscreen-overlay');
    const closeButton = overlay.querySelector('.close-overlay');

    // Open overlay on menu icon click
    if (menuIcon) {
        menuIcon.addEventListener ('click', function() {
            console.log('made it ');
            
            overlay.style.display = 'flex'; // Show the overlay
        });
    }

    // Close overlay on close button click
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            overlay.style.display = 'none'; // Hide the overlay
        });
    }

    // Close overlay when clicking outside of the overlay content
    overlay.addEventListener('click', function(event) {
        if (event.target === overlay) {
            overlay.style.display = 'none'; // Hide the overlay
        }
    });
});