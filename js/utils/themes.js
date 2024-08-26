// ************ Themes ************
var themes = ["default"]

var colors = {
	default: {
		1: "#ffffff",//Branch color 1
		2: "#bfbfbf",//Branch color 2
		3: "#7f7f7f",//Branch color 3
		color: "#ffffff",
		points: "#ffffff",
		locked: "#bf8f8f",
		background: "#0f0f0f",
		background_tooltip: "rgba(0, 0, 0, 0.875)",
	},
}
function changeTheme() {

	colors_theme = colors[player.options.theme || "default"];
	document.body.style.setProperty('--background', colors_theme["background"]);
	document.body.style.setProperty('--background_tooltip', colors_theme["background_tooltip"]);
	document.body.style.setProperty('--color', colors_theme["color"]);
	document.body.style.setProperty('--points', colors_theme["points"]);
	document.body.style.setProperty("--locked", colors_theme["locked"]);
}
function getThemeName() {
	return player.options.theme? player.options.theme : "default";
}

function switchTheme() {
	updateSecretThemes()
	let index = themes.indexOf(player.options.theme)
	if (player.options.theme === null || index >= themes.length-1 || index < 0) {
		player.options.theme = themes[0];
	}
	else {
		index ++;
		player.options.theme = themes[index];
	}
	changeTheme();
	resizeCanvas();
}

function updateSecretThemes() {
}