let modInfo = {
	name: "Create Incremental",
	id: "createIncremental",
	author: "BanaCubed, with ideas from galaxy",
	pointsName: "$",
	modFiles: ["layers.js", "tree.js", "layers/cash.js", "layers/rebirth.js", "layers/rebirth2.js", "layers/rebirth3.js", "layers/matter.js"],

	discordName: "Create Incremental Server",
	discordLink: "https://discord.gg/wt5XyPRtte",
	initialStartPoints: new Decimal(0), // Used for hard resets and new players
	offlineLimit: 12,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.0",
	name: "The Universe Update",
}

let changelog = 
`<h1>Changelog</h1><br><br>
<span style="text-align: left; position: absolute; left: 30px;">
	<h3>v1.0</h3><br>
		- <span style="color: #9966BB">Remade the Entire Game</span><br>
		- Actually Added <span style="color: #9966BB">The Changelog</span><br><br>
	<h3>v0.3.2</h3><br>
		- Added <span style="color: #2ed5e8">Matter Paths</span><br>
		- Added <span style="color: #2dc0d6">Matter</span><br>
		- Added <span style="color: #d6442d">Antimatter</span><br>
		- Added <span style="color: #303030">Dark Matter</span> and <span style="color: #4b0f75">Black Hole</span><br>
		- Added <span style="color: #cc59de">Exotic Matter</span>, <span style="color: #8c617e">Hypothetical Particles</span>, and <span style="color: #7bff00">Unstable Matter</span><br>
		- Added <span style="color: #472961">Ultimate Matter Fragments</span><br>
		- Added <span style="color: #9966BB">Softlock Prevention</span><br>
		Endgame <span style="color: #472961">4 UMF</span><br><br>
	<h3>v0.3.0.1 - v0.3.0.5</h3><br>
		- Added <span style="color: #9966BB">Hotkeys</span><br>
		- Added <span style="color: #2ed5e8">Hyper Paths Respec</span><br><br>
	<h2>v0.3</h2><br>
		- Added <span style="color: #2ed5e8">Hyper Rebirth</span><br>
		- Added <span style="color: #2ed5e8">Hyper Paths</span><br>
		- Added <span style="color: #34eb67">Hyper Cash</span><br>
		Endgame <span style="color: #157307">e10,000 $</span> (wait, it went down?), <span style="color: #2ed5e8">130 HRP</span><br><br>
	<h3>v0.2.1</h3><br>
		- Added <span style="color: #d6c611">Power</span><br>
		- Added <span style="color: #d6c611">Power Pylons</span><br>
		- Added More <span style="color: #eb1a3d">Super Rebirth Challenges</span><br>
		Endgame <span style="color: #157307">e12,000 $</span>, <span style="color: #ba0022">e5,000 RP</span>, <span style="color: #eb1a3d">100,000 SRP</span><br><br>
	<h2>v0.2</h2><br>
		- Added <span style="color: #eb1a3d">Super Rebirth</span><br>
		- Added <span style="color: #eb1a3d">Super Rebirth Challenge 1</span><br>
		- Added <span style="color: #eb1a3d">Super Rebirth Milestones</span><br>
		- Added <span style="color: #9966BB">Secret Achievements</span><br>
		- Added <span style="color: #9966BB">More Themes</span><br>
		Endgame <span style="color: #eb1a3d">8 SRP, Challenge Completed</span><br><br>
	<h3>v0.1.3</h3><br>
		- Added <span style="color: #157307">Money</span><br>
		- Added <span style="color: #ba0022">Rebirth</span><br>
		- Added <span style="color: #157307">The Machine</span><br>
		- Added <span style="color: #FFEE88">Achievements</span><br>
		Endgame <span style="color: #9966BB">Unkown</span><br><br>
</span>`

let winText = `You are win! Congratulations on wasting your time! (Keep save for future updates)`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)

	if(hasUpgrade('cash', 11)) { gain = gain.add(tmp.cash.upgrades[11].effect) }
	if(hasUpgrade('cash', 12)) { gain = gain.times(tmp.cash.upgrades[12].effect) }
	if(hasUpgrade('cash', 13)) { gain = gain.times(tmp.cash.upgrades[13].effect) }
	if(hasUpgrade('cash', 14)) { gain = gain.times(tmp.cash.upgrades[14].effect) }
	if(hasUpgrade('cash', 15)) { gain = gain.times(tmp.cash.upgrades[15].effect) }
	if(hasUpgrade('cash', 16)) { gain = gain.times(tmp.cash.upgrades[16].effect) }
	if(hasUpgrade('cash', 21)) { gain = gain.times(tmp.cash.upgrades[21].effect) }
	if(hasUpgrade('cash', 22)) { gain = gain.times(tmp.cash.upgrades[22].effect) }
	if(player.machine.state === 1) { gain = gain.times(tmp.machine.clickables[11].effect.add(1)) }
	if(player.machine.state === 2) { gain = gain.times(tmp.machine.clickables[11].effect.times(tmp.machine.clickables[12].effect).add(1)) }

	gain = gain.times(tmp.rebirth.effect)
	if(hasUpgrade('rebirth', 11)) { gain = gain.times(tmp.rebirth.upgrades[11].effect) }

	gain = gain.times(tmp.super.effect[1])

	if(inChallenge('super', 12)) { gain = gain.div(tmp.super.challenges[12].nerf)}

	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	SA14: false,
	SA15: false,
	MILK: false
}}

// Display extra things at the top of the page
var displayThings = [
]


// Determines when the game "ends"
function isEndgame() {
	return false
}

function findIndex(arr, x) {
	const index = arr.indexOf(x);
	return index !== -1 ? index : arr.length;
}

// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}