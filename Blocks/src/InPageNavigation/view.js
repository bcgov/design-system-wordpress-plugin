/**
 * In-Page Navigation Block Frontend JavaScript
 *
 * Handles the interactive functionality of the In-Page Navigation block:
 *
 * @since 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    const navigationBlocks = document.querySelectorAll('.wp-block-design-system-wordpress-plugin-in-page-navigation');
    
    navigationBlocks.forEach(navBlock => {
        const navList = navBlock.querySelector('ul');
        const h2Elements = document.querySelectorAll('h2[id]');
        
        h2Elements.forEach(heading => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            
            a.href = `#${heading.id}`;
            a.textContent = heading.textContent;
            
            li.appendChild(a);
            navList.appendChild(li);
        });
    });
});
