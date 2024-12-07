var player;
var needCanvasUpdate = true;

// Don't change this
const TMT_VERSION = {
	tmtNum: "2.7",
	tmtName: "Δ"
}

/**
 * Checks the potential reset gain that a layer would gain. Uses the variables defined within a layer to calculate.
 * @param {string} layer The layer to check.
 * @param {string} useType Can be "none", "normal", "static", "custom" or left undefined (undefined is recommended).
 * @returns {Decimal}
 */
function getResetGain(layer, useType = null) {
	let type = useType
	if (!useType){ 
		type = tmp[layer].type
		if (layers[layer].getResetGain !== undefined)
			return layers[layer].getResetGain()
	} 
	if(tmp[layer].type == "none")
		return new Decimal(0)
	if (tmp[layer].gainExp.eq(0)) return decimalZero
	if (type=="static") {
		if ((!tmp[layer].canBuyMax) || tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalOne
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).div(tmp[layer].gainMult).max(1).log(tmp[layer].base).times(tmp[layer].gainExp).pow(Decimal.pow(tmp[layer].exponent, -1))
		gain = gain.times(tmp[layer].directMult)
		return gain.floor().sub(player[layer].points).add(1).max(1);
	} else if (type=="normal"){
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalZero
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).pow(tmp[layer].exponent).times(tmp[layer].gainMult).pow(tmp[layer].gainExp)
		if (gain.gte(tmp[layer].softcap)) gain = gain.pow(tmp[layer].softcapPower).times(tmp[layer].softcap.pow(decimalOne.sub(tmp[layer].softcapPower)))
		gain = gain.times(tmp[layer].directMult)
		return gain.floor().max(0);
	} else if (type=="custom"){
		return layers[layer].getResetGain()
	} else {
		return decimalZero
	}
}

/**
 * Checks the amount of a layer's `baseAmount` value required to either increase {@link getResetGain} or get anything depending on `canMax`.
 * @param {string} layer The layer to check.
 * @param {boolean} canMax Determines whether a "static" or "custom" reset type should check the amount for the next gain or any gain.
 * @param {string} useType Can be "none", "normal", "static", "custom" or left undefined (undefined is recommended).
 * @returns {Decimal}
 */
function getNextAt(layer, canMax=false, useType = null) {
	let type = useType
	if (!useType) {
		type = tmp[layer].type
		if (layers[layer].getNextAt !== undefined)
			return layers[layer].getNextAt(canMax)

		}
	if(tmp[layer].type == "none")
		return new Decimal (Infinity)

	if (tmp[layer].gainMult.lte(0)) return new Decimal(Infinity)
	if (tmp[layer].gainExp.lte(0)) return new Decimal(Infinity)

	if (type=="static") 
	{
		if (!tmp[layer].canBuyMax) canMax = false
		let amt = player[layer].points.plus((canMax&&tmp[layer].baseAmount.gte(tmp[layer].nextAt))?tmp[layer].resetGain:0).div(tmp[layer].directMult)
		let extraCost = Decimal.pow(tmp[layer].base, amt.pow(tmp[layer].exponent).div(tmp[layer].gainExp)).times(tmp[layer].gainMult)
		let cost = extraCost.times(tmp[layer].requires).max(tmp[layer].requires)
		if (tmp[layer].roundUpCost) cost = cost.ceil()
		return cost;
	} else if (type=="normal"){
		let next = tmp[layer].resetGain.add(1).div(tmp[layer].directMult)
		if (next.gte(tmp[layer].softcap)) next = next.div(tmp[layer].softcap.pow(decimalOne.sub(tmp[layer].softcapPower))).pow(decimalOne.div(tmp[layer].softcapPower))
		next = next.root(tmp[layer].gainExp).div(tmp[layer].gainMult).root(tmp[layer].exponent).times(tmp[layer].requires).max(tmp[layer].requires)
		if (tmp[layer].roundUpCost) next = next.ceil()
		return next;
	} else if (type=="custom"){
		return layers[layer].getNextAt(canMax)
	} else {
		return decimalZero
	}
}

