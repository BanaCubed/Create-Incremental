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
import { MachinePowerID, CashPylonID, CashRepeatableID, CashUpgradeID, CreationID } from "../enums";
import { createBooleanRequirement, createCostRequirement } from "game/requirements";
import { Ref } from "vue";
import { createRepeatable, Repeatable } from "features/clickables/repeatable";
import Formula from "game/formulas/formulas";
import { format, formatWhole } from "util/bignum";
import effects, { EffectID } from "../effects";
import { createPylon, Pylon } from "features/clickables/pylon";
import { Visibility } from "features/feature";
import { Clickable, createClickable } from "features/clickables/clickable";
import { persistent, Persistent } from "game/persistence";

export interface LayerCash extends Layer {
	cash: Resource<DecimalSource>;
	bestCash: Ref<DecimalSource>;
	totalCash: Ref<DecimalSource>;
	oomps: Ref<string>;
	treeNode: LayerTreeNode;
	creations: Record<CreationID, Upgrade>;
	repeatables: Record<CashRepeatableID, Repeatable>;
	upgrades: Record<CashUpgradeID, Upgrade>;
	pylons: Record<CashPylonID, Pylon>;
	powers: Partial<Record<MachinePowerID, Persistent<DecimalSource>>>;
}

const id = "cash";
const layer: LayerCash = createLayer(id, l => {
	const name = "Cash";
	const color = "#0b9000";

	const cash = createResource<DecimalSource>(10, "Cash", 2);
	// Storing these values for a rainy day.
	const bestCash = trackBest(cash);
	const totalCash = trackTotal(cash);

	const reset = createReset(() => ({
		thingsToReset: (): Record<string, unknown>[] =>
			[cash, bestCash, totalCash, upgrades, repeatables, pylons] as unknown as Record<
				string,
				unknown
			>[]
	}));

	const treeNode = createLayerTreeNode(() => ({
		layerID: id,
		color,
		reset
	}));

	const creations: Record<CreationID, Upgrade> = {
		[CreationID.CreationCash]: createUpgrade(() => ({
			requirements: createBooleanRequirement(true, "None"),
			display: {
				title: "Creation 1",
				description: "Unlock Cash."
			}
		})),
		[CreationID.CreationMachine]: createUpgrade(() => ({
			requirements: createCostRequirement(() => ({
				cost: 15,
				resource: cash
			})),
			display: {
				title: "Creation 2",
				description: () =>
					creations[CreationID.CreationCash].bought.value ? (
						<>Unlock the Machine (new tab).</>
					) : (
						<>Unlock the ??????? (new tab)</>
					)
			}
		})),
		[CreationID.CreationPower]: createUpgrade(() => ({
			requirements: createCostRequirement(() => ({
				resource: cash,
				cost: 10e6
			})),
			display: {
				title: "Creation 3",
				description: () =>
					creations[CreationID.CreationMachine].bought.value ? (
						<>Unlock Power.</>
					) : (
						<>Unlock ?????.</>
					)
			}
		})),
		[CreationID.CreationRebirth]: createUpgrade(() => ({
			requirements: createCostRequirement(() => ({
				resource: cash,
				cost: Decimal.dInf
			})),
			display: {
				title: "Creation 4",
				description: () =>
					creations[CreationID.CreationPower].bought.value ? (
						<>Unlock Rebirth (new tab).</>
					) : (
						<>Unlock ??????? (new tab).</>
					)
			}
		}))
	};

	const repeatables: Record<CashRepeatableID, Repeatable> = {
		[CashRepeatableID.PrinterOverclock]: createRepeatable(() => ({
			requirements: createCostRequirement(() => ({
				resource: cash,
				cost: Formula.variable(repeatables[CashRepeatableID.PrinterOverclock].amount)
					.pow_base(1.25)
					.mul(10),
				cumulativeCost: false
			})),
			display: {
				title: "Printer Overclock",
				description: <>+20% cash production (additive).</>,
				effectDisplay: () => <>&times;{format(effects[EffectID.PrinterOverclock].value)}</>
			}
		})),
		[CashRepeatableID.PrinterInk]: createRepeatable(() => ({
			requirements: createCostRequirement(() => ({
				resource: cash,
				cost: Formula.variable(repeatables[CashRepeatableID.PrinterInk].amount)
					.pow(1.2)
					.pow_base(1.8)
					.mul(15),
				cumulativeCost: false
			})),
			display: {
				title: "Printer Ink",
				description: <>+20% cash production (multiplicative).</>,
				effectDisplay: () => <>&times;{format(effects[EffectID.PrinterInk].value)}</>
			}
		})),
		[CashRepeatableID.UselessWires]: createRepeatable(() => ({
			requirements: createCostRequirement(() => ({
				resource: cash,
				cost: Formula.variable(repeatables[CashRepeatableID.UselessWires].amount)
					.pow(1.2)
					.pow_base(2.5)
					.mul(35),
				cumulativeCost: false
			})),
			display: {
				title: "Useless Wires",
				description: () => (
					<>
						Boost cash gain based on itself (&times;
						{format(effects[EffectID.UselessWiresBase].value)}, multiplicative).
					</>
				),
				effectDisplay: () => <>&times;{format(effects[EffectID.UselessWires].value)}</>
			}
		})),
		[CashRepeatableID.UsefulWires]: createRepeatable(() => ({
			requirements: createCostRequirement(() => ({
				resource: cash,
				cost: Formula.variable(repeatables[CashRepeatableID.UsefulWires].amount)
					.pow(1.5)
					.pow_base(4)
					.mul(2.5e6),
				cumulativeCost: false
			})),
			display: {
				title: "Useful Wires",
				description: () => <>Add +1 to Power.</>,
				effectDisplay: () => <>+{formatWhole(effects[EffectID.UsefulWires].value)}</>
			},
			visibility: () =>
				creations[CreationID.CreationPower].bought.value
					? Visibility.Visible
					: Visibility.None
		}))
	};

	const upgrades: Record<CashUpgradeID, Upgrade> = {
		[CashUpgradeID.PylonShed]: createUpgrade(() => ({
			requirements: createCostRequirement(() => ({
				resource: cash,
				cost: 1000
			})),
			display: {
				title: "Printer Shed",
				description: (
					<>
						A proper place to put cash printers.
						<br />
						Allows buying more cash printers.
					</>
				)
			}
		}))
	};

	const pylons: Record<CashPylonID, Pylon> = {
		[CashPylonID.MoneyPrinter]: createPylon(() => ({
			requirements: createCostRequirement(() => ({
				cumulativeCost: false,
				cost: Formula.variable(pylons[CashPylonID.MoneyPrinter].amount)
					.pow(1.4)
					.pow_base(2)
					.mul(250),
				resource: cash
			})),
			display: {
				title: "Cash Printer",
				description: () => (
					<>
						Produces {format(cashGain.value)}/s, per printer. Multipliers to cash gain
						affect gain per printer rather than final gain.
					</>
				),
				effectDisplay: () => (
					<>{format(pylons[CashPylonID.MoneyPrinter].effectiveGain.value)}/s</>
				)
			},
			target: cash,
			initialAmount: 1, // Beats having base cost be 10 and some jank to allow the game to start.
			gain: cashGain
		}))
	};

	const powers: Partial<Record<MachinePowerID, Persistent<DecimalSource>>> = {
		[MachinePowerID.CashBooster]: persistent(0),
		[MachinePowerID.CashDiscount]: persistent(0)
	};

	const oomps = trackOOMPS(cash, pylons[CashPylonID.MoneyPrinter].effectiveGain);

	return {
		name,
		color,
		cash,
		bestCash,
		totalCash,
		oomps,
		display: () => <></>,
		treeNode,
		creations,
		repeatables,
		upgrades,
		pylons,
		powers
	};
});

export default layer;
