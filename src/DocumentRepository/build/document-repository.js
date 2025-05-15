/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/js/apps/document-repository/App.js":
/*!***************************************************!*\
  !*** ./assets/js/apps/document-repository/App.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_DocumentList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/DocumentList */ "./assets/js/apps/document-repository/components/DocumentList/index.js");
/* harmony import */ var _components_DocumentUploader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/DocumentUploader */ "./assets/js/apps/document-repository/components/DocumentUploader.js");
/* harmony import */ var _hooks_useDocuments__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hooks/useDocuments */ "./assets/js/apps/document-repository/hooks/useDocuments.js");
/* harmony import */ var _shared_components_AppErrorBoundary__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../shared/components/AppErrorBoundary */ "./assets/js/shared/components/AppErrorBoundary.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/**
 * Document Repository - Main App Component
 *
 * This is the root component of the Document Repository application.
 * It sets up the application structure, context providers, and main routes.
 *
 * @example
 * <App />
 */









/**
 * Main App component
 *
 * Manages the document repository application state and UI.
 * Handles document listing, uploading, and metadata management.
 *
 * @return {JSX.Element} The rendered application
 */

var App = function App() {
  // API data loading state
  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true),
    _useState2 = _slicedToArray(_useState, 2),
    isInitializing = _useState2[0],
    setIsInitializing = _useState2[1];
  var _useState3 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState4 = _slicedToArray(_useState3, 2),
    error = _useState4[0],
    setError = _useState4[1];

  // Metadata fields configuration
  var _useState5 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState6 = _slicedToArray(_useState5, 2),
    metadataFields = _useState6[0],
    setMetadataFields = _useState6[1];

  // Modal state for document upload
  var _useState7 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    showUploadModal = _useState8[0],
    setShowUploadModal = _useState8[1];
  var _useState9 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState10 = _slicedToArray(_useState9, 2),
    showCancelConfirmModal = _useState10[0],
    setShowCancelConfirmModal = _useState10[1];
  var _useState11 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState12 = _slicedToArray(_useState11, 2),
    selectedFileForUpload = _useState12[0],
    setSelectedFileForUpload = _useState12[1];

  // Document data and operations from custom hook
  var _useDocuments = (0,_hooks_useDocuments__WEBPACK_IMPORTED_MODULE_5__.useDocuments)(),
    documents = _useDocuments.documents,
    totalDocuments = _useDocuments.totalDocuments,
    currentPage = _useDocuments.currentPage,
    totalPages = _useDocuments.totalPages,
    fetchDocuments = _useDocuments.fetchDocuments,
    deleteDocument = _useDocuments.deleteDocument,
    isDeleting = _useDocuments.isDeleting,
    isLoadingDocuments = _useDocuments.isLoading,
    documentsError = _useDocuments.error,
    setSearchParams = _useDocuments.setSearchParams;

  // Selected documents for bulk actions
  var _useState13 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState14 = _slicedToArray(_useState13, 2),
    selectedDocuments = _useState14[0],
    setSelectedDocuments = _useState14[1];

  // Initialize data on component mount
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var initializeData = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var settings, response, errorMessage, errorData, data;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              setIsInitializing(true);
              setError(null);

              // Check for required settings
              settings = window.documentRepositorySettings;
              if (!(!(settings !== null && settings !== void 0 && settings.apiRoot) || !(settings !== null && settings !== void 0 && settings.apiNamespace) || !(settings !== null && settings !== void 0 && settings.nonce))) {
                _context.next = 6;
                break;
              }
              throw new Error((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Document Repository settings not found. Make sure the script is properly enqueued in WordPress.', 'bcgov-design-system'));
            case 6:
              _context.next = 8;
              return fetch("".concat(settings.apiRoot).concat(settings.apiNamespace, "/metadata-fields"), {
                headers: {
                  'X-WP-Nonce': settings.nonce
                }
              });
            case 8:
              response = _context.sent;
              if (response.ok) {
                _context.next = 21;
                break;
              }
              _context.prev = 10;
              _context.next = 13;
              return response.json();
            case 13:
              errorData = _context.sent;
              errorMessage = errorData.message || errorData.error;
              _context.next = 20;
              break;
            case 17:
              _context.prev = 17;
              _context.t0 = _context["catch"](10);
              errorMessage = response.statusText;
            case 20:
              throw new Error((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Failed to fetch metadata fields: ', 'bcgov-design-system') + errorMessage);
            case 21:
              _context.next = 23;
              return response.json();
            case 23:
              data = _context.sent;
              setMetadataFields(data);

              // Fetch initial documents
              _context.next = 27;
              return fetchDocuments();
            case 27:
              _context.next = 32;
              break;
            case 29:
              _context.prev = 29;
              _context.t1 = _context["catch"](0);
              setError(_context.t1.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Failed to initialize document repository', 'bcgov-design-system'));
            case 32:
              _context.prev = 32;
              setIsInitializing(false);
              return _context.finish(32);
            case 35:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 29, 32, 35], [10, 17]]);
      }));
      return function initializeData() {
        return _ref.apply(this, arguments);
      };
    }();
    initializeData();
  }, [fetchDocuments]);

  /**
   * Handle document selection for bulk actions
   *
   * @function handleDocumentSelection
   * @param {number} documentId - ID of the document to select/deselect
   */
  var handleDocumentSelection = function handleDocumentSelection(documentId) {
    try {
      var newSelectedDocuments = selectedDocuments.includes(documentId) ? selectedDocuments.filter(function (id) {
        return id !== documentId;
      }) : [].concat(_toConsumableArray(selectedDocuments), [documentId]);
      setSelectedDocuments(newSelectedDocuments);
    } catch (err) {
      setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Failed to select document', 'bcgov-design-system'));
    }
  };

  /**
   * Handle selecting all documents
   *
   * @function handleSelectAll
   * @param {boolean} isSelected - Whether to select or deselect all documents
   */
  var handleSelectAll = function handleSelectAll(isSelected) {
    try {
      setSelectedDocuments(isSelected ? documents.map(function (doc) {
        return doc.id;
      }) : []);
    } catch (err) {
      setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Failed to select documents', 'bcgov-design-system'));
    }
  };

  /**
   * Handle page change in pagination
   *
   * @function handlePageChange
   * @param {number} newPage - New page number to navigate to
   */
  var handlePageChange = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(newPage) {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            try {
              setError(null);

              // Update search params to include the new page number
              setSearchParams(function (prev) {
                return _objectSpread(_objectSpread({}, prev), {}, {
                  page: newPage
                });
              });

              // The fetchDocuments call will happen automatically due to the useEffect
              // in useDocuments that watches for searchParams changes
            } catch (err) {
              setError(err.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Failed to change page', 'bcgov-design-system'));
              // If there's an error, revert to the previous page
              setSearchParams(function (prev) {
                return _objectSpread(_objectSpread({}, prev), {}, {
                  page: currentPage
                });
              });
            }
          case 1:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function handlePageChange(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  // Add new state for managing multiple file uploads
  var _useState15 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState16 = _slicedToArray(_useState15, 2),
    uploadQueue = _useState16[0],
    setUploadQueue = _useState16[1];
  var _useState17 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0),
    _useState18 = _slicedToArray(_useState17, 2),
    currentUploadIndex = _useState18[0],
    setCurrentUploadIndex = _useState18[1];
  var _useState19 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0),
    _useState20 = _slicedToArray(_useState19, 2),
    uploadProgress = _useState20[0],
    setUploadProgress = _useState20[1];

  /**
   * Handle upload success and move to next file
   *
   * @function handleUploadSuccess
   */
  var handleUploadSuccess = function handleUploadSuccess() {
    // Update the document list by fetching the latest documents
    fetchDocuments();

    // Reset upload state
    setShowUploadModal(false);
    setSelectedFileForUpload(null);
    setUploadQueue([]);
    setCurrentUploadIndex(0);
  };

  /**
   * Handle file drop for document upload
   *
   * @async
   * @function handleFileDrop
   * @param {File} file - The file to upload
   * @throws {Error} If upload fails
   */
  var handleFileDrop = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(file) {
      var _window$documentRepos, formData, nonce, xhr, uploadPromise;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            if (!(!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf'))) {
              _context3.next = 3;
              break;
            }
            throw new Error('Only PDF files are allowed');
          case 3:
            // Create FormData object
            formData = new FormData();
            formData.append('file', file);
            formData.append('title', file.name.split('.')[0]); // Use filename without extension as title

            // Get the nonce from WordPress settings
            nonce = (_window$documentRepos = window.documentRepositorySettings) === null || _window$documentRepos === void 0 ? void 0 : _window$documentRepos.nonce;
            if (nonce) {
              _context3.next = 9;
              break;
            }
            throw new Error('Security token not found');
          case 9:
            // Create XMLHttpRequest for upload with progress tracking
            xhr = new window.XMLHttpRequest();
            uploadPromise = new Promise(function (resolve, reject) {
              xhr.open('POST', "".concat(window.documentRepositorySettings.apiRoot).concat(window.documentRepositorySettings.apiNamespace, "/documents"));
              xhr.setRequestHeader('X-WP-Nonce', nonce);

              // Track upload progress
              xhr.upload.onprogress = function (event) {
                if (event.lengthComputable) {
                  var progress = Math.round(event.loaded / event.total * 100);
                  setUploadProgress(progress);
                }
              };
              xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                  try {
                    var response = JSON.parse(xhr.responseText);
                    resolve(response);
                  } catch (parseErr) {
                    reject(new Error("Error uploading \"".concat(file.name, "\": Server returned invalid response")));
                  }
                } else {
                  var errorMessage;
                  try {
                    var _response = JSON.parse(xhr.responseText);
                    errorMessage = _response.message || _response.error || xhr.statusText;
                  } catch (e) {
                    errorMessage = xhr.statusText || 'Server error';
                  }
                  reject(new Error("Error uploading \"".concat(file.name, "\": ").concat(errorMessage)));
                }
              };
              xhr.onerror = function () {
                reject(new Error("Network error while uploading \"".concat(file.name, "\". Please check your connection and try again.")));
              };
              xhr.send(formData);
            }); // Wait for upload to complete
            _context3.next = 13;
            return uploadPromise;
          case 13:
            // Handle successful upload
            handleUploadSuccess();
            _context3.next = 20;
            break;
          case 16:
            _context3.prev = 16;
            _context3.t0 = _context3["catch"](0);
            setError(_context3.t0.message || 'Failed to upload file');
            throw _context3.t0;
          case 20:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[0, 16]]);
    }));
    return function handleFileDrop(_x2) {
      return _ref3.apply(this, arguments);
    };
  }();
  var handleCancelUpload = function handleCancelUpload() {
    setShowUploadModal(false);
    setSelectedFileForUpload(null);
    setUploadQueue([]);
    setCurrentUploadIndex(0);
    setShowCancelConfirmModal(false);
  };

  // Show error if either initialization or documents error occurs
  var displayError = error || documentsError;

  // Handle error auto-dismissal
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (displayError) {
      var timer = setTimeout(function () {
        setError(null);
      }, 3000);
      return function () {
        return clearTimeout(timer);
      };
    }
  }, [displayError]);

  // Loading state
  if (isInitializing) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "dswp-document-repository-loading",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Spinner, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Loading document repository…', 'bcgov-design-system')
      })]
    });
  }

  // Main application render
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_shared_components_AppErrorBoundary__WEBPACK_IMPORTED_MODULE_6__["default"], {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "dswp-document-repository",
      children: [displayError && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
        status: "error",
        isDismissible: true,
        onDismiss: function onDismiss() {
          return setError(null);
        },
        className: "document-repository-error",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
          children: displayError
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_components_DocumentList__WEBPACK_IMPORTED_MODULE_3__["default"], {
        documents: documents || [],
        isLoading: isLoadingDocuments,
        totalItems: totalDocuments,
        currentPage: currentPage || 1,
        totalPages: totalPages || 1,
        onPageChange: handlePageChange,
        onDelete: deleteDocument,
        isDeleting: isDeleting,
        selectedDocuments: selectedDocuments || [],
        onSelectDocument: handleDocumentSelection,
        onSelectAll: handleSelectAll,
        metadataFields: metadataFields || [],
        onUploadSuccess: handleUploadSuccess,
        onFileDrop: handleFileDrop
      }), showUploadModal && selectedFileForUpload && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Modal, {
        title: uploadQueue.length > 1 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Upload Documents', 'bcgov-design-system') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Upload Document', 'bcgov-design-system'),
        onRequestClose: function onRequestClose() {
          return setShowCancelConfirmModal(true);
        },
        className: "document-upload-modal",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
          className: "upload-progress-info",
          children: [uploadQueue.length > 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("p", {
            className: "upload-queue-status",
            children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Uploading file', 'bcgov-design-system'), ' ', currentUploadIndex + 1, ' ', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('of', 'bcgov-design-system'), ' ', uploadQueue.length]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
            className: "progress-bar",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
              className: "progress-bar-fill",
              style: {
                width: "".concat(uploadProgress, "%")
              }
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_components_DocumentUploader__WEBPACK_IMPORTED_MODULE_4__["default"], {
          metadataFields: metadataFields,
          onUploadSuccess: handleUploadSuccess,
          selectedFile: selectedFileForUpload,
          modalMode: true,
          onFileDrop: handleFileDrop
        })]
      }), showCancelConfirmModal && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Modal, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Cancel Upload', 'bcgov-design-system'),
        onRequestClose: function onRequestClose() {
          return setShowCancelConfirmModal(false);
        },
        className: "cancel-upload-modal",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Are you sure you want to cancel the remaining uploads?', 'bcgov-design-system')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
          className: "modal-actions",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
            className: "doc-repo-button",
            onClick: function onClick() {
              return setShowCancelConfirmModal(false);
            },
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Continue Upload', 'bcgov-design-system')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
            className: "doc-repo-button",
            isDestructive: true,
            onClick: handleCancelUpload,
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Cancel Upload', 'bcgov-design-system')
          })]
        })]
      })]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);

/***/ }),

/***/ "./assets/js/apps/document-repository/components/DocumentList/DocumentTable.js":
/*!*************************************************************************************!*\
  !*** ./assets/js/apps/document-repository/components/DocumentList/DocumentTable.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _SafeRender__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SafeRender */ "./assets/js/apps/document-repository/components/DocumentList/SafeRender.js");
/* harmony import */ var _DocumentTableRow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DocumentTableRow */ "./assets/js/apps/document-repository/components/DocumentList/DocumentTableRow.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");





/**
 * DocumentTable Component
 *
 * A table component that displays a list of documents with their metadata and actions.
 * Supports both regular and spreadsheet modes for metadata editing.
 *
 * @param {Object}   props                    - Component props
 * @param {Array}    props.documents          - List of document objects to display
 * @param {Array}    props.selectedDocuments  - Array of selected document IDs
 * @param {Function} props.onSelectDocument   - Callback when a document is selected
 * @param {Function} props.onSelectAll        - Callback when all documents are selected/deselected
 * @param {Function} props.onDelete           - Callback when a document is deleted
 * @param {Function} props.onEdit             - Callback when a document is edited
 * @param {boolean}  props.isDeleting         - Flag indicating if a delete operation is in progress
 * @param {Array}    props.metadataFields     - Array of metadata field definitions
 * @param {boolean}  props.isSpreadsheetMode  - Flag indicating if table is in spreadsheet mode
 * @param {Object}   props.bulkEditedMetadata - Object containing bulk edited metadata values
 * @param {Function} props.onMetadataChange   - Callback when metadata is changed in spreadsheet mode
 * @param {Function} props.formatFileSize     - Function to format file size for display
 * @return {JSX.Element} Rendered document table
 */

var DocumentTable = function DocumentTable(_ref) {
  var documents = _ref.documents,
    selectedDocuments = _ref.selectedDocuments,
    onSelectDocument = _ref.onSelectDocument,
    onSelectAll = _ref.onSelectAll,
    onDelete = _ref.onDelete,
    onEdit = _ref.onEdit,
    isDeleting = _ref.isDeleting,
    metadataFields = _ref.metadataFields,
    isSpreadsheetMode = _ref.isSpreadsheetMode,
    bulkEditedMetadata = _ref.bulkEditedMetadata,
    onMetadataChange = _ref.onMetadataChange,
    formatFileSize = _ref.formatFileSize;
  // Check if all documents are currently selected
  var allSelected = documents.length > 0 && selectedDocuments.length === documents.length;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: "document-table",
    role: "table",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "document-table-header",
      role: "rowgroup",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "document-table-row",
        role: "row",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "document-table-cell header",
          role: "columnheader",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.CheckboxControl, {
            checked: allSelected,
            onChange: onSelectAll
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "document-table-cell header",
          role: "columnheader",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Title', 'bcgov-design-system')
        }), metadataFields.map(function (field) {
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "document-table-cell header metadata-column",
            role: "columnheader",
            children: field.label
          }, field.id);
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "document-table-cell header",
          role: "columnheader",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Size', 'bcgov-design-system')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "document-table-cell header",
          role: "columnheader",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Type', 'bcgov-design-system')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "document-table-cell header",
          role: "columnheader",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Actions', 'bcgov-design-system')
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "document-table-body",
      role: "rowgroup",
      children: documents.map(function (document) {
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_SafeRender__WEBPACK_IMPORTED_MODULE_2__["default"], {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_DocumentTableRow__WEBPACK_IMPORTED_MODULE_3__["default"], {
            document: document,
            isSelected: selectedDocuments.includes(document.id),
            onSelect: onSelectDocument,
            onDelete: onDelete,
            onEdit: onEdit,
            isDeleting: isDeleting,
            metadataFields: metadataFields,
            isSpreadsheetMode: isSpreadsheetMode,
            bulkEditedMetadata: bulkEditedMetadata,
            onMetadataChange: onMetadataChange,
            formatFileSize: formatFileSize
          })
        }, document.id);
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DocumentTable);

/***/ }),

/***/ "./assets/js/apps/document-repository/components/DocumentList/DocumentTableRow.js":
/*!****************************************************************************************!*\
  !*** ./assets/js/apps/document-repository/components/DocumentList/DocumentTableRow.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }



/**
 * DocumentTableRow Component
 *
 * A row component that displays a single document's information and actions.
 * Handles both display and editing of document metadata in spreadsheet mode.
 *
 * @param {Object}   props                    - Component props
 * @param {Object}   props.document           - The document object containing all document data
 * @param {boolean}  props.isSelected         - Whether this document is currently selected
 * @param {Function} props.onSelect           - Callback when the document's selection state changes
 * @param {Function} props.onDelete           - Callback when the document is deleted
 * @param {Function} props.onEdit             - Callback when the document is edited
 * @param {boolean}  props.isDeleting         - Flag indicating if a delete operation is in progress
 * @param {Array}    props.metadataFields     - Array of metadata field definitions
 * @param {boolean}  props.isSpreadsheetMode  - Flag indicating if table is in spreadsheet mode
 * @param {Object}   props.bulkEditedMetadata - Object containing bulk edited metadata values
 * @param {Function} props.onMetadataChange   - Callback when metadata is changed in spreadsheet mode
 * @param {Function} props.formatFileSize     - Function to format file size for display
 * @return {JSX.Element} Rendered document table row
 */