/**
 * Reduces a value beyond a cap by raising excess amount to a power.
 * 
 * **This doesn't affect inputted variable for `value` directly, but *returns* the softcapped amount.**
 * @param {Decimal} value Value to reduce.
 * @param {Decimal} cap Minimum number value must be to reduce.
 * @param {Decimal} power Power to raise `value` beyond `cap`.
 * @returns {Decimal}
 */
function softcap(value, cap, power = 0.5) {
	if (value.lte(cap)) return value
	else
		return value.pow(power).times(cap.pow(decimalOne.sub(power)))
}

/**
 * Checks whether or not a layer should be notified. By default checks for upgrades only.
 * 
 * To make this check for more than just upgrades, edit it in {@link shouldNotify | game.js}.
 * @param {string} layer The layer to check.
 * @returns {boolean}
 */
function shouldNotify(layer) {
	for (id in tmp[layer].upgrades){
		if (isPlainObject(layers[layer].upgrades[id])){
			if (canAffordUpgrade(layer, id) && !hasUpgrade(layer, id) && tmp[layer].upgrades[id].unlocked){
				return true
			}
		}
	}
	if (player[layer].activeChallenge && canCompleteChallenge(layer, player[layer].activeChallenge)) {
		return true
	}

	if (tmp[layer].shouldNotify)
		return true

	if (isPlainObject(tmp[layer].tabFormat)) {
		for (subtab in tmp[layer].tabFormat){
			if (subtabShouldNotify(layer, 'mainTabs', subtab)) {
				tmp[layer].trueGlowColor = tmp[layer].tabFormat[subtab].glowColor || defaultGlow

				return true
			}
		}
	}

	for (family in tmp[layer].microtabs) {
		for (subtab in tmp[layer].microtabs[family]){
			if (subtabShouldNotify(layer, family, subtab)) {
				tmp[layer].trueGlowColor = tmp[layer].microtabs[family][subtab].glowColor
				return true
			}
		}
	}
	 
	return false
	
}

/**
 * Checks whether a layer can be reset.
 * @param {string} layer The layer to check.
 * @returns {boolean}
 */
function canReset(layer) {	
	if (layers[layer].canReset!== undefined)
		return run(layers[layer].canReset, layers[layer])
	else if(tmp[layer].type == "normal")
		return tmp[layer].baseAmount.gte(tmp[layer].requires)
	else if(tmp[layer].type== "static")
		return tmp[layer].baseAmount.gte(tmp[layer].nextAt) 
	else 
		return false
}

/**
 * Not to be confused with {@link resetRow}
 * 
 * Resets all layers up to the n-th row as a specified layer.
 * @param {number} row The row to reset up to.
 * @param {string} layer The layer to reset as.
 */
function rowReset(row, layer) {
	for (lr in ROW_LAYERS[row]){
		if(layers[lr].doReset) {
			if (!isNaN(row)) Vue.set(player[lr], "activeChallenge", null) // Exit challenges on any row reset on an equal or higher row
			run(layers[lr].doReset, layers[lr], layer)
		}
		else
			if(tmp[layer].row > tmp[lr].row && !isNaN(row)) layerDataReset(lr)
	}
}

/**
 * Resets all data within a layer, except for that listed in `keep`.
 * @param {string} layer The layer to reset.
 * @param {string[]} keep Array of keys of values to keep within the layer's saved data.
 */
function layerDataReset(layer, keep = []) {
	let storedData = {unlocked: player[layer].unlocked, forceTooltip: player[layer].forceTooltip, noRespecConfirm: player[layer].noRespecConfirm, prevTab:player[layer].prevTab} // Always keep these

	for (thing in keep) {
		if (player[layer][keep[thing]] !== undefined)
			storedData[keep[thing]] = player[layer][keep[thing]]
	}

	Vue.set(player[layer], "buyables", getStartBuyables(layer))
	Vue.set(player[layer], "clickables", getStartClickables(layer))
	Vue.set(player[layer], "challenges", getStartChallenges(layer))
	Vue.set(player[layer], "grid", getStartGrid(layer))

	layOver(player[layer], getStartLayerData(layer))
	player[layer].upgrades = []
	player[layer].milestones = []
	player[layer].achievements = []

	for (thing in storedData) {
		player[layer][thing] =storedData[thing]
	}
}

