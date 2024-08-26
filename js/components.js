var app;

function loadVue() {
	Vue.component('changelog', {
		props: ['layer', 'data'],
		template: `
		<div>
			<h1>Changelog</h1><br><br>
<span style="text-align: left; position: absolute; left: 30px;">
	<h1>v1.0</h1><br>
		- <span style="color: var(--cursed)">Remade the Entire Game</span><br>
		- Improved <span style="color: var(--cash)">Cash</span><br>
		- Improved <span style="color: var(--rebirth)">Rebirth</span><br>
		- Improved <span style="color: var(--super)">Super Rebirth</span><br>
		- Improved <span style="color: var(--hyper)">Hyper Rebirth</span><br>
		- Improved <span style="color: var(--cursed)">Tax Display</span><br>
		- Added <span style="color: var(--power)">Power Allocation</span><br>
		- Improved <span style="color: var(--power)">Power Pylons</span><br>
		- Added <span style="color: rgba(122, 6, 176, 1)">Universal Time</span><br>
		- Added <span style="color: var(--hyper)">Hyper Paths Icons</span><br>
		- Added <span style="color: var(--cursed)">Standard Notation</span><br>
		- Improved <span style="color: var(--cursed)">Credits</span><br>
		- Actually Added <span style="color: var(--cursed)">The Changelog</span><br><br>
	<h3>v0.3.2</h3><br>
		- Added <span style="color: var(--hyper)">Matter Paths</span><br>
		- Added <span style="color: #2dc0d6">Matter</span><br>
		- Added <span style="color: #d6442d">Antimatter</span><br>
		- Added <span style="color: #303030">Dark Matter</span> and <span style="color: #4b0f75">Black Hole</span><br>
		- Added <span style="color: #cc59de">Exotic Matter</span>, <span style="color: #8c617e">Hypothetical Particles</span>, and <span style="color: #7bff00">Unstable Matter</span><br>
		- Added <span style="color: #472961">Ultimate Matter Fragments</span><br>
		- Added <span style="color: var(--cursed)">Softlock Prevention</span><br>
	<h3>v0.3.0.1 - v0.3.0.5</h3><br>
		- Added <span style="color: var(--cursed)">Hotkeys</span><br>
		- Added <span style="color: var(--hyper)">Hyper Paths Respec</span><br><br>
	<h2>v0.3</h2><br>
		- Added <span style="color: var(--hyper)">Hyper Rebirth</span><br>
		- Added <span style="color: var(--hyper)">Hyper Paths</span><br>
		- Added <span style="color: #34eb67">Hyper Cash</span><br>
	<h3>v0.2.1</h3><br>
		- Added <span style="color: var(--power)">Power</span><br>
		- Added <span style="color: var(--power)">Power Pylons</span><br>
		- Added More <span style="color: var(--super)">Super Rebirth Challenges</span><br>
	<h2>v0.2</h2><br>
		- Added <span style="color: var(--super)">Super Rebirth</span><br>
		- Added <span style="color: var(--super)">Super Rebirth Challenge 1</span><br>
		- Added <span style="color: var(--super)">Super Rebirth Milestones</span><br>
		- Added <span style="color: var(--cursed)">Secret Achievements</span><br>
		- Added <span style="color: var(--cursed)">More Themes</span><br>
	<h3>v0.1.3</h3><br>
		- Added <span style="color: var(--cash)">Cash</span><br>
		- Added <span style="color: var(--rebirth)">Rebirth</span><br>
		- Added <span style="color: var(--tech)">The Machine</span><br>
		- Added <span style="color: #FFEE88">Achievements</span><br><br></span></div>`
	})

	Vue.component('clickable', {
		props: ['layer', 'data'],
		template: `
		<button 
			v-if="tmp[layer].clickables && tmp[layer].clickables[data]!== undefined && tmp[layer].clickables[data].unlocked" 
			v-bind:class="{ button: true, tooltipBox: true, can: tmp[layer].clickables[data].canClick, locked: !tmp[layer].clickables[data].canClick, bought: tmp[layer].clickables[data].has, [layer]: true}"
			v-bind:style="[tmp[layer].clickables[data].canClick ? {'background-color': tmp[layer].color} : {}, tmp[layer].clickables[data].style]"
			v-on:click="if(!interval) clickClickable(layer, data)" :id='"clickable-" + layer + "-" + data' @mousedown="start" @mouseleave="stop" @mouseup="stop" @touchstart="start" @touchend="stop" @touchcancel="stop">
			<span v-bind:style="{'white-space': 'pre-line'}" v-html="run(layers[layer].clickables[data].display, layers[layer].clickables[data])"></span>
			<node-mark :layer='layer' :data='tmp[layer].clickables[data].marked'></node-mark>
			<tooltip v-if="tmp[layer].clickables[data].tooltip" :text="tmp[layer].clickables[data].tooltip" style="min-width: 240px"></tooltip>

		</button>
		`,
		data() { return { interval: false, time: 0,}},
		methods: {
			start() {
				if (!this.interval && layers[this.layer].clickables[this.data].onHold) {
					this.interval = setInterval((function() {
						let c = layers[this.layer].clickables[this.data]
						if(this.time >= 30 && run(c.canClick, c)) {
							run(c.onHold, c)
						}	
						this.time = this.time+1
					}).bind(this), 50/3)}
			},
			stop() {
				clearInterval(this.interval)
				this.interval = false
			  	this.time = 0
			}
		},
	})

	app = new Vue({
		el: "#app",
		data: {
			player,
			tmp,
			Decimal,
			format,
			formatTime,
			focused,
			getThemeName,
			layerunlocked,
			doReset,
			buyUpg,
			buyUpgrade,
			startChallenge,
			keepGoing,
			inChallenge,
			canAffordUpgrade,
			canBuyBuyable,
			canCompleteChallenge,
			subtabShouldNotify,
			subtabResetNotify,
			challengeStyle,
			challengeButtonText,
			constructBarStyle,
			constructParticleStyle,
			VERSION,
			LAYERS,
			hotkeys,
			activePopups,
			particles,
			mouseX,
			mouseY,
			shiftDown,
			ctrlDown,
			run,
			gridRun,
		},
	})
}

 