var DocumentTableRow = function DocumentTableRow(_ref) {
  var document = _ref.document,
    isSelected = _ref.isSelected,
    onSelect = _ref.onSelect,
    onDelete = _ref.onDelete,
    onEdit = _ref.onEdit,
    isDeleting = _ref.isDeleting,
    metadataFields = _ref.metadataFields,
    isSpreadsheetMode = _ref.isSpreadsheetMode,
    bulkEditedMetadata = _ref.bulkEditedMetadata,
    onMetadataChange = _ref.onMetadataChange,
    formatFileSize = _ref.formatFileSize;
  var renderMetadataField = function renderMetadataField(field) {
    var _bulkEditedMetadata$d;
    if (!isSpreadsheetMode) {
      return document.metadata && document.metadata[field.id] ? document.metadata[field.id] : '—';
    }
    var fieldValue = ((_bulkEditedMetadata$d = bulkEditedMetadata[document.id]) === null || _bulkEditedMetadata$d === void 0 ? void 0 : _bulkEditedMetadata$d[field.id]) || '';
    if (field.type === 'select') {
      var options = Array.isArray(field.options) ? field.options.map(function (option) {
        return {
          label: option,
          value: option
        };
      }) : Object.entries(field.options || {}).map(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
          optionValue = _ref3[0],
          label = _ref3[1];
        return {
          label: label,
          value: optionValue
        };
      });
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
        value: fieldValue,
        options: [{
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select…', 'bcgov-design-system'),
          value: ''
        }].concat(_toConsumableArray(options)),
        onChange: function onChange(newValue) {
          return onMetadataChange(document.id, field.id, newValue);
        }
      });
    }
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.TextControl, {
      type: field.type === 'date' ? 'date' : 'text',
      value: fieldValue,
      onChange: function onChange(newValue) {
        return onMetadataChange(document.id, field.id, newValue);
      },
      className: "metadata-input"
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "document-table-row",
    role: "row",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "document-table-cell",
      role: "cell",
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select document', 'bcgov-design-system'),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.CheckboxControl, {
        checked: isSelected,
        onChange: function onChange() {
          return onSelect(document.id);
        }
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "document-table-cell",
      role: "cell",
      children: document.title || document.filename
    }), metadataFields.map(function (field) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "document-table-cell metadata-column",
        role: "cell",
        "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %s: field label */
        (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Edit %s', 'bcgov-design-system'), field.label),
        children: renderMetadataField(field)
      }, field.id);
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "document-table-cell",
      role: "cell",
      children: document.metadata && document.metadata.document_file_size ? formatFileSize(document.metadata.document_file_size) : '—'
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "document-table-cell",
      role: "cell",
      children: document.metadata && document.metadata.document_file_type ? document.metadata.document_file_type : '—'
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "document-table-cell actions",
      role: "cell",
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Document actions', 'bcgov-design-system'),
      children: !isSpreadsheetMode && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "action-buttons",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
          onClick: function onClick() {
            return window.open(document.metadata.document_file_url, '_blank');
          },
          className: "doc-repo-button icon-button table-action-button",
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Download', 'bcgov-design-system'),
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Download', 'bcgov-design-system'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
            viewBox: "0 0 24 24",
            width: "16",
            height: "16",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
              d: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z",
              fill: "currentColor"
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
          onClick: function onClick() {
            return onEdit(document);
          },
          className: "doc-repo-button icon-button table-action-button",
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Edit Metadata', 'bcgov-design-system'),
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Edit Metadata', 'bcgov-design-system'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
            viewBox: "0 0 24 24",
            width: "16",
            height: "16",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
              d: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
              fill: "currentColor"
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
          onClick: function onClick() {
            return onDelete(document);
          },
          className: "doc-repo-button icon-button table-action-button",
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Delete', 'bcgov-design-system'),
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Delete', 'bcgov-design-system'),
          disabled: isDeleting,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
            viewBox: "0 0 24 24",
            width: "16",
            height: "16",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
              d: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
              fill: "currentColor"
            })
          })
        })]
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DocumentTableRow);

/***/ }),

/***/ "./assets/js/apps/document-repository/components/DocumentList/ErrorBoundary.js":
/*!*************************************************************************************!*\
  !*** ./assets/js/apps/document-repository/components/DocumentList/ErrorBoundary.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }



/**
 * ErrorBoundary Component
 *
 * A React error boundary component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 *
 * @augments {Component}
 * @param {Object}      props          - Component props
 * @param {JSX.Element} props.children - Child components to be wrapped by the error boundary
 */

var ErrorBoundary = /*#__PURE__*/function (_Component) {
  /**
   * Constructor for the ErrorBoundary component
   * @param {Object} props - Component props
   */
  function ErrorBoundary(props) {
    var _this;
    _classCallCheck(this, ErrorBoundary);
    _this = _callSuper(this, ErrorBoundary, [props]);
    _this.state = {
      hasError: false,
      error: null
    };
    return _this;
  }

  /**
   * Static method that returns a new state when an error is caught
   * @static
   * @param {Error} error - The error that was caught
   * @return {Object} New state object with error information
   */
  _inherits(ErrorBoundary, _Component);
  return _createClass(ErrorBoundary, [{
    key: "renderError",
    value:
    /**
     * Renders the error UI when an error has been caught
     * @return {JSX.Element} Error message UI
     */
    function renderError() {
      var _this$state$error;
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "error-boundary",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h2", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Something went wrong.', 'bcgov-design-system')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Please try refreshing the page.', 'bcgov-design-system')
        }),  true && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("pre", {
          children: (_this$state$error = this.state.error) === null || _this$state$error === void 0 ? void 0 : _this$state$error.toString()
        })]
      });
    }

    /**
     * Renders the child components when no error has been caught
     * @return {JSX.Element} Child components
     */
  }, {
    key: "renderContent",
    value: function renderContent() {
      return this.props.children;
    }

    /**
     * Main render method that decides whether to show error UI or child components
     * @return {JSX.Element} Either error UI or child components
     */
  }, {
    key: "render",
    value: function render() {
      if (this.state.hasError) {
        return this.renderError();
      }
      return this.renderContent();
    }
  }], [{
    key: "getDerivedStateFromError",
    value: function getDerivedStateFromError(error) {
      return {
        hasError: true,
        error: error
      };
    }
  }]);
}(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Component);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ErrorBoundary);

/***/ }),

/***/ "./assets/js/apps/document-repository/components/DocumentList/PaginationControls.js":
/*!******************************************************************************************!*\
  !*** ./assets/js/apps/document-repository/components/DocumentList/PaginationControls.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");



/**
 * PaginationControls Component
 *
 * Renders pagination controls for navigating through document pages
 *
 * @param {Object}   props
 * @param {number}   props.currentPage  - Current page number
 * @param {number}   props.totalPages   - Total number of pages
 * @param {Function} props.onPageChange - Callback when page changes
 */

var PaginationControls = function PaginationControls(_ref) {
  var currentPage = _ref.currentPage,
    totalPages = _ref.totalPages,
    onPageChange = _ref.onPageChange;
  if (totalPages <= 1) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "pagination",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
      onClick: function onClick() {
        return onPageChange(currentPage - 1);
      },
      disabled: currentPage === 1,
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Previous', 'bcgov-design-system')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
      className: "page-info",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %1$d: current page number, %2$d: total number of pages */
      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Page %1$d of %2$d', 'bcgov-design-system'), currentPage, totalPages)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
      onClick: function onClick() {
        return onPageChange(currentPage + 1);
      },
      disabled: currentPage === totalPages,
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Next', 'bcgov-design-system')
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PaginationControls);

/***/ }),

/***/ "./assets/js/apps/document-repository/components/DocumentList/RetryNotice.js":
/*!***********************************************************************************!*\
  !*** ./assets/js/apps/document-repository/components/DocumentList/RetryNotice.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");



/**
 * RetryNotice Component
 *
 * Displays a notice for operations that can be retried
 *
 * @param {Object}   props
 * @param {Array}    props.failedOperations - Array of failed operations
 * @param {Function} props.onRetryAll       - Callback when retry all button is clicked
 */

var RetryNotice = function RetryNotice(_ref) {
  var failedOperations = _ref.failedOperations,
    onRetryAll = _ref.onRetryAll;
  if (failedOperations.length === 0) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Notice, {
    status: "warning",
    isDismissible: false,
    className: "retry-notice",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %d: number of failed operations */
      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('There are %d failed operations that can be retried.', 'bcgov-design-system'), failedOperations.length)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
      variant: "secondary",
      onClick: onRetryAll,
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Retry All', 'bcgov-design-system')
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RetryNotice);

/***/ }),

/***/ "./assets/js/apps/document-repository/components/DocumentList/SafeRender.js":
/*!**********************************************************************************!*\
  !*** ./assets/js/apps/document-repository/components/DocumentList/SafeRender.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }



/**
 * SafeRender Component
 *
 * A utility component that wraps document table rows to provide error boundary functionality.
 * Catches and handles rendering errors in individual rows without breaking the entire table.
 *
 * @augments {Component}
 * @param {Object}      props          - Component props
 * @param {JSX.Element} props.children - Child components to be rendered safely
 */

var SafeRender = /*#__PURE__*/function (_Component) {
  /**
   * Constructor for the SafeRender component
   * Initializes state for error handling
   *
   * @param {Object} props - Component props
   */
  function SafeRender(props) {
    var _this;
    _classCallCheck(this, SafeRender);
    _this = _callSuper(this, SafeRender, [props]);
    _this.state = {
      hasError: false,
      error: null
    };
    return _this;
  }

  /**
   * Static method that returns a new state when an error is caught
   * Updates the component state to indicate an error has occurred
   *
   * @static
   * @param {Error} error - The error that was caught
   * @return {Object} New state object with error information
   */
  _inherits(SafeRender, _Component);
  return _createClass(SafeRender, [{
    key: "renderError",
    value:
    /**
     * Renders the error UI when an error has been caught
     * Shows a user-friendly error message and detailed error info in development
     *
     * @return {JSX.Element} Error message UI with optional error details
     */
    function renderError() {
      var _this$state$error;
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "document-table-row error",
        role: "row",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "document-table-cell",
          role: "cell",
          style: {
            textAlign: 'center'
          },
          children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Error rendering document row.', 'bcgov-design-system'),  true && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("pre", {
            children: (_this$state$error = this.state.error) === null || _this$state$error === void 0 ? void 0 : _this$state$error.toString()
          })]
        })
      });
    }

    /**
     * Renders the child components when no error has been caught
     *
     * @return {JSX.Element} Child components
     */
  }, {
    key: "renderContent",
    value: function renderContent() {
      return this.props.children;
    }

    /**
     * Main render method that decides whether to show error UI or child components
     *
     * @return {JSX.Element} Either error UI or child components
     */
  }, {
    key: "render",
    value: function render() {
      if (this.state.hasError) {
        return this.renderError();
      }
      return this.renderContent();
    }
  }], [{
    key: "getDerivedStateFromError",
    value: function getDerivedStateFromError(error) {
      return {
        hasError: true,
        error: error
      };
    }
  }]);
}(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Component);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SafeRender);

/***/ }),

/***/ "./assets/js/apps/document-repository/components/DocumentList/UploadArea.js":
/*!**********************************************************************************!*\
  !*** ./assets/js/apps/document-repository/components/DocumentList/UploadArea.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }




/**
 * Upload Area Component
 *
 * Provides a drag-and-drop area for file uploads
 *
 * @param {Object}   props
 * @param {Function} props.onFilesSelected - Callback when files are selected
 * @param {string}   props.acceptMimeTypes - MIME types to accept (e.g. 'application/pdf')
 */

var UploadArea = function UploadArea(_ref) {
  var onFilesSelected = _ref.onFilesSelected,
    _ref$acceptMimeTypes = _ref.acceptMimeTypes,
    acceptMimeTypes = _ref$acceptMimeTypes === void 0 ? 'application/pdf' : _ref$acceptMimeTypes;
  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    isDragging = _useState2[0],
    setIsDragging = _useState2[1];
  var fileInputRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  var dragTimeoutRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);

  // Cleanup drag timeout on unmount
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    return function () {
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
    };
  }, []);
  var handleDragEnter = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  var handleDragOver = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);
  var handleDragLeave = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (e) {
    e.preventDefault();
    e.stopPropagation();
    var isLeavingContainer = !e.currentTarget.contains(e.relatedTarget);
    if (isLeavingContainer) {
      // Use timeout to prevent flickering
      dragTimeoutRef.current = setTimeout(function () {
        setIsDragging(false);
      }, 50);
    }
  }, []);
  var handleDrop = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    var droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      onFilesSelected(Array.from(droppedFiles));
    }
  }, [onFilesSelected]);
  var handleFileInputChange = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (e) {
    var files = Array.from(e.target.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);
  var handleUploadClick = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (e) {
    // If event exists, prevent it from bubbling up to parent elements
    if (e) {
      e.stopPropagation();
    }
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [fileInputRef]);
  var handleKeyDown = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (e) {
    // Handle Enter and Space keys
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleUploadClick();
    }
  }, [handleUploadClick]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "upload-area__container ".concat(isDragging ? 'upload-area__container--drag-active' : ''),
    onDragEnter: handleDragEnter,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
    onClick: handleUploadClick,
    onKeyDown: handleKeyDown,
    tabIndex: "0",
    role: "button",
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Click or drag files to upload', 'bcgov-design-system'),
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
      type: "file",
      ref: fileInputRef,
      className: "upload-area__file-input",
      onChange: handleFileInputChange,
      multiple: true,
      accept: acceptMimeTypes,
      "aria-hidden": "true"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "upload-area__content",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "upload-area__icon",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          width: "48",
          height: "48",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("path", {
            d: "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z",
            fill: "currentColor"
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h3", {
        className: "upload-area__text",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Drag & Drop or Click to Upload', 'bcgov-design-system')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
        className: "upload-area__help-text",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Upload PDF documents to the repository', 'bcgov-design-system')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        className: "upload-area__button",
        onClick: function onClick(e) {
          e.stopPropagation();
          handleUploadClick();
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Choose Files', 'bcgov-design-system')
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UploadArea);

/***/ }),

/***/ "./assets/js/apps/document-repository/components/DocumentList/UploadFeedback.js":
/*!**************************************************************************************!*\
  !*** ./assets/js/apps/document-repository/components/DocumentList/UploadFeedback.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");



/**
 * UploadFeedback Component
 *
 * Displays the status of file uploads in a modal-like interface.
 * Shows individual file status, progress, and error messages.
 * Provides a summary of upload results and allows closing when complete.
 *
 * @param {Object}   props                    - Component props
 * @param {Array}    props.uploadingFiles     - Array of files being uploaded with their status
 * @param {boolean}  props.showUploadFeedback - Flag to control visibility of the feedback UI
 * @param {Function} props.onClose            - Callback function to close the feedback UI
 *
 * @example
 * const files = [
 *   { id: '1', name: 'document.pdf', status: 'uploading' },
 *   { id: '2', name: 'report.pdf', status: 'success' }
 * ];
 * <UploadFeedback
 *   uploadingFiles={files}
 *   showUploadFeedback={true}
 *   onClose={() => setShowUploadFeedback(false)}
 * />
 */

var UploadFeedback = function UploadFeedback(_ref) {
  var uploadingFiles = _ref.uploadingFiles,
    showUploadFeedback = _ref.showUploadFeedback,
    onClose = _ref.onClose;
  // Auto-close after 3 seconds only when all uploads are complete or have errors
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
    if (showUploadFeedback && uploadingCount === 0 && processingCount === 0 && !hasPlaceholder) {
      var timer = setTimeout(function () {
        onClose();
      }, 3000); // 3 seconds to match error notice timing

      return function () {
        return clearTimeout(timer);
      };
    }
  }, [showUploadFeedback, uploadingCount, processingCount, hasPlaceholder, onClose]);

  // Return null if feedback should not be shown or no files are being uploaded
  if (!showUploadFeedback || uploadingFiles.length === 0) {
    return null;
  }

  // Count files by their status for summary display
  var successCount = uploadingFiles.filter(function (f) {
    return f.status === 'success';
  }).length;
  var errorCount = uploadingFiles.filter(function (f) {
    return f.status === 'error';
  }).length;
  var uploadingCount = uploadingFiles.filter(function (f) {
    return f.status === 'uploading';
  }).length;
  var processingCount = uploadingFiles.filter(function (f) {
    return f.status === 'processing';
  }).length;
  var hasPlaceholder = uploadingFiles.some(function (f) {
    return f.isPlaceholder;
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "upload-feedback",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "upload-feedback-header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "upload-feedback-title",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
          viewBox: "0 0 24 24",
          width: "16",
          height: "16",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
            d: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z",
            fill: "currentColor"
          })
        }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Document Upload Status', 'bcgov-design-system')]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
        className: "upload-feedback-close",
        onClick: function onClick() {
          // Only allow closing if no files are being processed or uploaded
          if (uploadingCount === 0 && processingCount === 0) {
            onClose();
          }
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
          viewBox: "0 0 24 24",
          width: "16",
          height: "16",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
            d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
            fill: "currentColor"
          })
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "upload-feedback-items",
      children: uploadingFiles.map(function (file) {
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "upload-feedback-item ".concat(file.status, " ").concat(file.isPlaceholder ? 'placeholder' : ''),
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
            className: "upload-feedback-item-name",
            children: file.name
          }), file.status === 'processing' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Processing…', 'bcgov-design-system')
          }), file.status === 'uploading' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Uploading…', 'bcgov-design-system')
          }), file.status === 'success' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
            viewBox: "0 0 24 24",
            width: "16",
            height: "16",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
              d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
              fill: "currentColor"
            })
          }), file.status === 'error' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
              viewBox: "0 0 24 24",
              width: "16",
              height: "16",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
                d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
                fill: "currentColor"
              })
            }), file.error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
              className: "upload-feedback-item-error",
              children: file.error
            })]
          })]
        }, file.id);
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "upload-feedback-summary",
      children: hasPlaceholder ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "processing",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
          viewBox: "0 0 24 24",
          width: "16",
          height: "16",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
            d: "M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z",
            fill: "currentColor"
          })
        }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Preparing files…', 'bcgov-design-system')]
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
        children: [processingCount > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "processing",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
            viewBox: "0 0 24 24",
            width: "16",
            height: "16",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
              d: "M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z",
              fill: "currentColor"
            })
          }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %d: number of files being processed */
          (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Processing %d files…', 'bcgov-design-system'), processingCount)]
        }), uploadingCount > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "uploading",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
            viewBox: "0 0 24 24",
            width: "16",
            height: "16",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
              d: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z",
              fill: "currentColor"
            })
          }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %d: number of files being uploaded */
          (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Uploading %d files…', 'bcgov-design-system'), uploadingCount)]
        }), successCount > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "success",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
            viewBox: "0 0 24 24",
            width: "16",
            height: "16",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
              d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
              fill: "currentColor"
            })
          }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %d: number of files that were successfully uploaded */
          (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('%d files uploaded successfully', 'bcgov-design-system'), successCount)]
        }), errorCount > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "error",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
            viewBox: "0 0 24 24",
            width: "16",
            height: "16",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
              d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
              fill: "currentColor"
            })
          }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %d: number of files that failed to upload */
          (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('%d files failed to upload', 'bcgov-design-system'), errorCount)]
        })]
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UploadFeedback);

/***/ }),

/***/ "./assets/js/apps/document-repository/components/DocumentList/VirtualDocumentTable.js":
/*!********************************************************************************************!*\
  !*** ./assets/js/apps/document-repository/components/DocumentList/VirtualDocumentTable.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _hooks_useVirtualization__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./hooks/useVirtualization */ "./assets/js/apps/document-repository/components/DocumentList/hooks/useVirtualization.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/**
 * VirtualDocumentTable Component
 *
 * A performance-optimized version of DocumentTable that uses virtualization
 * to render only the visible rows in the viewport, greatly improving
 * performance for large document lists.
 */






/**
 * VirtualDocumentTable Component
 *
 * @param {Object}   props                    Component props
 * @param {Array}    props.documents          List of documents to display
 * @param {Array}    props.selectedDocuments  Array of selected document IDs
 * @param {Function} props.onSelectDocument   Callback when a document is selected
 * @param {Function} props.onSelectAll        Callback to select all documents
 * @param {Function} props.onDelete           Callback to delete a document
 * @param {Function} props.onEdit             Callback to edit a document
 * @param {boolean}  props.isDeleting         Flag indicating if a delete operation is in progress
 * @param {Array}    props.metadataFields     Array of metadata field definitions
 * @param {boolean}  props.isSpreadsheetMode  Flag indicating if spreadsheet mode is active
 * @param {Object}   props.bulkEditedMetadata Object containing bulk edited metadata values
 * @param {Function} props.onMetadataChange   Callback when metadata is changed in spreadsheet mode
 * @param {Function} props.formatFileSize     Function to format file size
 */