/**
 * Increases base points of a certain layer. Also increases best points and total points as needed.
 * @param {string} layer The layer to increase points of.
 * @param {Decimal} gain
 */
function addPoints(layer, gain) {
	player[layer].points = player[layer].points.add(gain).max(0)
	if (player[layer].best) player[layer].best = player[layer].best.max(player[layer].points)
	if (player[layer].total) player[layer].total = player[layer].total.add(gain)
}

/**
 * Increases base points of a certain layer based on `resetGain`. `diff` should be taken from `diff` in a layer's update function.
 * 
 * Most common use will be (in `update(diff)`) `generatePoints(this.layer, diff)`, or `generatePoints(this.layer, Decimal.times(diff, n))` where n is % of `resetGain` to generate each second.
 * @param {string} layer The layer to increase points of.
 * @param {(Decimal|number)} diff Direct multiplier to `resetGain`.
 */
function generatePoints(layer, diff) {
	addPoints(layer, tmp[layer].resetGain.times(diff))
}

/**
 * Resets a layer, gaining all appropriate resources and resetting previous rows. By default will do nothing if layer cannot be reset.
 * @param {string} layer The layer to reset.
 * @param {boolean} force If true, nothing will be gained, and will reset regardless of `canReset`.
 */
function doReset(layer, force=false) {
	if (tmp[layer].type == "none") return
	let row = tmp[layer].row
	if (!force) {
		
		if (tmp[layer].canReset === false) return;
		
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return;
		let gain = tmp[layer].resetGain
		if (tmp[layer].type=="static") {
			if (tmp[layer].baseAmount.lt(tmp[layer].nextAt)) return;
			gain =(tmp[layer].canBuyMax ? gain : 1)
		}

		if (layers[layer].onPrestige){
			updateMilestones(layer)
			run(layers[layer].onPrestige, layers[layer], gain)
		}
		
		addPoints(layer, gain)
		updateMilestones(layer)
		updateAchievements(layer)

		if (!player[layer].unlocked) {
			player[layer].unlocked = true;
			needCanvasUpdate = true;

			if (tmp[layer].increaseUnlockOrder){
				lrs = tmp[layer].increaseUnlockOrder
				for (lr in lrs)
					if (!player[lrs[lr]].unlocked) player[lrs[lr]].unlockOrder++
			}
		}
	
	}

	if (run(layers[layer].resetsNothing, layers[layer])) return
	tmp[layer].baseAmount = decimalZero // quick fix


	for (layerResetting in layers) {
		if (row >= layers[layerResetting].row && (!force || layerResetting != layer)) completeChallenge(layerResetting)
	}

	player.points = (row == 0 ? decimalZero : getStartPoints())

	for (let x = row; x >= 0; x--) rowReset(x, layer)
	for (r in OTHER_LAYERS){
		rowReset(r, layer)
	}

	player[layer].resetTime = 0

	updateTemp()
	updateTemp()
}

/**
 * Not to be confused with {@link rowReset}.
 * Forcefully resets a row, completely.
 * 
 * This resets whether a layer within the row is unlocked.
 * @param {number} row 
 */
function resetRow(row) {
	if (prompt('Are you sure you want to reset this row? It is highly recommended that you wait until the end of your current run before doing this! Type "I WANT TO RESET THIS" to confirm')!="I WANT TO RESET THIS") return
	let pre_layers = ROW_LAYERS[row-1]
	let layers = ROW_LAYERS[row]
	let post_layers = ROW_LAYERS[row+1]
	rowReset(row+1, post_layers[0])
	doReset(pre_layers[0], true)
	for (let layer in layers) {
		player[layer].unlocked = false
		if (player[layer].unlockOrder) player[layer].unlockOrder = 0
	}
	player.points = getStartPoints()
	updateTemp();
	resizeCanvas();
}

