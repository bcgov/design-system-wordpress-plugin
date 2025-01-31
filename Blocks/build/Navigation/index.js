/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Navigation/edit/index.js":
/*!**************************************!*\
  !*** ./src/Navigation/edit/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _mobile_menu_icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./mobile-menu-icon */ "./src/Navigation/edit/mobile-menu-icon.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);










/**
 * Navigation Block Edit Component
 * 
 * @param {Object} props - Component properties
 * @param {Object} props.attributes - Block attributes
 * @param {Function} props.setAttributes - Function to update block attributes
 * @param {string} props.clientId - Unique block identifier
 * @return {JSX.Element} Navigation block editor interface
 */

function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  const {
    menuId,
    overlayMenu,
    isMobile,
    mobileBreakpoint = 768
  } = attributes;

  /**
   * WordPress dispatch and registry hooks for block manipulation
   */
  const {
    replaceInnerBlocks
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useDispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.store);
  const {
    editEntityRecord,
    saveEditedEntityRecord
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useDispatch)(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_5__.store);
  const registry = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useRegistry)();

  /**
   * Block props with dynamic className and mobile breakpoint styling
   * Memoized to prevent unnecessary re-renders
   */
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps)({
    className: `dswp-block-navigation-is-${overlayMenu}-overlay`,
    style: {
      '--mobile-breakpoint': mobileBreakpoint
    }
  });

  /**
   * Combined selector hook for retrieving menu data and block state
   * Optimized to reduce re-renders by combining multiple selectors
   */
  const {
    menus,
    hasResolvedMenus,
    selectedMenu,
    currentBlocks,
    isCurrentPostSaving
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useSelect)(select => {
    const {
      getEntityRecords,
      hasFinishedResolution,
      getEditedEntityRecord
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_5__.store);
    const query = {
      per_page: -1,
      status: ["publish", "draft"]
    };
    return {
      menus: getEntityRecords("postType", "wp_navigation", query),
      hasResolvedMenus: hasFinishedResolution("getEntityRecords", ["postType", "wp_navigation", query]),
      selectedMenu: menuId ? getEditedEntityRecord("postType", "wp_navigation", menuId) : null,
      currentBlocks: select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.store).getBlocks(clientId),
      isCurrentPostSaving: select('core/editor')?.isSavingPost()
    };
  }, [menuId, clientId]);

  /**
   * Refs for tracking content state and initialization
   */
  const lastSavedContent = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useRef)(null);
  const isInitialLoad = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useRef)(true);
  const initialBlocksRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useRef)(null);

  /**
   * Processes navigation blocks to ensure correct structure and attributes
   * Memoized to prevent unnecessary recreation on re-renders
   * 
   * @param {Array} blocks - Array of block objects to process
   * @return {Array} Processed blocks with correct structure
   */
  const processBlocks = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useCallback)(blocks => {
    return blocks.map(block => {
      const commonProps = {
        ...block.attributes,
        label: block.attributes.label,
        url: block.attributes.url,
        type: block.attributes.type,
        id: block.attributes.id,
        kind: block.attributes.kind,
        opensInNewTab: block.attributes.opensInNewTab || false
      };
      if (block.name === "core/navigation-link") {
        return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__.createBlock)("core/navigation-link", commonProps);
      }
      if (block.name === "core/navigation-submenu") {
        return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__.createBlock)("core/navigation-submenu", commonProps, block.innerBlocks ? processBlocks(block.innerBlocks) : []);
      }
      return null;
    }).filter(Boolean);
  }, []);

  /**
   * Effect for handling initial menu content load
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    if (selectedMenu?.content && isInitialLoad.current) {
      const parsedBlocks = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__.parse)(selectedMenu.content);
      initialBlocksRef.current = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__.serialize)(parsedBlocks);
      lastSavedContent.current = initialBlocksRef.current;
      registry.dispatch(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.store).__unstableMarkNextChangeAsNotPersistent();
    }
  }, [selectedMenu]);

  /**
   * Effect for handling block content changes
   * Marks changes as non-persistent when content matches initial state
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    if (!isInitialLoad.current && currentBlocks) {
      const serializedContent = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__.serialize)(currentBlocks);
      if (serializedContent === initialBlocksRef.current) {
        registry.dispatch(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.store).__unstableMarkNextChangeAsNotPersistent();
      }
    }
  }, [currentBlocks]);

  /**
   * Effect for saving menu changes
   * Handles automatic saving when post is being saved
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    if (!isCurrentPostSaving || !menuId || !currentBlocks) return;
    const serializedContent = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__.serialize)(currentBlocks);
    if (serializedContent === lastSavedContent.current || isInitialLoad.current && serializedContent === initialBlocksRef.current) {
      return;
    }
    lastSavedContent.current = serializedContent;
    (async () => {
      try {
        await editEntityRecord("postType", "wp_navigation", menuId, {
          content: serializedContent,
          status: "publish"
        });
        await saveEditedEntityRecord("postType", "wp_navigation", menuId);
      } catch (error) {
        console.error("Failed to update navigation menu:", error);
      }
    })();
  }, [isCurrentPostSaving, menuId, currentBlocks]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    if (!selectedMenu || !selectedMenu.content) {
      registry.dispatch(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.store).__unstableMarkNextChangeAsNotPersistent();
      replaceInnerBlocks(clientId, []);
      lastSavedContent.current = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__.serialize)([]);
      isInitialLoad.current = false;
      return;
    }
    const parsedBlocks = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__.parse)(selectedMenu.content);
    const newBlocks = processBlocks(parsedBlocks);
    registry.dispatch(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.store).__unstableMarkNextChangeAsNotPersistent();
    replaceInnerBlocks(clientId, newBlocks);
    if (isInitialLoad.current) {
      lastSavedContent.current = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__.serialize)(newBlocks);
      initialBlocksRef.current = lastSavedContent.current;
      isInitialLoad.current = false;
      registry.dispatch(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.store).__unstableMarkNextChangeAsNotPersistent();
    }
  }, [selectedMenu]);

  /**
   * Handles menu selection changes
   * @param {string} value - The selected menu ID
   */
  const handleMenuSelect = value => {
    const newMenuId = parseInt(value);
    setAttributes({
      menuId: newMenuId
    });
  };

  /**
   * Inner blocks configuration for the navigation menu
   * Restricts allowed blocks to navigation-specific types
   */
  const innerBlocksProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useInnerBlocksProps)({
    className: "dswp-block-navigation__container"
  }, {
    allowedBlocks: ["core/navigation-link", "core/navigation-submenu"],
    orientation: "horizontal",
    templateLock: false
  });

  // Early return for loading state
  if (!hasResolvedMenus) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Spinner, {});
  }

  // Transform menu data into select options format
  const menuOptions = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Select a menu"),
    value: 0
  }, ...(menus || []).map(menu => ({
    label: menu.title.rendered || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("(no title)"),
    value: menu.id
  }))];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Navigation Settings"),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Select Menu"),
          value: menuId || 0,
          options: menuOptions,
          onChange: handleMenuSelect
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ButtonGroup, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
            className: "components-base-control__label",
            style: {
              display: 'block',
              marginBottom: '8px'
            },
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Overlay Menu")
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
            variant: overlayMenu === "mobile" ? "primary" : "secondary",
            onClick: () => setAttributes({
              overlayMenu: "mobile",
              isMobile: "inMobileMode"
            }),
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Mobile")
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
            variant: overlayMenu === "always" ? "primary" : "secondary",
            onClick: () => setAttributes({
              overlayMenu: "always",
              isMobile: "always"
            }),
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Always")
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
            variant: overlayMenu === "never" ? "primary" : "secondary",
            onClick: () => setAttributes({
              overlayMenu: "never",
              isMobile: "never"
            }),
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Never")
          })]
        }), overlayMenu === "mobile" && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
          style: {
            marginTop: '1rem'
          },
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Mobile Breakpoint (px)', 'your-text-domain'),
            value: mobileBreakpoint,
            onChange: value => setAttributes({
              mobileBreakpoint: value
            }),
            min: 320,
            max: 1200,
            step: 1
          })
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("nav", {
      ...blockProps,
      children: overlayMenu === "always" ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_mobile_menu_icon__WEBPACK_IMPORTED_MODULE_7__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
          ...innerBlocksProps,
          style: {
            display: 'none'
          }
        })]
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
        ...innerBlocksProps
      })
    })]
  });
}

