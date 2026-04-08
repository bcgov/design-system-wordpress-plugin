<style scoped>
/*
 * Full-width strip in the *main pane* only: break out of prose max-width but
 * do not extend under the fixed sidebar (VuePress --sidebar-width).
 */
.block-html-playground {
	position: relative;
	box-sizing: border-box;
	margin-top: 1rem;
	margin-bottom: 1.5rem;
	padding: 16px clamp(12px, 3vw, 28px);
	min-height: calc(100dvh - 3.5rem);
	display: flex;
	flex-direction: column;
	border-block: 1px solid var(--vp-c-divider, #ddd);
	border-inline: none;
	border-radius: 0;
	background: var(--vp-c-bg-alt, #f9f9f9);
	left: auto;
	right: auto;
}

/* Desktop: align with vp-page padding (sidebar); width = viewport minus sidebar */
@media (min-width: 960px) {
	.block-html-playground {
		width: calc(100vw - var(--sidebar-width, 20rem));
		max-width: calc(100vw - var(--sidebar-width, 20rem));
		margin-left: calc((100% - 100vw + var(--sidebar-width, 20rem)) / 2);
		margin-right: 0;
	}
}

/* Tablet: matches VPPage padding-inline-start */
@media (min-width: 720px) and (max-width: 959px) {
	.block-html-playground {
		width: calc(100vw - var(--sidebar-width-mobile));
		max-width: calc(100vw - var(--sidebar-width-mobile));
		margin-left: calc((100% - 100vw + var(--sidebar-width-mobile)) / 2);
		margin-right: 0;
	}
}

/* Mobile: no sidebar gutter on vp-page — classic full-bleed from prose column */
@media (max-width: 719px) {
	.block-html-playground {
		width: 100vw;
		max-width: 100vw;
		left: 50%;
		right: 50%;
		margin-left: -50vw;
		margin-right: -50vw;
	}
}

.block-html-playground__note {
	flex-shrink: 0;
	margin: 0 0 12px;
	font-size: 0.875rem;
	color: var(--vp-c-text-mute, #646970);
	line-height: 1.5;
}

.block-html-playground__note code {
	font-size: 0.8125rem;
	color: var(--vp-c-text, inherit);
}

.block-html-playground__workspace {
	flex: 1;
	min-height: 0;
	display: grid;
	grid-template-columns: minmax(180px, 220px) minmax(0, 1fr) minmax(0, 1fr);
	grid-template-rows: minmax(0, 1fr);
	gap: 12px;
	align-items: stretch;
}

@media (max-width: 960px) {
	.block-html-playground__workspace {
		grid-template-columns: 1fr;
		grid-template-rows: auto;
		flex: none;
		min-height: auto;
	}

	.block-html-playground {
		min-height: auto;
	}
}

.block-html-playground__tree {
	border: 1px solid var(--vp-c-border, var(--vp-c-divider, #c3c4c7));
	border-radius: 4px;
	background: var(--vp-c-bg-elv, var(--vp-c-bg, #fff));
	padding: 8px 0;
	overflow: auto;
	min-height: 0;
	align-self: stretch;
	max-height: none;
}

@media (max-width: 960px) {
	.block-html-playground__tree {
		max-height: 220px;
	}
}

.block-html-playground__tree-title {
	font-size: 0.7rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: var(--vp-c-text-mute, #646970);
	padding: 0 10px 8px;
	border-bottom: 1px solid var(--vp-c-divider, #eee);
	margin-bottom: 6px;
}

.block-html-playground__tree-list {
	list-style: none;
	margin: 0;
	padding: 0;
}

.block-html-playground__tree-item {
	margin: 0;
}

.block-html-playground__tree-file {
	display: flex;
	align-items: center;
	gap: 6px;
	width: 100%;
	text-align: left;
	padding: 5px 10px;
	border: 0;
	background: transparent;
	color: var(--vp-c-text, #1e1e1e);
	font-size: 12px;
	font-family: ui-monospace, monospace;
	cursor: pointer;
	border-radius: 0;
}

.block-html-playground__tree-file:hover {
	background: var(--vp-c-control-hover, #f0f0f1);
}

.block-html-playground__tree-file.is-active {
	background: var(--vp-c-control, rgb(142 150 170 / 10%));
	font-weight: 600;
}

.block-html-playground__tree-dir {
	display: block;
	padding: 4px 10px;
	font-size: 11px;
	font-weight: 600;
	font-family: ui-monospace, monospace;
	color: var(--vp-c-text-mute, #646970);
	user-select: none;
}

.block-html-playground__editor-pane,
.block-html-playground__preview-pane {
	display: flex;
	flex-direction: column;
	min-height: 0;
}

.block-html-playground__label {
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	margin-bottom: 6px;
	color: var(--vp-c-text-mute, #646970);
	word-break: break-all;
}

.block-html-playground__textarea {
	flex: 1;
	min-height: 0;
	width: 100%;
	box-sizing: border-box;
	font-family: ui-monospace, monospace;
	font-size: 11px;
	line-height: 1.45;
	padding: 10px;
	color: var(--vp-c-text, #1e1e1e);
	background: var(--vp-c-bg-elv, var(--vp-c-bg, #fff));
	border: 1px solid var(--vp-c-border, var(--vp-c-divider, #c3c4c7));
	border-radius: 4px;
	caret-color: var(--vp-c-text, #1e1e1e);
	resize: vertical;
	tab-size: 2;
}

.block-html-playground__reset {
	align-self: flex-start;
	margin-top: 8px;
	padding: 6px 12px;
	font-size: 13px;
	cursor: pointer;
	color: var(--vp-c-text, #1e1e1e);
	border: 1px solid var(--vp-c-border, var(--vp-c-divider, #c3c4c7));
	border-radius: 4px;
	background: var(--vp-c-bg-elv, var(--vp-c-bg, #fff));
}

.block-html-playground__reset:hover {
	background: var(--vp-c-control-hover, #f0f0f1);
}

.block-html-playground__frame-wrap {
	flex: 1;
	min-height: 200px;
	border: 1px solid var(--vp-c-border, var(--vp-c-divider, #c3c4c7));
	border-radius: 4px;
	background: var(--vp-c-bg-elv, var(--vp-c-bg, #fff));
	overflow: hidden;
}

.block-html-playground__iframe {
	width: 100%;
	height: 100%;
	min-height: 200px;
	border: 0;
	display: block;
}

@media (min-width: 961px) {
	.block-html-playground__iframe {
		min-height: 0;
	}
}
</style>

<script setup>
import { computed, reactive, ref } from 'vue';

const editorId = 'block-playground-file-editor';

/** @typedef {{ groupHeader: string, cards: { title: string, body: string }[] }} Snapshot */

/** @type {Snapshot} */
const defaultSnapshot = () => ( {
	groupHeader: 'Card Group',
	cards: [
		{
			title: 'First item',
			body: 'Description for the first card.',
		},
		{
			title: 'Second item',
			body: 'Edit any file in the tree — strings stay in sync where they match.',
		},
	],
} );

function buildCardGroupBlockJson() {
	return buildBlockJson( {
		name: 'block-plugin/card-group',
		title: 'Card Group',
		icon: 'screenoptions',
		description: 'Parent block: header row and inner Card Item blocks.',
		render: true,
	} );
}

function buildCardItemBlockJson() {
	return buildBlockJson( {
		name: 'block-plugin/card-item',
		title: 'Card Item',
		icon: 'index-card',
		description: 'Child block: title and body saved in post content.',
		parent: 'block-plugin/card-group',
	} );
}

const blockSupports = {
	html: false,
	border: {
		color: true,
		radius: true,
		style: true,
		width: true,
	},
	color: { text: true, background: true },
	spacing: { padding: true, margin: true },
};

function buildBlockJson( { name, title, icon, description, parent, render = false } ) {
	const o = {
		$schema: 'https://schemas.wp.org/trunk/block.json',
		apiVersion: 3,
		name,
		title,
		category: 'widgets',
		icon,
		description,
		textdomain: 'block-plugin',
		editorScript: 'file:./index.js',
		style: 'file:./style-index.css',
		supports: blockSupports,
	};
	if ( parent ) {
		o.parent = [ parent ];
	}
	if ( render ) {
		o.render = 'file:./render.php';
	}
	return `${ JSON.stringify( o, null, 2 ) }\n`;
}

function buildThemeJson() {
	return `{
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
`;
}

const snapshot = reactive( {
	...defaultSnapshot(),
	cardGroupBlockJsonText: buildCardGroupBlockJson(),
	cardItemBlockJsonText: buildCardItemBlockJson(),
	themeJsonText: buildThemeJson(),
} );

const tree = [
	{
		type: 'dir',
		label: 'CardGroup',
		children: [
			{ type: 'file', label: 'block.json', path: 'CardGroup/block.json' },
			{ type: 'file', label: 'render.php', path: 'CardGroup/render.php' },
		],
	},
	{
		type: 'dir',
		label: 'CardItem',
		children: [
			{ type: 'file', label: 'block.json', path: 'CardItem/block.json' },
			{ type: 'file', label: 'save.js', path: 'CardItem/save.js' },
		],
	},
	{
		type: 'dir',
		label: 'Theme',
		children: [
			{ type: 'file', label: 'theme.json', path: 'Theme/theme.json' },
		],
	},
];

function flattenTree( nodes, depth = 0, acc = [] ) {
	for ( const n of nodes ) {
		if ( n.type === 'dir' ) {
			acc.push( { type: 'dir', label: n.label, path: `dir:${ n.label }@${ depth }`, depth } );
			flattenTree( n.children, depth + 1, acc );
		} else {
			acc.push( { type: 'file', label: n.label, path: n.path, depth } );
		}
	}
	return acc;
}

const flatTree = flattenTree( tree );

function escHtml( s ) {
	return s
		.replace( /&/g, '&amp;' )
		.replace( /</g, '&lt;' )
		.replace( />/g, '&gt;' )
		.replace( /"/g, '&quot;' );
}

function escSingleQuoted( s ) {
	return s.replace( /\\/g, '\\\\' ).replace( /'/g, "\\'" );
}

function cardsToInnerHtml( cards ) {
	return cards
		.map(
			( c ) =>
				`    <div class="wp-block-block-plugin-card-item">
      <h3 class="card-item__title">${ escHtml( c.title ) }</h3>
      <p class="card-item__body">${ escHtml( c.body ) }</p>
    </div>`
		)
		.join( '\n' );
}

function buildRenderPhp( snap ) {
	const inner = cardsToInnerHtml( snap.cards );
	return `<?php
/**
 * Card Group dynamic render.
 *
 * @package block-plugin
 */

namespace BlockPlugin\\CardGroup;

$wrapper_attributes = get_block_wrapper_attributes();
?>

<div <?php echo $wrapper_attributes; ?>>
	<div class="card-group__header">
		<?php echo esc_html__( '${ escSingleQuoted( snap.groupHeader ) }', 'block-plugin' ); ?>
	</div>

	<div class="card-group__items">
		<?php
		// Playground: static HTML stands in for echoed $content from child blocks.
		// In production: echo $content;
		?>
${ inner.split( '\n' ).map( ( line ) => `\t\t${ line }` ).join( '\n' ) }
	</div>
</div>
`;
}

function buildSaveJs( snap ) {
	const c = snap.cards[ 0 ] ?? { title: '', body: '' };
	return `import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { title, body } = attributes;

	return (
		<div { ...useBlockProps.save() }>
			<RichText.Content tagName="h3" className="card-item__title" value={ '${ escSingleQuoted( c.title ) }' } />
			<RichText.Content tagName="p" className="card-item__body" value={ '${ escSingleQuoted( c.body ) }' } />
		</div>
	);
}
`;
}

function composeFiles( snap ) {
	return {
		'CardGroup/block.json':
			snap.cardGroupBlockJsonText ?? buildCardGroupBlockJson(),
		'CardGroup/render.php': buildRenderPhp( snap ),
		'CardItem/block.json': snap.cardItemBlockJsonText ?? buildCardItemBlockJson(),
		'CardItem/save.js': buildSaveJs( snap ),
		'Theme/theme.json': snap.themeJsonText ?? buildThemeJson(),
	};
}

function parseRenderPhp( text, snap ) {
	const headerM = text.match(
		/esc_html__\(\s*'((?:\\.|[^'\\])*)'\s*,\s*'block-plugin'\s*\)/
	);
	if ( headerM ) {
		snap.groupHeader = headerM[ 1 ].replace( /\\'/g, "'" ).replace( /\\\\/g, '\\' );
	}

	const itemsStart = text.indexOf( 'class="card-group__items"' );
	if ( itemsStart === -1 ) {
		return;
	}
	const divStart = text.indexOf( '<div class="wp-block-block-plugin-card-item"', itemsStart );
	if ( divStart === -1 ) {
		return;
	}
	const slice = text.slice( divStart );
	const cards = [];
	const cardRe =
		/<div class="wp-block-block-plugin-card-item"[^>]*>\s*<h3 class="card-item__title"[^>]*>([^<]*)<\/h3>\s*<p class="card-item__body"[^>]*>([^<]*)<\/p>\s*<\/div>/g;
	let cm;
	while ( ( cm = cardRe.exec( slice ) ) !== null ) {
		cards.push( {
			title: cm[ 1 ].trim(),
			body: cm[ 2 ].trim(),
		} );
	}
	if ( cards.length ) {
		snap.cards = cards;
	}
}

function parseSaveJs( text, snap ) {
	const titleM = text.match(
		/className="card-item__title"[^>]*value=\{\s*'((?:\\.|[^'\\])*)'\s*\}/
	);
	const bodyM = text.match(
		/className="card-item__body"[^>]*value=\{\s*'((?:\\.|[^'\\])*)'\s*\}/
	);
	if ( ! snap.cards.length ) {
		snap.cards = defaultSnapshot().cards;
	}
	const next = [ ...snap.cards ];
	if ( ! next.length ) {
		next.push( { title: '', body: '' } );
	}
	if ( titleM ) {
		next[ 0 ] = {
			...next[ 0 ],
			title: titleM[ 1 ].replace( /\\'/g, "'" ).replace( /\\\\/g, '\\' ),
		};
	}
	if ( bodyM ) {
		next[ 0 ] = {
			...next[ 0 ],
			body: bodyM[ 1 ].replace( /\\'/g, "'" ).replace( /\\\\/g, '\\' ),
		};
	}
	snap.cards = next;
}

function parseBlockJsonFile( text, snap, field ) {
	try {
		const data = JSON.parse( text );
		if ( ! data || typeof data !== 'object' || Array.isArray( data ) ) {
			return;
		}
		snap[ field ] = text;
	} catch {
		/* invalid JSON: do not overwrite snapshot */
	}
}

function parseThemeJson( text, snap ) {
	try {
		JSON.parse( text );
		snap.themeJsonText = text;
	} catch {
		/* invalid JSON: do not overwrite snapshot */
	}
}

function colorDecls( c ) {
	if ( ! c || typeof c !== 'object' ) {
		return [];
	}
	const p = [];
	if ( c.text ) {
		p.push( `color: ${ c.text }` );
	}
	if ( c.background ) {
		p.push( `background: ${ c.background }` );
	}
	return p;
}

/** Block border merges on top of global `styles.border` (same as theme.json intent). */
function mergeFlatBorder( base, over ) {
	const out = { ...base };
	if ( ! over || typeof over !== 'object' ) {
		return out;
	}
	for ( const k of [ 'color', 'width', 'style', 'radius' ] ) {
		const v = over[ k ];
		if ( v != null && v !== '' ) {
			out[ k ] = v;
		}
	}
	return out;
}

function borderDecls( b ) {
	if ( ! b || typeof b !== 'object' ) {
		return [];
	}
	const p = [];
	const color = typeof b.color === 'string' ? b.color : '';
	const width = typeof b.width === 'string' ? b.width : '';
	const style = typeof b.style === 'string' ? b.style : '';
	const radius = b.radius;
	const wantsStroke = Boolean( color || width || style );
	if ( color ) {
		p.push( `border-color: ${ color }` );
	}
	if ( width ) {
		p.push( `border-width: ${ width }` );
	} else if ( color && ! width ) {
		p.push( 'border-width: 1px' );
	}
	if ( style ) {
		p.push( `border-style: ${ style }` );
	} else if ( wantsStroke ) {
		p.push( 'border-style: solid' );
	}
	if ( radius != null && radius !== '' ) {
		p.push( `border-radius: ${ radius }` );
	}
	return p;
}

function themeJsonToPlaygroundCss( rawText ) {
	let data;
	try {
		data = JSON.parse( rawText );
	} catch {
		return '/* Invalid theme.json — fix JSON to update preview styles. */\n';
	}
	const styles = data?.styles;
	if ( ! styles || typeof styles !== 'object' ) {
		return '';
	}
	const chunks = [];
	const gColor = styles.color;
	if ( gColor && typeof gColor === 'object' ) {
		const d = colorDecls( gColor );
		if ( d.length ) {
			chunks.push( `body { ${ d.join( '; ' ) }; }` );
		}
	}
	const groupSel = '.wp-block-block-plugin-card-group';
	const itemSel = '.wp-block-block-plugin-card-item';
	const globalBorder =
		styles.border && typeof styles.border === 'object' ? styles.border : {};
	const blocks = styles.blocks;
	const cg =
		blocks && typeof blocks === 'object'
			? blocks[ 'block-plugin/card-group' ]
			: null;
	const groupBorderMerged = mergeFlatBorder(
		globalBorder,
		cg && typeof cg === 'object' && cg.border && typeof cg.border === 'object'
			? cg.border
			: {}
	);
	const gbd = borderDecls( groupBorderMerged );
	if ( gbd.length ) {
		chunks.push( `${ groupSel } { ${ gbd.join( '; ' ) }; }` );
	}
	const ci =
		blocks && typeof blocks === 'object'
			? blocks[ 'block-plugin/card-item' ]
			: null;
	const itemBorderBase = {};
	if ( typeof globalBorder.color === 'string' && globalBorder.color ) {
		itemBorderBase.color = globalBorder.color;
	}
	const itemBorderMerged = mergeFlatBorder(
		itemBorderBase,
		ci && typeof ci === 'object' && ci.border && typeof ci.border === 'object'
			? ci.border
			: {}
	);
	const ibd = borderDecls( itemBorderMerged );
	if ( ibd.length ) {
		chunks.push( `${ itemSel } { ${ ibd.join( '; ' ) }; }` );
	}
	if ( blocks && typeof blocks === 'object' ) {
		if ( cg && typeof cg === 'object' ) {
			const gc = colorDecls( cg.color );
			if ( gc.length ) {
				chunks.push( `${ groupSel } { ${ gc.join( '; ' ) }; }` );
			}
			const hdr = cg.header;
			if ( hdr && typeof hdr === 'object' ) {
				const hc = hdr.color;
				if ( hc && typeof hc === 'object' ) {
					const hd = colorDecls( hc );
					if ( hd.length ) {
						chunks.push(
							`${ groupSel } .card-group__header { ${ hd.join( '; ' ) }; }`
						);
					}
				}
			}
		}
		if ( ci && typeof ci === 'object' ) {
			const ic = colorDecls( ci.color );
			if ( ic.length ) {
				chunks.push( `${ itemSel } { ${ ic.join( '; ' ) }; }` );
			}
		}
	}
	return chunks.filter( Boolean ).join( '\n' );
}

function applyParsedToFiles( path, text, snap ) {
	if ( path === 'CardGroup/render.php' ) {
		parseRenderPhp( text, snap );
	} else if ( path === 'CardItem/save.js' ) {
		parseSaveJs( text, snap );
	} else if ( path === 'CardGroup/block.json' ) {
		parseBlockJsonFile( text, snap, 'cardGroupBlockJsonText' );
	} else if ( path === 'CardItem/block.json' ) {
		parseBlockJsonFile( text, snap, 'cardItemBlockJsonText' );
	} else if ( path === 'Theme/theme.json' ) {
		parseThemeJson( text, snap );
	}
}

function previewBodyFromSnapshot( snap ) {
	const inner = cardsToInnerHtml( snap.cards );
	return `<div class="wp-block-block-plugin-card-group">
  <div class="card-group__header">${ escHtml( snap.groupHeader ) }</div>
  <div class="card-group__items">
${ inner }
  </div>
</div>`;
}

const files = reactive( composeFiles( snapshot ) );
const selectedPath = ref( 'CardGroup/render.php' );

let debounceId = null;

function syncFilesFromSnapshot() {
	Object.assign( files, composeFiles( snapshot ) );
}

function selectFile( path ) {
	if ( path.startsWith( 'dir:' ) ) {
		return;
	}
	selectedPath.value = path;
}

function onFileInput( value ) {
	const path = selectedPath.value;
	files[ path ] = value;
	if ( debounceId ) {
		clearTimeout( debounceId );
	}
	debounceId = setTimeout( () => {
		debounceId = null;
		applyParsedToFiles( path, value, snapshot );
		syncFilesFromSnapshot();
	}, 280 );
}

function resetAll() {
	Object.assign( snapshot, {
		...defaultSnapshot(),
		cardGroupBlockJsonText: buildCardGroupBlockJson(),
		cardItemBlockJsonText: buildCardItemBlockJson(),
		themeJsonText: buildThemeJson(),
	} );
	syncFilesFromSnapshot();
	selectedPath.value = 'CardGroup/render.php';
}

/* Layout + preset tokens; Theme/theme.json layers overrides after this */
const previewStructuralCss = `
  :root {
    --wp--preset--color--foreground: #1e1e1e;
    --wp--preset--color--background: #ffffff;
    --wp--preset--color--contrast: #c3c4c7;
    --wp--preset--color--base-2: #f0f0f1;
  }
  body {
    margin: 12px;
    font-family: system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.4;
  }
  .wp-block-block-plugin-card-group {
    overflow: hidden;
    background: #fff;
  }
  .card-group__header {
    padding: 10px 12px;
    font-weight: 600;
  }
  .card-group__items { padding: 8px; }
  .wp-block-block-plugin-card-item {
    margin-bottom: 8px;
    padding: 10px 12px;
    border-style: dashed;
    border-width: 1px;
    border-color: var(--wp--preset--color--contrast);
    border-radius: 4px;
    background: #fafafa;
  }
  .wp-block-block-plugin-card-item:last-child { margin-bottom: 0; }
  .card-item__title { margin: 0 0 6px; font-size: 1rem; }
  .card-item__body { margin: 0; color: inherit; }
`;

const srcdoc = computed( () => {
	const body = previewBodyFromSnapshot( snapshot )
		.replace( /<\/script/gi, '<\\/script' )
		.replace( /<\/iframe/gi, '<\\/iframe' );
	const themeCss = themeJsonToPlaygroundCss( snapshot.themeJsonText ?? '' );
	const allCss = `${ previewStructuralCss }\n${ themeCss }`;
	return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><style>${ allCss }</style></head><body>${ body }</body></html>`;
} );
</script>

<template>
	<div class="block-html-playground">
		<p class="block-html-playground__note">
			Each block folder includes a real <code>block.json</code> location (reference only — they do
			<strong>not</strong> change the preview). Preview comes from <code>CardGroup/render.php</code>,
			<code>CardItem/save.js</code> (literals <code>value={ '…' }</code> for sync), and
			<code>Theme/theme.json</code>. Parent <code>edit.js</code> is in section 9 only. This is not the
			WordPress editor.
		</p>
		<div class="block-html-playground__workspace">
			<nav
				class="block-html-playground__tree"
				aria-label="Example project files"
			>
				<div class="block-html-playground__tree-title">Project</div>
				<ul class="block-html-playground__tree-list">
					<li
						v-for="node in flatTree"
						:key="node.path"
						class="block-html-playground__tree-item"
						:style="{ paddingLeft: `${12 + node.depth * 14}px` }"
					>
						<span
							v-if="node.type === 'dir'"
							class="block-html-playground__tree-dir"
							>{{ node.label }}/</span
						>
						<button
							v-else
							type="button"
							class="block-html-playground__tree-file"
							:class="{
								'is-active': node.path === selectedPath,
							}"
							@click="selectFile( node.path )"
						>
							{{ node.label }}
						</button>
					</li>
				</ul>
			</nav>
			<div class="block-html-playground__editor-pane">
				<label
					class="block-html-playground__label"
					:for="editorId"
					>{{ selectedPath }}</label
				>
				<textarea
					:id="editorId"
					:value="files[ selectedPath ] ?? ''"
					class="block-html-playground__textarea"
					spellcheck="false"
					@input="onFileInput( $event.target.value )"
				/>
				<button
					type="button"
					class="block-html-playground__reset"
					@click="resetAll"
				>
					Reset all files
				</button>
			</div>
			<div class="block-html-playground__preview-pane">
				<span class="block-html-playground__label">Preview (merged HTML)</span>
				<div class="block-html-playground__frame-wrap">
					<iframe
						class="block-html-playground__iframe"
						title="HTML preview"
						sandbox="allow-same-origin"
						:srcdoc="srcdoc"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