var VirtualDocumentTable = function VirtualDocumentTable(_ref) {
  var _ref$documents = _ref.documents,
    documents = _ref$documents === void 0 ? [] : _ref$documents,
    _ref$selectedDocument = _ref.selectedDocuments,
    selectedDocuments = _ref$selectedDocument === void 0 ? [] : _ref$selectedDocument,
    onSelectDocument = _ref.onSelectDocument,
    onSelectAll = _ref.onSelectAll,
    onDelete = _ref.onDelete,
    onEdit = _ref.onEdit,
    _ref$isDeleting = _ref.isDeleting,
    isDeleting = _ref$isDeleting === void 0 ? false : _ref$isDeleting,
    _ref$metadataFields = _ref.metadataFields,
    metadataFields = _ref$metadataFields === void 0 ? [] : _ref$metadataFields,
    _ref$isSpreadsheetMod = _ref.isSpreadsheetMode,
    isSpreadsheetMode = _ref$isSpreadsheetMod === void 0 ? false : _ref$isSpreadsheetMod,
    _ref$bulkEditedMetada = _ref.bulkEditedMetadata,
    bulkEditedMetadata = _ref$bulkEditedMetada === void 0 ? {} : _ref$bulkEditedMetada,
    onMetadataChange = _ref.onMetadataChange,
    formatFileSize = _ref.formatFileSize;
  // Use virtualization hook
  var _useVirtualization = (0,_hooks_useVirtualization__WEBPACK_IMPORTED_MODULE_3__["default"])({
      itemHeight: 60,
      // Height of each row in pixels
      itemCount: documents.length,
      overscan: 5,
      // Number of extra rows to render above/below viewport
      initialHeight: 500 // Initial container height
    }),
    containerRef = _useVirtualization.containerRef,
    visibleRange = _useVirtualization.visibleRange,
    totalHeight = _useVirtualization.totalHeight,
    topOffset = _useVirtualization.topOffset;

  // Handle select all checkbox
  var handleSelectAll = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (isChecked) {
    onSelectAll(isChecked);
  }, [onSelectAll]);

  // Check if all documents are selected
  var areAllSelected = documents.length > 0 && selectedDocuments.length === documents.length;

  // Check if some documents are selected
  var areSomeSelected = selectedDocuments.length > 0 && selectedDocuments.length < documents.length;

  // Render only the visible rows
  var visibleDocuments = documents.slice(visibleRange.start, visibleRange.end);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
    className: "virtualized-table-container",
    ref: containerRef,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("table", {
      className: "document-table",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("thead", {
        className: "document-table__header",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("tr", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
            className: "checkbox-column",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
              checked: areAllSelected,
              indeterminate: areSomeSelected,
              onChange: handleSelectAll
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Document', 'bcgov-design-system')
          }), metadataFields.map(function (field) {
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
              children: field.label
            }, field.id);
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('File Size', 'bcgov-design-system')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
            className: "actions-column",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Actions', 'bcgov-design-system')
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("tbody", {
        style: {
          height: "".concat(totalHeight, "px"),
          position: 'relative'
        },
        children: documents.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("tr", {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("td", {
            colSpan: metadataFields.length + 4,
            className: "empty-state",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No documents found.', 'bcgov-design-system')
          })
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "virtualized-rows",
          style: {
            position: 'absolute',
            top: "".concat(topOffset, "px"),
            width: '100%'
          },
          children: visibleDocuments.map(function (document) {
            var _document$metadata2, _document$metadata3;
            var isSelected = selectedDocuments.includes(document.id);
            var rowClass = isSelected ? 'document-table__row document-table__row--selected' : 'document-table__row';
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("tr", {
              className: rowClass,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("td", {
                className: "checkbox-column",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
                  checked: isSelected,
                  onChange: function onChange() {
                    return onSelectDocument(document.id);
                  }
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("td", {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                  className: "document-cell",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                    className: "document-cell__title",
                    children: document.title || document.filename || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Untitled', 'bcgov-design-system')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                    className: "document-cell__metadata",
                    children: document.filename || document.title || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No filename', 'bcgov-design-system')
                  })]
                })
              }), metadataFields.map(function (field) {
                var _document$metadata, _bulkEditedMetadata$d, _bulkEditedMetadata$d2;
                var fieldValue = ((_document$metadata = document.metadata) === null || _document$metadata === void 0 ? void 0 : _document$metadata[field.id]) || '';
                var cellValue = isSpreadsheetMode ? (_bulkEditedMetadata$d = (_bulkEditedMetadata$d2 = bulkEditedMetadata[document.id]) === null || _bulkEditedMetadata$d2 === void 0 ? void 0 : _bulkEditedMetadata$d2[field.id]) !== null && _bulkEditedMetadata$d !== void 0 ? _bulkEditedMetadata$d : fieldValue : fieldValue;
                if (isSpreadsheetMode) {
                  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("td", {
                    className: "editable-cell",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
                      type: "text",
                      className: "editable-field",
                      value: cellValue,
                      onChange: function onChange(e) {
                        return onMetadataChange(document.id, field.id, e.target.value);
                      }
                    })
                  }, field.id);
                }
                return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("td", {
                  children: cellValue
                }, field.id);
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("td", {
                className: "file-size",
                children: (_document$metadata2 = document.metadata) !== null && _document$metadata2 !== void 0 && _document$metadata2.document_file_size ? formatFileSize(parseInt(document.metadata.document_file_size)) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('N/A', 'bcgov-design-system')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("td", {
                className: "actions-column",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                  className: "action-buttons",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
                    className: "edit-button",
                    onClick: function onClick() {
                      return onEdit(document);
                    },
                    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Edit Document', 'bcgov-design-system'),
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("svg", {
                      viewBox: "0 0 24 24",
                      width: "24",
                      height: "24",
                      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("path", {
                        fill: "currentColor",
                        d: "M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"
                      })
                    })
                  }), ((_document$metadata3 = document.metadata) === null || _document$metadata3 === void 0 ? void 0 : _document$metadata3.document_file_url) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("a", {
                    href: document.metadata.document_file_url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "view-button",
                    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('View Document', 'bcgov-design-system'),
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("svg", {
                      viewBox: "0 0 24 24",
                      width: "24",
                      height: "24",
                      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("path", {
                        fill: "currentColor",
                        d: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                      })
                    })
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
                    className: "delete-button",
                    onClick: function onClick() {
                      return onDelete(document);
                    },
                    disabled: isDeleting,
                    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Delete Document', 'bcgov-design-system'),
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("svg", {
                      viewBox: "0 0 24 24",
                      width: "24",
                      height: "24",
                      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("path", {
                        fill: "currentColor",
                        d: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                      })
                    })
                  })]
                })
              })]
            }, document.id);
          })
        })
      })]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VirtualDocumentTable);

/***/ }),

/***/ "./assets/js/apps/document-repository/components/DocumentList/hooks/useDocumentManagement.js":
/*!***************************************************************************************************!*\
  !*** ./assets/js/apps/document-repository/components/DocumentList/hooks/useDocumentManagement.js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }



/**
 * Custom hook for document management operations
 *
 * @param {Object}   options                    Options for the hook
 * @param {Function} options.onDelete           Function to delete a document
 * @param {Function} options.onSelectAll        Function to select/deselect all documents
 * @param {Function} options.onShowNotification Function to show notifications
 * @param {Function} options.onError            Function to handle errors
 * @return {Object} Document management state and functions
 */
var useDocumentManagement = function useDocumentManagement(_ref) {
  var onDelete = _ref.onDelete,
    onSelectAll = _ref.onSelectAll,
    onShowNotification = _ref.onShowNotification,
    onError = _ref.onError;
  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    deleteDocument = _useState2[0],
    setDeleteDocument = _useState2[1];
  var _useState3 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    bulkDeleteConfirmOpen = _useState4[0],
    setBulkDeleteConfirmOpen = _useState4[1];
  var _useState5 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    isMultiDeleting = _useState6[0],
    setIsMultiDeleting = _useState6[1];

  /**
   * Handle bulk deletion of documents
   * @param {Array} selectedDocuments Array of document IDs to delete
   */
  var handleBulkDelete = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(/*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(selectedDocuments) {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!(!selectedDocuments || selectedDocuments.length === 0)) {
              _context.next = 2;
              break;
            }
            return _context.abrupt("return");
          case 2:
            setIsMultiDeleting(true);
            _context.prev = 3;
            _context.next = 6;
            return Promise.all(selectedDocuments.map(function (docId) {
              return onDelete(docId);
            }));
          case 6:
            setBulkDeleteConfirmOpen(false);
            onSelectAll(false);
            if (onShowNotification) {
              onShowNotification('success', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Selected documents were deleted successfully.', 'bcgov-design-system'));
            }
            _context.next = 14;
            break;
          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](3);
            if (onError) {
              onError('bulk-delete', null, _context.t0, {
                addToRetryQueue: false,
                customMessage: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Error deleting one or more documents.', 'bcgov-design-system')
              });
            }
          case 14:
            _context.prev = 14;
            setIsMultiDeleting(false);
            return _context.finish(14);
          case 17:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[3, 11, 14, 17]]);
    }));
    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }(), [onDelete, onSelectAll, onShowNotification, onError]);

  /**
   * Delete a single document
   * @param {number} documentId Document ID to delete
   */
  var handleSingleDelete = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(/*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(documentId) {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return onDelete(documentId);
          case 3:
            setDeleteDocument(null);
            if (onShowNotification) {
              onShowNotification('success', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Document deleted successfully.', 'bcgov-design-system'));
            }
            _context2.next = 10;
            break;
          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            if (onError) {
              onError('delete', documentId, _context2.t0, {
                customMessage: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %1$d: document ID, %2$s: error message */
                (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Error deleting document %1$d: %2$s', 'bcgov-design-system'), documentId, _context2.t0.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('An unknown error occurred', 'bcgov-design-system'))
              });
            }
          case 10:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[0, 7]]);
    }));
    return function (_x2) {
      return _ref3.apply(this, arguments);
    };
  }(), [onDelete, onShowNotification, onError]);

  /**
   * Open bulk delete confirmation dialog
   */
  var openBulkDeleteConfirm = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    setBulkDeleteConfirmOpen(true);
  }, []);

  /**
   * Close bulk delete confirmation dialog
   */
  var closeBulkDeleteConfirm = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    setBulkDeleteConfirmOpen(false);
  }, []);
  return {
    // State
    deleteDocument: deleteDocument,
    bulkDeleteConfirmOpen: bulkDeleteConfirmOpen,
    isMultiDeleting: isMultiDeleting,
    // Actions
    setDeleteDocument: setDeleteDocument,
    handleBulkDelete: handleBulkDelete,
    handleSingleDelete: handleSingleDelete,
    openBulkDeleteConfirm: openBulkDeleteConfirm,
    closeBulkDeleteConfirm: closeBulkDeleteConfirm
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useDocumentManagement);

/***/ }),

/***/ "./assets/js/apps/document-repository/components/DocumentList/hooks/useErrorHandling.js":
/*!**********************************************************************************************!*\
  !*** ./assets/js/apps/document-repository/components/DocumentList/hooks/useErrorHandling.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }



/**
 * Custom hook for error handling and operation retries
 *
 * @param {Object}   options                    Options for the hook
 * @param {Function} options.onShowNotification Function to show notifications
 * @return {Object} Error handling state and functions
 */
var useErrorHandling = function useErrorHandling(_ref) {
  var onShowNotification = _ref.onShowNotification;
  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    failedOperations = _useState2[0],
    setFailedOperations = _useState2[1];
  var _useState3 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({}),
    _useState4 = _slicedToArray(_useState3, 2),
    retryCount = _useState4[0],
    setRetryCount = _useState4[1];

  /**
   * Handles errors and tracks failed operations
   * @param {string}        operationType           - Type of operation that failed (delete, metadata, upload)
   * @param {number|string} documentId              - ID of the document or operation that failed
   * @param {Error|Object}  error                   - Error object
   * @param {Object}        options                 - Additional options
   * @param {boolean}       options.addToRetryQueue - Whether to add to the retry queue
   * @param {boolean}       options.showNotice      - Whether to show a notification
   * @param {string}        options.customMessage   - Custom message to display instead of the default
   */
  var handleOperationError = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (operationType, documentId, error) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var _options$addToRetryQu = options.addToRetryQueue,
      addToRetryQueue = _options$addToRetryQu === void 0 ? true : _options$addToRetryQu,
      _options$showNotice = options.showNotice,
      showNotice = _options$showNotice === void 0 ? true : _options$showNotice,
      _options$customMessag = options.customMessage,
      customMessage = _options$customMessag === void 0 ? null : _options$customMessag;

    // Add to retry queue if needed
    if (addToRetryQueue) {
      setFailedOperations(function (prev) {
        return [].concat(_toConsumableArray(prev), [{
          type: operationType,
          documentId: documentId,
          error: error
        }]);
      });
      setRetryCount(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, documentId, (prev[documentId] || 0) + 1));
      });
    }

    // Show notification if needed
    if (showNotice && onShowNotification) {
      var _error$data;
      var errorMessage = customMessage || error.message || ((_error$data = error.data) === null || _error$data === void 0 ? void 0 : _error$data.message) || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('An unknown error occurred.', 'bcgov-design-system');
      onShowNotification('error', documentId ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %1$d: document ID, %2$s: error message */
      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Operation failed for document %1$d: %2$s', 'bcgov-design-system'), documentId, errorMessage) : errorMessage);
    }
  }, [onShowNotification]);

  /**
   * Retry a specific failed operation
   * @param {Object} operation - The operation to retry
   * @param {Object} handlers  - Handlers for different operation types
   */
  var retryOperation = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(/*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(operation, handlers) {
      var maxRetries, handler;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            maxRetries = 3;
            if (!(retryCount[operation.documentId] >= maxRetries)) {
              _context.next = 4;
              break;
            }
            onShowNotification('error', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %1$d: document ID */
            (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Maximum retry attempts reached for document %1$d', 'bcgov-design-system'), operation.documentId));
            return _context.abrupt("return");
          case 4:
            _context.prev = 4;
            handler = handlers[operation.type];
            if (!handler) {
              _context.next = 11;
              break;
            }
            _context.next = 9;
            return handler(operation.documentId);
          case 9:
            _context.next = 12;
            break;
          case 11:
            return _context.abrupt("return", {
              error: "Unknown operation type: ".concat(operation.type)
            });
          case 12:
            // Remove from failed operations if successful
            setFailedOperations(function (prev) {
              return prev.filter(function (op) {
                return !(op.type === operation.type && op.documentId === operation.documentId);
              });
            });
            _context.next = 18;
            break;
          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](4);
            handleOperationError(operation.type, operation.documentId, _context.t0);
          case 18:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[4, 15]]);
    }));
    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }(), [retryCount, handleOperationError, onShowNotification]);

  /**
   * Retry all failed operations
   * @param {Object} handlers - Handlers for different operation types
   */
  var retryAllOperations = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (handlers) {
    failedOperations.forEach(function (operation) {
      return retryOperation(operation, handlers);
    });
  }, [failedOperations, retryOperation]);
  return {
    failedOperations: failedOperations,
    handleOperationError: handleOperationError,
    retryOperation: retryOperation,
    retryAllOperations: retryAllOperations
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useErrorHandling);

/***/ }),

/***/ "./assets/js/apps/document-repository/components/DocumentList/hooks/useFileHandling.js":
/*!*********************************************************************************************!*\
  !*** ./assets/js/apps/document-repository/components/DocumentList/hooks/useFileHandling.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }



/**
 * Custom hook for handling file uploads
 *
 * @param {Object}   options                    Options for the hook
 * @param {Function} options.onFileDrop         Callback to handle file upload
 * @param {Function} options.onShowNotification Callback for showing notifications
 * @param {Function} options.onError            Callback for error handling
 * @return {Object} File handling state and functions
 */
var useFileHandling = function useFileHandling(_ref) {
  var onFileDrop = _ref.onFileDrop,
    onShowNotification = _ref.onShowNotification,
    onError = _ref.onError;
  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    uploadingFiles = _useState2[0],
    setUploadingFiles = _useState2[1];
  var _useState3 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    showUploadFeedback = _useState4[0],
    setShowUploadFeedback = _useState4[1];

  /**
   * Handle files selected for upload
   * @param {Array} files Array of File objects
   */
  var handleFiles = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (files) {
    // Show immediate feedback before any processing
    setShowUploadFeedback(true);
    if (!files || files.length === 0) {
      if (onShowNotification) {
        onShowNotification('error', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No files were selected for upload.', 'bcgov-design-system'));
      }
      setShowUploadFeedback(false);
      return;
    }

    // Display placeholder while processing files
    setUploadingFiles([{
      id: 'placeholder',
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %d: number of files being prepared */
      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Preparing %d files…', 'bcgov-design-system'), files.length),
      status: 'processing',
      error: null,
      isPlaceholder: true
    }]);

    // Process files and create file objects for display
    var processedFiles = files.map(function (file) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        originalFile: file,
        status: 'processing',
        error: null
      };
    });

    // Update UI with processing files
    setUploadingFiles(processedFiles);

    // Filter for PDF files and check file types
    var pdfFiles = [];
    var nonPdfFiles = [];
    files.forEach(function (file) {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        pdfFiles.push(file);
      } else {
        nonPdfFiles.push(file);
      }
    });

    // Update UI with file validation results
    setUploadingFiles(function (prev) {
      return prev.map(function (f) {
        var originalFile = files.find(function (file) {
          return file.name === f.name;
        });
        var isPdf = originalFile && (originalFile.type === 'application/pdf' || originalFile.name.toLowerCase().endsWith('.pdf'));
        return _objectSpread(_objectSpread({}, f), {}, {
          status: isPdf ? 'uploading' : 'error',
          error: isPdf ? null : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Not a PDF file. Only PDF files are allowed.', 'bcgov-design-system')
        });
      });
    });

    // Show error notice if any files were skipped
    if (nonPdfFiles.length > 0 && onShowNotification) {
      onShowNotification('warning', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %1$d: number of skipped files, %2$d: total number of files */
      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('%1$d of %2$d files were skipped because they are not PDFs.', 'bcgov-design-system'), nonPdfFiles.length, files.length));
    }

    // If no valid files, return
    if (pdfFiles.length === 0) {
      return;
    }

    // Upload each valid PDF file
    pdfFiles.forEach(function (file) {
      onFileDrop(file).then(function () {
        // Update UI with success
        setUploadingFiles(function (prev) {
          return prev.map(function (f) {
            return f.name === file.name ? _objectSpread(_objectSpread({}, f), {}, {
              status: 'success'
            }) : f;
          });
        });
      })["catch"](function (error) {
        // Update UI with error details
        setUploadingFiles(function (prev) {
          return prev.map(function (f) {
            return f.name === file.name ? _objectSpread(_objectSpread({}, f), {}, {
              status: 'error',
              error: error.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Upload failed. Please try again.', 'bcgov-design-system')
            }) : f;
          });
        });

        // Handle error
        if (onError) {
          onError('upload', file.name, error, {
            addToRetryQueue: false,
            customMessage: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %1$s: file name, %2$s: error message */
            (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Error uploading "%1$s": %2$s', 'bcgov-design-system'), file.name, error.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Upload failed', 'bcgov-design-system'))
          });
        }
      });
    });
  }, [onFileDrop, onShowNotification, onError]);

  /**
   * Close the upload feedback UI
   */
  var closeUploadFeedback = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    setShowUploadFeedback(false);
    setUploadingFiles([]);
  }, []);
  return {
    uploadingFiles: uploadingFiles,
    showUploadFeedback: showUploadFeedback,
    handleFiles: handleFiles,
    closeUploadFeedback: closeUploadFeedback
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useFileHandling);

/***/ }),

/***/ "./assets/js/apps/document-repository/components/DocumentList/hooks/useMetadataManagement.js":
/*!***************************************************************************************************!*\
  !*** ./assets/js/apps/document-repository/components/DocumentList/hooks/useMetadataManagement.js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }




/**
 * Metadata reducer for handling metadata state
 * @param {Object}  state                      - The current state
 * @param {Object}  action                     - The action to perform
 * @param {string}  action.type                - The type of action
 * @param {*}       action.payload             - The payload for the action
 * @param {Object}  [action.initialValues]     - Initial values for editing
 * @param {Object}  [action.initialBulkValues] - Initial values for bulk editing
 * @param {string}  [action.documentId]        - Document ID for bulk updates
 * @param {string}  [action.fieldId]           - Field ID for bulk updates
 * @param {*}       [action.value]             - New value for bulk updates
 * @param {boolean} [action.hasChanges]        - Whether there are changes
 * @return {Object} The new state
 */
