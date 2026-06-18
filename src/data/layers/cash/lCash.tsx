import { createReset } from "features/reset";
import { createLayer } from "game/layers";
import { createLayerTreeNode } from "../../common";
import { createResource, trackBest, trackOOMPS, trackTotal } from "features/resources/resource";
import Decimal, { DecimalSource } from "lib/break_eternity";
import { cashGain } from "./resourceGain";
import { createUpgrade, Upgrade } from "features/clickables/upgrade";
import { CashUpgradeID } from "./enums";
import { createBooleanRequirement, createCostRequirement } from "game/requirements";
import Resource from "features/resources/Resource.vue";
import Spacer from "components/layout/Spacer.vue";
import { renderRow } from "util/vue";

const id = "cash";
const layer = createLayer(id, l => {
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
		thingsToReset: (): Record<string, unknown>[] => [layer]
	}));

	const treeNode = createLayerTreeNode(() => ({
		layerID: id,
		color,
		reset
	}));

	const upgrades: Record<CashUpgradeID, Upgrade> = {
		[CashUpgradeID.CUpA]: createUpgrade(() => ({
			requirements: createBooleanRequirement(true, "Free"),
			display: {
				title: "Create Incremental",
				description: "Start producing cash.",
				effectDisplay: "+1/s"
			}
		})),
		[CashUpgradeID.CUpB]: createUpgrade(() => ({
			requirements: createCostRequirement(() => ({
				cost: 12,
				resource: cash
			})),
			display: {
				title: "Create Machinery",
				description: "Unlock the Machine."
			}
		}))
	}

	return {
		name,
		color,
		points: cash,
		best: bestCash,
		total: totalCash,
		oomps,
		display: () => (
			<>
				You have <Resource resource={cash} color={color} /> Cash
				{
					Decimal.gt(cashGain.value, 0) ? <><br />{oomps.value}</> : null
				}
				<Spacer />
				<h2>Creations</h2>
				{renderRow(...Object.values(upgrades))}
			</>
		),
		treeNode,
		upgrades
	};
});

export default layer;
