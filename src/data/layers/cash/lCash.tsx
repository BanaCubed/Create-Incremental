import { createReset } from "features/reset";
import { createLayer, Layer } from "game/layers";
import { createLayerTreeNode, LayerTreeNode } from "../../common";
import {
	createResource,
	Resource,
	trackBest,
	trackOOMPS,
	trackTotal
} from "features/resources/resource";
import Decimal, { DecimalSource } from "lib/break_eternity";
import { cashGain } from "./resourceGain";
import { createUpgrade, Upgrade } from "features/clickables/upgrade";
import { CreationID } from "./enums";
import { createBooleanRequirement, createCostRequirement } from "game/requirements";
import { Ref } from "vue";

export interface LayerCash extends Layer {
	cash: Resource<DecimalSource>;
	bestCash: Ref<DecimalSource>;
	totalCash: Ref<DecimalSource>;
	oomps: Ref<string>;
	treeNode: LayerTreeNode;
	upgrades: Record<CreationID, Upgrade>;
}

const id = "cash";
const layer: LayerCash = createLayer(id, l => {
	const name = "Cash";
	const color = "#0b9000";

	const cash = createResource<DecimalSource>(10, "Cash");
	// Storing these values for a rainy day.
	const bestCash = trackBest(cash);
	const totalCash = trackTotal(cash);

	const oomps = trackOOMPS(cash, cashGain);
	l.on("update", diff => {
		cash.value = Decimal.add(cash.value, Decimal.times(cashGain.value, diff));
	});

	const reset = createReset(() => ({
		thingsToReset: (): Record<string, unknown>[] =>
			[cash, bestCash, totalCash, upgrades] as unknown as Record<string, unknown>[]
	}));

	const treeNode = createLayerTreeNode(() => ({
		layerID: id,
		color,
		reset
	}));

	const upgrades: Record<CreationID, Upgrade> = {
		[CreationID.CreationCash]: createUpgrade(() => ({
			requirements: createBooleanRequirement(true, "Nil"),
			display: {
				title: "Create Cash",
				description: "Unlock cash.",
				effectDisplay: "+1/s"
			}
		})),
		[CreationID.CreationMachine]: createUpgrade(() => ({
			requirements: createCostRequirement(() => ({
				cost: 12,
				resource: cash
			})),
			display: {
				title: "Create Machinery",
				description: "Unlock the Machine."
			}
		}))
	};

	return {
		name,
		color,
		cash,
		bestCash,
		totalCash,
		oomps,
		display: () => <></>,
		treeNode,
		upgrades
	};
});

export default layer;
