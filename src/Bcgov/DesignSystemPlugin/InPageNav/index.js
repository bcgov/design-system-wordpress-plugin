// Import the styles for the in-page navigation
import './styles.css';  

/**
 * In-page Navigation Script
 * Creates a navigation menu that links to all H2 headings on the page
 */
document.addEventListener('DOMContentLoaded', () => {
    /**
     * Safely escapes HTML special characters to prevent XSS attacks
     * @param {string} str - The string to escape
     * @returns {string} - The escaped HTML string
     */
    const escapeHTML = (str) => {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    };

    /**
     * Creates and inserts the in-page navigation into the DOM
     * Only creates navigation if H2 elements with IDs exist on the page
     */
    const createNavigation = () => {
        // Convert NodeList to Array for better method access
        // Only select H2 elements that have an ID attribute
        const headings = Array.from(document.querySelectorAll('h2[id]'));

        // Don't create navigation if there are no valid headings
        if (headings.length === 0) return;

        // Create the navigation HTML structure using template literals
        // This is more efficient than creating multiple DOM elements
        const navHTML = `
            <nav class="in-page-nav-container">
                <h6>On this page</h6>
                <ul>
                    ${headings
                        // Transform each heading into a list item with a link
                        .map(heading => `
                            <li>
                                <a href="#${heading.id}">${escapeHTML(heading.textContent)}</a>
                            </li>
                        `)
                        // Join all list items into a single string
                        .join('')}
                </ul>
            </nav>
        `;

        // Insert the complete navigation HTML at the end of the body
        // Using insertAdjacentHTML is more efficient than createElement
        document.body.insertAdjacentHTML('beforeend', navHTML);
    };

    // Initialize the navigation when the DOM is fully loaded
    createNavigation();
});