var systemComponents = {
	'tab-buttons': {
		props: ['layer', 'data', 'name'],
		template: `
			<div class="upgRow">
				<div v-for="tab in Object.keys(data)">
					<button v-if="data[tab].unlocked == undefined || data[tab].unlocked" v-bind:class="{tabButton: true, tooltipBox: true}"
					v-bind:style="[{'background-color': tmp[layer].color}, tmp[layer].componentStyles['tab-button'], data[tab].buttonStyle]"
						v-on:click="function(){player.subtabs[layer][name] = tab; updateTabFormats(); needCanvasUpdate = true;}">{{data[tab].name?data[tab].name:tab}}
						</button>
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
			<div class="tooltip nodeTooltip" v-bind:style="{'font-size': '1rem', 'background-color': '#0f0f0f', 'width': '31rem'}">
				<div v-bind:is="tmp[layer].tooltip"></div>
			</div>
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
		<span class="overlayThing" v-if="VERSION.beta || VERSION.pre">
			<br><h1 v-if="VERSION.beta" class="betaWarning">BETA VERSION - CURRENTLY UNFINISHED - EXPECT CHANGES AND BUGS</h1><h1 v-if="VERSION.pre" class="betaWarning">PRE-RELEASE VERSION - EXPECT BUGS</h1><br>
		</span>
		<span v-if="player.offTime !== undefined"  class="overlayThing">
			<br>Offline Time: {{formatTime(player.offTime.remain)}}<br>
		</span>	<br>
		<div v-for="thing in tmp.displayThings" class="overlayThing"><span v-if="thing" v-html="thing"></span></div>
		<bar :layer="'chall'" :data="'nextFeature'"></bar><br>
		<div class="overlayThing" id="headerFlexbox">
			<cash-display></cash-display>
			<tax-display v-if="inChallenge('super', 15) && !hasMilestone('chall', 1)"></tax-display>
			<rp-display v-if="player.rebirth.unlocked && !hasMilestone('chall', 1)"></rp-display>
			<srp-display v-if="player.super.unlocked"></srp-display>
			<power-display v-if="player.power.unlocked && !hasMilestone('chall', 1)"></power-display>
			<hyper-display v-if="player.hyper.unlocked"></hyper-display>
			<utime-display v-if="tmp.chall.uTime.neq(1)"></utime-display>
		</div>
		</div>
	`
    },

    'info-tab': {
        template: `
        <div>
        <h1>{{modInfo.name}}</h1>
        <br>
        <h2>{{VERSION.withName}}</h2>
		<br>
		Coding by BanaCubed<br>
		Ideas by adoplayzz, galaxyuser63274, EchoingLycanthrope, Shadow69420,<br>
		BanaCubed, Create_Incremental_Boy, EdenGameMaster<br>
		Artwork by BanaCubed, adoplayzz
        <br><br>
        The Modding Tree <a v-bind:href="'https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md'" target="_blank" class="link" v-bind:style = "{'display': 'inline'}" >{{TMT_VERSION.tmtNum}}</a> by Acamaeda
        <br>
        The Prestige Tree made by Jacorb and Aarex
		<br><br>
		<div class="link" onclick="showTab('changelog-tab')">Changelog</div><br>
        <span v-if="modInfo.discordLink"><a class="link" v-bind:href="modInfo.discordLink" target="_blank">{{modInfo.discordName}}</a><br></span>
        <a class="link" href="https://galaxy.click/forum/thread/255" target="_blank">Original Forum Thread</a><br>
        <a class="link" href="https://discord.gg/F3xveHV" target="_blank">The Modding Tree Discord</a><br>
        <a class="link" href="https://discord.gg/wwQfgPa" target="_blank">Main Prestige Tree server</a><br>
		<br><br></div>
    `
    },

    'stats-tab': {
        template: `
        <div>
		Time Since:<br>Rebirth - <span v-html="formatTime(player.rebirth.resetTime)"></span><br>Super Rebirth - <span v-html="formatTime(player.super.resetTime)"></span><br>Hyper Rebirth - <span v-html="formatTime(player.hyper.resetTime)"></span><br><br>
		<span v-if="player.hyper.unlocked">Universal Time Since:<br>Rebirth - <span v-html="formatTime(player.rebirth.uResetTime)"></span><br>Super Rebirth - <span v-html="formatTime(player.super.uResetTime)"></span><br>Hyper Rebirth - <span v-html="formatTime(player.hyper.uResetTime)"></span><br><br></span>
		<span v-if="player.hyper.unlocked">Real </span>Playtime<br><span v-html="formatTime(player.timePlayed)"></span><br><br>
		<span v-if="player.hyper.unlocked">Universal Playtime<br><span v-html="formatTime(player.chall.uTimePlayed)"></span><br><br></span>
		<br><br></div>
    `
    },

    'help-tab': {
        template: `
        <div>
		<h3>Hotkeys</h3><br>
        <span v-for="key in hotkeys" v-if="player[key.layer].unlocked && tmp[key.layer].hotkeys[key.id].unlocked"><br>{{key.description}}</span><br><br><br>
		<br><br></div>
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
					<li><a class="link" href="https://discord.gg/F3xveHV" target="_blank">The Modding Tree
							Discord</a><br></li>
					<li><a class="link" href="http://discord.gg/wwQfgPa" target="_blank">Main Prestige Tree server</a></li>
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
                <td><button class="opt tooltipBox" onclick="importSave()">Import Save<tooltip :text="'Will cause a prompt'"></tooltip></button></td>
                <td><button class="opt" onclick="exportSave()">Export Save to clipboard</button></td>
                <td><button class="opt tooltipBox" onclick="toggleOpt('autosave')">Autosave: {{ options.autosave?"ON":"OFF" }}<tooltip :text="'Highly reccommended to leave enabled'"></tooltip></button></td>
                <td><button class="opt" onclick="hardReset()">HARD RESET</button></td>
            </tr>
            <tr>
				<td><button class="optTitle">Visual -</button></td>
                <td><button class="opt" onclick="adjustMSDisp()">Show Milestones: {{ MS_DISPLAYS[MS_SETTINGS.indexOf(options.msDisplay)]}}</button></td>
                <td><button class="opt tooltipBox" onclick="toggleNotation()">Notation: {{ viewNotation() }}<tooltip :text="'Tooltips are unaffected by notation'"></tooltip></button></td>
                <td><button class="opt" onclick="toggleOpt('compact')">Compact Mode: {{ options.compact?"ON":"OFF" }}</button></td>
                <td><button class="opt" onclick="toggleOpt('upgID')">Display IDs: {{ options.upgID?"ON":"OFF" }}</button></td>
                <td><button class="opt tooltipBox" onclick="toggleOpt('tooltipCredits')">Tooltips: {{ options.tooltipCredits?"Credits/ Oringial Formula":"Formula" }}<tooltip :text="'Original formulas follow balancing from forum, not actual formulas'"></tooltip></button></td>
            </tr>
            <tr>
				<td><button class="optTitle">Gameplay -</button></td>
				<td><button class="opt" onclick="toggleOpt('offlineProd')">Offline Prod: {{ options.offlineProd?"ON":"OFF" }}</button></td>
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
		template: `<div class="tooltip" v-html="text" style="width: 100%;"></div>
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

