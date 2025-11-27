/**
 * Local Stylelint configuration to avoid ESM plugin loading issue with @stylistic/stylelint-plugin.
 * Using the SCSS base config only (no stylistic formatting plugin) until upstream compatibility is resolved.
 */
module.exports = {
	extends: "@bcgov/wordpress-stylelintrc/.stylelintrc",
};