/**
 * Enters a challenge if unlocked, and exits if already inside the same challenge. Resets previous rows.
 * @param {string} layer The layer to enter a challenge in.
 * @param {number} x ID of a challenge within `layer` to enter.
 */
function startChallenge(layer, x) {
	let enter = false
	if (!player[layer].unlocked || !tmp[layer].challenges[x].unlocked || !canEnterChallenge(layer, x)) return

	if (player[layer].activeChallenge == x) {
		// This needs to be embedded due to how 'enter' works
		if(canExitChallenge(layer, x)){
			completeChallenge(layer, x)
			Vue.set(player[layer], "activeChallenge", null)
		}
	}
	else {
		enter = true
	}
	if(enter || canExitChallenge(layer, x)) doReset(layer, true)
	if(enter) {
		Vue.set(player[layer], "activeChallenge", x)
		run(layers[layer].challenges[x].onEnter, layers[layer].challenges[x])
	}
	updateChallengeTemp(layer)
}

/**
 * Checks whether a challenge can be completed.
 * 
 * If the challenge is not currently being run, returns `undefined`.
 * @param {string} layer The layer to check a challenge in.
 * @param {number} x ID of a challenge within `layer` to check.
 * @returns {(boolean | undefined)}
 */
function canCompleteChallenge(layer, x) {
	if (x != player[layer].activeChallenge) return
	let challenge = tmp[layer].challenges[x]
	if (challenge.canComplete !== undefined) return challenge.canComplete

	if (challenge.currencyInternalName){
		let name = challenge.currencyInternalName
		if (challenge.currencyLocation){
			return !(challenge.currencyLocation[name].lt(challenge.goal)) 
		}
		else if (challenge.currencyLayer){
			let lr = challenge.currencyLayer
			return !(player[lr][name].lt(challenge.goal)) 
		}
		else {
			return !(player[name].lt(challenge.goal))
		}
	}
	else {
		return !(player.points.lt(challenge.goal))
	}
}

/**
 * Completes a challenge. Does nothing if the challenge cannot be completed, or if the challenge is not being run.
 * @param {string} layer The layer to complete a challenge in.
 * @param {number} x ID of a challenge within `layer` to complete.
 */
function completeChallenge(layer, x) {
	var x = player[layer].activeChallenge
	if (!x) return
	
	let completions = canCompleteChallenge(layer, x)
	if (!completions){
		Vue.set(player[layer], "activeChallenge", null)
		run(layers[layer].challenges[x].onExit, layers[layer].challenges[x])
		return
	}
	if (player[layer].challenges[x] < tmp[layer].challenges[x].completionLimit) {
		needCanvasUpdate = true
		player[layer].challenges[x] += completions
		player[layer].challenges[x] = Math.min(player[layer].challenges[x], tmp[layer].challenges[x].completionLimit)
		if (layers[layer].challenges[x].onComplete) run(layers[layer].challenges[x].onComplete, layers[layer].challenges[x])
	}
	Vue.set(player[layer], "activeChallenge", null)
	run(layers[layer].challenges[x].onExit, layers[layer].challenges[x])
	updateChallengeTemp(layer)
}

VERSION.withoutName = "v" + VERSION.num + (VERSION.pre ? " Pre-Release " + VERSION.pre : VERSION.pre ? " Beta " + VERSION.beta : "")
VERSION.withName = VERSION.withoutName + (VERSION.name ? ": " + VERSION.name : "")

/**
 * Attempts to buy *all* upgrades within an upgrade when run. This must be run every in-game tick to actually autobuy.
 * @param {string} layer The layer to buy *all* upgrades in.
 */
function autobuyUpgrades(layer){
	if (!tmp[layer].upgrades) return
	for (id in tmp[layer].upgrades)
		if (isPlainObject(tmp[layer].upgrades[id]) && (layers[layer].upgrades[id].canAfford === undefined || layers[layer].upgrades[id].canAfford() === true))
			buyUpg(layer, id) 
}

/**
 * Runs the game loop. This should not be manually run.
 * @param {number} diff Time in seconds since last run of `gameLoop`.
 */
