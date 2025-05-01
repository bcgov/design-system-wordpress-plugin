/**
 * CRITICAL - Button Style Fix
 * 
 * This is a more aggressive approach to fixing button styles
 * using continuous polling and MutationObserver to ensure
 * that styles are applied and maintained even if other scripts
 * override them.
 */

(function() {
  // Define the styles we want to apply (outside function to reduce memory usage)
  const deleteButtonStyles = {
    backgroundColor: '#bc2929 !important',
    color: 'white !important',
    border: '1px solid #bc2929 !important',
    borderRadius: '4px !important',
    height: '30px !important',
    minHeight: '30px !important',
    padding: '0 12px !important',
    fontSize: '13px !important',
    lineHeight: 'normal !important',
    display: 'inline-flex !important',
    alignItems: 'center !important',
    justifyContent: 'center !important',
    boxShadow: 'none !important',
    cursor: 'pointer !important',
    textShadow: 'none !important',
    fontWeight: 'normal !important',
    opacity: '1 !important',
    margin: '0 !important',
    order: '2 !important'  // This will push it to the right in a flex container
  };
  
  const cancelButtonStyles = {
    backgroundColor: '#f6f7f7 !important',
    color: '#555 !important',
    border: '1px solid #ddd !important',
    borderRadius: '4px !important',
    height: '30px !important',
    minHeight: '30px !important',
    padding: '0 12px !important',
    fontSize: '13px !important',
    lineHeight: 'normal !important',
    display: 'inline-flex !important',
    alignItems: 'center !important',
    justifyContent: 'center !important',
    boxShadow: 'none !important',
    cursor: 'pointer !important',
    textShadow: 'none !important',
    fontWeight: 'normal !important',
    opacity: '1 !important',
    margin: '0 !important',
    order: '1 !important'  // This will push it to the left in a flex container
  };

  // Utility function to apply styles with !important
  function applyStyles(element, styles) {
    if (!element) return;
    
    Object.entries(styles).forEach(([property, value]) => {
      const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      element.style.setProperty(cssProperty, value, 'important');
    });
    
    // If styling a button, ensure any spans inside also have correct text color
    if (element.tagName === 'BUTTON' && styles.color) {
      const spans = element.querySelectorAll('span');
      spans.forEach(span => {
        span.style.setProperty('color', styles.color, 'important');
      });
    }
  }

  // Apply the styles to the delete confirmation modal buttons
  function detectAndStyleButtons() {
    // Query all modals
    const modals = document.querySelectorAll('.components-modal__content, .delete-confirmation-content, .components-modal__frame');
    
    modals.forEach(modal => {
      // Find button containers
      const actionContainers = modal.querySelectorAll('.modal-actions, .components-modal__footer');
      
      actionContainers.forEach(container => {
        // Get all buttons in this container
        const buttons = container.querySelectorAll('button');
        if (!buttons.length) return;
        
        const deleteButtons = [];
        const cancelButtons = [];
        
        buttons.forEach(button => {
          // Check if it's a cancel button first
          if (
            button.classList.contains('cancel-button') || 
            /cancel|close|back/i.test(button.textContent)
          ) {
            cancelButtons.push(button);
          }
          // Check if it's a delete/destructive button
          else if (
            button.classList.contains('is-destructive') || 
            button.classList.contains('custom-destructive-button') ||
            button.classList.contains('delete-button') ||
            /delete|remove|trash/i.test(button.textContent)
          ) {
            deleteButtons.push(button);
          } 
          // If we can't determine based on class or text, default to cancel
          else {
            cancelButtons.push(button);
          }
        });
        
        // Apply styles to delete buttons
        deleteButtons.forEach(button => {
          applyStyles(button, {
            backgroundColor: '#bc2929',
            color: 'white',
            borderColor: '#bc2929',
            order: '2'
          });
        });
        
        // Apply styles to cancel buttons
        cancelButtons.forEach(button => {
          applyStyles(button, {
            backgroundColor: '#f6f7f7',
            color: '#555',
            borderColor: '#ddd',
            order: '1'
          });
        });
        
        // Apply styles to container
        applyStyles(container, {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: '0.75rem'
        });
      });
    });
  }

  // Apply the styles as soon as possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      detectAndStyleButtons();
      startWatchers();
      enhanceCloseButtons();
    });
  } else {
    detectAndStyleButtons();
    startWatchers();
    enhanceCloseButtons();
  }

  // Set up watchers to continuously check for new modals and apply styles
  function startWatchers() {
    // 1. Set up a mutation observer to watch for DOM changes
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          // Check if any modal-related nodes were added
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === 1) { // Element node
              if (
                node.classList && (
                  node.classList.contains('components-modal__screen-overlay') ||
                  node.classList.contains('components-modal__frame') ||
                  node.classList.contains('components-modal__content') ||
                  node.classList.contains('delete-confirmation-content') ||
                  node.classList.contains('modal-actions') ||
                  node.classList.contains('components-modal__footer')
                )
              ) {
                console.log('BCGov Document Repository: Modal element added to DOM');
                detectAndStyleButtons();
              }
              
              // Also check children of this node
              if (node.querySelector) {
                const modalElements = node.querySelectorAll(
                  '.components-modal__screen-overlay, .components-modal__frame, ' +
                  '.components-modal__content, .delete-confirmation-content, ' +
                  '.modal-actions, .components-modal__footer'
                );
                if (modalElements.length > 0) {
                  console.log('BCGov Document Repository: Modal elements found in added node');
                  detectAndStyleButtons();
                }
              }
            }
          }
        }
        
        // Check for attribute changes that might affect our buttons
        if (mutation.type === 'attributes' && mutation.target.tagName === 'BUTTON') {
          const modalActions = mutation.target.closest('.modal-actions, .components-modal__footer');
          if (modalActions) {
            console.log('BCGov Document Repository: Button attributes changed, reapplying styles');
            detectAndStyleButtons();
          }
        }
      });
    });
    
    // Observe the entire document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    // 2. Set up an interval to periodically check for and style the buttons
    // This is a fallback in case the MutationObserver misses something
    setInterval(detectAndStyleButtons, 500);
    
    // 3. Also watch for click events that might trigger modals
    document.addEventListener('click', function(event) {
      // Check if we clicked on something that might open a modal
      const target = event.target;
      if (
        target.classList && (
          target.classList.contains('components-button') ||
          target.classList.contains('is-destructive') ||
          target.classList.contains('delete-button')
        )
      ) {
        // Wait a moment for the modal to open, then apply styles
        setTimeout(detectAndStyleButtons, 100);
      }
      
      // Check parent elements too
      let parent = target.parentElement;
      while (parent) {
        if (
          parent.classList && (
            parent.classList.contains('components-button') ||
            parent.classList.contains('is-destructive') ||
            parent.classList.contains('delete-button')
          )
        ) {
          setTimeout(detectAndStyleButtons, 100);
          break;
        }
        parent = parent.parentElement;
      }
    });
  }
  
  // Also add an inline style tag with !important rules as a fallback
  function addStyleTag() {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      /* Make delete buttons red */
      .components-modal__content .delete-confirmation-content .modal-actions button.is-destructive,
      .components-modal__content .delete-confirmation-content .modal-actions button.delete-button,
      .components-modal__content .delete-confirmation-content .modal-actions button.custom-destructive-button,
      .delete-confirmation-content .modal-actions button.is-destructive,
      .delete-confirmation-content .modal-actions button.delete-button,
      .delete-confirmation-content .modal-actions .components-button.is-destructive,
      .components-modal__content .modal-actions button.is-destructive,
      .modal-actions button.custom-destructive-button,
      .components-modal__footer button.is-destructive {
        background-color: #bc2929 !important;
        color: white !important;
        border-color: #bc2929 !important;
        order: 2 !important;
      }
      
      /* Make cancel buttons gray */
      .components-modal__content .delete-confirmation-content .modal-actions button.cancel-button,
      .delete-confirmation-content .modal-actions button.cancel-button,
      .modal-actions button.cancel-button,
      .components-modal__content .delete-confirmation-content .modal-actions button:not(.is-destructive):not(.delete-button):not(.custom-destructive-button),
      .delete-confirmation-content .modal-actions button:not(.is-destructive):not(.delete-button):not(.custom-destructive-button),
      .components-modal__content .modal-actions button:not(.is-destructive):not(.delete-button):not(.custom-destructive-button),
      .modal-actions button:not(.is-destructive):not(.delete-button):not(.custom-destructive-button),
      .components-modal__footer button:not(.is-destructive):not(.delete-button):not(.custom-destructive-button) {
        background-color: #f6f7f7 !important;
        color: #555 !important;
        border-color: #ddd !important;
        order: 1 !important;
      }
      
      /* Configure the button container for proper ordering */
      .modal-actions,
      .components-modal__footer {
        display: flex !important;
        flex-direction: row !important;
        justify-content: flex-end !important;
        gap: 0.75rem !important;
      }
    `;
    document.head.appendChild(styleTag);
  }
  
  addStyleTag();

  /**
   * Add custom class to all modal close buttons for improved styling
   */
  function enhanceCloseButtons() {
    // Find all close buttons in modal headers
    const closeButtons = document.querySelectorAll('.components-modal__header .components-button[aria-label="Close"]');
    
    // Add custom class to each button
    closeButtons.forEach(button => {
      button.classList.add('modal-close-button');
    });
  }
})(); 