<script setup lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import type { Result } from "./types/Result";
import Multiselect from "vue-multiselect";

defineComponent({
	multiselect: Multiselect
});

const games = ["uma"];

const fields = [
	{
		key: "ip",
		sortable: true
	},
	...games.map((key) => ({
		key,
		label: key,
		sortable: true
	}))
];

let _results = ref([] as Result[]);

const sortCompare = (aRes: Result, bRes: Result, key: keyof Result, sortDesc: boolean) => {
	if (key === "ip") {
		const a = aRes[key];
		const b = bRes[key];

		// Sort IP addresses by their numeric value
		const aParts = a.split(".");
		const bParts = b.split(".");
		for (let i = 0; i < 4; i++) {
			const aPart = parseInt(aParts[i]);
			const bPart = parseInt(bParts[i]);
			if (aPart < bPart) {
				return -1;
			}
			if (aPart > bPart) {
				return 1;
			}
		}
		return 0;
	}
	const a = aRes[key] as number;
	const b = bRes[key] as number;
	// Always put negative values at the bottom
	if (a < 0) {
		return sortDesc ? -1 : 1;
	}
	if (b < 0) {
		return sortDesc ? 1 : -1;
	}
	return a - b;
};

const currentPage = ref(1);
const selectedGames = ref([] as string[]);

onMounted(async () => {
	const request = await fetch("/results.json");
	if (!request.ok) {
		throw new Error("HTTP error " + request.status);
	}
	_results.value = await request.json();
	// Mark error results with _cellVariant danger
	_results.value = _results.value.map((result) => {
		for (const _key in result) {
			const key = _key as keyof Result;
			if (typeof result[key] === "number") {
				if (result[key]! < 0) {
					result._cellVariants = {
						...result._cellVariants ?? {},
						[key]: "danger"
					};
				}
			}
		}
		return result;
	});
	// Sort values by uma by default
	_results.value = _results.value.sort((a, b) => sortCompare(a, b, "uma", false));
});
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<template>
	<b-container>
		<pre>{{ selectedGames }}</pre>

		<label for="gamesSelect">Games</label>
		<multiselect
			v-model="selectedGames"
			:options="games"
			:multiple="true"
			:searchable="true"
			:close-on-select="false"
			:taggable="true"
		></multiselect>

		<b-table
			id="my-table"
			hover
			label-sort-asc=""
			label-sort-desc=""
			label-sort-clear=""
			per-page="10"
			:fields="fields"
			:items="_results"
			:sort-compare="sortCompare"
			:currentPage="currentPage"
		/>

		<b-pagination
			v-model="currentPage"
			aria-controls="my-table"
			first-text="⏮"
			prev-text="⏪"
			next-text="⏩"
			last-text="⏭"
			align="fill"
			:total-rows="_results.length"
			:per-page="10"
		/>
	</b-container>
</template> 