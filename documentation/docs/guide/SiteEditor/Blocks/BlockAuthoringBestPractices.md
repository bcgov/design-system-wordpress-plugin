# Build a block (best practices for buiilding a new block)

Use this as a quick checklist when building new blocks in this plugin.
This version uses a simple example: `Card Group` (parent) + `Card Item` (child).

## 1) Folder structure to follow

Keep block code under `Blocks/src/<BlockName>/`.

Example:

```text
Blocks/
  src/
    CardGroup/
      block.json
      index.js
      edit/index.js
      render.php
      view.js
      view.scss
    CardItem/
      block.json
      index.js
      edit/index.js
      render.php
      view.scss
```

Build output goes to `Blocks/build/<BlockName>/` using `wp-scripts`.

## 2) Namespace pattern (PHP)

In each block render file, use:

```php
namespace BlockPlugin\<BlockName>;
```

Examples:

- `BlockPlugin\CardGroup`
- `BlockPlugin\CardItem`

If you need shared PHP logic, keep it in `src/` under `BlockPlugin\...`.

## 3) Parent + child blocks (children allowed only inside parent)

### Child `block.json`

Use `parent` so the child is not insertable at root:

```json
{
  "name": "block-plugin/card-item",
  "parent": ["block-plugin/card-group"],
  "supports": { "html": false }
}
```

### Parent `edit/index.js`

Allow only your children:

```js
const innerBlocksProps = useInnerBlocksProps(
  { className: 'card-group__items' },
  {
    allowedBlocks: [ 'block-plugin/card-item' ],
    orientation: 'vertical',
    renderAppender: false
  }
);
```

Result:

- child block appears only inside parent
- user cannot add child directly to page root

## 4) Block supports (enable style controls)

In each block `block.json`, enable supports you want in Global Styles:

```json
{
  "supports": {
    "html": false,
    "border": { "color": true, "radius": true, "style": true, "width": true },
    "color": { "text": true, "background": true },
    "spacing": { "padding": true, "margin": true }
  }
}
```

Do this on parent and child blocks if both should be theme-stylable.

## 5) Theme.json styling (global + per block)

Because nested children are separate blocks, style each block name explicitly.

### Global defaults

Set broad defaults once:

```json
{
  "styles": {
    "color": {
      "text": "var(--wp--preset--color--foreground)",
      "background": "var(--wp--preset--color--background)"
    },
    "border": {
      "color": "var(--wp--preset--color--contrast)",
      "width": "1px",
      "style": "solid"
    }
  }
}
```

### Per-block overrides

Then override only where needed:

```json
{
  "styles": {
    "blocks": {
      "block-plugin/card-group": {
        "border": { "radius": "4px" },
        "spacing": { "padding": { "top": "0", "right": "0", "bottom": "0", "left": "0" } },
        "css": ".wp-block-block-plugin-card-group .card-group__header { background: var(--wp--preset--color--base-2); }"
      },
      "block-plugin/card-item": {
        "color": { "background": "transparent" },
        "css": ".wp-block-block-plugin-card-item .card-item__title { color: var(--wp--preset--color--foreground); }"
      }
    }
  }
}
```

Simple rule:

- Global styles = baseline
- `styles.blocks["namespace/block"]` = specific behavior for that block
- Child blocks do **not** automatically inherit parent block overrides unless styled directly

## 6) Register and build

### Register in plugin bootstrap

`block-plugin.php`:

```php
register_block_type( plugin_dir_path( __FILE__ ) . 'Blocks/build/CardGroup' );
register_block_type( plugin_dir_path( __FILE__ ) . 'Blocks/build/CardItem' );
```

### Add scripts in `Blocks/package.json`

```json
"build:cardgroup": "wp-scripts build --webpack-src-dir=src/CardGroup --output-path=build/CardGroup",
"build:carditem": "wp-scripts build --webpack-src-dir=src/CardItem --output-path=build/CardItem"
```

## 7) Keep it simple checklist

- one folder per block under `Blocks/src/`
- one namespace per block render file
- child `parent` restriction in child `block.json`
- `allowedBlocks` restriction in parent edit
- supports enabled in block.json
- theme.json has entries for parent and child block names
- register both blocks in plugin bootstrap

## 8) `render.php` vs `save.js` (simple rule)

Use this rule of thumb:

- If output depends on server/runtime data -> use `render.php` (dynamic block)
- If output is fixed from attributes only -> use `save.js` (static block)

### When to use `render.php`

Use `render.php` when your block needs:

- database or API data at page load
- logged-in/user-specific content
- query vars or URL-dependent output
- centralized PHP logic shared across blocks

