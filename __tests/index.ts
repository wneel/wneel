import svg_overwrite from "../functions/files/svg/write";

async function unit_test() {
	await svg_overwrite("img/dark_mode.svg", 20, 1470, 4, 76, 79, 52, [(427099).toLocaleString(), (855033).toLocaleString(), (427934).toLocaleString()]);
	await svg_overwrite("img/light_mode.svg", 20, 1470, 4, 76, 79, 52, [(427099).toLocaleString(), (855033).toLocaleString(), (427934).toLocaleString()]);
}

unit_test();
