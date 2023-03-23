// Create dummy data
const fs = require("fs");

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const games = [
	"umamusume", 
	"worldflipper",
	"kancolle",
	"konosuba"
];

const datas = [];

// Random generate results
for (let i = 0; i < rand(50, 150); i++) {
	const data = {
		ip: `${rand(1, 230)}.${rand(1, 254)}.${rand(1, 254)}.${rand(1, 254)}`
	};
	for (const game of games) {
		if (rand(0, 100) < 10) {
			data[game] = -403;
		} else {
			data[game] = rand(0, 1000);
		}
	}
	datas.push(data);
}

// Write to file
fs.rmdirSync("./profiles", { recursive: true });
fs.mkdirSync("./profiles");
for (const data of datas) {
	fs.writeFileSync(`./profiles/${data.ip}.ovpn`, "dummy");
}
fs.writeFileSync("./results.json", JSON.stringify({
	ts: +new Date(),
	results: datas
}, null, 4));
