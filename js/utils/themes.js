// ************ Themes ************
var themes = ["default", "aqua", "verdant", "electro", "pyro", "arcane", "steel", "wooden", "light", "void", "quality"]

var colors = {
	default: {
		1: "#ffffff",//Branch color 1
		2: "#bfbfbf",//Branch color 2
		3: "#7f7f7f",//Branch color 3
		color: "#dfdfdf",
		points: "#ffffff",
		locked: "#bf8f8f",
		background: "#0f0f0f",
		background_tooltip: "rgba(0, 0, 0, 0.75)",
	},
	steel: {
		1: "#eeeeee",//Branch color 1
		2: "#afafaf",//Branch color 2
		3: "#6f6f6f",//Branch color 3
		color: "#cfcfcf",
		points: "#efefef",
		locked: "#af9f9f",
		background: "#2f2f2f",
		background_tooltip: "rgba(32, 32, 32, 0.75)",
	},
	aqua: {
		1: "#bfdfff",
		2: "#8fa7bf",
		3: "#5f6f7f",
		color: "#bfdfff",
		points: "#dfefff",
		locked: "#c4a7b3",
		background: "#001f3f",
		background_tooltip: "rgba(0, 15, 31, 0.75)",
	},
	pyro: {
		1: "#ffbfbf",
		2: "#bf8f8f",
		3: "#7f5f5f",
		color: "#ffbfbf",
		points: "#ffdfdf",
		locked: "#c4a7a7",
		background: "#3f0000",
		background_tooltip: "rgba(31, 0, 0, 0.75)",
	},
	wooden: {
		1: "#ffdfbf",
		2: "#bf9f8f",
		3: "#7f6f5f",
		color: "#ffdfbf",
		points: "#ffefdf",
		locked: "#c4b5a7",
		background: "#3f1700",
		background_tooltip: "rgba(31, 15, 0, 0.75)",
	},
	electro: {
		1: "#ffffbf",
		2: "#bfbf8f",
		3: "#7f7f5f",
		color: "#ffffbf",
		points: "#ffffdf",
		locked: "#c4c4a7",
		background: "#4f4f00",
		background_tooltip: "rgba(31, 31, 0, 0.75)",
	},
	arcane: {
		1: "#dfbfff",
		2: "#a78fbf",
		3: "#6f5f7f",
		color: "#dfbfff",
		points: "#efdfff",
		locked: "#b3a7c4",
		background: "#1f003f",
		background_tooltip: "rgba(31, 0, 31, 0.75)",
	},
	verdant: {
		1: "#bfffbf",
		2: "#8fbf8f",
		3: "#5f7f5f",
		color: "#bfffbf",
		points: "#dfffdf",
		locked: "#a7c4a7",
		background: "#003f00",
		background_tooltip: "rgba(0, 31, 0, 0.75)",
	},
	void: {
		1: "#333333",
		2: "#222222",
		3: "#111111",
		color: "#222222",
		points: "#333333",
		locked: "#111111",
		background: "#000000",
		background_tooltip: "rgba(0, 0, 0, 0.75)",
	},
	light: {
		1: "#000000",
		2: "#404040",
		3: "#808080",
		color: "#505050",
		points: "#000000",
		locked: "#a07070",
		background: "#e0e0e0",
		background_tooltip: "rgba(255, 255, 255, 0.75)",
	},
	quality: {
		1: "#00ff00",
		2: "#00ffff",
		3: "#ff00ff",
		color: "#ffffff",
		points: "#ffffff",
		locked: "#ff0000",
		background: "#ffff00",
		background_tooltip: "rgba(255, 255, 0, 0.75)",
	},
}
function changeTheme() {

	colors_theme = colors[options.theme || "default"];
	document.body.style.setProperty('--background', colors_theme["background"]);
	document.body.style.setProperty('--background_tooltip', colors_theme["background_tooltip"]);
	document.body.style.setProperty('--color', colors_theme["color"]);
	document.body.style.setProperty('--points', colors_theme["points"]);
	document.body.style.setProperty("--locked", colors_theme["locked"]);
}
function getThemeName() {
	return options.theme? options.theme : "default";
}

function switchTheme() {
	let index = themes.indexOf(options.theme)
	if (options.theme === null || index >= themes.length-1 || index < 0) {
		options.theme = themes[0];
	}
	else {
		index ++;
		options.theme = themes[index];
	}
	changeTheme();
	resizeCanvas();
}
