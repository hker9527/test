<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { Json, Result } from "./types/Result";

// const GAMES = {
// 	umamusume: "Uma Musume: Pretty Derby",
// 	kancolle: "Kantai Collection",
// 	worldflipper: "World Flipper",
// 	konosuba: "KonoSuba: Fantastic Days"
// };

const GAMES: {
	key: keyof Result,
	label: string,
	icon: string
}[] = [
	{
		key: "umamusume",
		label: "Uma Musume: Pretty Derby",
		icon: "https://i.imgur.com/WtIQUO9.png"
	},
	{
		key: "kancolle",
		label: "Kantai Collection",
		icon: "https://upload.wikimedia.org/wikipedia/en/0/02/Kantai_Collection_logo.png"
	},
	{
		key: "worldflipper",
		label: "World Flipper",
		icon: "https://i.imgur.com/tbIZaEd.png"
	},
	{
		key: "konosuba",
		label: "KonoSuba: Fantastic Days",
		icon: "https://i.imgur.com/4k4Y4dw.png"
	}
];

let _results = ref({
	ts: 0,
	results: []
} as Json);

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

const selectedGames = ref([GAMES[0].key]);

// Watch selectedGames and update localStorage
watch(selectedGames, (value) => {
	localStorage.setItem("selectedGames", JSON.stringify(value));
	fields.value = getFields();
});

// Load selectedGames from localStorage
const selectedGamesFromStorage = localStorage.getItem("selectedGames");
if (selectedGamesFromStorage) {
	try {
		const _ = JSON.parse(selectedGamesFromStorage);
		selectedGames.value = _;
	} catch (e) { /* empty */ }
}

// Buttons
const buttons = ref(GAMES.map((game) => ({
	...game,
	state: selectedGames.value.includes(game.key)
})));

watch(buttons, (value) => {
	selectedGames.value = value.filter(a => a.state).map(a => a.key);
});

// Table
const getFields = () => [
	{
		key: "ip",
		label: "IP",
		sortable: true,
		thStyle: { width: "30%" }
	},
	...selectedGames.value
		.map(key => ({
			key,
			label: GAMES.find(a => a.key === key)?.label ?? key,
			sortable: true,
			thStyle: { width: ((100 - 40) / selectedGames.value.length) + "%" }
		})
		),
	{
		key: "action",
		label: "Action",
		thStyle: { width: "10%" }
	}
];

const fields = ref(getFields());

const currentPage = ref(1);

const fetchData = async () => {
	const request = await fetch("/results.json?r=" + Math.random());
	if (!request.ok) {
		throw new Error("HTTP error " + request.status);
	}
	_results.value = await request.json();
	// Mark error results with _cellVariant danger
	_results.value.results = _results.value.results.map((result) => {
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
	// Sort values by the first selected game by default
	// or IP address if none are selected
	_results.value.results = _results.value.results.sort((a, b) =>
		sortCompare(a, b, selectedGames.value[0] ?? "ip", false)
	);
};

onMounted(async () => {
	await fetchData();
});
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<template>
	<b-container>
		<h4>
			Updated at: {{ new Date(_results.ts).toLocaleString() }}
		</h4>

		<b-row>
			<b-col cols="4">
				<label for="gamesSelect">Select your games</label>
			</b-col>
			<b-col>
				<b-button-group>
					<b-button
						v-for="button in buttons"
						:key="button.key"
						:variant="button.state ? 'success' : 'danger'"
						@click="button.state = !button.state"
					>
						<b-img
							:src="button.icon"
							thumbnail
							width="64"
							height="64"
						/>
					</b-button>
				</b-button-group>
			</b-col>
		</b-row>

		<b-table
			id="my-table"
			hover
			label-sort-asc=""
			label-sort-desc=""
			label-sort-clear=""
			per-page="10"
			:fields="fields"
			:items="_results.results"
			:sort-compare="sortCompare"
			:currentPage="currentPage"
		>
			<template v-slot:cell(action)="{ item }">
				<a
					:href="'/profiles/' + item.ip + '.ovpn'"
					:download="item.ip + '.ovpn'"
					target="_blank"
				>Download</a>
			</template>
		</b-table>

		<b-pagination
			v-model="currentPage"
			aria-controls="my-table"
			first-text="⏮"
			prev-text="⏪"
			next-text="⏩"
			last-text="⏭"
			align="fill"
			:total-rows="_results.results.length"
			:per-page="10"
		/>
	</b-container>
</template> 