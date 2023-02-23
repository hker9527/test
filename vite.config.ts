import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue({
			template: {
				compilerOptions: {
					compatConfig: {
						MODE: 2
					}
				}
			}
		}),
		vueJsx()
	],
	resolve: {
		alias: {
			"~": fileURLToPath(new URL("./public", import.meta.url)),
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			vue: "@vue/compat"
		}
	}
})
