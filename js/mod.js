let modInfo = {
	name: "Create Incremental",
	id: "createIncremental",
	author: "BanaCubed, with ideas from galaxy",
	pointsName: "$",
	modFiles: ["layers.js", "tree.js", "layers/cash.js", "layers/rebirth.js", "layers/rebirth2.js", "layers/rebirth3.js", "layers/matter.js", "layers/universe.js"],

	discordName: "Create Incremental Server",
	discordLink: "https://discord.gg/wt5XyPRtte",
	initialStartPoints: new Decimal(0), // Used for hard resets and new players
	offlineLimit: 12,  // In hours
	forumClone: ``,
}

// Set your version in num and name
let VERSION = {
	num: "1.0",
	name: "Universe Update",
	beta: '3'
}

let changelog = 
`<h1>Changelog</h1>`

let winText = `You are win! Congratulations on wasting your time! (Keep save for future updates)`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return hasUpgrade('cash', 11)
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)

	if(hasUpgrade('cash', 11)) { gain = gain.times(tmp.cash.upgrades[11].effect) }
	if(hasUpgrade('cash', 12)) { gain = gain.times(tmp.cash.upgrades[12].effect) }
	if(hasUpgrade('cash', 13)) { gain = gain.times(tmp.cash.upgrades[13].effect) }
	if(hasUpgrade('cash', 14)) { gain = gain.times(tmp.cash.upgrades[14].effect) }
	if(hasUpgrade('cash', 15)) { gain = gain.times(tmp.cash.upgrades[15].effect) }
	if(hasUpgrade('cash', 16)) { gain = gain.times(tmp.cash.upgrades[16].effect) }
	if(hasUpgrade('cash', 21)) { gain = gain.times(tmp.cash.upgrades[21].effect) }
	if(hasUpgrade('cash', 22)) { gain = gain.times(tmp.cash.upgrades[22].effect) }
	if(hasUpgrade('cash', 31)) { gain = gain.times(tmp.cash.upgrades[31].effect) }
	if(player.machine.state === 1) { gain = gain.times(tmp.machine.clickables[11].effect.add(1)) }
	if(player.machine.state === 2) { gain = gain.times(tmp.machine.clickables[11].effect.times(tmp.machine.clickables[12].effect).add(1)) }

	gain = gain.times(tmp.rebirth.effect)
	if(hasUpgrade('rebirth', 11)) { gain = gain.times(tmp.rebirth.upgrades[11].effect) }

	gain = gain.times(tmp.super.effect[1])
	if(hasMilestone('power', 4)) { gain = gain.times(tmp.power.milestones[4].effect) }
	if(hasChallenge('super', 14)) { gain = gain.times(tmp.super.challenges[14].effect) }

	if(inChallenge('super', 12)) { gain = gain.div(tmp.super.challenges[12].nerf)}
	if(inChallenge('super', 15)) { gain = gain.div(player.super.tax) }

	gain = gain.times(tmp.hyper.effect[0])

	if(hasUpgrade('hyper', 11)) { gain = gain.times(1000) }
	if(hasUpgrade('hyper', 33)) { gain = gain.times(tmp.hyper.upgrades[33].effect) }
	if(hasUpgrade('hyper', 41)) { gain = gain.times(10) }
	if(hasUpgrade('hyper', 44)) { gain = gain.times(tmp.hyper.effect[1]) }


	gain = gain.times(tmp.chall.uTime)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	
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