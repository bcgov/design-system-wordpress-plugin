# Test plan for Design System WordPress Plugin

## Plugin Initialization Test

- ✔ Wordpress environment

## Blocks Tests

### BreadCrumb Block Render

- ✔ Renders with default slash divider
- ✔ Renders with chevron divider
- ✔ Current page as text by default
- ✔ Current page as link when enabled
- ✔ Builds correct hierarchy
- ✔ Renders with no ancestors
- ✔ Correct number of separators
- ✔ Urls are escaped
- ✔ Html structure and classes
- ✔ Titles are escaped
- ✔ Renders parent page correctly

### Navigation Block Registration

> note: this block should be updated to be dynamic. This will affect render tests: they will look for `<nav>` elements and other metadata added by render.php (which is missing and should be added)


- ✔ Block is registered with correct name
- ✔ Block has correct attributes defined
- ✔ Block supports className attribute
- ✔ Block has correct view script enqueued
- ✔ Block has correct editor and frontend styles enqueued

### Navigation Block Render

- ✔ Renders with default attributes
- ✔ Renders list with core navigation layout classes
- ✔ Inner blocks content is rendered
- ✔ Custom class name is applied
- ✔ Mobile menu button renders with correct attributes
- ✔ Mobile menu button has correct aria attributes
- ✔ Menu close button renders correctly
- ✔ Nav element has role navigation
- ✔ Nav element has aria label
- ✔ Mobile toggle has aria expanded
- ✔ Mobile toggle has aria controls
- ✔ Screen reader text is properly implemented

## Feature Tests

### Auto Anchor Settings

- ✔ Init registers expected hooks
- ✔ Register settings registers option with expected args
- ✔ Add menu creates parent and submenu when parent missing
- ✔ Add menu adds submenu when parent exists
- ✔ Add toggle styles only enqueues on settings page
- ✔ Render settings page outputs view for admin
- ✔ Render settings page outputs nothing for non admin

### Auto Anchor View

- ✔ View renders wrapper div
- ✔ View renders page title
- ✔ View renders form with correct action
- ✔ View calls settings fields
- ✔ View renders checkbox input with correct name
- ✔ View renders checkbox unchecked when option is disabled
- ✔ View renders checkbox checked when option is enabled
- ✔ View renders toggle switch classes
- ✔ View renders form table structure
- ✔ View renders field label
- ✔ View renders toggle label text
- ✔ View renders description text
- ✔ View renders submit button
- ✔ View escapes output properly
- ✔ View uses wordpress i18n functions
- ✔ View has inline flex styling
- ✔ View option defaults to zero when not set
- ✔ View handles abspath check
- ✔ View includes namespace
- ✔ View uses settings class constant

### In Page Nav

- ✔ Constructor sets version and calls init
- ✔ Register meta creates meta field
- ✔ Meta auth callback checks capability
- ✔ Enqueue assets returns early when not on page
- ✔ Enqueue assets returns early when nav disabled
- ✔ Enqueue assets enqueues when nav enabled
- ✔ Enqueue assets localizes script data
- ✔ Enqueue assets excerpt fallback to content
- ✔ Enqueue editor assets with asset file
- ✔ Enqueue editor assets uses fallback dependencies
- ✔ Localized script has correct options

### Content Security Policy

> note: validate_csp_input() should be refactored to detect and record
> disallowed keywords and add a settings error when the sanitized input is empty. The
> test that covers this function has been commented out.*

- ✔ Validate csp input valid
- ✔ Validate csp input disallowed keywords
- ✔ Register settings registers with wp
- ✔ Add csp header

### Design System Settings

- ✔ Add menu registers page
- ✔ Render settings page outputs expected markup

### Notification Banner

> note: add_menu() currently does not register a submenu (empty implementation).
> To enable this test, the class must be refactored to call add_submenu_page with:
>
> - parent slug: 'dswp-admin-menu' (from the Settings main menu),
> - page title/menu title/capability,
> - menu slug: 'dswp-notification-menu',
> - callback: [$this, 'render_notification_banner_page'].*

- ✔ Register settings registers with wp
- ✔ Render notification banner page outputs form and preview container
- ✔ Display banner outputs when enabled
- ✔ Display banner no output when disabled

### Skip Navigation

- ✔ Modify block render returns null when content is null
- ✔ Modify block render adds id for core post content
- ✔ Modify block render adds id for main tag
- ✔ Modify block render adds id for navigation block
- ✔ Modify block render adds main id only once
- ✔ Add skip nav outputs expected links
