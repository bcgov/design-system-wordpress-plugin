// in-page-nav.js
document.addEventListener('DOMContentLoaded', function() {
    // Create the navigation container
    const navContainer = document.createElement('nav');
    navContainer.classList.add('in-page-nav-container');

    // Create and add the "On this page" heading
    const heading = document.createElement('h6');
    heading.textContent = 'On this page';
    navContainer.appendChild(heading);

    // Find all H2s with IDs
    const headings = document.querySelectorAll('h2[id]');
    
    if (headings.length > 0) {
        const ul = document.createElement('ul');
        
        headings.forEach(heading => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${heading.id}`;
            a.textContent = heading.textContent;
            li.appendChild(a);
            ul.appendChild(li);
        });

        navContainer.appendChild(ul);
        document.body.appendChild(navContainer);
    }
});