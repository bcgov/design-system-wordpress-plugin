import { defineClientConfig } from 'vuepress/client';
import BlockHtmlPlayground from './components/BlockHtmlPlayground.vue';

export default defineClientConfig( {
	enhance( { app } ) {
		app.component( 'BlockHtmlPlayground', BlockHtmlPlayground );
	},
} );