/***/ }),

/***/ "./src/Navigation/edit/mobile-menu-icon.js":
/*!*************************************************!*\
  !*** ./src/Navigation/edit/mobile-menu-icon.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MobileMenuIcon)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

function MobileMenuIcon() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
    className: "dswp-nav-mobile-toggle-icon",
    "aria-label": "Toggle menu",
    "aria-expanded": "false",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
      className: "dswp-nav-mobile-menu-icon-text",
      children: "Menu"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", {
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      focusable: "false",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
        className: "dswp-nav-mobile-bar dswp-nav-mobile-menu-top-bar",
        d: "M3,6h13",
        strokeWidth: "1",
        stroke: "currentColor"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
        className: "dswp-nav-mobile-bar dswp-nav-mobile-menu-middle-bar",
        d: "M3,12h13",
        strokeWidth: "1",
        stroke: "currentColor"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
        className: "dswp-nav-mobile-bar dswp-nav-mobile-menu-bottom-bar",
        d: "M3,18h13",
        strokeWidth: "1",
        stroke: "currentColor"
      })]
    })]
  });
}

/***/ }),

/***/ "./src/Navigation/index.js":
/*!*********************************!*\
  !*** ./src/Navigation/index.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/Navigation/edit/index.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./src/Navigation/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/Navigation/block.json");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style.scss */ "./src/Navigation/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./editor.scss */ "./src/Navigation/editor.scss");