var metadataReducer = function metadataReducer(state, action) {
  switch (action.type) {
    case 'SET_EDITING_DOCUMENT':
      return _objectSpread(_objectSpread({}, state), {}, {
        editingMetadata: action.payload,
        editedValues: action.initialValues || {},
        errors: {}
      });
    case 'CLEAR_EDITING_DOCUMENT':
      return _objectSpread(_objectSpread({}, state), {}, {
        editingMetadata: null,
        editedValues: {},
        errors: {}
      });
    case 'UPDATE_EDITED_VALUES':
      return _objectSpread(_objectSpread({}, state), {}, {
        editedValues: _objectSpread(_objectSpread({}, state.editedValues), action.payload)
      });
    case 'SET_ERRORS':
      return _objectSpread(_objectSpread({}, state), {}, {
        errors: action.payload
      });
    case 'SET_IS_SAVING':
      return _objectSpread(_objectSpread({}, state), {}, {
        isSaving: action.payload
      });
    case 'ENTER_SPREADSHEET_MODE':
      return _objectSpread(_objectSpread({}, state), {}, {
        isSpreadsheetMode: true,
        bulkEditedMetadata: action.initialBulkValues || {},
        hasMetadataChanges: false
      });
    case 'EXIT_SPREADSHEET_MODE':
      return _objectSpread(_objectSpread({}, state), {}, {
        isSpreadsheetMode: false,
        bulkEditedMetadata: {},
        hasMetadataChanges: false
      });
    case 'UPDATE_BULK_METADATA':
      return _objectSpread(_objectSpread({}, state), {}, {
        bulkEditedMetadata: _objectSpread(_objectSpread({}, state.bulkEditedMetadata), {}, _defineProperty({}, action.documentId, _objectSpread(_objectSpread({}, state.bulkEditedMetadata[action.documentId]), {}, _defineProperty({}, action.fieldId, action.value)))),
        hasMetadataChanges: action.hasChanges
      });
    case 'SET_IS_SAVING_BULK':
      return _objectSpread(_objectSpread({}, state), {}, {
        isSavingBulk: action.payload
      });
    case 'CLEAR_BULK_CHANGES':
      return _objectSpread(_objectSpread({}, state), {}, {
        bulkEditedMetadata: {},
        hasMetadataChanges: false
      });
    default:
      return state;
  }
};

/**
 * Custom hook for managing document metadata
 *
 * @param {Object}   options                    Options for the hook
 * @param {Array}    options.documents          Current documents array
 * @param {Array}    options.metadataFields     Metadata field definitions
 * @param {string}   options.apiNamespace       API namespace for metadata operations
 * @param {Function} options.onUpdateDocuments  Callback when documents are updated
 * @param {Function} options.onError            Callback for error handling
 * @param {Function} options.onShowNotification Callback for showing notifications
 * @return {Object} Metadata management state and functions
 */
var useMetadataManagement = function useMetadataManagement(_ref) {
  var _ref$documents = _ref.documents,
    documents = _ref$documents === void 0 ? [] : _ref$documents,
    _ref$metadataFields = _ref.metadataFields,
    metadataFields = _ref$metadataFields === void 0 ? [] : _ref$metadataFields,
    apiNamespace = _ref.apiNamespace,
    onUpdateDocuments = _ref.onUpdateDocuments,
    onError = _ref.onError,
    onShowNotification = _ref.onShowNotification;
  // Use reducer for all metadata-related state
  var _useReducer = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useReducer)(metadataReducer, {
      // Single document editing
      editingMetadata: null,
      editedValues: {},
      errors: {},
      isSaving: false,
      // Spreadsheet mode - critical for keeping the save button functionality
      isSpreadsheetMode: false,
      bulkEditedMetadata: {},
      hasMetadataChanges: false,
      isSavingBulk: false
    }),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    metadataState = _useReducer2[0],
    dispatch = _useReducer2[1];

  // Maintain local copy of documents
  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(documents),
    _useState2 = _slicedToArray(_useState, 2),
    localDocuments = _useState2[0],
    setLocalDocuments = _useState2[1];

  // Keep local documents in sync with documents prop
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    setLocalDocuments(documents);
  }, [documents]);

  /**
   * Check if metadata values have changed
   */
  var hasMetadataChanged = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    var editingMetadata = metadataState.editingMetadata,
      editedValues = metadataState.editedValues;
    if (!editingMetadata) {
      return false;
    }
    return metadataFields.some(function (field) {
      var _editingMetadata$meta;
      var currentValue = ((_editingMetadata$meta = editingMetadata.metadata) === null || _editingMetadata$meta === void 0 ? void 0 : _editingMetadata$meta[field.id]) || '';
      var editedValue = editedValues[field.id] || '';
      return currentValue !== editedValue;
    });
  }, [metadataState, metadataFields]);

  /**
   * Start editing a document's metadata
   * @param {Object} document The document to edit
   */
  var handleEditMetadata = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (document) {
    var _document$metadata;
    // If document is null, clear the editing state
    if (!document) {
      dispatch({
        type: 'CLEAR_EDITING_DOCUMENT'
      });
      return;
    }
    var documentToEdit = _objectSpread(_objectSpread({}, document), {}, {
      upload_date: document.date || document.upload_date || ((_document$metadata = document.metadata) === null || _document$metadata === void 0 ? void 0 : _document$metadata.upload_date)
    });

    // Initialize edited values with current metadata, preserving case
    var initialValues = {};
    metadataFields.forEach(function (field) {
      var _document$metadata$fi, _document$metadata2;
      initialValues[field.id] = (_document$metadata$fi = (_document$metadata2 = document.metadata) === null || _document$metadata2 === void 0 ? void 0 : _document$metadata2[field.id]) !== null && _document$metadata$fi !== void 0 ? _document$metadata$fi : '';
    });
    dispatch({
      type: 'SET_EDITING_DOCUMENT',
      payload: documentToEdit,
      initialValues: initialValues
    });
  }, [metadataFields]);

  /**
   * Handle metadata field value change
   * @param {number} documentId Document ID
   * @param {string} fieldId    Field ID
   * @param {string} value      New value
   */
  var handleMetadataChange = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (documentId, fieldId, value) {
    // Update bulk edited metadata
    var newBulkMetadata = _objectSpread(_objectSpread({}, metadataState.bulkEditedMetadata), {}, _defineProperty({}, documentId, _objectSpread(_objectSpread({}, metadataState.bulkEditedMetadata[documentId]), {}, _defineProperty({}, fieldId, value))));

    // Check if any metadata has changed
    var hasChanges = Object.entries(newBulkMetadata).some(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
        docId = _ref3[0],
        editedMetadata = _ref3[1];
      var currentDoc = localDocuments.find(function (doc) {
        return doc.id === parseInt(docId);
      });
      if (!currentDoc) {
        return false;
      }
      return Object.entries(editedMetadata).some(function (_ref4) {
        var _currentDoc$metadata;
        var _ref5 = _slicedToArray(_ref4, 2),
          currentFieldId = _ref5[0],
          editedValue = _ref5[1];
        var originalValue = ((_currentDoc$metadata = currentDoc.metadata) === null || _currentDoc$metadata === void 0 ? void 0 : _currentDoc$metadata[currentFieldId]) || '';
        var isChanged = String(originalValue) !== String(editedValue);
        return isChanged;
      });
    });

    // Update state with changed value and hasChanges flag
    dispatch({
      type: 'UPDATE_BULK_METADATA',
      documentId: documentId,
      fieldId: fieldId,
      value: value,
      hasChanges: hasChanges
    });

    // Always update local documents to reflect changes in the UI
    setLocalDocuments(function (prev) {
      var newDocs = prev.map(function (doc) {
        if (doc.id === documentId) {
          return _objectSpread(_objectSpread({}, doc), {}, {
            metadata: _objectSpread(_objectSpread({}, doc.metadata), {}, _defineProperty({}, fieldId, value))
          });
        }
        return doc;
      });
      return newDocs;
    });
  }, [localDocuments, metadataState.bulkEditedMetadata, dispatch]);

  /**
   * Update a single field value when editing a single document
   * @param {string} fieldId Field ID
   * @param {string} value   New value
   */
  var updateEditedField = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (fieldId, value) {
    dispatch({
      type: 'UPDATE_EDITED_VALUES',
      payload: _defineProperty({}, fieldId, value)
    });
  }, [dispatch]);

  /**
   * Save metadata changes for a single document
   */
  var handleSaveMetadata = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var editingMetadata, editedValues, _error$data, _error$data2;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          editingMetadata = metadataState.editingMetadata, editedValues = metadataState.editedValues;
          if (editingMetadata) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return");
        case 3:
          dispatch({
            type: 'SET_IS_SAVING',
            payload: true
          });
          _context.prev = 4;
          _context.next = 7;
          return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
            path: "/".concat(apiNamespace, "/documents/").concat(editingMetadata.id, "/metadata"),
            method: 'POST',
            data: editedValues
          });
        case 7:
          // Update local documents
          setLocalDocuments(function (prev) {
            return prev.map(function (doc) {
              return doc.id === editingMetadata.id ? _objectSpread(_objectSpread({}, doc), {}, {
                metadata: _objectSpread(_objectSpread({}, doc.metadata), editedValues)
              }) : doc;
            });
          });

          // Update parent component if needed
          if (typeof onUpdateDocuments === 'function') {
            onUpdateDocuments(localDocuments.map(function (doc) {
              return doc.id === editingMetadata.id ? _objectSpread(_objectSpread({}, doc), {}, {
                metadata: _objectSpread(_objectSpread({}, doc.metadata), editedValues)
              }) : doc;
            }));
          }

          // Reset editing state
          dispatch({
            type: 'CLEAR_EDITING_DOCUMENT'
          });

          // Show success notification
          if (onShowNotification) {
            onShowNotification('success', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Document metadata updated successfully', 'bcgov-design-system'));
          }
          _context.next = 17;
          break;
        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](4);
          if ((_error$data = _context.t0.data) !== null && _error$data !== void 0 && _error$data.errors) {
            dispatch({
              type: 'SET_ERRORS',
              payload: _context.t0.data.errors
            });
          }
          if (onError) {
            onError('metadata', editingMetadata.id, _context.t0, {
              customMessage: ((_error$data2 = _context.t0.data) === null || _error$data2 === void 0 ? void 0 : _error$data2.message) || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Failed to update metadata', 'bcgov-design-system')
            });
          }
        case 17:
          _context.prev = 17;
          dispatch({
            type: 'SET_IS_SAVING',
            payload: false
          });
          return _context.finish(17);
        case 20:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[4, 13, 17, 20]]);
  })), [metadataState, apiNamespace, localDocuments, onUpdateDocuments, onShowNotification, onError, dispatch]);

  /**
   * Toggle spreadsheet mode on/off
   * @param {boolean} enabled Whether to enable spreadsheet mode
   */
  var toggleSpreadsheetMode = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (enabled) {
    if (enabled) {
      // Initialize bulk edit metadata when entering spreadsheet mode
      var initialBulkMetadata = {};
      localDocuments.forEach(function (doc) {
        initialBulkMetadata[doc.id] = _objectSpread({}, doc.metadata || {});
      });
      dispatch({
        type: 'ENTER_SPREADSHEET_MODE',
        initialBulkValues: initialBulkMetadata
      });
    } else {
      dispatch({
        type: 'EXIT_SPREADSHEET_MODE'
      });
    }
  }, [localDocuments]);

  /**
   * Save all bulk metadata changes
   */
  var handleSaveBulkChanges = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var bulkEditedMetadata, results, failed;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          bulkEditedMetadata = metadataState.bulkEditedMetadata;
          dispatch({
            type: 'SET_IS_SAVING_BULK',
            payload: true
          });
          _context2.prev = 2;
          _context2.next = 5;
          return Promise.allSettled(Object.entries(bulkEditedMetadata).map(function (_ref8) {
            var _ref9 = _slicedToArray(_ref8, 2),
              docId = _ref9[0],
              metadata = _ref9[1];
            return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
              path: "/".concat(apiNamespace, "/documents/").concat(docId, "/metadata"),
              method: 'POST',
              data: metadata
            });
          }));
        case 5:
          results = _context2.sent;
          // Process results
          failed = results.map(function (result, index) {
            return {
              result: result,
              docId: Object.keys(bulkEditedMetadata)[index]
            };
          }).filter(function (_ref10) {
            var result = _ref10.result;
            return result.status === 'rejected';
          });
          if (failed.length > 0) {
            // Handle failed operations
            failed.forEach(function (_ref11) {
              var result = _ref11.result,
                docId = _ref11.docId;
              if (onError) {
                onError('metadata', docId, result.reason, {
                  showNotice: false // Don't show individual notices
                });
              }
            });

            // Show summary notification
            if (onShowNotification) {
              onShowNotification('warning', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.sprintf)(/* translators: %1$d: number of failed updates, %2$d: total number of updates */
              (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('%1$d of %2$d metadata updates failed. You can retry the failed operations.', 'bcgov-design-system'), failed.length, Object.keys(bulkEditedMetadata).length), 0 // Don't auto-dismiss
              );
            }
          } else {
            // All updates successful
            if (onShowNotification) {
              onShowNotification('success', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('All metadata changes saved successfully.', 'bcgov-design-system'));
            }

            // Clear bulk changes state
            dispatch({
              type: 'CLEAR_BULK_CHANGES'
            });

            // Exit spreadsheet mode
            dispatch({
              type: 'EXIT_SPREADSHEET_MODE'
            });
          }
          _context2.next = 13;
          break;
        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](2);
          if (onError) {
            onError('bulk-metadata', null, _context2.t0);
          }
        case 13:
          _context2.prev = 13;
          dispatch({
            type: 'SET_IS_SAVING_BULK',
            payload: false
          });
          return _context2.finish(13);
        case 16:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[2, 10, 13, 16]]);
  })), [metadataState, apiNamespace, onError, onShowNotification]);
  return {
    // Single document editing
    editingMetadata: metadataState.editingMetadata,
    editedValues: metadataState.editedValues,
    errors: metadataState.errors,
    isSaving: metadataState.isSaving,
    hasMetadataChanged: hasMetadataChanged,
    handleEditMetadata: handleEditMetadata,
    updateEditedField: updateEditedField,
    handleSaveMetadata: handleSaveMetadata,
    // Spreadsheet mode
    isSpreadsheetMode: metadataState.isSpreadsheetMode,
    hasMetadataChanges: metadataState.hasMetadataChanges,
    bulkEditedMetadata: metadataState.bulkEditedMetadata,
    isSavingBulk: metadataState.isSavingBulk,
    handleMetadataChange: handleMetadataChange,
    toggleSpreadsheetMode: toggleSpreadsheetMode,
    handleSaveBulkChanges: handleSaveBulkChanges,
    // Document state
    localDocuments: localDocuments
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useMetadataManagement);

/***/ }),

/***/ "./assets/js/apps/document-repository/components/DocumentList/hooks/useNotifications.js":
/*!**********************************************************************************************!*\
  !*** ./assets/js/apps/document-repository/components/DocumentList/hooks/useNotifications.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }


/**
 * Custom hook for managing notifications.
 *
 * @return {Object} Notification state and functions
 * @property {Object|null} notice            - Current notification object or null
 * @property {Function}    showNotification  - Function to show a notification
 * @property {Function}    clearNotification - Function to clear the notification
 */
var useNotifications = function useNotifications() {
  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    notice = _useState2[0],
    setNotice = _useState2[1];

  /**
   * Display a notification message
   * @param {string} status  - Status of the notification (success, error, warning)
   * @param {string} message - Message to display
   * @param {number} timeout - Time in ms before auto-dismissing (0 to disable)
   */
  var showNotification = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (status, message) {
    var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3000;
    setNotice({
      status: status,
      message: message
    });
    if (timeout > 0) {
      setTimeout(function () {
        return setNotice(null);
      }, timeout);
    }
  }, []);

  /**
   * Clear the current notification
   */
  var clearNotification = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    setNotice(null);
  }, []);
  return {
    notice: notice,
    showNotification: showNotification,
    clearNotification: clearNotification
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useNotifications);

/***/ }),

/***/ "./assets/js/apps/document-repository/components/DocumentList/hooks/useVirtualization.js":
/*!***********************************************************************************************!*\
  !*** ./assets/js/apps/document-repository/components/DocumentList/hooks/useVirtualization.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/**
 * useVirtualization Hook
 *
 * A custom hook that handles virtualization logic for rendering large lists efficiently.
 * It calculates which items should be visible in the viewport based on scroll position.
 */



/**
 * useVirtualization Hook
 *
 * @param {Object} options               Virtualization options
 * @param {number} options.itemHeight    Height of each item in pixels
 * @param {number} options.itemCount     Total number of items
 * @param {number} options.overscan      Number of extra items to render above/below viewport
 * @param {number} options.initialHeight Initial container height in pixels
 * @return {Object} Virtualization state and handlers
 */
var useVirtualization = function useVirtualization(_ref) {
  var _ref$itemHeight = _ref.itemHeight,
    itemHeight = _ref$itemHeight === void 0 ? 60 : _ref$itemHeight,
    _ref$itemCount = _ref.itemCount,
    itemCount = _ref$itemCount === void 0 ? 0 : _ref$itemCount,
    _ref$overscan = _ref.overscan,
    overscan = _ref$overscan === void 0 ? 5 : _ref$overscan,
    _ref$initialHeight = _ref.initialHeight,
    initialHeight = _ref$initialHeight === void 0 ? 500 : _ref$initialHeight;
  var containerRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
      start: 0,
      end: Math.min(20, itemCount)
    }),
    _useState2 = _slicedToArray(_useState, 2),
    visibleRange = _useState2[0],
    setVisibleRange = _useState2[1];
  var _useState3 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(initialHeight),
    _useState4 = _slicedToArray(_useState3, 2),
    containerHeight = _useState4[0],
    setContainerHeight = _useState4[1];

  // Calculate which items should be visible based on scroll position
  var calculateVisibleRange = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    if (!containerRef.current) {
      return;
    }
    var container = containerRef.current;
    var scrollTop = container.scrollTop;
    var viewportHeight = container.clientHeight;

    // Calculate visible item indices
    var startIndex = Math.floor(scrollTop / itemHeight);
    startIndex = Math.max(0, startIndex - overscan);
    var endIndex = Math.ceil((scrollTop + viewportHeight) / itemHeight);
    endIndex = Math.min(itemCount, endIndex + overscan);
    setVisibleRange({
      start: startIndex,
      end: endIndex
    });
  }, [itemCount, itemHeight, overscan]);

  // Define handleScroll using useCallback to maintain referential equality
  var handleScroll = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    calculateVisibleRange();
  }, [calculateVisibleRange]);

  // Initialize and handle resize
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var container = containerRef.current;
    if (!container) {
      return;
    }

    // Set initial container height
    setContainerHeight(container.clientHeight);

    // Calculate initial visible range
    calculateVisibleRange();

    // Add scroll event listener
    container.addEventListener('scroll', handleScroll);

    // Handle window resize
    var handleResize = function handleResize() {
      if (container) {
        setContainerHeight(container.clientHeight);
        calculateVisibleRange();
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return function () {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateVisibleRange, handleScroll]);

  // Update visible range when itemCount changes
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    calculateVisibleRange();
  }, [itemCount, calculateVisibleRange]);

  // Calculate total height of all items for the scroll container
  var totalHeight = itemCount * itemHeight;

  // Calculate top offset for the visible items
  var topOffset = visibleRange.start * itemHeight;
  return {
    containerRef: containerRef,
    visibleRange: visibleRange,
    containerHeight: containerHeight,
    totalHeight: totalHeight,
    topOffset: topOffset,
    handleScroll: handleScroll,
    calculateVisibleRange: calculateVisibleRange
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useVirtualization);

/***/ }),

