/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
	root: true,
	rules: {
		"comma-dangle": ["error", "never"],
		"indent": ["error", "tab", { "SwitchCase": 1 }],
		"func-style": ["error", "expression"],
		"@typescript-eslint/consistent-type-assertions": "off",
		"@typescript-eslint/member-ordering": "off",
		"no-case-declarations": "off",
		"no-undef": "off",
		"no-unused-vars": "off",
		"no-var": "error",
		"@typescript-eslint/no-unused-vars": "error",
		"eqeqeq": "error",
		"quotes": ["error", "double"],
		"yoda": "error"
	},
	"extends": [
		"plugin:vue/vue3-essential",
		"eslint:recommended",
		"@vue/eslint-config-typescript"
	],
	parserOptions: {
		ecmaVersion: "latest"
	}
}