(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});

/***/ }),

/***/ "./src/Navigation/save.js":
/*!********************************!*\
  !*** ./src/Navigation/save.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit_mobile_menu_icon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit/mobile-menu-icon */ "./src/Navigation/edit/mobile-menu-icon.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function save({
  attributes
}) {
  const {
    overlayMenu
  } = attributes;
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
    className: `dswp-block-navigation-is-${overlayMenu}-overlay`
  });
  const innerBlocksProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useInnerBlocksProps.save({
    className: "dswp-block-navigation__container"
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("nav", {
    ...blockProps,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_edit_mobile_menu_icon__WEBPACK_IMPORTED_MODULE_1__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      ...innerBlocksProps
    })]
  });
}

/***/ }),

/***/ "./src/Navigation/editor.scss":
/*!************************************!*\
  !*** ./src/Navigation/editor.scss ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/Navigation/style.scss":
/*!***********************************!*\
  !*** ./src/Navigation/style.scss ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/core-data":
/*!**********************************!*\
  !*** external ["wp","coreData"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["coreData"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./src/Navigation/block.json":
/*!***********************************!*\
  !*** ./src/Navigation/block.json ***!
  \***********************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"custom/navigation","version":"1.0.0","title":"Custom Navigation","category":"widgets","icon":"menu","description":"Custom navigation block","supports":{"__experimentalToolbar":true,"inserter":true,"inspectorGroups":{"list":true},"html":false,"align":["wide","full"],"typography":{"fontSize":true,"lineHeight":true,"__experimentalFontFamily":true,"__experimentalTextTransform":true},"spacing":{"blockGap":true,"margin":true,"padding":true,"units":["px","em","rem","vh","vw"]},"layout":{"allowSwitching":false,"allowInheriting":false,"default":{"type":"flex"}}},"attributes":{"ref":{"type":"number"},"layout":{"type":"object"},"overlayMenu":{"type":"string","default":"never"},"isMobile":{"type":"boolean","default":false},"menuId":{"type":"number"},"mobileIconStyle":{"type":"string","default":"threeBar"},"mobileBreakpoint":{"type":"number","default":768}},"editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","viewScript":"file:./view.js"}');

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
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
/******/ 			"Navigation/index": 0,
/******/ 			"Navigation/style-index": 0
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
/******/ 		var chunkLoadingGlobal = self["webpackChunkmega_menu_nav"] = self["webpackChunkmega_menu_nav"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["Navigation/style-index"], () => (__webpack_require__("./src/Navigation/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map