/***/ "./assets/js/apps/document-repository/components/DocumentList/index.js":
/*!*****************************************************************************!*\
  !*** ./assets/js/apps/document-repository/components/DocumentList/index.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _ErrorBoundary__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ErrorBoundary */ "./assets/js/apps/document-repository/components/DocumentList/ErrorBoundary.js");
/* harmony import */ var _DocumentTable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DocumentTable */ "./assets/js/apps/document-repository/components/DocumentList/DocumentTable.js");
/* harmony import */ var _VirtualDocumentTable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./VirtualDocumentTable */ "./assets/js/apps/document-repository/components/DocumentList/VirtualDocumentTable.js");
/* harmony import */ var _UploadFeedback__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./UploadFeedback */ "./assets/js/apps/document-repository/components/DocumentList/UploadFeedback.js");
/* harmony import */ var _shared_components_MetadataModal__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../shared/components/MetadataModal */ "./assets/js/apps/shared/components/MetadataModal.js");
/* harmony import */ var _UploadArea__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./UploadArea */ "./assets/js/apps/document-repository/components/DocumentList/UploadArea.js");
/* harmony import */ var _PaginationControls__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./PaginationControls */ "./assets/js/apps/document-repository/components/DocumentList/PaginationControls.js");
/* harmony import */ var _RetryNotice__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./RetryNotice */ "./assets/js/apps/document-repository/components/DocumentList/RetryNotice.js");
/* harmony import */ var _hooks_useNotifications__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./hooks/useNotifications */ "./assets/js/apps/document-repository/components/DocumentList/hooks/useNotifications.js");
/* harmony import */ var _hooks_useErrorHandling__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./hooks/useErrorHandling */ "./assets/js/apps/document-repository/components/DocumentList/hooks/useErrorHandling.js");
/* harmony import */ var _hooks_useMetadataManagement__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./hooks/useMetadataManagement */ "./assets/js/apps/document-repository/components/DocumentList/hooks/useMetadataManagement.js");
/* harmony import */ var _hooks_useFileHandling__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./hooks/useFileHandling */ "./assets/js/apps/document-repository/components/DocumentList/hooks/useFileHandling.js");
/* harmony import */ var _hooks_useDocumentManagement__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./hooks/useDocumentManagement */ "./assets/js/apps/document-repository/components/DocumentList/hooks/useDocumentManagement.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }












// Import custom hooks






// Define a threshold for when to use virtualization

var VIRTUALIZATION_THRESHOLD = 50; // Use virtualization when there are more than 50 documents

/**
 * DocumentList Component
 *
 * Main component for managing and displaying a list of documents with metadata.
 * Handles document uploads, metadata editing, bulk operations, and pagination.
 *
 * @param {Object}   props                   - Component props
 * @param {Array}    props.documents         - List of document objects to display
 * @param {number}   props.currentPage       - Current page number for pagination
 * @param {number}   props.totalPages        - Total number of pages
 * @param {Function} props.onPageChange      - Callback when page changes
 * @param {Function} props.onDelete          - Callback when a document is deleted
 * @param {boolean}  props.isDeleting        - Flag indicating if a delete operation is in progress
 * @param {Array}    props.selectedDocuments - Array of selected document IDs
 * @param {Function} props.onSelectDocument  - Callback when a document is selected
 * @param {Function} props.onSelectAll       - Callback when all documents are selected/deselected
 * @param {Function} props.onFileDrop        - Callback when files are dropped/uploaded
 * @param {Function} props.onDocumentsUpdate - Callback when documents are updated
 * @param {Array}    props.metadataFields    - Array of metadata field definitions
 */
var DocumentList = function DocumentList(_ref) {
  var _editingMetadata$meta, _editingMetadata$meta2, _editingMetadata$meta3;
  var _ref$documents = _ref.documents,
    documents = _ref$documents === void 0 ? [] : _ref$documents,
    _ref$currentPage = _ref.currentPage,
    currentPage = _ref$currentPage === void 0 ? 1 : _ref$currentPage,
    _ref$totalPages = _ref.totalPages,
    totalPages = _ref$totalPages === void 0 ? 1 : _ref$totalPages,
    onPageChange = _ref.onPageChange,
    onDelete = _ref.onDelete,
    _ref$isDeleting = _ref.isDeleting,
    isDeleting = _ref$isDeleting === void 0 ? false : _ref$isDeleting,
    _ref$selectedDocument = _ref.selectedDocuments,
    selectedDocuments = _ref$selectedDocument === void 0 ? [] : _ref$selectedDocument,
    onSelectDocument = _ref.onSelectDocument,
    onSelectAll = _ref.onSelectAll,
    onFileDrop = _ref.onFileDrop,
    onDocumentsUpdate = _ref.onDocumentsUpdate,
    _ref$metadataFields = _ref.metadataFields,
    metadataFields = _ref$metadataFields === void 0 ? [] : _ref$metadataFields;
  // Memoize formatFileSize function
  var formatFileSize = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return function (bytes) {
      if (bytes === 0) {
        return '0 Bytes';
      }
      var k = 1024;
      var sizes = ['Bytes', 'KB', 'MB', 'GB'];
      var i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
  }, []);

  // Memoize API namespace to prevent recalculation
  var apiNamespace = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    var settings = window.documentRepositorySettings;
    return (settings === null || settings === void 0 ? void 0 : settings.apiNamespace) || 'wp/v2';
  }, []);

  // Use notifications hook
  var _useNotifications = (0,_hooks_useNotifications__WEBPACK_IMPORTED_MODULE_11__["default"])(),
    showNotification = _useNotifications.showNotification;

  // Use error handling hook
  var _useErrorHandling = (0,_hooks_useErrorHandling__WEBPACK_IMPORTED_MODULE_12__["default"])({
      onShowNotification: showNotification
    }),
    failedOperations = _useErrorHandling.failedOperations,
    handleOperationError = _useErrorHandling.handleOperationError,
    retryAllOperations = _useErrorHandling.retryAllOperations;

  // Use document management hook
  var _useDocumentManagemen = (0,_hooks_useDocumentManagement__WEBPACK_IMPORTED_MODULE_15__["default"])({
      onDelete: onDelete,
      onSelectAll: onSelectAll,
      onShowNotification: showNotification,
      onError: handleOperationError
    }),
    deleteDocument = _useDocumentManagemen.deleteDocument,
    bulkDeleteConfirmOpen = _useDocumentManagemen.bulkDeleteConfirmOpen,
    isMultiDeleting = _useDocumentManagemen.isMultiDeleting,
    setDeleteDocument = _useDocumentManagemen.setDeleteDocument,
    handleBulkDelete = _useDocumentManagemen.handleBulkDelete,
    handleSingleDelete = _useDocumentManagemen.handleSingleDelete,
    openBulkDeleteConfirm = _useDocumentManagemen.openBulkDeleteConfirm,
    closeBulkDeleteConfirm = _useDocumentManagemen.closeBulkDeleteConfirm;

  // Use metadata management hook - critical for spreadsheet mode
  var _useMetadataManagemen = (0,_hooks_useMetadataManagement__WEBPACK_IMPORTED_MODULE_13__["default"])({
      documents: documents,
      metadataFields: metadataFields,
      apiNamespace: apiNamespace,
      onUpdateDocuments: onDocumentsUpdate,
      onError: handleOperationError,
      onShowNotification: showNotification
    }),
    editingMetadata = _useMetadataManagemen.editingMetadata,
    editedValues = _useMetadataManagemen.editedValues,
    metadataErrors = _useMetadataManagemen.errors,
    isSavingMetadata = _useMetadataManagemen.isSaving,
    hasMetadataChanged = _useMetadataManagemen.hasMetadataChanged,
    handleEditMetadata = _useMetadataManagemen.handleEditMetadata,
    updateEditedField = _useMetadataManagemen.updateEditedField,
    handleSaveMetadata = _useMetadataManagemen.handleSaveMetadata,
    isSpreadsheetMode = _useMetadataManagemen.isSpreadsheetMode,
    hasMetadataChanges = _useMetadataManagemen.hasMetadataChanges,
    bulkEditedMetadata = _useMetadataManagemen.bulkEditedMetadata,
    isSavingBulk = _useMetadataManagemen.isSavingBulk,
    handleMetadataChange = _useMetadataManagemen.handleMetadataChange,
    toggleSpreadsheetMode = _useMetadataManagemen.toggleSpreadsheetMode,
    handleSaveBulkChanges = _useMetadataManagemen.handleSaveBulkChanges,
    localDocuments = _useMetadataManagemen.localDocuments;

  // Use file handling hook
  var _useFileHandling = (0,_hooks_useFileHandling__WEBPACK_IMPORTED_MODULE_14__["default"])({
      onFileDrop: onFileDrop,
      onShowNotification: showNotification,
      onError: handleOperationError
    }),
    uploadingFiles = _useFileHandling.uploadingFiles,
    showUploadFeedback = _useFileHandling.showUploadFeedback,
    handleFiles = _useFileHandling.handleFiles,
    closeUploadFeedback = _useFileHandling.closeUploadFeedback;

  // Handler to retry all failed operations
  var handleRetryAll = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    var operationHandlers = {
      "delete": onDelete,
      metadata: handleSaveMetadata
    };
    retryAllOperations(operationHandlers);
  }, [onDelete, handleSaveMetadata, retryAllOperations]);

  // Memoize the document table props to prevent unnecessary re-renders
  var documentTableProps = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return {
      documents: localDocuments,
      selectedDocuments: selectedDocuments,
      onSelectDocument: onSelectDocument,
      onSelectAll: onSelectAll,
      onDelete: setDeleteDocument,
      onEdit: handleEditMetadata,
      isDeleting: isDeleting,
      metadataFields: metadataFields,
      isSpreadsheetMode: isSpreadsheetMode,
      bulkEditedMetadata: bulkEditedMetadata,
      onMetadataChange: handleMetadataChange,
      formatFileSize: formatFileSize
    };
  }, [localDocuments, selectedDocuments, onSelectDocument, onSelectAll, isDeleting, metadataFields, isSpreadsheetMode, bulkEditedMetadata, handleEditMetadata, handleMetadataChange, formatFileSize, setDeleteDocument]);
  var handleFilesWithLog = function handleFilesWithLog(files) {
    handleFiles(files);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_ErrorBoundary__WEBPACK_IMPORTED_MODULE_3__["default"], {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
      className: "document-list",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_RetryNotice__WEBPACK_IMPORTED_MODULE_10__["default"], {
        failedOperations: failedOperations,
        onRetryAll: handleRetryAll
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
        className: "document-list__actions",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
          className: "document-list__left-actions"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
          className: "document-list__right-actions",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_UploadArea__WEBPACK_IMPORTED_MODULE_8__["default"], {
            onFilesSelected: handleFilesWithLog
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
        className: "document-list__table-actions",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
          className: "action-buttons-container",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
            className: "doc-repo-button spreadsheet-toggle".concat(isSpreadsheetMode ? ' isPressed' : ''),
            onClick: function onClick() {
              return toggleSpreadsheetMode(!isSpreadsheetMode);
            },
            isPressed: isSpreadsheetMode,
            children: isSpreadsheetMode ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Exit Spreadsheet Mode', 'bcgov-design-system') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Enter Spreadsheet Mode', 'bcgov-design-system')
          }), selectedDocuments.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
            className: "doc-repo-button delete-button bulk-delete-button",
            onClick: openBulkDeleteConfirm,
            disabled: isMultiDeleting,
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.sprintf)(/* translators: %d: number of selected documents */
            (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Delete Selected (%d)', 'bcgov-design-system'), selectedDocuments.length)
          })]
        }), isSpreadsheetMode && hasMetadataChanges && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          className: "doc-repo-button save-button",
          onClick: handleSaveBulkChanges,
          isBusy: isSavingBulk,
          disabled: isSavingBulk,
          children: isSavingBulk ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Saving…', 'bcgov-design-system') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Save Changes', 'bcgov-design-system')
        })]
      }), documents.length >= VIRTUALIZATION_THRESHOLD ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_VirtualDocumentTable__WEBPACK_IMPORTED_MODULE_5__["default"], _objectSpread({}, documentTableProps)) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_DocumentTable__WEBPACK_IMPORTED_MODULE_4__["default"], _objectSpread({}, documentTableProps)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_PaginationControls__WEBPACK_IMPORTED_MODULE_9__["default"], {
        currentPage: currentPage,
        totalPages: totalPages,
        onPageChange: onPageChange
      }), showUploadFeedback && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_UploadFeedback__WEBPACK_IMPORTED_MODULE_6__["default"], {
        uploadingFiles: uploadingFiles,
        showUploadFeedback: showUploadFeedback,
        onClose: closeUploadFeedback
      }), deleteDocument && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_shared_components_MetadataModal__WEBPACK_IMPORTED_MODULE_7__["default"], {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Delete Document', 'bcgov-design-system'),
        isOpen: !!deleteDocument,
        onClose: function onClose() {
          return setDeleteDocument(null);
        },
        onSave: function onSave() {
          return handleSingleDelete(deleteDocument.id);
        },
        isSaving: isDeleting,
        isDisabled: false,
        saveButtonText: isDeleting ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Deleting…', 'bcgov-design-system') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Delete', 'bcgov-design-system'),
        saveButtonClassName: "doc-repo-button delete-button",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
          className: "delete-confirmation-content",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
            className: "delete-warning",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Are you sure you want to delete this document? This action cannot be undone.', 'bcgov-design-system')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
            className: "documents-to-delete",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("h4", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Document to be deleted:', 'bcgov-design-system')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("ul", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("li", {
                children: deleteDocument.title
              })
            })]
          })]
        })
      }), bulkDeleteConfirmOpen && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_shared_components_MetadataModal__WEBPACK_IMPORTED_MODULE_7__["default"], {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Delete Selected Documents', 'bcgov-design-system'),
        isOpen: bulkDeleteConfirmOpen,
        onClose: closeBulkDeleteConfirm,
        onSave: function onSave() {
          return handleBulkDelete(selectedDocuments);
        },
        isSaving: isMultiDeleting,
        isDisabled: false,
        saveButtonText: isMultiDeleting ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Deleting…', 'bcgov-design-system') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Delete Selected', 'bcgov-design-system'),
        saveButtonClassName: "doc-repo-button delete-button",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
          className: "delete-confirmation-content",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
            className: "delete-warning",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Are you sure you want to delete the selected documents? This action cannot be undone.', 'bcgov-design-system')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
            className: "documents-to-delete",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("h4", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.sprintf)(/* translators: %d: number of selected documents */
              (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Documents to be deleted (%d):', 'bcgov-design-system'), selectedDocuments.length)
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("ul", {
              children: localDocuments.filter(function (doc) {
                return selectedDocuments.includes(doc.id);
              }).map(function (doc) {
                return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("li", {
                  children: doc.title
                }, doc.id);
              })
            })]
          })]
        })
      }), editingMetadata && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)(_shared_components_MetadataModal__WEBPACK_IMPORTED_MODULE_7__["default"], {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Edit Document Metadata', 'bcgov-design-system'),
        isOpen: !!editingMetadata,
        onClose: function onClose() {
          return handleEditMetadata(null);
        },
        onSave: handleSaveMetadata,
        isSaving: isSavingMetadata,
        isDisabled: !hasMetadataChanged,
        saveButtonText: isSavingMetadata ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Saving…', 'bcgov-design-system') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Save Changes', 'bcgov-design-system'),
        saveButtonClassName: "doc-repo-button save-button",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
          className: "editable-metadata",
          children: metadataFields.map(function (field) {
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
              className: "metadata-field",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("label", {
                htmlFor: field.id,
                children: field.label
              }), field.type === 'select' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
                id: field.id,
                value: editedValues[field.id] || '',
                options: [{
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select…', 'bcgov-design-system'),
                  value: ''
                }].concat(_toConsumableArray(field.options.map(function (option) {
                  return {
                    label: option,
                    value: option
                  };
                }))),
                onChange: function onChange(value) {
                  return updateEditedField(field.id, value);
                }
              }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
                id: field.id,
                value: editedValues[field.id] || '',
                onChange: function onChange(value) {
                  return updateEditedField(field.id, value);
                }
              }), metadataErrors[field.id] && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
                className: "metadata-error",
                children: metadataErrors[field.id]
              })]
            }, field.id);
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
          className: "non-editable-metadata",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("h3", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Document Information', 'bcgov-design-system')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
            className: "metadata-field",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("label", {
              htmlFor: "document-filename",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Filename', 'bcgov-design-system')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
              id: "document-filename",
              className: "field-value",
              children: (((_editingMetadata$meta = editingMetadata.metadata) === null || _editingMetadata$meta === void 0 ? void 0 : _editingMetadata$meta.document_file_name) || editingMetadata.filename || editingMetadata.title || '').replace(/\.pdf$/i, '') || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Not available', 'bcgov-design-system')
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
            className: "metadata-field",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("label", {
              htmlFor: "document-file-type",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('File Type', 'bcgov-design-system')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
              id: "document-file-type",
              className: "field-value",
              children: ((_editingMetadata$meta2 = editingMetadata.metadata) === null || _editingMetadata$meta2 === void 0 ? void 0 : _editingMetadata$meta2.document_file_type) || 'PDF'
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
            className: "metadata-field",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("label", {
              htmlFor: "document-file-size",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('File Size', 'bcgov-design-system')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
              id: "document-file-size",
              className: "field-value",
              children: (_editingMetadata$meta3 = editingMetadata.metadata) !== null && _editingMetadata$meta3 !== void 0 && _editingMetadata$meta3.document_file_size ? formatFileSize(parseInt(editingMetadata.metadata.document_file_size)) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Not available', 'bcgov-design-system')
            })]
          })]
        })]
      })]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DocumentList);

/***/ }),

/***/ "./assets/js/apps/document-repository/components/DocumentUploader.js":
/*!***************************************************************************!*\
  !*** ./assets/js/apps/document-repository/components/DocumentUploader.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/**
 * DocumentUploader Component
 *
 * A comprehensive component for handling document uploads with metadata.
 * Supports both drag-and-drop and file selection, with progress tracking
 * and validation. Can operate in both modal and full-page modes.
 *
 * @param {Object}   props                   - Component props
 * @param {Array}    props.metadataFields    - Array of metadata field definitions
 * @param {Function} props.onUploadSuccess   - Callback when upload completes successfully
 * @param {File}     [props.selectedFile]    - Optional pre-selected file
 * @param {boolean}  [props.modalMode=false] - Whether to render in modal mode
 *
 * @example
 * const metadataFields = [
 *   { id: 'title', label: 'Title', type: 'text', required: true },
 *   { id: 'category', label: 'Category', type: 'select', options: ['A', 'B', 'C'] }
 * ];
 *
 * <DocumentUploader
 *   metadataFields={metadataFields}
 *   onUploadSuccess={(document) => handleDocumentUploaded(document)}
 *   modalMode={true}
 * />
 */





/**
 * State Management
 *
 * The component manages several pieces of state:
 * - file: The currently selected file
 * - isUploading: Upload progress flag
 * - uploadProgress: Upload progress percentage
 * - error: Error message if any
 * - uploadSuccess: Success state flag
 * - isDragging: Drag-and-drop state
 * - title: Document title
 * - metadata: Document metadata values
 */

/**
 * Document Uploader component
 *
 * @param {Object}   props                 - Component props
 * @param {Array}    props.metadataFields  - Array of metadata field definitions
 * @param {Function} props.onUploadSuccess - Callback when upload completes successfully
 * @param {File}     props.selectedFile    - Optional pre-selected file
 * @param {boolean}  props.modalMode       - Whether to render in modal mode
 * @return {JSX.Element}                     - Component
 */