`block.json` example:

```json
{
  "name": "block-plugin/card-group",
  "render": "file:./render.php"
}
```

In this case, `save.js` is usually:

```js
save: () => null
```

### When to use `save.js`

Use `save.js` when block HTML can be fully saved in post content and does not need PHP.

`Card Item` is a good simple example:

- title text
- description text
- optional icon class

All of that can be saved directly in markup with `save.js`.

### When each file is not needed

- Dynamic block:
  - need: `render.php`
  - usually no real `save.js` output (`save: () => null`)
- Static block:
  - need: `save.js`
  - no `render.php` needed

### Parent/child example choice

For this guide's example:

- `CardGroup` (parent): usually dynamic (`render.php`) if it aggregates runtime data
- `CardItem` (child): often static (`save.js`) if it is just editor-entered content

Both are valid as dynamic too. Pick the simplest option that matches your data needs.

## 9) Copy/paste sample code (with theming support)

These examples are intentionally small. They show the minimum pieces needed for theme styling to work.

### Parent `edit.js` (`block-plugin/card-group`)

```js
import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

const ALLOWED_BLOCKS = [ 'block-plugin/card-item' ];

export default function Edit() {
	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'card-group__items' },
		{
			allowedBlocks: ALLOWED_BLOCKS,
			orientation: 'vertical',
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Card Group Settings', 'block-plugin' ) }>
					<p>{ __( 'Add and reorder Card Item blocks.', 'block-plugin' ) }</p>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="card-group__header">
					<strong>{ __( 'Card Group', 'block-plugin' ) }</strong>
				</div>
				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}
```

### Parent `render.php` (`block-plugin/card-group`)

```php
<?php
/**
 * Card Group dynamic render.
 *
 * @package block-plugin
 */

namespace BlockPlugin\CardGroup;

$wrapper_attributes = get_block_wrapper_attributes();
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="card-group__header">
		<?php echo esc_html__( 'Card Group', 'block-plugin' ); ?>
	</div>

	<div class="card-group__items">
		<?php
		// Render nested child blocks in saved order.
		echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		?>
	</div>
</div>
```

### Child `save.js` (`block-plugin/card-item`)

```js
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { title, body } = attributes;

	return (
		<div { ...useBlockProps.save() }>
			<RichText.Content tagName="h3" className="card-item__title" value={ title } />
			<RichText.Content tagName="p" className="card-item__body" value={ body } />
		</div>
	);
}
```

### Required `block.json` supports (for theme controls)

```json
{
  "supports": {
    "html": false,
    "border": { "color": true, "radius": true, "style": true, "width": true },
    "color": { "text": true, "background": true },
    "spacing": { "padding": true, "margin": true }
  }
}
```

For child-only usage:

```json
{
  "name": "block-plugin/card-item",
  "parent": [ "block-plugin/card-group" ]
}
```

### Matching `theme.json` example

```json
{
  "styles": {
    "color": {
      "text": "var(--wp--preset--color--foreground)",
      "background": "var(--wp--preset--color--background)"
    },
    "border": {
      "color": "var(--wp--preset--color--contrast)",
      "width": "1px",
      "style": "solid"
    },
    "blocks": {
      "block-plugin/card-group": {
        "border": {
          "radius": "4px",
          "color": "var(--wp--preset--color--contrast)"
        },
        "color": {
          "background": "var(--wp--preset--color--background)"
        },
        "header": {
          "color": {
            "background": "var(--wp--preset--color--base-2)",
            "text": "var(--wp--preset--color--foreground)"
          }
        }
      },
      "block-plugin/card-item": {
        "border": { "color": "var(--wp--preset--color--contrast)" },
        "color": {
          "background": "transparent",
          "text": "var(--wp--preset--color--foreground)"
        }
      }
    }
  }
}
```

Why this works:

- `useBlockProps()` / `useBlockProps.save()` adds the standard block wrapper class
- `get_block_wrapper_attributes()` does the same for dynamic PHP blocks
- theme.json targets those wrapper classes per block name
- `header.color` in the example maps to `.card-group__header` in the interactive playground below (structured colors instead of a `css` string)
- Per-block `border` (e.g. `color` next to `radius` on `card-group`) merges over global `styles.border` in the playground preview

## 10. Interactive HTML preview (docs only)

The playground below uses `render.php`, `save.js`, and `theme.json` for the live preview. Each block folder includes its own `block.json` (same place as in a real plugin) for reference only — they do not change the preview. Parent `edit.js` from section 9 is omitted here. Mock styles only — not your theme.

<BlockHtmlPlayground />
