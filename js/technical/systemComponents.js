var systemComponents = {
	'tab-buttons': {
		props: ['layer', 'data', 'name'],
		template: `
			<div class="upgRow">
				<div v-for="tab in Object.keys(data)">
					<button v-if="data[tab].unlocked == undefined || data[tab].unlocked" v-bind:class="{tabButton: true, notify: subtabShouldNotify(layer, name, tab), resetNotify: subtabResetNotify(layer, name, tab)}"
					v-bind:style="[{'border-color': tmp[layer].color}, (subtabShouldNotify(layer, name, tab) ? {'box-shadow': 'var(--hqProperty2a), 0 0 20px '  + (data[tab].glowColor || defaultGlow)} : {}), tmp[layer].componentStyles['tab-button'], data[tab].buttonStyle]"
						v-on:click="function(){player.subtabs[layer][name] = tab; updateTabFormats(); needCanvasUpdate = true;}">{{tab}}</button>
				</div>
			</div>
		`
	},

	'tree-node': {
		props: ['layer', 'abb', 'size', 'prev'],
		template: `
		<button v-if="nodeShown(layer)"
			v-bind:id="layer"
			v-on:click="function() {
				if (shiftDown && options.forceTooltips) player[layer].forceTooltip = !player[layer].forceTooltip
				else if(tmp[layer].isLayer) {
					if (tmp[layer].leftTab) {
						showNavTab(layer, prev)
						showTab('none')
					}
					else
						showTab(layer, prev)
				}
				else {run(layers[layer].onClick, layers[layer])}
			}"


			v-bind:class="{
				treeNode: tmp[layer].isLayer,
				treeButton: !tmp[layer].isLayer,
				smallNode: size == 'small',
				[layer]: true,
				tooltipBox: true,
				forceTooltip: player[layer].forceTooltip,
				ghost: tmp[layer].layerShown == 'ghost',
				hidden: !tmp[layer].layerShown,
				locked: tmp[layer].isLayer ? !(player[layer].unlocked || tmp[layer].canReset) : !(tmp[layer].canClick),
				notify: tmp[layer].notify && player[layer].unlocked,
				resetNotify: tmp[layer].prestigeNotify,
				can: ((player[layer].unlocked || tmp[layer].canReset) && tmp[layer].isLayer) || (!tmp[layer].isLayer && tmp[layer].canClick),
				front: !tmp.scrolled,
			}"
			v-bind:style="constructNodeStyle(layer)">
			<span class="nodeLabel" v-html="(abb !== '' && tmp[layer].image === undefined) ? abb : '&nbsp;'"></span>
			<tooltip
      v-if="tmp[layer].tooltip != ''"
			:text="(tmp[layer].isLayer) ? (
				player[layer].unlocked ? (tmp[layer].tooltip ? tmp[layer].tooltip : formatWhole(player[layer].points) + ' ' + tmp[layer].resource)
				: (tmp[layer].tooltipLocked ? tmp[layer].tooltipLocked : 'Reach ' + formatWhole(tmp[layer].requires) + ' ' + tmp[layer].baseResource + ' to unlock (You have ' + formatWhole(tmp[layer].baseAmount) + ' ' + tmp[layer].baseResource + ')')
			)
			: (
				tmp[layer].canClick ? (tmp[layer].tooltip ? tmp[layer].tooltip : 'I am a button!')
				: (tmp[layer].tooltipLocked ? tmp[layer].tooltipLocked : 'I am a button!')
			)"></tooltip>
			<node-mark :layer='layer' :data='tmp[layer].marked'></node-mark></span>
		</button>
		`
	},

	
	'layer-tab': {
		props: ['layer', 'back', 'spacing', 'embedded'],
		template: `<div v-bind:style="[tmp[layer].style ? tmp[layer].style : {}, (tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ? tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style : {}]" class="noBackground">
		<div v-if="back"><button v-bind:class="back == 'big' ? 'other-back' : 'back'" v-on:click="goBack(layer)">←</button></div>
		<div v-if="!tmp[layer].tabFormat">
			<div v-if="spacing" v-bind:style="{'height': spacing}" :key="this.$vnode.key + '-spacing'"></div>
			<infobox v-if="tmp[layer].infoboxes" :layer="layer" :data="Object.keys(tmp[layer].infoboxes)[0]":key="this.$vnode.key + '-info'"></infobox>
			<main-display v-bind:style="tmp[layer].componentStyles['main-display']" :layer="layer"></main-display>
			<div v-if="tmp[layer].type !== 'none'">
				<prestige-button v-bind:style="tmp[layer].componentStyles['prestige-button']" :layer="layer"></prestige-button>
			</div>
			<resource-display v-bind:style="tmp[layer].componentStyles['resource-display']" :layer="layer"></resource-display>
			<milestones v-bind:style="tmp[layer].componentStyles.milestones" :layer="layer"></milestones>
			<div v-if="Array.isArray(tmp[layer].midsection)">
				<column :layer="layer" :data="tmp[layer].midsection" :key="this.$vnode.key + '-mid'"></column>
			</div>
			<clickables v-bind:style="tmp[layer].componentStyles['clickables']" :layer="layer"></clickables>
			<buyables v-bind:style="tmp[layer].componentStyles.buyables" :layer="layer"></buyables>
			<upgrades v-bind:style="tmp[layer].componentStyles['upgrades']" :layer="layer"></upgrades>
			<challenges v-bind:style="tmp[layer].componentStyles['challenges']" :layer="layer"></challenges>
			<achievements v-bind:style="tmp[layer].componentStyles.achievements" :layer="layer"></achievements>
			<br><br>
		</div>
		<div v-if="tmp[layer].tabFormat">
			<div v-if="Array.isArray(tmp[layer].tabFormat)"><div v-if="spacing" v-bind:style="{'height': spacing}"></div>
				<column :layer="layer" :data="tmp[layer].tabFormat" :key="this.$vnode.key + '-col'"></column>
			</div>
			<div v-else>
				<div class="upgTable" v-bind:style="{'padding-top': (embedded ? '0' : '25px'), 'margin-top': (embedded ? '-10px' : '0'), 'margin-bottom': '24px'}">
					<tab-buttons v-bind:style="tmp[layer].componentStyles['tab-buttons']" :layer="layer" :data="tmp[layer].tabFormat" :name="'mainTabs'"></tab-buttons>
				</div>
				<layer-tab v-if="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :layer="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :embedded="true" :key="this.$vnode.key + '-' + layer"></layer-tab>
				<column v-else :layer="layer" :data="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].content" :key="this.$vnode.key + '-col'"></column>
			</div>
		</div></div>
			`
	},

	'overlay-head': {
		template: `	
		<div>	
		<span v-if="player.devSpeed && player.devSpeed != 1" class="overlayThing">
			<br>Dev Speed: ×{{format(player.devSpeed)}}<br>
		</span>
		<span v-if="player.offTime !== undefined"  class="overlayThing">
			<br>Offline Time: {{formatTime(player.offTime.remain)}}
		</span>	<br>
		<div v-for="thing in tmp.displayThings" class="overlayThing"><span v-if="thing" v-html="thing"></span></div>
		<div class="overlayThing" style="padding-bottom:7px; width: 90%; z-index: 1000; position: relative; justify-content: space-around; display: flex; flex-wrap: wrap; pointer-events: none;">
			<div class="currencyDisplayHeader" v-if="options.cashPin">
				<span v-if="player.points.lt('1e1000')"  class="overlayThing">You have </span>
				<h2  class="overlayThing" id="points" style="color: rgb(21, 115, 7); text-shadow: rgb(21, 115, 7) 0px 0px 10px;">{{"$" + format(player.points.max(0))}}</h2>
				<br>
				<span v-if="canGenPoints()"  class="overlayThing">({{tmp.other.oompsMag != 0 ? format(tmp.other.oomps) + " OOM" + (tmp.other.oompsMag < 0 ? "^OOM" : tmp.other.oompsMag > 1 ? "^" + tmp.other.oompsMag : "") + "s" : formatSmall(getPointGen())}}/sec)</span>
			</div>
			<div class="currencyDisplayHeader" v-if="player.rebirth.unlocked && options.rebirthPin">
				<span v-if="player.rebirth.points.lt('1e1000')"  class="overlayThing">You have </span>
				<h2  class="overlayThing" id="points" style="color: #BA0022; text-shadow: #BA0022 0px 0px 10px;">{{formatWhole(player.rebirth.points.max(0))}}</h2> RP
				<br>
				<span v-if="maxedChallenge('super', 11)"  class="overlayThing">({{formatSmall(tmp.rebirth.getResetGain.times(tmp.rebirth.passiveGeneration))}}/sec)</span>
			</div>
			<div class="currencyDisplayHeader" v-if="player.super.unlocked && options.superPin">
				<span v-if="player.super.points.lt('1e1000')"  class="overlayThing">You have </span>
				<h2  class="overlayThing" id="points" style="color: rgb(251, 26, 61); text-shadow: rgb(251, 26, 61) 0px 0px 10px;">{{formatWhole(player.super.points.max(0))}}</h2> SRP
				<br><br>
			</div>
	</div></div>
	`
    },

    'info-tab': {
        template: `
        <div>
        <h2>{{modInfo.name}}</h2>
        <br>
        <h3>{{VERSION.withName}}</h3>
        <span v-if="modInfo.author">
            <br>
            Made by {{modInfo.author}}	
        </span>
        <br>
        The Modding Tree <a v-bind:href="'https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md'" target="_blank" class="link" v-bind:style = "{'font-size': '14px', 'display': 'inline'}" >{{TMT_VERSION.tmtNum}}</a> by Acamaeda
        <br>
        The Prestige Tree made by Jacorb and Aarex
		<br><br>
		<div class="link" onclick="showTab('changelog-tab')">Changelog</div><br>
        <span v-if="modInfo.discordLink"><a class="link" v-bind:href="modInfo.discordLink" target="_blank">{{modInfo.discordName}}</a><br></span>
        <a class="link" href="https://discord.gg/F3xveHV" target="_blank" v-bind:style="modInfo.discordLink ? {'font-size': '16px'} : {}">The Modding Tree Discord</a><br>
        <a class="link" href="http://discord.gg/wwQfgPa" target="_blank" v-bind:style="{'font-size': '16px'}">Main Prestige Tree server</a><br>
		<br></div>
    `
    },

    'stats-tab': {
        template: `
        <div>
		Time Played: {{ formatTime(player.timePlayed) }}<br><br>
        <span v-if="player.points.max(0).add(1).log(10).ceil().div(3).gte(1) || player.rebirth.points.max(0).add(1).log(10).ceil().div(3).gte(1) || player.super.points.max(0).add(1).log(10).ceil().div(3).gte(1)">If you wrote 3 digits per second, it would take you:<br>
		<span v-if="player.points.max(0).add(1).log(10).ceil().div(3).gte(1)">{{ formatTime(player.points.max(0).add(1).log(10).ceil().div(3), 1) }} to write your cash amount<br></span>
		<span v-if="player.rebirth.points.max(0).add(1).log(10).ceil().div(3).gte(1)">{{ formatTime(player.rebirth.points.max(0).add(1).log(10).ceil().div(3), 1) }} to write your RP amount<br></span>
		<span v-if="player.super.points.max(0).add(1).log(10).ceil().div(3).gte(1)">{{ formatTime(player.super.max(0).points.add(1).log(10).ceil().div(3), 1) }} to write your SRP amount<br></span><br></span>
		</div>
    `
    },

    'help-tab': {
        template: `
        <div>
		<h3>Hotkeys</h3><br>
        <span v-for="key in hotkeys" v-if="player[key.layer].unlocked && tmp[key.layer].hotkeys[key.id].unlocked"><br>{{key.description}}</span><br><br><br>
		<h3>Standard Notation Key</h3><br><br>
		<h3>Unique Standalones</h3><br>
		M: e6,
		B: e9<br><br><br>
		<h3>Units</h3><br>
		U: e3, D: e6, T: e9, Qa: e12, Qt: e15, Sx: e18, Sp: e21, Oc: e24, No: e27<br><br>
		<h3>Decillions</h3><br>
		Dc: e30, Vg: e60, Tg: e90, Qg: e120, Qi: e150, He: e180, Se: e210, Og: e240, Nn: e270<br><br>
		<h3>Other Info</h3><br>
		Standard Notation is always e3 higher than the sum of its parts when not a Unique Standalone.<br>
		</div>
    `
    },

    'discord-version-overlay': {
        template: `
        <div>	
			<div id="discord" class="overlayThing">
				<img onclick="window.open((modInfo.discordLink ? modInfo.discordLink : 'https://discord.gg/F3xveHV'),'mywindow')"
					src="discord.png" target="_blank"></img>
				<ul id="discord-links">
					<li v-if="modInfo.discordLink"><a class="link" v-bind:href="modInfo.discordLink"
							target="_blank">{{modInfo.discordName}}</a><br></li>
					<li><a class="link" href="https://discord.gg/F3xveHV" target="_blank"
							v-bind:style="modInfo.discordLink ? {'font-size': '16px'} : {}">The Modding Tree
							Discord</a><br></li>
					<li><a class="link" href="http://discord.gg/wwQfgPa" target="_blank"
							v-bind:style="{'font-size': '16px'}">Main Prestige Tree server</a></li>
				</ul>
			</div>
			<div id="version" onclick="showTab('changelog-tab')" class="overlayThing" style="margin-right: 13px" >
				{{VERSION.withoutName}}</div>
		</div>`
    },

    'options-tab': {
        template: `
        <table>
            <tr>
				<td><button class="optTitle">Saving -</button></td>
                <td><button class="opt" onclick="save()">Save</button></td>
                <td><button class="opt" onclick="importSave()">Import Save</button></td>
                <td><button class="opt" onclick="exportSave()">Export Save to clipboard</button></td>
                <td><button class="opt" onclick="toggleOpt('autosave')">Autosave: {{ options.autosave?"ON":"OFF" }}</button></td>
                <td><button class="opt" onclick="hardReset()">HARD RESET</button></td>
            </tr>
            <tr>
				<td><button class="optTitle">Visual -</button></td>
                <td><button class="opt" onclick="adjustMSDisp()">Show Milestones: {{ MS_DISPLAYS[MS_SETTINGS.indexOf(options.msDisplay)]}}</button></td>
                <td><button class="opt" onclick="toggleOpt('hideChallenges')">Completed Challenges: {{ options.hideChallenges?"HIDDEN":"SHOWN" }}</button></td>
                <td><button class="opt" onclick="toggleOpt('standardNotate')">Standard Notation: {{ options.standardNotate?"ON":"OFF" }}</button></td>
				<td><button class="opt" onclick="toggleOpt('forceTooltips'); needsCanvasUpdate = true">Shift-Click to Toggle Tooltips: {{ options.forceTooltips?"ON":"OFF" }}</button></td>
            </tr>
            <tr>
				<td><button class="optTitle">Gameplay -</button></td>
				<td><button class="opt" onclick="toggleOpt('offlineProd')">Offline Prod: {{ options.offlineProd?"ON":"OFF" }}</button></td>
				<td><button class="opt" onclick="toggleOpt('missingTabs')">Move Hidden Tabs Into Unique Tab: {{ options.missingTabs?"ON":"OFF" }}</button></td>
            </tr>
            <tr>
				<td><button class="optTitle">Header -</button></td>
				<td><button class="opt" onclick="toggleOpt('cashPin')">Cash: {{ options.cashPin?"ON":"OFF" }}</button></td>
				<td><button class="opt" onclick="toggleOpt('rebirthPin')">{{ player.rebirth.unlocked?'RP':'???' }}: {{ options.rebirthPin?"ON":"OFF" }}</button></td>
				<td><button class="opt" onclick="toggleOpt('superPin')">{{ player.super.unlocked?'SRP':'???' }}: {{ options.superPin?"ON":"OFF" }}</button></td>
            </tr>
        </table>`
    },

    'back-button': {
        template: `
        <button v-bind:class="back" onclick="goBack()">←</button>
        `
    },


	'tooltip' : {
		props: ['text'],
		template: `<div class="tooltip" v-html="text"></div>
		`
	},

	'node-mark': {
		props: {'layer': {}, data: {}, offset: {default: 0}, scale: {default: 1}},
		template: `<div v-if='data'>
			<div v-if='data === true' class='star' v-bind:style='{position: "absolute", left: (offset-10) + "px", top: (offset-10) + "px", transform: "scale( " + scale||1 + ", " + scale||1 + ")"}'></div>
			<img v-else class='mark' v-bind:style='{position: "absolute", left: (offset-22) + "px", top: (offset-15) + "px", transform: "scale( " + scale||1 + ", " + scale||1 + ")"}' v-bind:src="data"></div>
		</div>
		`
	},

	'particle': {
		props: ['data', 'index'],
		template: `<div><div class='particle instant' v-bind:style="[constructParticleStyle(data), data.style]" 
			v-on:click="run(data.onClick, data)"  v-on:mouseenter="run(data.onMouseOver, data)" v-on:mouseleave="run(data.onMouseLeave, data)" ><span v-html="data.text"></span>
		</div>
		<svg version="2" v-if="data.color">
		<mask v-bind:id="'pmask' + data.id">
        <image id="img" v-bind:href="data.image" x="0" y="0" :height="data.width" :width="data.height" />
    	</mask>
    	</svg>
		</div>
		`
	},

	'bg': {
		props: ['layer'],
		template: `<div class ="bg" v-bind:style="[tmp[layer].style ? tmp[layer].style : {}, (tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ? tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style : {}]"></div>
		`
	}

}

