var app;

function loadVue() {
	// data = a function returning the content (actually HTML)
	Vue.component('display-text', {
		props: ['layer', 'data'],
		template: `
			<span class="instant" v-html="data"></span>
		`
	})

// data = a function returning the content (actually HTML)
	Vue.component('raw-html', {
			props: ['layer', 'data'],
			template: `
				<span class="instant"  v-html="data"></span>
			`
		})

	// Blank space, data = optional height in px or pair with width and height in px
	Vue.component('blank', {
		props: ['layer', 'data'],
		template: `
			<div class = "instant">
			<div class = "instant" v-if="!data" v-bind:style="{'width': '8px', 'height': '17px'}"></div>
			<div class = "instant" v-else-if="Array.isArray(data)" v-bind:style="{'width': data[0], 'height': data[1]}"></div>
			<div class = "instant" v-else v-bind:style="{'width': '8px', 'height': data}"><br></div>
			</div>
		`
	})

	// Displays an image, data is the URL
	Vue.component('display-image', {
		props: ['layer', 'data'],
		template: `
			<img class="instant" v-bind:src= "data" v-bind:alt= "data">
		`
	})
		
	// data = an array of Components to be displayed in a row
	Vue.component('row', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: `
		<div class="upgTable instant">
			<div class="upgRow" style="align-items: start;">
				<div v-for="(item, index) in data">
				<div v-if="!Array.isArray(item)" v-bind:is="item" :layer= "layer" v-bind:style="tmp[layer].componentStyles[item]" :key="key + '-' + index"></div>
				<div v-else-if="item.length==3" v-bind:style="[tmp[layer].componentStyles[item[0]], (item[2] ? item[2] : {})]" v-bind:is="item[0]" :layer= "layer" :data= "item[1]" :key="key + '-' + index"></div>
				<div v-else-if="item.length==2" v-bind:is="item[0]" :layer= "layer" :data= "item[1]" v-bind:style="tmp[layer].componentStyles[item[0]]" :key="key + '-' + index"></div>
				</div>
			</div>
		</div>
		`
	})

	// data = an array of Components to be displayed in a column
	Vue.component('column', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: `
		<div class="upgTable instant">
			<div class="upgCol">
				<div v-for="(item, index) in data">
					<div v-if="!Array.isArray(item)" v-bind:is="item" :layer= "layer" v-bind:style="tmp[layer].componentStyles[item]" :key="key + '-' + index"></div>
					<div v-else-if="item.length==3" v-bind:style="[tmp[layer].componentStyles[item[0]], (item[2] ? item[2] : {})]" v-bind:is="item[0]" :layer= "layer" :data= "item[1]" :key="key + '-' + index"></div>
					<div v-else-if="item.length==2" v-bind:is="item[0]" :layer= "layer" :data= "item[1]" v-bind:style="tmp[layer].componentStyles[item[0]]" :key="key + '-' + index"></div>
				</div>
			</div>
		</div>
		`
	})

	// data [other layer, tabformat for within proxy]
	Vue.component('layer-proxy', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: `
		<div>
			<column :layer="data[0]" :data="data[1]" :key="key + 'col'"></column>
		</div>
		`
	})
	Vue.component('infobox', {
		props: ['layer', 'data'],
		template: `
		<div class="story instant" v-if="tmp[layer].infoboxes && tmp[layer].infoboxes[data]!== undefined && tmp[layer].infoboxes[data].unlocked" v-bind:style="[{'border-color': tmp[layer].color, 'border-radius': player.infoboxes[layer][data] ? 0 : '8px'}, tmp[layer].infoboxes[data].style]">
			<button class="story-title" v-bind:style="[{'background-color': tmp[layer].color}, tmp[layer].infoboxes[data].titleStyle]"
				v-on:click="player.infoboxes[layer][data] = !player.infoboxes[layer][data]">
				<span class="story-toggle">{{player.infoboxes[layer][data] ? "+" : "-"}}</span>
				<span v-html="tmp[layer].infoboxes[data].title ? tmp[layer].infoboxes[data].title : (tmp[layer].name)"></span>
			</button>
			<div v-if="!player.infoboxes[layer][data]" class="story-text" v-bind:style="tmp[layer].infoboxes[data].bodyStyle">
				<span v-html="tmp[layer].infoboxes[data].body ? tmp[layer].infoboxes[data].body : 'Blah'"></span>
			</div>
		</div>
		`
	})
	Vue.component('cash-display', {
		template: `
			<div class="currencyDisplayHeader cash upg">
				<span class="overlayThing">You have </span>
				<h2 id="points" style="color: var(--cash); text-shadow: var(--cash) 0px 0px 10px;" v-html="'$' + format(player.points.max(0))"></h2>
				<br>
				<span v-if="canGenPoints()" class="overlayThing" v-html="'(' + formatSmall(getPointGen()) + '/sec)'"></span>
			</div>
		`
	});
	Vue.component('rp-display', {
		template: `
			<div class="currencyDisplayHeader rebirth upg">
				<span class="overlayThing">You have </span>
				<h2 id="points" style="color: var(--rebirth); text-shadow: var(--rebirth) 0px 0px 10px;" v-html="formatWhole(player.rebirth.points.max(0))"></h2> RP
				<br>
				<span v-if="maxedChallenge('super', 11)" class="overlayThing" v-html="'(' + formatSmall(tmp.rebirth.getResetGain.times(tmp.rebirth.passiveGeneration)) + '/sec)'"></span>
			</div>
		`
	});
	Vue.component('rp-uhoh-display', {
		template: `
			<div class="currencyDisplayHeader rebirth upg uhoh" v-if="hasMilestone('chall', 1)">
				<span class="overlayThing">You have </span>
				<h2 id="points" style="color: var(--rebirth); text-shadow: var(--rebirth) 0px 0px 10px;" v-html="formatWhole(player.rebirth.points.max(0))"></h2> RP
				<br>
				<span v-if="maxedChallenge('super', 11)" class="overlayThing" v-html="'(' + formatSmall(tmp.rebirth.getResetGain.times(tmp.rebirth.passiveGeneration)) + '/sec)'"></span>
			</div>
		`
	});
	Vue.component('srp-display', {
		template: `
			<div class="currencyDisplayHeader super upg">
				<span class="overlayThing">You have </span>
				<h2 id="points" style="color: var(--super); text-shadow: var(--super) 0px 0px 10px;" v-html="formatWhole(player.super.points.max(0))"></h2> SRP
				<br>
				<span v-if="hasMilestone('hyper', 0)" class="overlayThing" v-html="'(' + formatSmall(tmp.super.getResetGain.times(tmp.super.passiveGeneration)) + '/sec)'"></span>
			</div>
		`
	});
	Vue.component('srp-uhoh-display', {
		template: `
			<div class="currencyDisplayHeader super upg uhoh" v-if="false">
				<span class="overlayThing">You have </span>
				<h2 id="points" style="color: var(--super); text-shadow: var(--super) 0px 0px 10px;" v-html="formatWhole(player.super.points.max(0))"></h2> SRP
				<br>
				<span v-if="hasMilestone('hyper', 0)" class="overlayThing" v-html="'(' + formatSmall(tmp.super.getResetGain.times(tmp.super.passiveGeneration)) + '/sec)'"></span>
			</div>
		`
	});
	Vue.component('power-display', {
		template: `
			<div class="currencyDisplayHeader power upg">
				<span class="overlayThing">You have </span>
				<h2 id="points" style="color: var(--power); text-shadow: var(--power) 0px 0px 10px;" v-html="formatWhole(player.power.power.max(0))"></h2> Power
				<br>
				<span class="overlayThing" v-if="hasUpgrade('super', 14)" v-html="'(' + formatSmall(tmp.power.pylons.a.effect) + '/sec)'"></span>
			</div>
		`
	});
	Vue.component('power-uhoh-display', {
		template: `
			<div class="currencyDisplayHeader power upg uhoh" v-if="hasMilestone('chall', 1)">
				<span class="overlayThing">You have </span>
				<h2 id="points" style="color: var(--power); text-shadow: var(--power) 0px 0px 10px;" v-html="formatWhole(player.power.power.max(0))"></h2> Power
				<br>
				<span class="overlayThing" v-if="hasUpgrade('super', 14)" v-html="'(' + formatSmall(tmp.power.pylons.a.effect) + '/sec)'"></span>
			</div>
		`
	});
	Vue.component('tax-display', {
		template: `
			<div class="currencyDisplayHeader tax upg">
				<span class="overlayThing">You have </span>
				<h2 id="points" style="color: var(--cursed); text-shadow: var(--cursed) 0px 0px 10px;" v-html="formatWhole(player.super.tax.max(0))"></h2> Tax
				<br>
				<span class="overlayThing" v-html="'(×' + formatSmall(tmp.super.challenges[15].nerf) + '/sec)'"></span>
			</div>
		`
	});
	Vue.component('tax-uhoh-display', {
		template: `
			<div class="currencyDisplayHeader tax upg uhoh" v-if="hasMilestone('chall', 1) && inChallenge('super', 15)">
				<span class="overlayThing">You have </span>
				<h2 id="points" style="color: var(--cursed); text-shadow: var(--cursed) 0px 0px 10px;" v-html="formatWhole(player.super.tax.max(0))"></h2> Tax
				<br>
				<span class="overlayThing" v-html="'(×' + formatSmall(tmp.super.challenges[15].nerf) + '/sec)'"></span>
			</div>
		`
	});
	Vue.component('hyper-display', {
		template: `
			<div class="currencyDisplayHeader hyper upg">
				<span class="overlayThing">You have </span>
				<h2 id="points" style="color: var(--hyper); text-shadow: var(--hyper) 0px 0px 10px;" v-html="formatWhole(player.hyper.points.max(0))"></h2> HRP
				<br>
			</div>
		`
	});
	Vue.component('hcash-display', {
		template: `
			<div class="currencyDisplayHeader hcash upg uhoh">
				<span class="overlayThing">You have Hyper</span>
				<h2 id="points" style="color: var(--hcash); text-shadow: var(--hcash) 0px 0px 10px;" v-html="'$' + format(player.hyper.cash.max(0))"></h2>
				<br>
				<span class="overlayThing" v-if="player.hyper.rebirths.gte(1)" v-html="formatSmall(tmp.chall.uTime.times(tmp.hyper.cashGain)) + '/sec'"></span>
			</div>
		`
	});
	Vue.component('utime-display', {
		template: `
			<div class="currencyDisplayHeader universe upg">
				<span class="overlayThing">Universal Time is </span>
				<h2 id="points" style="color: var(--universe); text-shadow: var(--universe) 0px 0px 10px;" v-html="formatBoost(tmp.chall.uTime.max(0), true)"></h2>
				<br><span>faster than real time</span>
			</div>
		`
	})
	Vue.component('matter-display', {
		template: `
			<div class="currencyDisplayHeader matter upg uhoh">
				<span class="overlayThing">You have </span>
				<h2 id="points" style="color: var(--matter); text-shadow: var(--matter) 0px 0px 10px;" v-html="format(player.matter.points.max(0))"></h2> Matter
				<br>
				<span class="overlayThing" v-if="hasUpgrade('hyper', 51)">(<span v-html="formatSmall(tmp.matter.matterGain)"></span>/sec)</span>
			</div>
		`
	})
	Vue.component('antimatter-display', {
		template: `
			<div class="currencyDisplayHeader antimatter upg uhoh">
				<span class="overlayThing">You have </span>
				<h2 id="points" style="color: var(--amatter); text-shadow: var(--amatter) 0px 0px 10px;" v-html="format(player.antimatter.points.max(0))"></h2> Antimatter
				<br>
				<span class="overlayThing" v-if="hasUpgrade('hyper', 52)">(<span v-html="formatSmall(tmp.antimatter.matterGain)"></span>/sec)</span>
			</div>
		`
	})
	Vue.component('darkmatter-display', {
		template: `
			<div class="currencyDisplayHeader darkmatter upg uhoh">
				<span class="overlayThing">You have </span>
				<h2 id="points" style="color: var(--dmatter); text-shadow: var(--dmatter) 0px 0px 10px;" v-html="format(player.darkmatter.points.max(0))"></h2> Dark Matter
				<br>
				<span class="overlayThing" v-if="hasUpgrade('hyper', 53)">(<span v-html="formatSmall(tmp.darkmatter.matterGain)"></span>/sec)</span>
			</div>
		`
	})
	Vue.component('blackhole-display', {
		template: `
			<div class="currencyDisplayHeader universe upg uhoh" v-if="player.blackhole.unlocked" style="height: 60px">
				<span class="overlayThing">You have </span>
				<h2 id="points" style="color: var(--universe); text-shadow: var(--universe) 0px 0px 10px;" v-html="format(player.blackhole.points.max(0))"></h2>
				<br>
				Planck Volumes of Black Hole<br><span class="overlayThing" v-if="hasUpgrade('darkmatter', 15)">(<span v-html="formatSmall(tmp.blackhole.matterGain)"></span>/sec)</span>
			</div>
		`
	})
	Vue.component('exomatter-display', {
		template: `
			<div class="currencyDisplayHeader exomatter upg uhoh">
				<span class="overlayThing">You have </span>
				<h2 id="points" style="color: var(--ematter); text-shadow: var(--ematter) 0px 0px 10px;" v-html="format(player.exomatter.points.max(0))"></h2> Exotic Matter
				<br>
				<span class="overlayThing" v-if="hasUpgrade('hyper', 54)">(<span v-html="formatSmall(tmp.exomatter.matterGain)"></span>/sec)</span>
			</div>
		`
	})

	// Data = width in px, by default fills the full area
	Vue.component('h-line', {
		props: ['layer', 'data'],
			template:`
				<hr class="instant" v-bind:style="data ? {'width': data} : {}" class="hl">
			`
		})

	// Data = height in px, by default is bad
	Vue.component('v-line', {
		props: ['layer', 'data'],
		template: `
			<div class="instant" v-bind:style="data ? {'height': data} : {}" class="vl2"></div>
		`
	})

	Vue.component('challenges', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].challenges" class="upgTable">
		<div v-for="row in (data === undefined ? tmp[layer].challenges.rows : data)" class="upgRow">
		<div v-for="col in tmp[layer].challenges.cols">
					<challenge v-if="tmp[layer].challenges[row*10+col]!== undefined && tmp[layer].challenges[row*10+col].unlocked" :layer = "layer" :data = "row*10+col" v-bind:style="tmp[layer].componentStyles.challenge"></challenge>
				</div>
			</div><br>
		</div>
		`
	})

	// data = id
	Vue.component('challenge', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].challenges && tmp[layer].challenges[data]!== undefined && tmp[layer].challenges[data].unlocked && !(options.hideChallenges && maxedChallenge(layer, [data]) && !inChallenge(layer, [data]))"
			v-bind:class="['challenge', challengeStyle(layer, data), player[layer].activeChallenge === data ? 'resetNotify' : '', 'upg', layer, 'tooltipBox']" v-bind:style="tmp[layer].challenges[data].style"
			:id="'challenge-' + layer + '-' + data">
			<h3 v-html="tmp[layer].challenges[data].name"></h3><br><br>
			<button v-bind:class="{ longUpg: true, can: true, [layer]: true }" v-bind:style="{'background-color': tmp[layer].color}" v-on:click="startChallenge(layer, data)">{{challengeButtonText(layer, data)}}</button><br><br>
			<span v-if="layers[layer].challenges[data].fullDisplay" v-html="run(layers[layer].challenges[data].fullDisplay, layers[layer].challenges[data])"></span>
			<span v-else>
				<span v-html="tmp[layer].challenges[data].challengeDescription"></span><br>
				Goal:  <span v-if="tmp[layer].challenges[data].goalDescription" v-html="tmp[layer].challenges[data].goalDescription"></span><span v-else>{{format(tmp[layer].challenges[data].goal)}} {{tmp[layer].challenges[data].currencyDisplayName ? tmp[layer].challenges[data].currencyDisplayName : modInfo.pointsName}}</span><br>
				Reward: <span v-html="tmp[layer].challenges[data].rewardDescription"></span><br>
				<span v-if="layers[layer].challenges[data].rewardDisplay!==undefined">Currently: <span v-html="(tmp[layer].challenges[data].rewardDisplay) ? (run(layers[layer].challenges[data].rewardDisplay, layers[layer].challenges[data])) : format(tmp[layer].challenges[data].rewardEffect)"></span></span>
			</span></span>
			<tooltip v-if="tmp[layer].challenges[data].tooltip" :text="tmp[layer].challenges[data].tooltip"></tooltip>
			
			<div style="position: absolute; bottom: 5px; left: 5px;" class="upgID" v-if="options.upgID">{{ formatID(layer, 'challenges', data) }}</div>

		</div>
		`
	})

	// data = id
	Vue.component('changelog', {
		props: ['layer', 'data'],
		template: `
		<div>
			<h1>Changelog</h1><br><br>
<span style="text-align: left; position: absolute; left: 30px;" id="creds">
	<h1>v1.0</h1><br>
		- <span class="betaWarning">Remade the Entire Game</span><br>
		- Added <span style="color: var(--power)">Power Allocation</span><br>
		- Added <span style="color: var(--universe)">Universal Time</span><br>
		- Added <span style="color: var(--hyper)">Hyper Paths Icons</span><br>
		- Added <span style="color: var(--blessed)">Many Notations</span><br>
		- Improved <span style="color: var(--cursed)">Credits</span><br>
		- Actually Added <span style="color: var(--cursed)">The Changelog</span><br><br>
	<h3>v0.3.2</h3><br>
		- Added <span style="color: var(--matter)">Matter Paths</span><br>
		- Added <span style="color: var(--matter)">Matter</span><br>
		- Added <span style="color: var(--amatter)">Antimatter</span><br>
		- Added <span style="color: var(--dmatter)">Dark Matter</span> and <span style="color: var(--dmatter)">Black Hole</span><br>
		- Added <span style="color: var(--ematter)">Exotic Matter</span>, <span style="color: var(--ematter)">Hypothetical Particles</span>, and <span style="color: var(--radio)">Unstable Matter</span><br>
		- Added <span style="color: var(--universe)">Ultimate Matter Fragments</span><br>
		- Added <span style="color: var(--cursed)">Softlock Prevention</span><br>
		Endgame <span style="color: var(--universe)">4 UMF</span><br><br>
	<h3>v0.3.0.1 - v0.3.0.5</h3><br>
		- Added <span style="color: var(--blessed)">Hotkeys</span><br>
		- Added <span style="color: var(--hyper)">Hyper Paths Respec</span><br><br>
	<h2>v0.3</h2><br>
		- Added <span style="color: var(--hyper)">Hyper Rebirth</span><br>
		- Added <span style="color: var(--hyper)">Hyper Paths</span><br>
		- Added <span style="color: var(--hcash)">Hyper Cash</span><br>
		Endgame <span style="color: var(--cash)">e10,000 $</span>, <span style="color: var(--hyper)">130 HRP</span><br><br>
	<h3>v0.2.1</h3><br>
		- Added <span style="color: var(--power)">Power</span><br>
		- Added <span style="color: var(--power)">Power Pylons</span><br>
		- Added More <span style="color: var(--super)">Super Rebirth Challenges</span><br>
		Endgame <span style="color: var(--cash)">e12,000 $</span>, <span style="color: var(--rebirth)">e5,000 RP</span>, <span style="color: var(--super)">100,000 SRP</span><br><br>
	<h2>v0.2</h2><br>
		- Added <span style="color: var(--super)">Super Rebirth</span><br>
		- Added <span style="color: var(--super)">Super Rebirth Challenge 1</span><br>
		- Added <span style="color: var(--super)">Super Rebirth Milestones</span><br>
		- Added <span style="color: var(--cursed)">Secret Achievements</span><br>
		- Added <span style="color: var(--cursed)">More Themes</span><br>
		Endgame <span style="color: var(--super)">8 SRP, Challenge Completed</span><br><br>
	<h3>v0.1.3</h3><br>
		- Added <span style="color: var(--cash)">Money</span><br>
		- Added <span style="color: var(--rebirth)">Rebirth</span><br>
		- Added <span style="color: var(--tech)">The Machine</span><br>
		- Added <span style="color: var(--blessed)">Achievements</span><br>
		Endgame <span style="color: var(--cursed)">Unkown</span><br><br>
	<h3>Game Stats</h3><br>
		- Prestige Layers: 3<br>
		- Unique Prestiges: 3<br>
		- Upgrades: {{ 18+12+6+20+7+9+6 }}<br>
		- Challenges: {{ 5 }}<br>
		- Buyables: {{ 1+2+2+3+4 }}<br>
		- Milestones: {{ 8+11+7+2 }}<br>
		- Pylons: {{ 6 }}<br>
		- Tabs: 5<br>
		- Subtabs: {{ 2+3+3+3+1 }}<br>
		- Buttons in the Machine: {{ 6+6+3 }}<br>
		- Upgrades to the Machine: 3<br>
		- Max UMF: 2<br>
		- Max Singularities: 0<br>
		- Settings: 11<br>
		- Currencies: 8<br>
		- Resources: 10<br>
		- Random Number: {{  format(Decimal.div(1, Math.random()).pow(25)) }}<br><br>
</span>
		</div>
		`
	})

	Vue.component('upgrades', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].upgrades" class="upgTable">
			<div v-for="row in (data === undefined ? tmp[layer].upgrades.rows : data)" class="upgRow">
				<div v-for="col in tmp[layer].upgrades.cols"><div v-if="tmp[layer].upgrades[row*10+col]!== undefined && tmp[layer].upgrades[row*10+col].unlocked" class="upgAlign">
					<upgrade :layer = "layer" :data = "row*10+col" v-bind:style="tmp[layer].componentStyles.upgrade"></upgrade>
				</div></div>
			</div>
			<br>
		</div>
		`
	})

	// data = id
	Vue.component('upgrade', {
		props: ['layer', 'data'],
		template: `
		<div>
			<div v-if="tmp[layer].upgrades && tmp[layer].upgrades[data]!== undefined && tmp[layer].upgrades[data].unlocked && !options.compact" :id='"upgrade-" + layer + "-" + data'  v-bind:class="{ [layer]: true, tooltipBox: true, upg: true}">
				<div style="height: 75px;">
					<h2 v-html="tmp[layer].upgrades[data].title"></h2><br><br>
					<span class="upgDescription" v-html="run(tmp[layer].upgrades[data].fullDisplay, tmp[layer].upgrades[data])"></span>
				</div>
				<div style="height: 35px; display: flex;">
					<div style="width: 140px;" class="upgDescription">Cost: <span v-html="formatCost(tmp[layer].upgrades[data].costa, layer)"></span></div>
					<button style="width: 90px; height: 35px; border-color: rgba(255, 255, 255, 0.25);"
						v-bind:class="{ upgBuy: true, tooltipBox: true, can: tmp[layer].upgrades[data].canAfford && !hasUpgrade(layer, data), locked: !tmp[layer].upgrades[data].canAfford, bought: hasUpgrade(layer, data), [layer]: true}"
						v-on:click="buyUpg(layer, data)">{{ hasUpgrade(layer, data)?'Bought':'Buy' }}</button>
				</div>
				<div style="position: absolute; bottom: 5px; left: 5px;" class="upgID" v-if="options.upgID">{{ formatID(layer, 'upgrades', data) }}</div>
				<tooltip :text="tmp[layer].upgrades[data].tooltip" v-if="tmp[layer].upgrades[data].tooltip !== undefined"></tooltip>
			</div>

			<div v-if="tmp[layer].upgrades && tmp[layer].upgrades[data]!== undefined && tmp[layer].upgrades[data].unlocked && options.compact" :id='"upgrade-" + layer + "-" + data'  v-bind:class="{ [layer]: true, tooltipBox: true, upg: true}" style="width: 13rem">
				<div style="height: 14rem;">
					<h2 v-html="tmp[layer].upgrades[data].title"></h2><br><br>
					<span class="upgDescription" v-html="run(tmp[layer].upgrades[data].fullDisplay, tmp[layer].upgrades[data])"></span><br><br>
					Cost: <span v-html="formatCost(tmp[layer].upgrades[data].costa?tmp[layer].upgrades[data].costa:tmp[layer].upgrades[data].cost, layer)"></span>
				</div>
				<div style="height: 35px; display: flex;">
					<button style="width: 13rem; height: 3.5rem; border-color: rgba(255, 255, 255, 0.25);"
						v-bind:class="{ upgBuy: true, tooltipBox: true, can: tmp[layer].upgrades[data].canAfford && !hasUpgrade(layer, data), locked: !tmp[layer].upgrades[data].canAfford, bought: hasUpgrade(layer, data), [layer]: true}"
						v-on:click="buyUpg(layer, data)">{{ hasUpgrade(layer, data)?'Bought':'Buy' }}</button>
				</div>
				<div style="position: absolute; bottom: 4.5rem; left: 5px;" class="upgID" v-if="options.upgID">{{ formatID(layer, 'upgrades', data) }}</div>
				<tooltip :text="tmp[layer].upgrades[data].tooltip" v-if="tmp[layer].upgrades[data].tooltip !== undefined"></tooltip>
			</div>
		</div>
		`
	})
	
	Vue.component('machine-display', {
		props: ['layer', 'data'],
		template: `
		<div style="display: flex; flex-direction: column; width: 514px; max-width: calc(100vw - 40px); position: relative; min-height: 0;" class="upg machine">
			<div>
				<h2>The Machine</h2><br>
				<span v-if="!options.compact && player.machine.main">The Machine is currently {{ machineText() }}<br></span>
				$ <span v-html="player.machine.state==1?formatBoost(tmp.machine.clickables[11].effect):player.machine.state==2?formatBoost(tmp.machine.clickables[11].effect.times(tmp.machine.clickables[12].effect)):formatBoost(0)"></span>,
				RP <span v-html="player.machine.state==3?formatBoost(tmp.machine.clickables[13].effect):player.machine.state==2?formatBoost(tmp.machine.clickables[13].effect.times(tmp.machine.clickables[12].effect)):formatBoost(0)"></span><br v-if="player.machine.main"><br v-if="player.machine.main">
			</div>
			<div style="display: flex; justify-content: space-evenly; flex-direction: row; width: 100%;" v-if="player.machine.main">
				<clickable :layer="'machine'" :data="11" v-bind:class="{bought: player.machine.state == 1}"></clickable>
				<clickable :layer="'machine'" :data="12" v-bind:class="{bought: player.machine.state == 2}"></clickable>
				<clickable :layer="'machine'" :data="13" v-bind:class="{bought: player.machine.state == 3}"></clickable>
			</div>
			<div style="display: flex; justify-content: space-evenly; flex-direction: row; width: 100%; margin-top: 10px;" v-if="player.machine.main">
				<div style="width: 130px; margin-top: 0;">
					Cash Mode increases cash <span v-if="!options.compact">gain by </span><span class="cash infoText" v-html="formatBoost(tmp.machine.clickables[11].effect)"></span>
				</div>
				<div style="width: 130px; margin-top: 0;">
					Neutral Mode applies both Cash and Rebirth Modes <span v-if="!options.compact">at </span><span class="power infoText" v-html="formatBoost(tmp.machine.clickables[12].effect, false)"></span><span v-if="!options.compact"> efficiency</span>
				</div>
				<div style="width: 130px; margin-top: 0;">
					Rebirth Mode increases RP <span v-if="!options.compact">gain by </span><span class="rebirth infoText" v-html="formatBoost(tmp.machine.clickables[13].effect)"></span>
				</div>
			</div>
			<h2 v-if="hasMilestone('power', 2) && player.machine.main"><br>Power Allocation</h2><br>
			<slider v-if="hasMilestone('power', 2) && !hasMilestone('chall', 1) && player.machine.main" :layer="'chall'" :data="['pap', 1, 100]" :text="player.chall.pap + '%'" class="power"></slider>
			<div v-if="hasMilestone('power', 2) && player.machine.main" style="display: flex; justify-content: space-evenly; flex-direction: row; width: 100%; margin-top: 10px; min-height: 4em;">
				<div style="width: 130px; margin-top: 0;">
					Cash Mode has<br><span v-html="formatWhole(player.power.cashPower)"></span><br>Power<span v-if="!options.compact"> allocated</span>
				</div>
				<div style="width: 130px; margin-top: 0;">
					Neutral Mode has<br><span v-html="formatWhole(player.power.neutralPower)"></span><br>Power<span v-if="!options.compact"> allocated</span>
				</div>
				<div style="width: 130px; margin-top: 0;">
					Rebirth Mode has<br><span v-html="formatWhole(player.power.rebirthPower)"></span><br>Power<span v-if="!options.compact"> allocated</span>
				</div>
			</div>
			<div v-if="hasMilestone('power', 2) && !hasMilestone('chall', 1) && player.machine.main" style="display: flex; justify-content: space-evenly; flex-direction: row; width: 100%; margin-top: 10px;">
				<clickable :layer="'power'" :data="11"></clickable>
				<clickable :layer="'power'" :data="12"></clickable>
				<clickable :layer="'power'" :data="13"></clickable>
			</div>
			<button style="width: 4rem; height: 4rem; background-color: transparent; text-align: center; min-height: 2rem; position: absolute; top: -0.5rem; left: -0.5rem; border: none;" onclick="player.machine.main = !player.machine.main" class="minButton">{{player.machine.main?'▼':'▶'}}</button>
		</div>
		`
	})

	Vue.component('power-pylons', {
		props: ['layer', 'data'],
		template: `
		<div v-if="player.power.unlocked" class="power upg" style="width: 514px; max-width: calc(100vw - 40px); position: relative; min-height: 0;">
			<h2>Power Pylons</h2><br>
			<span v-if="!player.machine.power"><span v-html="formatWhole(player.power.power)"></span> Power<br><br></span>
			<span v-if="!options.compact && player.machine.power">Each Pylon produces the previous one (Power is Pylon 0)<br></span>
			<span v-if="!options.compact && player.machine.power">All Pylons cost Power<br></span><br v-if="player.machine.power">
			<power-uhoh-display v-if="hasMilestone('chall', 1) && player.machine.power"></power-uhoh-display><br v-if="player.machine.power">
			<power-pylon :layer="'power'" :data="21" :letter="'A'" v-if="player.machine.power"></power-pylon><br v-if="player.machine.power">
			<power-pylon :layer="'power'" :data="22" :letter="'B'" v-if="player.machine.power"></power-pylon><br v-if="player.machine.power">
			<power-pylon :layer="'power'" :data="23" :letter="'C'" v-if="player.machine.power"></power-pylon><br v-if="player.machine.power">
			<power-pylon :layer="'power'" :data="24" :letter="'D'" v-if="player.machine.power"></power-pylon><br v-if="player.machine.power">
			<power-pylon :layer="'power'" :data="25" :letter="'E'" v-if="player.machine.power"></power-pylon><br v-if="player.machine.power">
			<power-pylon :layer="'power'" :data="26" :letter="'F'" v-if="player.machine.power"></power-pylon><br v-if="player.machine.power">
			<milestones :layer="'power'" style="max-height: 300px; overflow-y: auto;" v-if="player.machine.power"></milestones>
			<button style="width: 4rem; height: 4rem; background-color: transparent; text-align: center; min-height: 2rem; position: absolute; top: -0.5rem; left: -0.5rem; border: none;" onclick="player.machine.power = !player.machine.power" class="minButton">{{player.machine.power?'▼':'▶'}}</button>
		</div>
		`
	})

	Vue.component('matter-combustor', {
		props: ['layer', 'data'],
		template: `
		<div v-if="player.matter.unlocked" class="hyper upg" style="width: 514px; max-width: calc(100vw - 40px); position: relative; min-height: 0;">
			<h2>Matter Combustor</h2><br>
			<span><span v-html="format(player.matter.points)"></span> Matter<span v-if="player.antimatter.unlocked"> | <span v-html="formatWhole(player.antimatter.points)"></span> AM</span><span v-if="player.darkmatter.unlocked"> | <span v-html="formatWhole(player.darkmatter.points)"></span> DM</span><span v-if="player.exomatter.unlocked"> | <span v-html="formatWhole(player.exomatter.points)"></span> EM</span><span v-if="player.matter.umf.gte(1)"> | <span v-html="formatWhole(player.matter.umf)"></span> UMF</span><br>
			<span v-if="player.matter.umf.gte(1)">Ultimate Matter Fragments are boosting HRP, SRP, RP, $ and Power <span v-html="formatBoost(tmp.matter.ultimateEffect, true)"></span></span><br></span>
			<br v-if="player.machine.matter"><br v-if="player.machine.matter"><tree :data="[['matter', 'antimatter', 'darkmatter', 'exomatter']]" v-if="player.machine.matter"></tree>
			<button style="width: 4rem; height: 4rem; background-color: transparent; text-align: center; min-height: 2rem; position: absolute; top: -0.5rem; left: -0.5rem; border: none;" onclick="player.machine.matter = !player.machine.matter" class="minButton">{{player.machine.matter?'▼':'▶'}}</button>
		</div>
		`
	})

	Vue.component('power-pylon', {
		props: ['layer', 'data', 'letter'],
		template: `
		<div style="width: 100%; display: flex; flex-flow: row nowrap; justify-content: space-between;" v-if="tmp.power.clickables[data].unlocked">
			<h2 style="margin: auto 0;">{{ tmp.power.clickables[data].title }}<br><span v-if="options.upgID" class="upgID" style="font-size: 15px">{{ formatID(layer, 'pylons', data) }}</span></h2><br>
			<span style="margin: auto 0;"><span v-html="formatWhole(player.power['pylon' + letter])"></span> [<span v-html="formatWhole(player.power['pylob' + letter])"></span>]</span>
			<span style="margin: auto 0;"><span v-if="!options.compact">Effect: </span><span v-html="format(tmp.power.pylons[letter.toLowerCase()].effect)"></span>/sec
			<clickable :layer="'power'" :data="data" style="margin: auto 0;"></clickable>
		</div>
		`
	})

	Vue.component('milestones', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].milestones" style="width: fit-content; display: flex; flex-direction: column; overflow-x: clip;">
			<h2>Milestones</h2><h3>of {{ tmp[layer].resetName }}</h3><br><br>
			<milestone :layer = "layer" :data = "id" v-bind:style="tmp[layer].componentStyles.milestone" v-for="id in (data === undefined ? Object.keys(tmp[layer].milestones) : data)" v-if="tmp[layer].milestones[id]!== undefined && tmp[layer].milestones[id].unlocked && milestoneShown(layer, id)">
				</milestone>
		</div>
		`
	})

	Vue.component('milestones-upgbox', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].milestones" style="width: fit-content; display: flex; flex-direction: column; overflow-x: clip; margin-left: auto; margin-right: auto;" v-bind:class="{upg: true, [layer]: true}">
			<h2>Milestones</h2><h3>of {{ tmp[layer].resetName }}</h3><br><br>
			<milestone :layer = "layer" :data = "id" v-bind:style="tmp[layer].componentStyles.milestone" v-for="id in (data === undefined ? Object.keys(tmp[layer].milestones) : data)" v-if="tmp[layer].milestones[id]!== undefined && tmp[layer].milestones[id].unlocked && milestoneShown(layer, id)">
				</milestone>
		</div>
		`
	})

	Vue.component('milestones-upgbox-unst', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].milestones" style="width: fit-content; display: flex; flex-direction: column; overflow-x: clip; margin-left: auto; margin-right: auto;" v-bind:class="{upg: true, radio: true}">
			<h2>Milestones</h2><h3>of {{ tmp[layer].resetName }}</h3><br><br>
			<milestone :layer = "layer" :data = "id" v-bind:style="tmp[layer].componentStyles.milestone" v-for="id in (data === undefined ? Object.keys(tmp[layer].milestones) : data)" v-if="tmp[layer].milestones[id]!== undefined && tmp[layer].milestones[id].unlocked && milestoneShown(layer, id)">
				</milestone>
		</div>
		`
	})

	Vue.component('milestones-scroll', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].milestones">
			<milestones :layer = "layer" :data = "data" style="width: 502px; max-height: 150px; overflow-y: auto; height: fit-content; min-height: 150px;" v-bind:class="{[layer]: true, upg: true,}">
				</milestones>
		</div>
		`
	})

	// data = id
	Vue.component('milestone', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].milestones && tmp[layer].milestones[data]!== undefined && milestoneShown(layer, data) && tmp[layer].milestones[data].unlocked" v-bind:style="[tmp[layer].milestones[data].style]" v-bind:class="{milestone: !hasMilestone(layer, data), tooltipBox: true, milestoneDone: hasMilestone(layer, data), upg: true, [layer]: true}"  style="width: 454px; min-height: 55px;">
			<h2 v-if="hasMilestone(layer, data)">★ </h2><h2 v-html="tmp[layer].milestones[data].requirementDescription"></h2><br>
			<span v-html="run(layers[layer].milestones[data].effectDescription, layers[layer].milestones[data])"></span><br>
			<tooltip v-if="tmp[layer].milestones[data].tooltip" :text="tmp[layer].milestones[data].tooltip"></tooltip>

			<div style="position: absolute; bottom: 5px; left: 5px;" class="upgID" v-if="options.upgID">{{ formatID(layer, 'milestones', data) }}</div>
		<span v-if="(tmp[layer].milestones[data].toggles)&&(hasMilestone(layer, data))" v-for="toggle in tmp[layer].milestones[data].toggles"><toggle :layer= "layer" :data= "toggle" v-bind:style="tmp[layer].componentStyles.toggle"></toggle>&nbsp;</span></div>
		`
	})

	Vue.component('toggle', {
		props: ['layer', 'data'],
		template: `
		<button class="smallUpg can" v-bind:style="{'background-color': tmp[data[0]].color}" v-on:click="toggleAuto(data)">{{player[data[0]][data[1]]?"ON":"OFF"}}</button>
		`
	})

	Vue.component('prestige-button', {
		props: ['layer', 'data'],
		template: `
		<div style="height: 150px;" v-bind:class="{ [layer]: true, tooltipBox: true, upg: true}" style="display: flex; flex-flow: column nowrap; justify-content: space-between;">
			<div style="height: 110px;">
				<h2>{{ tmp[layer].resetName }}</h2><br>
				<span v-html="tmp[layer].resetDescription" style="min-height: 40px; display: block;"></span><br>
				<span v-html="prestigeButtonText(layer)"></span>
			</div>
			<button v-if="(tmp[layer].type !== 'none')" v-bind:class="{ [layer]: true, reset: true, locked: !tmp[layer].canReset, can: tmp[layer].canReset}"
			v-bind:style="[tmp[layer].canReset ? {'background-color': tmp[layer].color} : {}, tmp[layer].componentStyles['prestige-button']]"
			v-on:click="doReset(layer)">{{ tmp[layer].canReset?tmp[layer].resetName:'Cannot '+tmp[layer].resetName }}
			</button>
			<tooltip v-if="tmp[layer].resetTooltip" :text="tmp[layer].resetTooltip"></tooltip>
		</div>
	`	
	})

	// Displays the main resource for the layer
	Vue.component('main-display', {
		props: ['layer', 'data'],
		template: `
		<div><span v-if="player[layer].points.lt('1e1000')">You have </span><h2 v-bind:style="{'color': tmp[layer].color, 'text-shadow': '0px 0px 10px ' + tmp[layer].color}">{{data ? format(player[layer].points, data) : formatWhole(player[layer].points)}}</h2> {{tmp[layer].resource}}<span v-if="layers[layer].effectDescription">, <span v-html="run(layers[layer].effectDescription, layers[layer])"></span></span><br><br></div>
		`
	})

	// Displays the base resource for the layer, as well as the best and total values for the layer's currency, if tracked
	Vue.component('resource-display', {
		props: ['layer'],
		template: `
		<div style="margin-top: -13px">
			<span v-if="tmp[layer].baseAmount"><br>You have {{formatWhole(tmp[layer].baseAmount)}} {{tmp[layer].baseResource}}</span>
			<span v-if="tmp[layer].passiveGeneration"><br>You are gaining {{format(tmp[layer].resetGain.times(tmp[layer].passiveGeneration))}} {{tmp[layer].resource}} per second</span>
			<br><br>
			<span v-if="tmp[layer].showBest">Your best {{tmp[layer].resource}} is {{formatWhole(player[layer].best)}}<br></span>
			<span v-if="tmp[layer].showTotal">You have made a total of {{formatWhole(player[layer].total)}} {{tmp[layer].resource}}<br></span>
		</div>
		`
	})

	Vue.component('buyables', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].buyables" class="upgTable">
			<respec-button v-if="tmp[layer].buyables.respec && !(tmp[layer].buyables.showRespec !== undefined && tmp[layer].buyables.showRespec == false)" :layer = "layer" v-bind:style="[{'margin-bottom': '12px'}, tmp[layer].componentStyles['respec-button']]"></respec-button>
			<div v-for="row in (data === undefined ? tmp[layer].buyables.rows : data)" class="upgRow">
				<div v-for="col in tmp[layer].buyables.cols"><div v-if="tmp[layer].buyables[row*10+col]!== undefined && tmp[layer].buyables[row*10+col].unlocked" class="upgAlign" v-bind:style="{'height': (data ? data : 'inherit'),}">
					<buyable :layer = "layer" :data = "row*10+col"></buyable>
				</div></div>
				<br>
			</div>
		</div>
	`
	})

	Vue.component('buyable', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].buyables && tmp[layer].buyables[data]!== undefined && tmp[layer].buyables[data].unlocked" :id='"buyable-" + layer + "-" + data'  v-bind:class="{ [layer]: true, tooltipBox: true, upg: true}">
			<div style="height: 75px;">
				<h2 v-html="tmp[layer].buyables[data].title"></h2><br><br>
				<span class="upgDescription" v-html="tmp[layer].buyables[data].display()"></span>
			</div>
			<div style="height: 35px; display: flex;">
				<div style="width: 140px;" class="upgDescription">Count: <span v-html="formatWhole(getBuyableAmount(layer, data))"></span><span v-if="tmp[layer].buyables[data].purchaseLimit.lt(Decimal.dLayerSafeMax)">/<span v-html="formatWhole(tmp[layer].buyables[data].purchaseLimit)"></span></span><br>Cost: <span v-html="formatCost(tmp[layer].buyables[data].cost, layer)"></span></div>
				<button style="width: 90px; height: 35px; border-color: rgba(255, 255, 255, 0.25);"
					v-bind:class="{ upgBuy: true, tooltipBox: true, can: tmp[layer].buyables[data].canAfford, locked: !tmp[layer].buyables[data].canAfford, [layer]: true, bought: getBuyableAmount(layer, data).gte(tmp[layer].buyables[data].purchaseLimit)}"
					v-on:click="if(!interval) buyBuyable(layer, data)">Buy</button>
			</div>
			<div style="position: absolute; bottom: 5px; left: 5px;" class="upgID" v-if="options.upgID">{{ formatID(layer, 'buyables', data) }}</div>
			<tooltip :text="tmp[layer].buyables[data].tooltip" v-if="tmp[layer].buyables[data].tooltip !== undefined"></tooltip>
		</div>
		`,
		data() { return { interval: false, time: 0,}},
		methods: {
			start() {
				if (!this.interval) {
					this.interval = setInterval((function() {
						if(this.time >= 5)
							buyBuyable(this.layer, this.data)
						this.time = this.time+1
					}).bind(this), 50)}
			},
			stop() {
				clearInterval(this.interval)
				this.interval = false
			  	this.time = 0
			}
		},
	})

	Vue.component('respec-button', {
		props: ['layer', 'data'],
		template: `
			<div v-if="tmp[layer].buyables && tmp[layer].buyables.respec && !(tmp[layer].buyables.showRespec !== undefined && tmp[layer].buyables.showRespec == false)">
				<div class="tooltipBox respecCheckbox"><input type="checkbox" v-model="player[layer].noRespecConfirm" ><tooltip v-bind:text="'Disable respec confirmation'"></tooltip></div>
				<button v-on:click="respecBuyables(layer)" v-bind:class="{ longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked }" style="margin-right: 18px">{{tmp[layer].buyables.respecText ? tmp[layer].buyables.respecText : "Respec"}}</button>
			</div>
			`
	})
	
	Vue.component('clickables', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].clickables" class="upgTable">
			<master-button v-if="tmp[layer].clickables.masterButtonPress && !(tmp[layer].clickables.showMasterButton !== undefined && tmp[layer].clickables.showMasterButton == false)" :layer = "layer" v-bind:style="[{'margin-bottom': '12px'}, tmp[layer].componentStyles['master-button']]"></master-button>
			<div v-for="row in (data === undefined ? tmp[layer].clickables.rows : data)" class="upgRow">
				<div v-for="col in tmp[layer].clickables.cols"><div v-if="tmp[layer].clickables[row*10+col]!== undefined && tmp[layer].clickables[row*10+col].unlocked" class="upgAlign" v-bind:style="{'margin-left': '7px', 'margin-right': '7px',  'height': (data ? data : 'inherit'),}">
					<clickable :layer = "layer" :data = "row*10+col" v-bind:style="tmp[layer].componentStyles.clickable"></clickable>
				</div></div>
				<br>
			</div>
		</div>
	`
	})

	// data = id of clickable
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
						if(this.time >= 5 && run(c.canClick, c)) {
							run(c.onHold, c)
						}	
						this.time = this.time+1
					}).bind(this), 50)}
			},
			stop() {
				clearInterval(this.interval)
				this.interval = false
			  	this.time = 0
			}
		},
	})

	Vue.component('master-button', {
		props: ['layer', 'data'],
		template: `
		<button v-if="tmp[layer].clickables && tmp[layer].clickables.masterButtonPress && !(tmp[layer].clickables.showMasterButton !== undefined && tmp[layer].clickables.showMasterButton == false)"
			v-on:click="run(tmp[layer].clickables.masterButtonPress, tmp[layer].clickables)" v-bind:class="{ longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked }">{{tmp[layer].clickables.masterButtonText ? tmp[layer].clickables.masterButtonText : "Click me!"}}</button>
	`
	})


	// data = optionally, array of rows for the grid to show
	Vue.component('grid', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].grid" class="upgTable">
			<div v-for="row in (data === undefined ? tmp[layer].grid.rows : data)" class="upgRow">
				<div v-for="col in tmp[layer].grid.cols"><div v-if="run(layers[layer].grid.getUnlocked, layers[layer].grid, row*100+col)"
					class="upgAlign" v-bind:style="{'margin': '1px',  'height': 'inherit',}">
					<gridable :layer = "layer" :data = "row*100+col" v-bind:style="tmp[layer].componentStyles.gridable"></gridable>
				</div></div>
				<br>
			</div>
		</div>
	`
	})

	Vue.component('gridable', {
		props: ['layer', 'data'],
		template: `
		<button 
		v-if="tmp[layer].grid && player[layer].grid[data]!== undefined && run(layers[layer].grid.getUnlocked, layers[layer].grid, data)" 
		v-bind:class="{ tile: true, can: canClick, locked: !canClick, tooltipBox: true,}"
		v-bind:style="[canClick ? {'background-color': tmp[layer].color} : {}, gridRun(layer, 'getStyle', player[this.layer].grid[this.data], this.data)]"
		v-on:click="clickGrid(layer, data)"  @mousedown="start" @mouseleave="stop" @mouseup="stop" @touchstart="start" @touchend="stop" @touchcancel="stop">
			<span v-if= "layers[layer].grid.getTitle"><h3 v-html="gridRun(this.layer, 'getTitle', player[this.layer].grid[this.data], this.data)"></h3><br></span>
			<span v-bind:style="{'white-space': 'pre-line'}" v-html="gridRun(this.layer, 'getDisplay', player[this.layer].grid[this.data], this.data)"></span>
			<tooltip v-if="layers[layer].grid.getTooltip" :text="gridRun(this.layer, 'getTooltip', player[this.layer].grid[this.data], this.data)"></tooltip>

		</button>
		`,
		data() { return { interval: false, time: 0,}},
		computed: {
			canClick() {
				return gridRun(this.layer, 'getCanClick', player[this.layer].grid[this.data], this.data)}
		},
		methods: {
			start() {
				if (!this.interval && layers[this.layer].grid.onHold) {
					this.interval = setInterval((function() {
						if(this.time >= 5 && gridRun(this.layer, 'getCanClick', player[this.layer].grid[this.data], this.data)) {
							gridRun(this.layer, 'onHold', player[this.layer].grid[this.data], this.data)						}	
						this.time = this.time+1
					}).bind(this), 50)}
			},
			stop() {
				clearInterval(this.interval)
				this.interval = false
			  	this.time = 0
			}
		},
	})

	// data = id of microtab family
	Vue.component('microtabs', {
		props: ['layer', 'data'],
		computed: {
			currentTab() {return player.subtabs[layer][data]}
		},
		template: `
		<div v-if="tmp[layer].microtabs" :style="{'border-style': 'solid'}">
			<div class="upgTable instant">
				<tab-buttons :layer="layer" :data="tmp[layer].microtabs[data]" :name="data" v-bind:style="tmp[layer].componentStyles['tab-buttons']"></tab-buttons>
			</div>
			<layer-tab v-if="tmp[layer].microtabs[data][player.subtabs[layer][data]].embedLayer" :layer="tmp[layer].microtabs[data][player.subtabs[layer][data]].embedLayer" :embedded="true"></layer-tab>

			<column v-else v-bind:style="tmp[layer].microtabs[data][player.subtabs[layer][data]].style" :layer="layer" :data="tmp[layer].microtabs[data][player.subtabs[layer][data]].content"></column>
		</div>
		`
	})


	// data = id of the bar
	Vue.component('bar', {
		props: ['layer', 'data'],
		computed: {
			style() {return constructBarStyle(this.layer, this.data)}
		},
		template: `
		<div v-if="tmp[layer].bars && tmp[layer].bars[data].unlocked" v-bind:style="{'position': 'relative', 'transition': 'none', 'overflow': 'clip'}"><div v-bind:style="[tmp[layer].bars[data].style, style.dims, {'display': 'table', 'transition': 'none'}]">
			<div class = "overlayTextContainer barBorder" v-bind:style="[tmp[layer].bars[data].borderStyle, style.dims, {'transition': 'none'}]">
				<h2 class = "overlayText" v-bind:style="[tmp[layer].bars[data].style, tmp[layer].bars[data].textStyle, {'transition': 'none'}]" v-html="run(layers[layer].bars[data].display, layers[layer].bars[data])"></h2>
			</div>
			<div class ="barBG barBorder" v-bind:style="[tmp[layer].bars[data].style, tmp[layer].bars[data].baseStyle, tmp[layer].bars[data].borderStyle,  style.dims, {'transition': 'none'}]">
				<div class ="fill" v-bind:style="[tmp[layer].bars[data].style, tmp[layer].bars[data].fillStyle, style.fillDims]"></div>
			</div>
		</div></div>
		`
	})


	Vue.component('achievements', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].achievements" class="upgTable">
			<div v-for="row in (data === undefined ? tmp[layer].achievements.rows : data)" class="upgRow">
				<div v-for="col in tmp[layer].achievements.cols"><div v-if="tmp[layer].achievements[row*10+col]!== undefined && tmp[layer].achievements[row*10+col].unlocked" class="upgAlign">
					<achievement :layer = "layer" :data = "row*10+col" v-bind:style="tmp[layer].componentStyles.achievement"></achievement>
				</div></div>
			</div>
			<br>
		</div>
		`
	})

	// data = id
	Vue.component('achievement', {
		props: ['layer', 'data'],
		template: `
		<div v-if="tmp[layer].achievements && tmp[layer].achievements[data]!== undefined && tmp[layer].achievements[data].unlocked" v-bind:class="{ [layer]: true, achievement: true, tooltipBox:true, locked: !hasAchievement(layer, data), bought: hasAchievement(layer, data)}"
			v-bind:style="achievementStyle(layer, data)">
			<tooltip :text="
			(tmp[layer].achievements[data].tooltip == '') ? false : hasAchievement(layer, data) ? (tmp[layer].achievements[data].doneTooltip ? tmp[layer].achievements[data].doneTooltip : (tmp[layer].achievements[data].tooltip ? tmp[layer].achievements[data].tooltip : 'You did it!'))
			: (tmp[layer].achievements[data].goalTooltip ? tmp[layer].achievements[data].goalTooltip : (tmp[layer].achievements[data].tooltip ? tmp[layer].achievements[data].tooltip : 'LOCKED'))
		"></tooltip>
			<span v-if= "tmp[layer].achievements[data].name"><br><h3 v-bind:style="tmp[layer].achievements[data].textStyle" v-html="tmp[layer].achievements[data].name"></h3><br></span>
		</div>
		`
	})

	// Data is an array with the structure of the tree
	Vue.component('tree', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: `<div>
		<span class="upgRow" v-for="(row, r) in data"><table>
			<span v-for="(node, id) in row" style = "{width: 0px}">
				<tree-node :layer='node' :prev='layer' :abb='tmp[node].symbol' :key="key + '-' + r + '-' + id"></tree-node>
			</span>
			<tr><table><button class="treeNode hidden"></button></table></tr>
		</span></div>

	`
	})
	// Data is an array with the structure of the tree
	Vue.component('hyper-paths', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: `
		<div>
		<div v-if="!options.compact">
		<clickable-tree :layer="'hyper'" :data = "[[11], [12], [13], [14], [21], [22], [23], [24], [31], [32], [33], [34], [41], [42], [43], [44], [51], [52], [53], [54], [99]]"></clickable-tree>
		</div>
		<div v-if="options.compact">
		<upgrades :layer="'hyper'" :data = "5"></upgrades>
		</div></div>

	`
	})

	// Data is an array with the structure of the tree
	Vue.component('upgrade-tree', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: `<thing-tree :layer="layer" :data = "data" :type = "'upgrade'"></thing-tree>`
	})

	// Data is an array with the structure of the tree
	Vue.component('buyable-tree', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: `<thing-tree :layer="layer" :data = "data" :type = "'buyable'"></thing-tree>`
	})

	// Data is an array with the structure of the tree
	Vue.component('clickable-tree', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: `<thing-tree :layer="layer" :data = "data" :type = "'clickable'"></thing-tree>`
	})

	// Data is an array with the structure of the tree
	Vue.component('challenge-tree', {
		props: ['layer', 'data'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: `<thing-tree :layer="layer" :data = "data" :type = "'challenge'"></thing-tree>`
	})

	Vue.component('thing-tree', {
		props: ['layer', 'data', 'type'],
		computed: {
			key() {return this.$vnode.key}
		},
		template: `<div>
		<span class="upgRow" v-for="(row, r) in data" style="height: 0px;">
			<span v-for="id in row" style = "{width: 0px; height: 0px;}" v-if="tmp[layer][type+'s'][id]!== undefined && tmp[layer][type+'s'][id].unlocked" class="upgAlign">
				<div v-bind:is="type" :layer = "layer" :data = "id" v-bind:style="tmp[layer].componentStyles[type]" class = "treeThing"></div>
			</span>
		</span></div>
	`
	})


	// Updates the value in player[layer][data]
	Vue.component('text-input', {
		props: ['layer', 'data'],
		template: `
			<input class="instant" :id="'input-' + layer + '-' + data" :value="player[layer][data].toString()" v-on:focus="focused(true)" v-on:blur="focused(false)"
			v-on:change="player[layer][data] = toValue(document.getElementById('input-' + layer + '-' + data).value, player[layer][data])">
		`
	})

	// Updates the value in player[layer][data][0]
	Vue.component('slider', {
		props: ['layer', 'data', 'text'],
		template: `
			<div class="tooltipBox">
			<tooltip :text="text?text:player[layer][data[0]]"></tooltip><input type="range" v-model="player[layer][data[0]]" :min="data[1]" :max="data[2]"></div>
		`
	})

	// Updates the value in player[layer][data[0]], options are an array in data[1]
	Vue.component('drop-down', {
		props: ['layer', 'data'],
		template: `
			<select v-model="player[layer][data[0]]">
				<option v-for="item in data[1]" v-bind:value="item">{{item}}</option>
			</select>
		`
	})
	// These are for buyables, data is the id of the corresponding buyable
	Vue.component('sell-one', {
		props: ['layer', 'data'],
		template: `
			<button v-if="tmp[layer].buyables && tmp[layer].buyables[data].sellOne && !(tmp[layer].buyables[data].canSellOne !== undefined && tmp[layer].buyables[data].canSellOne == false)" v-on:click="run(tmp[layer].buyables[data].sellOne, tmp[layer].buyables[data])"
				v-bind:class="{ longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked }">{{tmp[layer].buyables.sellOneText ? tmp[layer].buyables.sellOneText : "Sell One"}}</button>
	`
	})
	Vue.component('sell-all', {
		props: ['layer', 'data'],
		template: `
			<button v-if="tmp[layer].buyables && tmp[layer].buyables[data].sellAll && !(tmp[layer].buyables[data].canSellAll !== undefined && tmp[layer].buyables[data].canSellAll == false)" v-on:click="run(tmp[layer].buyables[data].sellAll, tmp[layer].buyables[data])"
				v-bind:class="{ longUpg: true, can: player[layer].unlocked, locked: !player[layer].unlocked }">{{tmp[layer].buyables.sellAllText ? tmp[layer].buyables.sellAllText : "Sell All"}}</button>
	`
	})

	// SYSTEM COMPONENTS
	Vue.component('node-mark', systemComponents['node-mark'])
	Vue.component('tab-buttons', systemComponents['tab-buttons'])
	Vue.component('tree-node', systemComponents['tree-node'])
	Vue.component('layer-tab', systemComponents['layer-tab'])
	Vue.component('overlay-head', systemComponents['overlay-head'])
	Vue.component('info-tab', systemComponents['info-tab'])
	Vue.component('discord-version-overlay', systemComponents['discord-version-overlay'])
	Vue.component('help-tab', systemComponents['help-tab'])
	Vue.component('stats-tab', systemComponents['stats-tab'])
	Vue.component('options-tab', systemComponents['options-tab'])
	Vue.component('tooltip', systemComponents['tooltip'])
	Vue.component('tooltipSide', systemComponents['tooltipSide'])
	Vue.component('particle', systemComponents['particle'])
	Vue.component('bg', systemComponents['bg'])


	app = new Vue({
		el: "#app",
		data: {
			player,
			tmp,
			options,
			Decimal,
			format,
			formatWhole,
			formatTime,
			formatSmall,
			focused,
			getThemeName,
			layerunlocked,
			doReset,
			buyUpg,
			buyUpgrade,
			startChallenge,
			milestoneShown,
			keepGoing,
			hasUpgrade,
			hasMilestone,
			hasAchievement,
			hasChallenge,
			maxedChallenge,
			getBuyableAmount,
			getClickableState,
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

 
