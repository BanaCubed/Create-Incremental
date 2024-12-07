let modInfo = {
	name: "The ??? Tree",
	author: "nobody",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

/**
 * Returns the initial amount of "points".
 * 
 * This can be based off of conditions, but is only read on a reset of row >=1.
 * @returns {Decimal}
 */
function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

/**
 * Determines whether the points/sec should appear and whether points are generated (see {@link getPointGen}).
 * @returns {boolean}
 */
function canGenPoints(){
	return true
}

/**
 * Calculates points/sec.
 * @returns {Decimal}
 */
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1) // <-- Change this if you want point gain to default to something other than 1
	// v Put calculations here v



	// ^ Put calculations here ^
	return gain
}

/**
 * Adds additional save data into the `player` object. Data cannot share a name with a layer, or any default TMT savedata.
 * @returns {Object.<string, any>}
 */
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

/**
 * Returns true when the game has been beaten.
 * 
 * Default to checking if points are above some arbitrary value.
 * @returns {boolean}
 */
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
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