var DocumentUploader = function DocumentUploader(_ref) {
  var metadataFields = _ref.metadataFields,
    onUploadSuccess = _ref.onUploadSuccess,
    _ref$selectedFile = _ref.selectedFile,
    selectedFile = _ref$selectedFile === void 0 ? null : _ref$selectedFile,
    _ref$modalMode = _ref.modalMode,
    modalMode = _ref$modalMode === void 0 ? false : _ref$modalMode;
  // File upload state
  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(selectedFile),
    _useState2 = _slicedToArray(_useState, 2),
    file = _useState2[0],
    setFile = _useState2[1];
  var _useState3 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    isUploading = _useState4[0],
    setIsUploading = _useState4[1];
  var _useState5 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0),
    _useState6 = _slicedToArray(_useState5, 2),
    uploadProgress = _useState6[0],
    setUploadProgress = _useState6[1];
  var _useState7 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    error = _useState8[0],
    setError = _useState8[1];
  var _useState9 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState10 = _slicedToArray(_useState9, 2),
    uploadSuccess = _useState10[0],
    setUploadSuccess = _useState10[1];
  var _useState11 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState12 = _slicedToArray(_useState11, 2),
    isDragging = _useState12[0],
    setIsDragging = _useState12[1];

  // Ref for the file input
  var fileInputRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  var dropzoneRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);

  // Document metadata state
  var _useState13 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(selectedFile ? selectedFile.name.split('.')[0] : ''),
    _useState14 = _slicedToArray(_useState13, 2),
    title = _useState14[0],
    setTitle = _useState14[1];
  var _useState15 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({}),
    _useState16 = _slicedToArray(_useState15, 2),
    metadata = _useState16[0],
    setMetadata = _useState16[1];

  // Get settings from WordPress
  var _window$documentRepos = window.documentRepositorySettings,
    apiNamespace = _window$documentRepos.apiNamespace,
    maxFileSize = _window$documentRepos.maxFileSize,
    allowedMimeTypes = _window$documentRepos.allowedMimeTypes;

  /**
   * File Validation
   *
   * Validates files based on:
   * - File size limits
   * - Allowed file types
   * - Required metadata fields
   *
   * @param {File} fileToValidate - File to validate
   * @return {boolean} Whether the file is valid
   */
  var validateFile = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (fileToValidate) {
    if (!fileToValidate) {
      return false;
    }

    // Check file size
    if (fileToValidate.size > maxFileSize) {
      var errorMsg = "File \"".concat(fileToValidate.name, "\" is too large (").concat((fileToValidate.size / (1024 * 1024)).toFixed(2), " MB). Maximum allowed size is ").concat((maxFileSize / (1024 * 1024)).toFixed(2), " MB.");
      setError(errorMsg);
      return false;
    }

    // Check file type
    var fileExtension = fileToValidate.name.split('.').pop().toLowerCase();
    var allowedExtensions = Object.keys(allowedMimeTypes);
    if (!allowedExtensions.includes(fileExtension)) {
      var _errorMsg = "File \"".concat(fileToValidate.name, "\" has an invalid file type. Allowed types are: ").concat(allowedExtensions.join(', '));
      setError(_errorMsg);
      return false;
    }
    setError(null);
    return true;
  }, [maxFileSize, allowedMimeTypes]);

  // Handle file validation and selection
  var validateAndSetFile = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (fileToValidate) {
    if (!fileToValidate) {
      return false;
    }
    if (validateFile(fileToValidate)) {
      setFile(fileToValidate);

      // Set default title from filename
      var fileNameWithoutExt = fileToValidate.name.includes('.') ? fileToValidate.name.substring(0, fileToValidate.name.lastIndexOf('.')) : fileToValidate.name;
      setTitle(fileNameWithoutExt);
      return true;
    }
    return false;
  }, [validateFile]);

  // Handle initial file setting from props
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (selectedFile) {
      // Update the title state based on the selected file
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, '')); // Remove file extension

      // Also validate the file
      if (!validateFile(selectedFile)) {
        return {
          error: 'Initial file validation failed, but still setting file for UI'
        };
      }
    }
  }, [selectedFile, validateFile]);

  // Handle modal mode file setting
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (modalMode && !file && selectedFile) {
      setFile(selectedFile);
    }
  }, [modalMode, selectedFile, file]);

  // Handle file selection from input
  var handleFileChange = function handleFileChange(event) {
    var newFile = event.target.files[0];
    validateAndSetFile(newFile);
  };

  // Handle file selection directly (for drag & drop)
  var handleFileSelect = function handleFileSelect(newFile) {
    validateAndSetFile(newFile);
  };

  // Handle drag events
  var handleDragEnter = function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  var handleDragOver = function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    // Keep setting isDragging to true to ensure state persists
    setIsDragging(true);
  };
  var handleDragLeave = function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();

    // Only set isDragging to false if we're leaving the container
    var rect = dropzoneRef.current.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX >= rect.right || e.clientY < rect.top || e.clientY >= rect.bottom) {
      setIsDragging(false);
    }
  };
  var handleDrop = function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    var droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles[0]);
    }
  };

  // Click handler for the drop zone
  var handleDropzoneClick = function handleDropzoneClick() {
    // Trigger the hidden file input's click event
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle metadata field change
  var handleMetadataChange = function handleMetadataChange(fieldId, value) {
    setMetadata(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, fieldId, value));
    });
  };

  /**
   * Upload Process
   *
   * Handles the document upload process:
   * 1. Validates required fields
   * 2. Creates FormData with file and metadata
   * 3. Tracks upload progress
   * 4. Handles success/error states
   * 5. Notifies parent component on success
   *
   * @async
   */
  var handleUpload = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var formData, metadataJson, response, errorData, data;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (file) {
              _context.next = 3;
              break;
            }
            setError('Please select a file to upload.');
            return _context.abrupt("return");
          case 3:
            if (validateFile(file)) {
              _context.next = 5;
              break;
            }
            return _context.abrupt("return");
          case 5:
            setIsUploading(true);
            setError(null);
            setUploadProgress(0);
            formData = new FormData();
            formData.append('file', file);
            formData.append('title', title);

            // Add metadata as JSON
            metadataJson = JSON.stringify(metadata);
            formData.append('metadata', metadataJson);
            _context.prev = 13;
            _context.next = 16;
            return fetch("".concat(window.documentRepositorySettings.apiRoot).concat(apiNamespace, "/documents"), {
              method: 'POST',
              headers: {
                'X-WP-Nonce': window.documentRepositorySettings.nonce
              },
              body: formData
            });
          case 16:
            response = _context.sent;
            if (response.ok) {
              _context.next = 22;
              break;
            }
            _context.next = 20;
            return response.json();
          case 20:
            errorData = _context.sent;
            throw new Error(errorData.message || 'Upload failed');
          case 22:
            _context.next = 24;
            return response.json();
          case 24:
            data = _context.sent;
            setUploadSuccess(true);
            setIsUploading(false);

            // Notify parent of successful upload
            if (onUploadSuccess) {
              onUploadSuccess(data.document);
            }

            // Reset form if not in modal mode
            if (!modalMode) {
              setFile(null);
              setTitle('');
              setMetadata({});
            }
            _context.next = 35;
            break;
          case 31:
            _context.prev = 31;
            _context.t0 = _context["catch"](13);
            setError(_context.t0.message || 'Failed to upload file. Please try again.');
            setIsUploading(false);
          case 35:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[13, 31]]);
    }));
    return function handleUpload() {
      return _ref2.apply(this, arguments);
    };
  }();

  /**
   * Metadata Field Rendering
   *
   * Dynamically renders form fields based on metadata field definitions:
   * - Text fields
   * - Select fields
   * - Date fields
   *
   * @param {Object} field - Metadata field definition
   * @return {JSX.Element} Rendered form field
   */
  var renderField = function renderField(field) {
    var id = field.id,
      fieldLabel = field.label,
      type = field.type,
      options = field.options,
      required = field.required;
    switch (type) {
      case 'text':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
          label: fieldLabel,
          value: metadata[id] || '',
          onChange: function onChange(value) {
            return handleMetadataChange(id, value);
          },
          required: required
        }, id);
      case 'select':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
          label: fieldLabel,
          value: metadata[id] || '',
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select…', 'bcgov-design-system'),
            value: ''
          }].concat(_toConsumableArray(Object.entries(options).map(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
              value = _ref4[0],
              label = _ref4[1];
            return {
              label: label,
              value: value
            };
          }))),
          onChange: function onChange(value) {
            return handleMetadataChange(id, value);
          },
          required: required
        }, id);
      case 'date':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
          label: fieldLabel,
          type: "date",
          value: metadata[id] || '',
          onChange: function onChange(value) {
            return handleMetadataChange(id, value);
          },
          required: required
        }, id);
      default:
        return null;
    }
  };

  /**
   * Layout Modes
   *
   * The component supports two layout modes:
   * 1. Modal Mode:
   *    - Simplified interface
   *    - Pre-selected file support
   *    - Compact metadata form
   *
   * 2. Full Mode:
   *    - Card-based layout
   *    - Drag-and-drop support
   *    - Full metadata form
   */
  // Render content based on whether we're in modal mode or not
  var renderContent = function renderContent() {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
      children: [uploadSuccess && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
        status: "success",
        isDismissible: true,
        onRemove: function onRemove() {
          return setUploadSuccess(false);
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Document uploaded successfully!', 'bcgov-design-system')
      }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
        status: "error",
        isDismissible: true,
        onRemove: function onRemove() {
          return setError(null);
        },
        children: error
      }), !modalMode && !file && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "upload-area__container ".concat(isDragging ? 'upload-area__container--drag-active' : ''),
        onDragEnter: handleDragEnter,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
        onClick: handleDropzoneClick,
        onKeyDown: function onKeyDown(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            handleDropzoneClick();
          }
        },
        role: "button",
        tabIndex: "0",
        ref: dropzoneRef,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
          type: "file",
          ref: fileInputRef,
          onChange: handleFileChange,
          className: "upload-area__file-input",
          accept: Object.values(allowedMimeTypes).join(',')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "upload-area__content",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            className: "upload-area__icon",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("svg", {
              viewBox: "0 0 64 64",
              width: "64",
              height: "64",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("path", {
                d: "M32 16v24M20 28l12-12 12 12",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("path", {
                d: "M16 48h32M12 20v28c0 2.2 1.8 4 4 4h32c2.2 0 4-1.8 4-4V20",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round"
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "upload-area__text",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
              className: "upload-area__text-primary",
              children: isDragging ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Drop file here', 'bcgov-design-system') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Drag & drop your file here or click to browse', 'bcgov-design-system')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("p", {
              className: "upload-area__help-text",
              children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Accepted file types:', 'bcgov-design-system'), ' ', Object.keys(allowedMimeTypes).join(', ')]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("p", {
              className: "upload-area__help-text",
              children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Maximum file size:', 'bcgov-design-system'), ' ', Math.round(maxFileSize / (1024 * 1024)), ' ', "MB"]
            })]
          })]
        })]
      }), modalMode && !file && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "document-uploader-file-select",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.FormFileUpload, {
          accept: Object.values(allowedMimeTypes).join(','),
          onChange: handleFileChange,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select a different file', 'bcgov-design-system')
        })
      }), file && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "selected-file-container",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "selected-file",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
            className: "file-name",
            children: file.name
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
            type: "button",
            className: "remove-file",
            onClick: function onClick() {
              return setFile(null);
            },
            children: "\u2715"
          })]
        }), !modalMode && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.FormFileUpload, {
          accept: Object.values(allowedMimeTypes).join(','),
          onChange: handleFileChange,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select a different file', 'bcgov-design-system')
        })]
      }), isUploading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "upload-progress",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("progress", {
          value: uploadProgress,
          max: "100"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("p", {
          children: [uploadProgress, "%", ' ', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Uploaded', 'bcgov-design-system')]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Document Title', 'bcgov-design-system'),
        value: title,
        onChange: setTitle,
        disabled: isUploading,
        required: true
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h4", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Document Metadata', 'bcgov-design-system')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "metadata-fields ".concat(modalMode ? 'modal-layout' : ''),
        children: metadataFields.map(renderField)
      })]
    });
  };

  // Helper functions to simplify the JSX
  var renderFileInfo = function renderFileInfo() {
    if (file) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("p", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
          children: "File:"
        }), " ", file.name, " (", Math.round(file.size / 1024), " KB)"]
      });
    }
    if (selectedFile) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("p", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
          children: "File:"
        }), " ", selectedFile.name, " (", Math.round(selectedFile.size / 1024), " KB)"]
      });
    }
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("p", {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
        children: "Warning:"
      }), " No file selected"]
    });
  };
  var renderUploadButtonContent = function renderUploadButtonContent() {
    if (isUploading) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Spinner, {}), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Uploading…', 'bcgov-design-system')]
      });
    }
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Upload Document', 'bcgov-design-system');
  };

  /**
   * Layout Modes
   *
   * The component supports two layout modes:
   * 1. Modal Mode:
   *    - Simplified interface
   *    - Pre-selected file support
   *    - Compact metadata form
   *
   * 2. Full Mode:
   *    - Card-based layout
   *    - Drag-and-drop support
   *    - Full metadata form
   */
  // If in modal mode, return a simplified layout
  if (modalMode) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "document-uploader-modal",
      children: [error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
        status: "error",
        isDismissible: true,
        onRemove: function onRemove() {
          return setError(null);
        },
        children: error
      }), uploadSuccess && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
        status: "success",
        isDismissible: true,
        onRemove: function onRemove() {
          return setUploadSuccess(false);
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Document uploaded successfully!', 'bcgov-design-system')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "selected-file-info",
        children: renderFileInfo()
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Document Title', 'bcgov-design-system'),
        value: title,
        onChange: setTitle,
        disabled: isUploading,
        required: true
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h4", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Document Metadata', 'bcgov-design-system')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "metadata-fields modal-layout",
        children: metadataFields.map(renderField)
      }), isUploading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "upload-progress",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("progress", {
          value: uploadProgress,
          max: "100"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("p", {
          children: [uploadProgress, "%", ' ', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Uploaded', 'bcgov-design-system')]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "modal-actions",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          isPrimary: true,
          onClick: handleUpload,
          disabled: !file && !selectedFile || !title || isUploading,
          children: renderUploadButtonContent()
        })
      })]
    });
  }

  // Full card layout for non-modal mode
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Card, {
    className: "document-uploader",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CardHeader, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h3", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Upload Document', 'bcgov-design-system')
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CardBody, {
      children: renderContent()
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CardFooter, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "card-actions",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          isPrimary: true,
          onClick: handleUpload,
          disabled: !file || !title || isUploading,
          children: renderUploadButtonContent()
        })
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DocumentUploader);

/***/ }),

/***/ "./assets/js/apps/document-repository/hooks/useDocuments.js":
/*!******************************************************************!*\
  !*** ./assets/js/apps/document-repository/hooks/useDocuments.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useDocuments: () => (/* binding */ useDocuments)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__);
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/**
 * Custom hook for managing document data and operations
 *
 * Provides a centralized way to manage document-related state and operations
 * including fetching, updating, and deleting documents. Handles pagination,
 * loading states, and error handling.
 *
 * @module useDocuments
 * @return {Object} Document management utilities and state
 * @property {Array}       documents           - List of documents
 * @property {number}      totalDocuments      - Total number of documents
 * @property {number}      currentPage         - Current page number
 * @property {number}      totalPages          - Total number of pages
 * @property {boolean}     isLoading           - Loading state flag
 * @property {boolean}     isDeleting          - Deletion in progress flag
 * @property {string|null} error               - Error message if any
 * @property {Object}      searchParams        - Current search parameters
 * @property {Function}    setSearchParams     - Update search parameters
 * @property {Function}    fetchDocuments      - Fetch documents from API
 * @property {Function}    deleteDocument      - Delete a single document
 * @property {Function}    updateDocument      - Update a single document
 * @property {Function}    bulkUpdateDocuments - Update multiple documents
 * @property {Function}    bulkDeleteDocuments - Delete multiple documents
 */




/**
 * Hook to manage document data and operations
 *
 * @return {Object} Document data and operations
 */
