/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Bcgov/DesignSystemPlugin/InPageNav/view.js":
/*!********************************************************!*\
  !*** ./src/Bcgov/DesignSystemPlugin/InPageNav/view.js ***!
  \********************************************************/
/***/ (() => {

document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.querySelector('#main-content') || document.querySelector('main') || document.querySelector('.content-area');
  if (!mainContent) return;
  const headings = Array.from(mainContent.querySelectorAll('h2[id], h3[id]'));
  if (headings.length < 2) return;

  // Create navigation structure
  const nav = document.createElement('aside');
  nav.className = 'dswp-in-page-nav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'On this page');
  nav.innerHTML = `
        <div class="nav-header">
            <div class="nav-title">
                <h4 id="nav-title">On this page:</h4>
            </div>
            <button type="button" 
                class="nav-toggle" 
                aria-label="Toggle section navigation" 
                aria-expanded="false"
                aria-controls="nav-links">
            </button>
        </div>
        <ul id="nav-links" 
            class="nav-links" 
            role="list" 
            aria-labelledby="nav-title">
            ${headings.map(heading => `
                <li>
                    <a href="#${heading.id}" 
                       data-heading-id="${heading.id}"
                       aria-current="false">
                        ${heading.textContent}
                    </a>
                </li>
            `).join('')}
        </ul>
    `;

  // Create wrapper structure
  const wrapper = document.createElement('div');
  wrapper.className = 'dswp-nav-content-container';
  mainContent.parentNode.insertBefore(wrapper, mainContent);
  wrapper.appendChild(nav);
  wrapper.appendChild(mainContent);

  // Handle scroll and click events
  const updateActiveLink = () => {
    const navHeight = nav.offsetHeight + 8;
    const scrollPosition = window.scrollY + navHeight + window.innerHeight * 0.2;

    // Only check for mobile view and top position
    if (window.innerWidth <= 768 && window.scrollY < 50) {
      nav.classList.add('is-expanded');
      navToggle.setAttribute('aria-expanded', 'true');
    } else {
      // Always collapse unless manually expanded
      if (!nav.hasAttribute('data-manual-expanded')) {
        nav.classList.remove('is-expanded');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }

    // Find current heading
    let currentHeading = null;
    for (const heading of headings) {
      if (heading.getBoundingClientRect().top + window.scrollY < scrollPosition) {
        currentHeading = heading;
      } else break;
    }

    // Update active link and current class
    nav.querySelectorAll('a').forEach(link => {
      const isCurrent = currentHeading && link.getAttribute('data-heading-id') === currentHeading.id;
      link.classList.toggle('dswp-current', isCurrent);
      link.setAttribute('aria-current', isCurrent ? 'true' : 'false');
      const listItem = link.closest('li');
      listItem.classList.toggle('current', isCurrent);
    });
  };

  // Toggle navigation - simplified
  const navToggle = nav.querySelector('.nav-toggle');
  navToggle.addEventListener('click', e => {
    e.stopPropagation();
    const isExpanded = nav.classList.toggle('is-expanded');
    navToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    if (isExpanded) {
      nav.setAttribute('data-manual-expanded', '');
    } else {
      nav.removeAttribute('data-manual-expanded');
    }
  });

  // Smooth scroll to heading
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      const offset = nav.offsetHeight + dswpInPageNav.options.scroll_offset;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
      history.pushState(null, null, `#${targetId}`);

      // Also remove manual expand marker when clicking a link
      nav.removeAttribute('data-manual-expanded');
      nav.classList.remove('is-expanded');
    });
  });

  // Keep the throttled scroll listener
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) window.cancelAnimationFrame(scrollTimeout);
    scrollTimeout = window.requestAnimationFrame(updateActiveLink);
  });

  // Add keyboard navigation for the toggle button
  navToggle.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navToggle.click();
    }
  });

  // Initial check
  updateActiveLink();
});

/***/ }),

/***/ "./src/Bcgov/DesignSystemPlugin/InPageNav/style.css":
/*!**********************************************************!*\
  !*** ./src/Bcgov/DesignSystemPlugin/InPageNav/style.css ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"in-page-nav": 0,
/******/ 			"./style-in-page-nav": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkdesign_system_wordpress_plugin"] = self["webpackChunkdesign_system_wordpress_plugin"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["./style-in-page-nav"], () => (__webpack_require__("./src/Bcgov/DesignSystemPlugin/InPageNav/view.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-in-page-nav"], () => (__webpack_require__("./src/Bcgov/DesignSystemPlugin/InPageNav/style.css")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=in-page-nav.js.map