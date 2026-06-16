/**
 * @module
 * @hidden
 */
import { createReset } from "features/reset";
import { createLayer } from "game/layers";
import { createLayerTreeNode } from "../../common";
import { createResource, trackBest, trackOOMPS, trackTotal } from "features/resources/resource";
import Decimal, { DecimalSource } from "lib/break_eternity";
import { cashGain } from "./resourceGain";

const id = "cash";
const layer = createLayer(id, l => {
	const name = "Cash";
	const color = "#0b9000";

	const cash = createResource<DecimalSource>(10);
	// Storing these values for a rainy day.
	const bestCash = trackBest(cash);
	const totalCash = trackTotal(cash);

	const oomps = trackOOMPS(cash, cashGain);
	l.on("update", diff => {
		cash.value = Decimal.add(cash.value, Decimal.times(cashGain.value, diff));
	});

	const reset = createReset(() => ({
		thingsToReset: (): Record<string, unknown>[] => [layer]
	}));

	const treeNode = createLayerTreeNode(() => ({
		layerID: id,
		color,
		reset
	}));

	return {
		name,
		color,
		points: cash,
		best: bestCash,
		total: totalCash,
		oomps,
		display: () => (
			<>
				Whoopdedoo
			</>
		),
		treeNode
	};
});

export default layer;