var useDocuments = function useDocuments() {
  var _window$documentRepos;
  // Document data state
  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    documents = _useState2[0],
    setDocuments = _useState2[1];
  var _useState3 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0),
    _useState4 = _slicedToArray(_useState3, 2),
    totalDocuments = _useState4[0],
    setTotalDocuments = _useState4[1];
  var _useState5 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(1),
    _useState6 = _slicedToArray(_useState5, 2),
    currentPage = _useState6[0],
    setCurrentPage = _useState6[1];
  var _useState7 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(1),
    _useState8 = _slicedToArray(_useState7, 2),
    totalPages = _useState8[0],
    setTotalPages = _useState8[1];

  // Loading and error states
  var _useState9 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState10 = _slicedToArray(_useState9, 2),
    isLoading = _useState10[0],
    setIsLoading = _useState10[1];
  var _useState11 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState12 = _slicedToArray(_useState11, 2),
    isDeleting = _useState12[0],
    setIsDeleting = _useState12[1];
  var _useState13 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState14 = _slicedToArray(_useState13, 2),
    error = _useState14[0],
    setError = _useState14[1];

  // Search and pagination parameters
  var _useState15 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
      page: 1,
      per_page: ((_window$documentRepos = window.documentRepositorySettings) === null || _window$documentRepos === void 0 ? void 0 : _window$documentRepos.perPage) || 20,
      orderby: 'date',
      order: 'DESC'
    }),
    _useState16 = _slicedToArray(_useState15, 2),
    searchParams = _useState16[0],
    setSearchParams = _useState16[1];

  /**
   * Fetch documents from the API
   *
   * Retrieves documents based on current search parameters.
   * Updates document list, pagination info, and loading states.
   *
   * @async
   * @function fetchDocuments
   * @throws {Error} If API request fails or response is invalid
   */
  var fetchDocuments = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var _window$documentRepos2;
    var apiNamespace, queryParams, response, validDocuments;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if ((_window$documentRepos2 = window.documentRepositorySettings) !== null && _window$documentRepos2 !== void 0 && _window$documentRepos2.apiNamespace) {
            _context.next = 3;
            break;
          }
          setError('Document Repository settings not found. Make sure the script is properly enqueued in WordPress.');
          return _context.abrupt("return");
        case 3:
          setIsLoading(true);
          setError(null);
          _context.prev = 5;
          apiNamespace = window.documentRepositorySettings.apiNamespace; // Build query string for pagination
          queryParams = new URLSearchParams(); // Add all parameters to query
          Object.entries(searchParams).forEach(function (_ref2) {
            var _ref3 = _slicedToArray(_ref2, 2),
              key = _ref3[0],
              value = _ref3[1];
            if (value) {
              queryParams.append(key, value);
            }
          });

          // Fetch documents from API
          _context.next = 11;
          return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
            path: "/".concat(apiNamespace, "/documents?").concat(queryParams.toString())
          });
        case 11:
          response = _context.sent;
          if (!(!response || _typeof(response) !== 'object')) {
            _context.next = 14;
            break;
          }
          throw new Error('Invalid response from server');
        case 14:
          // Ensure documents is an array and each item has required properties
          validDocuments = Array.isArray(response.documents) ? response.documents.filter(function (doc) {
            return doc && _typeof(doc) === 'object' && doc.id;
          }) : []; // Update state with fetched data
          setDocuments(validDocuments);
          setTotalDocuments(response.total || 0);
          setCurrentPage(response.current_page || 1);
          setTotalPages(response.total_pages || 1);

          // If we got no documents but the page number is greater than 1,
          // we should reset to page 1
          if (validDocuments.length === 0 && searchParams.page > 1) {
            setSearchParams(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, {
                page: 1
              });
            });
          }
          _context.next = 26;
          break;
        case 22:
          _context.prev = 22;
          _context.t0 = _context["catch"](5);
          setError(_context.t0.message || 'Error loading documents');
          // Don't clear the documents array on error to prevent UI flicker
          // Only update if we're on page 1
          if (searchParams.page === 1) {
            setDocuments([]);
            setTotalDocuments(0);
            setTotalPages(1);
          }
        case 26:
          _context.prev = 26;
          setIsLoading(false);
          return _context.finish(26);
        case 29:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[5, 22, 26, 29]]);
  })), [searchParams]);

  // Update current page when search params change
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var newPage = parseInt(searchParams.page, 10);
    if (!isNaN(newPage) && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  }, [searchParams.page, currentPage]);

  // Fetch documents when search parameters change
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchDocuments();
  }, [fetchDocuments]);

  /**
   * Delete a document
   *
   * @async
   * @function deleteDocument
   * @param {number} documentId - Document ID to delete
   * @return {Promise<boolean>} Success status
   * @throws {Error} If deletion fails
   */
  var deleteDocument = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(documentId) {
      var apiNamespace;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            setIsDeleting(true);
            _context2.prev = 1;
            apiNamespace = window.documentRepositorySettings.apiNamespace; // Delete document from API
            _context2.next = 5;
            return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
              path: "/".concat(apiNamespace, "/documents/").concat(documentId),
              method: 'DELETE'
            });
          case 5:
            _context2.next = 7;
            return fetchDocuments();
          case 7:
            setIsDeleting(false);
            return _context2.abrupt("return", true);
          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](1);
            setError(_context2.t0.message || 'Error deleting document');
            setIsDeleting(false);
            return _context2.abrupt("return", false);
          case 16:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[1, 11]]);
    }));
    return function deleteDocument(_x) {
      return _ref4.apply(this, arguments);
    };
  }();

  /**
   * Update a document
   *
   * @async
   * @function updateDocument
   * @param {number} documentId - Document ID to update
   * @param {Object} data       - Document data to update
   * @return {Promise<Object|null>} Updated document or null on error
   * @throws {Error} If update fails
   */
  var updateDocument = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(documentId, data) {
      var apiNamespace, response;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            apiNamespace = window.documentRepositorySettings.apiNamespace; // Update document via API
            _context3.next = 4;
            return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
              path: "/".concat(apiNamespace, "/documents/").concat(documentId),
              method: 'PUT',
              data: data
            });
          case 4:
            response = _context3.sent;
            _context3.next = 7;
            return fetchDocuments();
          case 7:
            return _context3.abrupt("return", response);
          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](0);
            setError(_context3.t0.message || 'Error updating document');
            return _context3.abrupt("return", null);
          case 14:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[0, 10]]);
    }));
    return function updateDocument(_x2, _x3) {
      return _ref5.apply(this, arguments);
    };
  }();

  /**
   * Bulk update documents
   *
   * @async
   * @function bulkUpdateDocuments
   * @param {Array<number>} documentIds - Document IDs to update
   * @param {Object}        data        - Data to update for all documents
   * @return {Promise<boolean>} Success status
   * @throws {Error} If bulk update fails
   */
  var bulkUpdateDocuments = /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(documentIds, data) {
      var _iterator, _step, id;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            // Update each document sequentially
            _iterator = _createForOfIteratorHelper(documentIds);
            _context4.prev = 2;
            _iterator.s();
          case 4:
            if ((_step = _iterator.n()).done) {
              _context4.next = 10;
              break;
            }
            id = _step.value;
            _context4.next = 8;
            return updateDocument(id, data);
          case 8:
            _context4.next = 4;
            break;
          case 10:
            _context4.next = 15;
            break;
          case 12:
            _context4.prev = 12;
            _context4.t0 = _context4["catch"](2);
            _iterator.e(_context4.t0);
          case 15:
            _context4.prev = 15;
            _iterator.f();
            return _context4.finish(15);
          case 18:
            _context4.next = 20;
            return fetchDocuments();
          case 20:
            return _context4.abrupt("return", true);
          case 23:
            _context4.prev = 23;
            _context4.t1 = _context4["catch"](0);
            setError(_context4.t1.message || 'Error performing bulk update');
            return _context4.abrupt("return", false);
          case 27:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[0, 23], [2, 12, 15, 18]]);
    }));
    return function bulkUpdateDocuments(_x4, _x5) {
      return _ref6.apply(this, arguments);
    };
  }();

  /**
   * Bulk delete documents
   *
   * @async
   * @function bulkDeleteDocuments
   * @param {Array<number>} documentIds - Document IDs to delete
   * @return {Promise<boolean>} Success status
   * @throws {Error} If bulk delete fails
   */
  var bulkDeleteDocuments = /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(documentIds) {
      var _iterator2, _step2, id;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            // Delete each document sequentially
            _iterator2 = _createForOfIteratorHelper(documentIds);
            _context5.prev = 2;
            _iterator2.s();
          case 4:
            if ((_step2 = _iterator2.n()).done) {
              _context5.next = 10;
              break;
            }
            id = _step2.value;
            _context5.next = 8;
            return deleteDocument(id);
          case 8:
            _context5.next = 4;
            break;
          case 10:
            _context5.next = 15;
            break;
          case 12:
            _context5.prev = 12;
            _context5.t0 = _context5["catch"](2);
            _iterator2.e(_context5.t0);
          case 15:
            _context5.prev = 15;
            _iterator2.f();
            return _context5.finish(15);
          case 18:
            return _context5.abrupt("return", true);
          case 21:
            _context5.prev = 21;
            _context5.t1 = _context5["catch"](0);
            setError(_context5.t1.message || 'Error performing bulk delete');
            return _context5.abrupt("return", false);
          case 25:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[0, 21], [2, 12, 15, 18]]);
    }));
    return function bulkDeleteDocuments(_x6) {
      return _ref7.apply(this, arguments);
    };
  }();
  return {
    // Document data
    documents: documents,
    totalDocuments: totalDocuments,
    currentPage: currentPage,
    totalPages: totalPages,
    // Loading states
    isLoading: isLoading,
    isDeleting: isDeleting,
    error: error,
    // Search and filter parameters
    searchParams: searchParams,
    setSearchParams: setSearchParams,
    // Document operations
    fetchDocuments: fetchDocuments,
    deleteDocument: deleteDocument,
    updateDocument: updateDocument,
    bulkUpdateDocuments: bulkUpdateDocuments,
    bulkDeleteDocuments: bulkDeleteDocuments
  };
};

/***/ }),

/***/ "./assets/js/apps/shared/components/MetadataModal.js":
/*!***********************************************************!*\
  !*** ./assets/js/apps/shared/components/MetadataModal.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");




/**
 * Shared metadata modal component used across the application
 *
 * @param {Object}      props                     Component props
 * @param {string}      props.title               Modal title
 * @param {boolean}     props.isOpen              Whether the modal is open
 * @param {Function}    props.onClose             Callback when modal is closed
 * @param {Function}    props.onSave              Callback when save button is clicked
 * @param {boolean}     props.isSaving            Whether save operation is in progress
 * @param {boolean}     props.isDisabled          Whether save button should be disabled
 * @param {string}      props.saveButtonText      Custom text for the save button
 * @param {string}      props.saveButtonClassName Custom class name for the save button
 * @param {JSX.Element} props.children            Content to render inside the modal
 * @return {JSX.Element|null} Modal component or null if not open
 */

var MetadataModal = function MetadataModal(_ref) {
  var title = _ref.title,
    isOpen = _ref.isOpen,
    onClose = _ref.onClose,
    onSave = _ref.onSave,
    _ref$isSaving = _ref.isSaving,
    isSaving = _ref$isSaving === void 0 ? false : _ref$isSaving,
    _ref$isDisabled = _ref.isDisabled,
    isDisabled = _ref$isDisabled === void 0 ? false : _ref$isDisabled,
    saveButtonText = _ref.saveButtonText,
    _ref$saveButtonClassN = _ref.saveButtonClassName,
    saveButtonClassName = _ref$saveButtonClassN === void 0 ? 'doc-repo-button save-button' : _ref$saveButtonClassN,
    children = _ref.children;
  // Create a safe handler for closing the modal that prevents event bubbling
  var handleClose = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(function (e) {
    // Stop propagation to prevent the event from bubbling up
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Call the onClose callback
    onClose();
  }, [onClose]);

  // Create a safe handler for form submission
  var handleSubmit = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(function (e) {
    e.preventDefault();
    e.stopPropagation();
    onSave();
  }, [onSave]);
  if (!isOpen) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Modal, {
    title: title,
    onRequestClose: handleClose,
    className: "metadata-edit-modal",
    shouldCloseOnClickOutside: true,
    shouldCloseOnEsc: true,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("form", {
      onSubmit: handleSubmit,
      className: "metadata-edit-form",
      children: [children, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "modal-actions",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
          onClick: handleClose,
          disabled: isSaving,
          className: "doc-repo-button cancel-button",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Cancel', 'bcgov-design-system')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
          type: "submit",
          isBusy: isSaving,
          disabled: isSaving || isDisabled,
          className: saveButtonClassName,
          children: saveButtonText || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Save Changes', 'bcgov-design-system')
        })]
      })]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MetadataModal);

/***/ }),

/***/ "./assets/js/shared/components/AppErrorBoundary.js":
/*!*********************************************************!*\
  !*** ./assets/js/shared/components/AppErrorBoundary.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }




/**
 * Error boundary for the entire application
 *
 * @class AppErrorBoundary
 * @augments Component
 * @param {Object} props - Component props
 */

var AppErrorBoundary = /*#__PURE__*/function (_Component) {
  /**
   * Creates an instance of AppErrorBoundary
   *
   * @param {Object} props - Component props
   */
  function AppErrorBoundary(props) {
    var _this;
    _classCallCheck(this, AppErrorBoundary);
    _this = _callSuper(this, AppErrorBoundary, [props]);
    _this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
    return _this;
  }

  /**
   * Updates state when an error is caught
   *
   * @static
   * @param {Error} error - The error that was thrown
   * @return {Object} New state with error information
   */
  _inherits(AppErrorBoundary, _Component);
  return _createClass(AppErrorBoundary, [{
    key: "componentDidCatch",
    value:
    /**
     * Handles error logging and additional error information
     *
     * @param {Error}  error     - The error that was thrown
     * @param {Object} errorInfo - Additional error information including component stack
     */
    function componentDidCatch(error, errorInfo) {
      this.setState({
        errorInfo: errorInfo
      });
    }

    /**
     * Renders either the error UI or children components
     *
     * @return {JSX.Element} Error UI or children components
     */
  }, {
    key: "render",
    value: function render() {
      if (this.state.hasError) {
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "dswp-document-repository-error",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
            status: "error",
            isDismissible: false,
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h2", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Something went wrong in the Document Repository', 'bcgov-design-system')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
              children: this.state.error && this.state.error.toString()
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("details", {
              style: {
                whiteSpace: 'pre-wrap'
              },
              children: this.state.errorInfo && this.state.errorInfo.componentStack
            })]
          })
        });
      }
      return this.props.children;
    }
  }], [{
    key: "getDerivedStateFromError",
    value: function getDerivedStateFromError(error) {
      return {
        hasError: true,
        error: error
      };
    }
  }]);
}(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Component);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AppErrorBoundary);

/***/ }),

/***/ "./node_modules/react/cjs/react-jsx-runtime.development.js":
/*!*****************************************************************!*\
  !*** ./node_modules/react/cjs/react-jsx-runtime.development.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (true) {
  (function() {
'use strict';

var React = __webpack_require__(/*! react */ "react");

// ATTENTION
// When adding new symbols to this file,
// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
// The Symbol used to tag the ReactElement-like types.
var REACT_ELEMENT_TYPE = Symbol.for('react.element');
var REACT_PORTAL_TYPE = Symbol.for('react.portal');
var REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
var REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode');
var REACT_PROFILER_TYPE = Symbol.for('react.profiler');
var REACT_PROVIDER_TYPE = Symbol.for('react.provider');
var REACT_CONTEXT_TYPE = Symbol.for('react.context');
var REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
var REACT_SUSPENSE_TYPE = Symbol.for('react.suspense');
var REACT_SUSPENSE_LIST_TYPE = Symbol.for('react.suspense_list');
var REACT_MEMO_TYPE = Symbol.for('react.memo');
var REACT_LAZY_TYPE = Symbol.for('react.lazy');
var REACT_OFFSCREEN_TYPE = Symbol.for('react.offscreen');
var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';
function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable !== 'object') {
    return null;
  }

  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }

  return null;
}

var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

function error(format) {
  {
    {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      printWarning('error', format, args);
    }
  }
}

function printWarning(level, format, args) {
  // When changing this logic, you might want to also
  // update consoleWithStackDev.www.js as well.
  {
    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
    var stack = ReactDebugCurrentFrame.getStackAddendum();

    if (stack !== '') {
      format += '%s';
      args = args.concat([stack]);
    } // eslint-disable-next-line react-internal/safe-string-coercion


    var argsWithFormat = args.map(function (item) {
      return String(item);
    }); // Careful: RN currently depends on this prefix

    argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
    // breaks IE9: https://github.com/facebook/react/issues/13610
    // eslint-disable-next-line react-internal/no-production-logging

    Function.prototype.apply.call(console[level], console, argsWithFormat);
  }
}

// -----------------------------------------------------------------------------

var enableScopeAPI = false; // Experimental Create Event Handle API.
var enableCacheElement = false;
var enableTransitionTracing = false; // No known bugs, but needs performance testing

var enableLegacyHidden = false; // Enables unstable_avoidThisFallback feature in Fiber
// stuff. Intended to enable React core members to more easily debug scheduling
// issues in DEV builds.

var enableDebugTracing = false; // Track which Fiber(s) schedule render work.

var REACT_MODULE_REFERENCE;

{
  REACT_MODULE_REFERENCE = Symbol.for('react.module.reference');
}

function isValidElementType(type) {
  if (typeof type === 'string' || typeof type === 'function') {
    return true;
  } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).


  if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing  || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden  || type === REACT_OFFSCREEN_TYPE || enableScopeAPI  || enableCacheElement  || enableTransitionTracing ) {
    return true;
  }

  if (typeof type === 'object' && type !== null) {
    if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
    // types supported by any Flight configuration anywhere since
    // we don't know which Flight build this will end up being used
    // with.
    type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== undefined) {
      return true;
    }
  }

  return false;
}

function getWrappedName(outerType, innerType, wrapperName) {
  var displayName = outerType.displayName;

  if (displayName) {
    return displayName;
  }

  var functionName = innerType.displayName || innerType.name || '';
  return functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName;
} // Keep in sync with react-reconciler/getComponentNameFromFiber


function getContextName(type) {
  return type.displayName || 'Context';
} // Note that the reconciler package should generally prefer to use getComponentNameFromFiber() instead.


function getComponentNameFromType(type) {
  if (type == null) {
    // Host root, text node or just invalid type.
    return null;
  }

  {
    if (typeof type.tag === 'number') {
      error('Received an unexpected object in getComponentNameFromType(). ' + 'This is likely a bug in React. Please file an issue.');
    }
  }

  if (typeof type === 'function') {
    return type.displayName || type.name || null;
  }

  if (typeof type === 'string') {
    return type;
  }

  switch (type) {
    case REACT_FRAGMENT_TYPE:
      return 'Fragment';

    case REACT_PORTAL_TYPE:
      return 'Portal';

    case REACT_PROFILER_TYPE:
      return 'Profiler';

    case REACT_STRICT_MODE_TYPE:
      return 'StrictMode';

    case REACT_SUSPENSE_TYPE:
      return 'Suspense';

    case REACT_SUSPENSE_LIST_TYPE:
      return 'SuspenseList';

  }

  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_CONTEXT_TYPE:
        var context = type;
        return getContextName(context) + '.Consumer';

      case REACT_PROVIDER_TYPE:
        var provider = type;
        return getContextName(provider._context) + '.Provider';

      case REACT_FORWARD_REF_TYPE:
        return getWrappedName(type, type.render, 'ForwardRef');

      case REACT_MEMO_TYPE:
        var outerName = type.displayName || null;

        if (outerName !== null) {
          return outerName;
        }

        return getComponentNameFromType(type.type) || 'Memo';

      case REACT_LAZY_TYPE:
        {
          var lazyComponent = type;
          var payload = lazyComponent._payload;
          var init = lazyComponent._init;

          try {
            return getComponentNameFromType(init(payload));
          } catch (x) {
            return null;
          }
        }

      // eslint-disable-next-line no-fallthrough
    }
  }

  return null;
}

var assign = Object.assign;

// Helpers to patch console.logs to avoid logging during side-effect free
// replaying on render function. This currently only patches the object
// lazily which won't cover if the log function was extracted eagerly.
// We could also eagerly patch the method.
var disabledDepth = 0;
var prevLog;
var prevInfo;
var prevWarn;
var prevError;
var prevGroup;
var prevGroupCollapsed;
var prevGroupEnd;

function disabledLog() {}

disabledLog.__reactDisabledLog = true;
function disableLogs() {
  {
    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      prevLog = console.log;
      prevInfo = console.info;
      prevWarn = console.warn;
      prevError = console.error;
      prevGroup = console.group;
      prevGroupCollapsed = console.groupCollapsed;
      prevGroupEnd = console.groupEnd; // https://github.com/facebook/react/issues/19099

      var props = {
        configurable: true,
        enumerable: true,
        value: disabledLog,
        writable: true
      }; // $FlowFixMe Flow thinks console is immutable.

      Object.defineProperties(console, {
        info: props,
        log: props,
        warn: props,
        error: props,
        group: props,
        groupCollapsed: props,
        groupEnd: props
      });
      /* eslint-enable react-internal/no-production-logging */
    }

    disabledDepth++;
  }
}
function reenableLogs() {
  {
    disabledDepth--;

    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      var props = {
        configurable: true,
        enumerable: true,
        writable: true
      }; // $FlowFixMe Flow thinks console is immutable.

      Object.defineProperties(console, {
        log: assign({}, props, {
          value: prevLog
        }),
        info: assign({}, props, {
          value: prevInfo
        }),
        warn: assign({}, props, {
          value: prevWarn
        }),
        error: assign({}, props, {
          value: prevError
        }),
        group: assign({}, props, {
          value: prevGroup
        }),
        groupCollapsed: assign({}, props, {
          value: prevGroupCollapsed
        }),
        groupEnd: assign({}, props, {
          value: prevGroupEnd
        })
      });
      /* eslint-enable react-internal/no-production-logging */
    }

    if (disabledDepth < 0) {
      error('disabledDepth fell below zero. ' + 'This is a bug in React. Please file an issue.');
    }
  }
}

var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
var prefix;
function describeBuiltInComponentFrame(name, source, ownerFn) {
  {
    if (prefix === undefined) {
      // Extract the VM specific prefix used by each line.
      try {
        throw Error();
      } catch (x) {
        var match = x.stack.trim().match(/\n( *(at )?)/);
        prefix = match && match[1] || '';
      }
    } // We use the prefix to ensure our stacks line up with native stack frames.


    return '\n' + prefix + name;
  }
}
var reentry = false;
var componentFrameCache;

{
  var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
  componentFrameCache = new PossiblyWeakMap();
}