function gameLoop(diff) {
	if (isEndgame() || tmp.gameEnded){
		tmp.gameEnded = true
		clearParticles()
	}

	if (isNaN(diff) || diff < 0) diff = 0
	if (tmp.gameEnded && !player.keepGoing) {
		diff = 0
		//player.tab = "tmp.gameEnded"
		clearParticles()
	}

	if (maxTickLength) {
		let limit = maxTickLength()
		if(diff > limit)
			diff = limit
	}
	addTime(diff)
	player.points = player.points.add(tmp.pointGen.times(diff)).max(0)

	for (let x = 0; x <= maxRow; x++){
		for (item in TREE_LAYERS[x]) {
			let layer = TREE_LAYERS[x][item]
			player[layer].resetTime += diff
			if (tmp[layer].passiveGeneration) generatePoints(layer, diff*tmp[layer].passiveGeneration);
			if (layers[layer].update) layers[layer].update(diff);
		}
	}

	for (row in OTHER_LAYERS){
		for (item in OTHER_LAYERS[row]) {
			let layer = OTHER_LAYERS[row][item]
			player[layer].resetTime += diff
			if (tmp[layer].passiveGeneration) generatePoints(layer, diff*tmp[layer].passiveGeneration);
			if (layers[layer].update) layers[layer].update(diff);
		}
	}	

	for (let x = maxRow; x >= 0; x--){
		for (item in TREE_LAYERS[x]) {
			let layer = TREE_LAYERS[x][item]
			if (tmp[layer].autoPrestige && tmp[layer].canReset) doReset(layer);
			if (layers[layer].automate) layers[layer].automate();
			if (tmp[layer].autoUpgrade) autobuyUpgrades(layer)
		}
	}

	for (row in OTHER_LAYERS){
		for (item in OTHER_LAYERS[row]) {
			let layer = OTHER_LAYERS[row][item]
			if (tmp[layer].autoPrestige && tmp[layer].canReset) doReset(layer);
			if (layers[layer].automate) layers[layer].automate();
				player[layer].best = player[layer].best.max(player[layer].points)
			if (tmp[layer].autoUpgrade) autobuyUpgrades(layer)
		}
	}

	for (layer in layers){
		if (layers[layer].milestones) updateMilestones(layer);
		if (layers[layer].achievements) updateAchievements(layer)
	}

}

/**
 * Resets everything under the `player` object irreversibly. This should not be remotely involved in the main gameplay.
 * @param {boolean} resetOptions Whether to reset the `options` object as well.
 */
function hardReset(resetOptions) {
	if (!confirm("Are you sure you want to do this? You will lose all your progress!")) return
	player = null
	if(resetOptions) options = null
	save(true);
	window.location.reload();
}

var ticking = false

var interval = setInterval(function() {
	if (player===undefined||tmp===undefined) return;
	if (ticking) return;
	if (tmp.gameEnded&&!player.keepGoing) return;
	ticking = true
	let now = Date.now()
	let diff = (now - player.time) / 1e3
	let trueDiff = diff
	if (player.offTime !== undefined) {
		if (player.offTime.remain > modInfo.offlineLimit * 3600) player.offTime.remain = modInfo.offlineLimit * 3600
		if (player.offTime.remain > 0) {
			let offlineDiff = Math.max(player.offTime.remain / 10, diff)
			player.offTime.remain -= offlineDiff
			diff += offlineDiff
		}
		if (!options.offlineProd || player.offTime.remain <= 0) player.offTime = undefined
	}
	if (player.devSpeed) diff *= player.devSpeed
	player.time = now
	if (needCanvasUpdate){ resizeCanvas();
		needCanvasUpdate = false;
	}
	tmp.scrolled = document.getElementById('treeTab') && document.getElementById('treeTab').scrollTop > 30
	updateTemp();
	updateOomps(diff);
	updateWidth()
	updateTabFormats()
	gameLoop(diff)
	fixNaNs()
	adjustPopupTime(trueDiff)
	updateParticles(trueDiff)
	ticking = false
}, 50)

setInterval(function() {needCanvasUpdate = true}, 500)