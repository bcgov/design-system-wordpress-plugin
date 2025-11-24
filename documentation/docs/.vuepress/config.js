import { defaultTheme } from "@vuepress/theme-default";

import { defineUserConfig } from "vuepress";
import { searchPlugin } from "@vuepress/plugin-search";
import { viteBundler } from "@vuepress/bundler-vite";

export default defineUserConfig({
	base: "/design-system-wordpress-plugin/",
	lang: "en-US",
	title: "Design System WordPress Plugin",
	description: "Developer Documentation for Design System WordPress Plugin",
	bundler: viteBundler({}),
	theme: defaultTheme({
		logo: "/images/BCID_H_rgb_pos.png",
		logoDark: "/images/BCID_H_rgb_rev.png",
		editLink: false,
		lastUpdated: false,
		repo: "bcgov/design-system-wordpress-plugin",
		repoLabel: "Github",
		sidebarDepth: 2,
		navbar: [
			{
				text: "Home",
				link: "/",
			},
		],
		sidebar: [
			{
				text: "Site Editor",
				collapsible: true,
				children: [
					{ text: "CSP", link: "/guide/SiteEditor/CSP" },
					{
						text: "Notification Banner",
						link: "/guide/SiteEditor/NotificationBanner",
					},
					{
						text: "In Page Navigation",
						link: "/guide/SiteEditor/InPageNavigation",
					},
					{
						text: "Navigation",
						link: "/guide/SiteEditor/Navigation",
					},
					{
						text: "Auto Anchor",
						link: "/guide/SiteEditor/AutoAnchor",
					},
					{
						text: "BreadCrumb",
						link: "/guide/SiteEditor/BreadCrumb",
					},
				],
			},
			{
				text: "Developers",
				collapsible: true,
				children: [
					{
						text: "Unit Test Best Practices",
						link: "/guide/Developers/UnitTestBestPractices",
					},
				],
			},
		],
	}),
	plugins: [
		searchPlugin({
			locales: {
				"/": {
					placeholder: "Search...",
				},
			},
		}),
	],
});