function describeNativeComponentFrame(fn, construct) {
  // If something asked for a stack inside a fake render, it should get ignored.
  if ( !fn || reentry) {
    return '';
  }

  {
    var frame = componentFrameCache.get(fn);

    if (frame !== undefined) {
      return frame;
    }
  }

  var control;
  reentry = true;
  var previousPrepareStackTrace = Error.prepareStackTrace; // $FlowFixMe It does accept undefined.

  Error.prepareStackTrace = undefined;
  var previousDispatcher;

  {
    previousDispatcher = ReactCurrentDispatcher.current; // Set the dispatcher in DEV because this might be call in the render function
    // for warnings.

    ReactCurrentDispatcher.current = null;
    disableLogs();
  }

  try {
    // This should throw.
    if (construct) {
      // Something should be setting the props in the constructor.
      var Fake = function () {
        throw Error();
      }; // $FlowFixMe


      Object.defineProperty(Fake.prototype, 'props', {
        set: function () {
          // We use a throwing setter instead of frozen or non-writable props
          // because that won't throw in a non-strict mode function.
          throw Error();
        }
      });

      if (typeof Reflect === 'object' && Reflect.construct) {
        // We construct a different control for this case to include any extra
        // frames added by the construct call.
        try {
          Reflect.construct(Fake, []);
        } catch (x) {
          control = x;
        }

        Reflect.construct(fn, [], Fake);
      } else {
        try {
          Fake.call();
        } catch (x) {
          control = x;
        }

        fn.call(Fake.prototype);
      }
    } else {
      try {
        throw Error();
      } catch (x) {
        control = x;
      }

      fn();
    }
  } catch (sample) {
    // This is inlined manually because closure doesn't do it for us.
    if (sample && control && typeof sample.stack === 'string') {
      // This extracts the first frame from the sample that isn't also in the control.
      // Skipping one frame that we assume is the frame that calls the two.
      var sampleLines = sample.stack.split('\n');
      var controlLines = control.stack.split('\n');
      var s = sampleLines.length - 1;
      var c = controlLines.length - 1;

      while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
        // We expect at least one stack frame to be shared.
        // Typically this will be the root most one. However, stack frames may be
        // cut off due to maximum stack limits. In this case, one maybe cut off
        // earlier than the other. We assume that the sample is longer or the same
        // and there for cut off earlier. So we should find the root most frame in
        // the sample somewhere in the control.
        c--;
      }

      for (; s >= 1 && c >= 0; s--, c--) {
        // Next we find the first one that isn't the same which should be the
        // frame that called our sample function and the control.
        if (sampleLines[s] !== controlLines[c]) {
          // In V8, the first line is describing the message but other VMs don't.
          // If we're about to return the first line, and the control is also on the same
          // line, that's a pretty good indicator that our sample threw at same line as
          // the control. I.e. before we entered the sample frame. So we ignore this result.
          // This can happen if you passed a class to function component, or non-function.
          if (s !== 1 || c !== 1) {
            do {
              s--;
              c--; // We may still have similar intermediate frames from the construct call.
              // The next one that isn't the same should be our match though.

              if (c < 0 || sampleLines[s] !== controlLines[c]) {
                // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
                var _frame = '\n' + sampleLines[s].replace(' at new ', ' at '); // If our component frame is labeled "<anonymous>"
                // but we have a user-provided "displayName"
                // splice it in to make the stack more readable.


                if (fn.displayName && _frame.includes('<anonymous>')) {
                  _frame = _frame.replace('<anonymous>', fn.displayName);
                }

                {
                  if (typeof fn === 'function') {
                    componentFrameCache.set(fn, _frame);
                  }
                } // Return the line we found.


                return _frame;
              }
            } while (s >= 1 && c >= 0);
          }

          break;
        }
      }
    }
  } finally {
    reentry = false;

    {
      ReactCurrentDispatcher.current = previousDispatcher;
      reenableLogs();
    }

    Error.prepareStackTrace = previousPrepareStackTrace;
  } // Fallback to just using the name if we couldn't make it throw.


  var name = fn ? fn.displayName || fn.name : '';
  var syntheticFrame = name ? describeBuiltInComponentFrame(name) : '';

  {
    if (typeof fn === 'function') {
      componentFrameCache.set(fn, syntheticFrame);
    }
  }

  return syntheticFrame;
}
function describeFunctionComponentFrame(fn, source, ownerFn) {
  {
    return describeNativeComponentFrame(fn, false);
  }
}

function shouldConstruct(Component) {
  var prototype = Component.prototype;
  return !!(prototype && prototype.isReactComponent);
}

function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {

  if (type == null) {
    return '';
  }

  if (typeof type === 'function') {
    {
      return describeNativeComponentFrame(type, shouldConstruct(type));
    }
  }

  if (typeof type === 'string') {
    return describeBuiltInComponentFrame(type);
  }

  switch (type) {
    case REACT_SUSPENSE_TYPE:
      return describeBuiltInComponentFrame('Suspense');

    case REACT_SUSPENSE_LIST_TYPE:
      return describeBuiltInComponentFrame('SuspenseList');
  }

  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_FORWARD_REF_TYPE:
        return describeFunctionComponentFrame(type.render);

      case REACT_MEMO_TYPE:
        // Memo may contain any component type so we recursively resolve it.
        return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);

      case REACT_LAZY_TYPE:
        {
          var lazyComponent = type;
          var payload = lazyComponent._payload;
          var init = lazyComponent._init;

          try {
            // Lazy may contain any component type so we recursively resolve it.
            return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
          } catch (x) {}
        }
    }
  }

  return '';
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

var loggedTypeFailures = {};
var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;

function setCurrentlyValidatingElement(element) {
  {
    if (element) {
      var owner = element._owner;
      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
      ReactDebugCurrentFrame.setExtraStackFrame(stack);
    } else {
      ReactDebugCurrentFrame.setExtraStackFrame(null);
    }
  }
}

function checkPropTypes(typeSpecs, values, location, componentName, element) {
  {
    // $FlowFixMe This is okay but Flow doesn't know it.
    var has = Function.call.bind(hasOwnProperty);

    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error$1 = void 0; // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.

        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            // eslint-disable-next-line react-internal/prod-error-codes
            var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
            err.name = 'Invariant Violation';
            throw err;
          }

          error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED');
        } catch (ex) {
          error$1 = ex;
        }

        if (error$1 && !(error$1 instanceof Error)) {
          setCurrentlyValidatingElement(element);

          error('%s: type specification of %s' + ' `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error$1);

          setCurrentlyValidatingElement(null);
        }

        if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error$1.message] = true;
          setCurrentlyValidatingElement(element);

          error('Failed %s type: %s', location, error$1.message);

          setCurrentlyValidatingElement(null);
        }
      }
    }
  }
}

var isArrayImpl = Array.isArray; // eslint-disable-next-line no-redeclare

function isArray(a) {
  return isArrayImpl(a);
}

/*
 * The `'' + value` pattern (used in in perf-sensitive code) throws for Symbol
 * and Temporal.* types. See https://github.com/facebook/react/pull/22064.
 *
 * The functions in this module will throw an easier-to-understand,
 * easier-to-debug exception with a clear errors message message explaining the
 * problem. (Instead of a confusing exception thrown inside the implementation
 * of the `value` object).
 */
// $FlowFixMe only called in DEV, so void return is not possible.
function typeName(value) {
  {
    // toStringTag is needed for namespaced types like Temporal.Instant
    var hasToStringTag = typeof Symbol === 'function' && Symbol.toStringTag;
    var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || 'Object';
    return type;
  }
} // $FlowFixMe only called in DEV, so void return is not possible.


function willCoercionThrow(value) {
  {
    try {
      testStringCoercion(value);
      return false;
    } catch (e) {
      return true;
    }
  }
}

function testStringCoercion(value) {
  // If you ended up here by following an exception call stack, here's what's
  // happened: you supplied an object or symbol value to React (as a prop, key,
  // DOM attribute, CSS property, string ref, etc.) and when React tried to
  // coerce it to a string using `'' + value`, an exception was thrown.
  //
  // The most common types that will cause this exception are `Symbol` instances
  // and Temporal objects like `Temporal.Instant`. But any object that has a
  // `valueOf` or `[Symbol.toPrimitive]` method that throws will also cause this
  // exception. (Library authors do this to prevent users from using built-in
  // numeric operators like `+` or comparison operators like `>=` because custom
  // methods are needed to perform accurate arithmetic or comparison.)
  //
  // To fix the problem, coerce this object or symbol value to a string before
  // passing it to React. The most reliable way is usually `String(value)`.
  //
  // To find which value is throwing, check the browser or debugger console.
  // Before this exception was thrown, there should be `console.error` output
  // that shows the type (Symbol, Temporal.PlainDate, etc.) that caused the
  // problem and how that type was used: key, atrribute, input value prop, etc.
  // In most cases, this console output also shows the component and its
  // ancestor components where the exception happened.
  //
  // eslint-disable-next-line react-internal/safe-string-coercion
  return '' + value;
}
function checkKeyStringCoercion(value) {
  {
    if (willCoercionThrow(value)) {
      error('The provided key is an unsupported type %s.' + ' This value must be coerced to a string before before using it here.', typeName(value));

      return testStringCoercion(value); // throw (to help callers find troubleshooting comments)
    }
  }
}

var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};
var specialPropKeyWarningShown;
var specialPropRefWarningShown;
var didWarnAboutStringRefs;

{
  didWarnAboutStringRefs = {};
}

function hasValidRef(config) {
  {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.ref !== undefined;
}

function hasValidKey(config) {
  {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.key !== undefined;
}

function warnIfStringRefCannotBeAutoConverted(config, self) {
  {
    if (typeof config.ref === 'string' && ReactCurrentOwner.current && self && ReactCurrentOwner.current.stateNode !== self) {
      var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);

      if (!didWarnAboutStringRefs[componentName]) {
        error('Component "%s" contains the string ref "%s". ' + 'Support for string refs will be removed in a future major release. ' + 'This case cannot be automatically converted to an arrow function. ' + 'We ask you to manually fix this case by using useRef() or createRef() instead. ' + 'Learn more about using refs safely here: ' + 'https://reactjs.org/link/strict-mode-string-ref', getComponentNameFromType(ReactCurrentOwner.current.type), config.ref);

        didWarnAboutStringRefs[componentName] = true;
      }
    }
  }
}

function defineKeyPropWarningGetter(props, displayName) {
  {
    var warnAboutAccessingKey = function () {
      if (!specialPropKeyWarningShown) {
        specialPropKeyWarningShown = true;

        error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
      }
    };

    warnAboutAccessingKey.isReactWarning = true;
    Object.defineProperty(props, 'key', {
      get: warnAboutAccessingKey,
      configurable: true
    });
  }
}

function defineRefPropWarningGetter(props, displayName) {
  {
    var warnAboutAccessingRef = function () {
      if (!specialPropRefWarningShown) {
        specialPropRefWarningShown = true;

        error('%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
      }
    };

    warnAboutAccessingRef.isReactWarning = true;
    Object.defineProperty(props, 'ref', {
      get: warnAboutAccessingRef,
      configurable: true
    });
  }
}
/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, instanceof check
 * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @internal
 */


var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,
    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,
    // Record the component responsible for creating this element.
    _owner: owner
  };

  {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.

    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    }); // self and source are DEV only properties.

    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self
    }); // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.

    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source
    });

    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};
/**
 * https://github.com/reactjs/rfcs/pull/107
 * @param {*} type
 * @param {object} props
 * @param {string} key
 */

function jsxDEV(type, config, maybeKey, source, self) {
  {
    var propName; // Reserved names are extracted

    var props = {};
    var key = null;
    var ref = null; // Currently, key can be spread in as a prop. This causes a potential
    // issue if key is also explicitly declared (ie. <div {...props} key="Hi" />
    // or <div key="Hi" {...props} /> ). We want to deprecate key spread,
    // but as an intermediary step, we will use jsxDEV for everything except
    // <div {...props} key="Hi" />, because we aren't currently able to tell if
    // key is explicitly declared to be undefined or not.

    if (maybeKey !== undefined) {
      {
        checkKeyStringCoercion(maybeKey);
      }

      key = '' + maybeKey;
    }

    if (hasValidKey(config)) {
      {
        checkKeyStringCoercion(config.key);
      }

      key = '' + config.key;
    }

    if (hasValidRef(config)) {
      ref = config.ref;
      warnIfStringRefCannotBeAutoConverted(config, self);
    } // Remaining properties are added to a new props object


    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    } // Resolve default props


    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;

      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }

    if (key || ref) {
      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }

      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }

    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
  }
}

var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;

function setCurrentlyValidatingElement$1(element) {
  {
    if (element) {
      var owner = element._owner;
      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
      ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
    } else {
      ReactDebugCurrentFrame$1.setExtraStackFrame(null);
    }
  }
}

var propTypesMisspellWarningShown;

{
  propTypesMisspellWarningShown = false;
}
/**
 * Verifies the object is a ReactElement.
 * See https://reactjs.org/docs/react-api.html#isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a ReactElement.
 * @final
 */


function isValidElement(object) {
  {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }
}

function getDeclarationErrorAddendum() {
  {
    if (ReactCurrentOwner$1.current) {
      var name = getComponentNameFromType(ReactCurrentOwner$1.current.type);

      if (name) {
        return '\n\nCheck the render method of `' + name + '`.';
      }
    }

    return '';
  }
}

function getSourceInfoErrorAddendum(source) {
  {
    if (source !== undefined) {
      var fileName = source.fileName.replace(/^.*[\\\/]/, '');
      var lineNumber = source.lineNumber;
      return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
    }

    return '';
  }
}
/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */


var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  {
    var info = getDeclarationErrorAddendum();

    if (!info) {
      var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;

      if (parentName) {
        info = "\n\nCheck the top-level render call using <" + parentName + ">.";
      }
    }

    return info;
  }
}
/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */


function validateExplicitKey(element, parentType) {
  {
    if (!element._store || element._store.validated || element.key != null) {
      return;
    }

    element._store.validated = true;
    var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

    if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
      return;
    }

    ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
    // property, it may be the creator of the child that's responsible for
    // assigning it a key.

    var childOwner = '';

    if (element && element._owner && element._owner !== ReactCurrentOwner$1.current) {
      // Give the component that originally created this child.
      childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
    }

    setCurrentlyValidatingElement$1(element);

    error('Each child in a list should have a unique "key" prop.' + '%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);

    setCurrentlyValidatingElement$1(null);
  }
}
/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */


function validateChildKeys(node, parentType) {
  {
    if (typeof node !== 'object') {
      return;
    }

    if (isArray(node)) {
      for (var i = 0; i < node.length; i++) {
        var child = node[i];

        if (isValidElement(child)) {
          validateExplicitKey(child, parentType);
        }
      }
    } else if (isValidElement(node)) {
      // This element was passed in a valid location.
      if (node._store) {
        node._store.validated = true;
      }
    } else if (node) {
      var iteratorFn = getIteratorFn(node);

      if (typeof iteratorFn === 'function') {
        // Entry iterators used to provide implicit keys,
        // but now we print a separate warning for them later.
        if (iteratorFn !== node.entries) {
          var iterator = iteratorFn.call(node);
          var step;

          while (!(step = iterator.next()).done) {
            if (isValidElement(step.value)) {
              validateExplicitKey(step.value, parentType);
            }
          }
        }
      }
    }
  }
}
/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */


function validatePropTypes(element) {
  {
    var type = element.type;

    if (type === null || type === undefined || typeof type === 'string') {
      return;
    }

    var propTypes;

    if (typeof type === 'function') {
      propTypes = type.propTypes;
    } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
    // Inner props are checked in the reconciler.
    type.$$typeof === REACT_MEMO_TYPE)) {
      propTypes = type.propTypes;
    } else {
      return;
    }

    if (propTypes) {
      // Intentionally inside to avoid triggering lazy initializers:
      var name = getComponentNameFromType(type);
      checkPropTypes(propTypes, element.props, 'prop', name, element);
    } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
      propTypesMisspellWarningShown = true; // Intentionally inside to avoid triggering lazy initializers:

      var _name = getComponentNameFromType(type);

      error('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', _name || 'Unknown');
    }

    if (typeof type.getDefaultProps === 'function' && !type.getDefaultProps.isReactClassApproved) {
      error('getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
    }
  }
}
/**
 * Given a fragment, validate that it can only be provided with fragment props
 * @param {ReactElement} fragment
 */


function validateFragmentProps(fragment) {
  {
    var keys = Object.keys(fragment.props);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (key !== 'children' && key !== 'key') {
        setCurrentlyValidatingElement$1(fragment);

        error('Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);

        setCurrentlyValidatingElement$1(null);
        break;
      }
    }

    if (fragment.ref !== null) {
      setCurrentlyValidatingElement$1(fragment);

      error('Invalid attribute `ref` supplied to `React.Fragment`.');

      setCurrentlyValidatingElement$1(null);
    }
  }
}

var didWarnAboutKeySpread = {};
function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
  {
    var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.

    if (!validType) {
      var info = '';

      if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
        info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
      }

      var sourceInfo = getSourceInfoErrorAddendum(source);

      if (sourceInfo) {
        info += sourceInfo;
      } else {
        info += getDeclarationErrorAddendum();
      }

      var typeString;

      if (type === null) {
        typeString = 'null';
      } else if (isArray(type)) {
        typeString = 'array';
      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
        typeString = "<" + (getComponentNameFromType(type.type) || 'Unknown') + " />";
        info = ' Did you accidentally export a JSX literal instead of a component?';
      } else {
        typeString = typeof type;
      }

      error('React.jsx: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
    }

    var element = jsxDEV(type, props, key, source, self); // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.

    if (element == null) {
      return element;
    } // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)


    if (validType) {
      var children = props.children;

      if (children !== undefined) {
        if (isStaticChildren) {
          if (isArray(children)) {
            for (var i = 0; i < children.length; i++) {
              validateChildKeys(children[i], type);
            }

            if (Object.freeze) {
              Object.freeze(children);
            }
          } else {
            error('React.jsx: Static children should always be an array. ' + 'You are likely explicitly calling React.jsxs or React.jsxDEV. ' + 'Use the Babel transform instead.');
          }
        } else {
          validateChildKeys(children, type);
        }
      }
    }

    {
      if (hasOwnProperty.call(props, 'key')) {
        var componentName = getComponentNameFromType(type);
        var keys = Object.keys(props).filter(function (k) {
          return k !== 'key';
        });
        var beforeExample = keys.length > 0 ? '{key: someKey, ' + keys.join(': ..., ') + ': ...}' : '{key: someKey}';

        if (!didWarnAboutKeySpread[componentName + beforeExample]) {
          var afterExample = keys.length > 0 ? '{' + keys.join(': ..., ') + ': ...}' : '{}';

          error('A props object containing a "key" prop is being spread into JSX:\n' + '  let props = %s;\n' + '  <%s {...props} />\n' + 'React keys must be passed directly to JSX without using spread:\n' + '  let props = %s;\n' + '  <%s key={someKey} {...props} />', beforeExample, componentName, afterExample, componentName);

          didWarnAboutKeySpread[componentName + beforeExample] = true;
        }
      }
    }

    if (type === REACT_FRAGMENT_TYPE) {
      validateFragmentProps(element);
    } else {
      validatePropTypes(element);
    }

    return element;
  }
} // These two functions exist to still get child warnings in dev
// even with the prod transform. This means that jsxDEV is purely
// opt-in behavior for better messages but that we won't stop
// giving you warnings if you use production apis.

function jsxWithValidationStatic(type, props, key) {
  {
    return jsxWithValidation(type, props, key, true);
  }
}
function jsxWithValidationDynamic(type, props, key) {
  {
    return jsxWithValidation(type, props, key, false);
  }
}

var jsx =  jsxWithValidationDynamic ; // we may want to special case jsxs internally to take advantage of static children.
// for now we can ship identical prod functions

var jsxs =  jsxWithValidationStatic ;

exports.Fragment = REACT_FRAGMENT_TYPE;
exports.jsx = jsx;
exports.jsxs = jsxs;
  })();
}


/***/ }),

/***/ "./node_modules/react/jsx-runtime.js":
/*!*******************************************!*\
  !*** ./node_modules/react/jsx-runtime.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-jsx-runtime.development.js */ "./node_modules/react/cjs/react-jsx-runtime.development.js");
}


/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["apiFetch"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

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

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

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
/************************************************************************/
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*****************************************************!*\
  !*** ./assets/js/apps/document-repository/index.js ***!
  \*****************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./App */ "./assets/js/apps/document-repository/App.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/**
 * Document Repository - Main Application Entry Point
 *
 * This is the main entry point for the Document Repository React application.
 * It sets up the React application and mounts it to the DOM.
 *
 * @module DocumentRepository
 * @requires @wordpress/element
 */




/**
 * Initialize and render the Document Repository application
 */

document.addEventListener('DOMContentLoaded', function () {
  try {
    var appContainer = document.getElementById('dswp-document-repository-app');
    if (appContainer) {
      var root = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createRoot)(appContainer);
      root.render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_App__WEBPACK_IMPORTED_MODULE_1__["default"], {}));
    } else {
      // Create a visible error message if container is not found
      var errorDiv = document.createElement('div');
      errorDiv.style.color = 'red';
      errorDiv.style.padding = '20px';
      errorDiv.style.border = '1px solid red';
      errorDiv.innerHTML = '<strong>Error:</strong> Document Repository container not found. Check console for details.';
      document.body.prepend(errorDiv);
    }
  } catch (error) {
    // Display error on the page
    var _errorDiv = document.createElement('div');
    _errorDiv.style.color = 'red';
    _errorDiv.style.padding = '20px';
    _errorDiv.style.border = '1px solid red';
    _errorDiv.innerHTML = "<strong>Error:</strong> Failed to initialize Document Repository app: ".concat(error.message);
    document.body.prepend(_errorDiv);
  }
});
})();

/******/ })()
;
//# sourceMappingURL=document-repository.js.map