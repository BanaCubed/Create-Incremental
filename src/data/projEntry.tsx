import Node from "components/Node.vue";
import Spacer from "components/layout/Spacer.vue";
import { branchedResetPropagation, createTree, Tree } from "features/trees/tree";
import type { Layer } from "game/layers";
import { createLayer } from "game/layers";
import { noPersist } from "game/persistence";
import player, { Player } from "game/player";
import Decimal, { format, formatTime } from "util/bignum";
import { render, renderCol } from "util/vue";
import { computed } from "vue";
import lCash from "./layers/cash/lCash";
import { cashGain } from "./layers/cash/resourceGain";
import { createTabFamily } from "features/tabs/tabFamily";
import Row from "components/layout/Row.vue";
import creationsTab from "./layers/cash/creationsTab";
import SidebarResource from "./layers/main/resources/SidebarResource.vue";
import { renderedDisplays } from "./layers/main/resources/resourceDisplays";
import Nav from "components/Nav.vue";
import machineTab from "./layers/cash/machineTab";

/**
 * @hidden
 */
export const main = createLayer("main", () => {
	// Something of note is that this tree is never actually shown to the player, and solely used
	// as a method of propagating resets through layers.
	const tree = createTree(() => ({
		nodes: noPersist([[lCash.treeNode]]),
		branches: [],
		resetPropagation: branchedResetPropagation
	})) as Tree;

	const tabFamily = createTabFamily({
		cash: () => ({
			tab: creationsTab,
			display: "Creations"
		}),
		machine: () => ({
			tab: machineTab,
			display: "Machine"
		})
	});

	return {
		name: "Tree",
		links: tree.links,
		display: () => (
			<>
				{/* {player.devSpeed === 0 ? (
					<div>
						Game Paused
						<Node id="paused" />
					</div>
				) : null}
				{player.devSpeed != null && player.devSpeed !== 0 && player.devSpeed !== 1 ? (
					<div>
						Dev Speed: {format(player.devSpeed)}x
						<Node id="devspeed" />
					</div>
				) : null}
				{player.offlineTime != null && player.offlineTime !== 0 ? (
					<div>
						Offline Time: {formatTime(player.offlineTime)}
						<Node id="offline" />
					</div>
				) : null} */}
				<div style="display: flex;">
					<div style="flex-grow: 1;">{render(tabFamily)}</div>
					<Spacer />
					{renderCol(...renderedDisplays.value, <div style="flex-grow: 1;"></div>)}
				</div>
			</>
		),
		tree,
		minimizable: false,
		tabFamily
	};
});

/**
 * Given a player save data object being loaded, return a list of layers that should currently be enabled.
 * If your project does not use dynamic layers, this should just return all layers.
 */
export const getInitialLayers = (
	/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
	player: Partial<Player>
): Array<Layer> => [main, lCash];

/**
 * A computed ref whose value is true whenever the game is over.
 */
export const hasWon = computed(() => {
	return false;
});

/**
 * Given a player save data object being loaded with a different version, update the save data object to match the structure of the current version.
 * @param oldVersion The version of the save being loaded in
 * @param player The save data being loaded in
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
export function fixOldSave(
	oldVersion: string | undefined,
	player: Partial<Player>
	// eslint-disable-next-line @typescript-eslint/no-empty-function
): void {}
/* eslint-enable @typescript-eslint/no-unused-vars */
