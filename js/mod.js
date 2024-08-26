const modFiles = ["layers.js", "tree.js", "layers/cash.js", "layers/rebirth.js", "layers/rebirth2.js", "layers/rebirth3.js", "layers/matter.js", "layers/universe.js"]

// Set your version in num and name
let VERSION = {
	num: "1.0",
	name: "Universe Update Beta",
	beta: true,
	withoutName: "v1.0",
	withName: "v1.0 Universe Update"
}

let changelog = 
`<h1>Changelog</h1>`

let winText = `You are win! Congratulations on wasting your time! (Keep save for future updates)`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(0)
}

// Determines if it should show points/sec
function canGenPoints(){
	return false
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)

	return gain
}


// Determines when the game "ends"
function isEndgame() { return false }

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