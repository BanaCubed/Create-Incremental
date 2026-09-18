import { createTab, Tab } from "features/tabs/tab";
import lCash from "../cash/lCash";
import { renderRow } from "util/vue";
import { ComputedRef, computed } from "vue";
import { CashPylonID, CashRepeatableID, CashUpgradeID, CreationID } from "../enums";
import Spacer from "components/layout/Spacer.vue";
import { powers, powerSlots, powerSlotThresholds, usedPowerSlots } from "./power";
import Decimal, { formatWhole } from "util/bignum";

const machineTab: Tab = createTab(() => ({
	display: () => (
		<div style={{ ["--layer-color"]: lCash.color as string } as any}>
			<h2>The Machine</h2>
			{!unlocked.value ? (
				" is Locked"
			) : (
				<>
					<Spacer />
					{renderRow(lCash.upgrades[CashUpgradeID.PylonShed])}
					<Spacer />
					<h3>Printer Upgrades</h3>
					{renderRow(
						lCash.repeatables[CashRepeatableID.PrinterOverclock],
						lCash.repeatables[CashRepeatableID.PrinterInk],
						lCash.repeatables[CashRepeatableID.UselessWires],
						lCash.repeatables[CashRepeatableID.UsefulWires]
					)}
					{!lCash.upgrades[CashUpgradeID.PylonShed].bought.value ? null : (
						<>
							<Spacer />
							<h3>Cash Printers</h3>
							{renderRow(lCash.pylons[CashPylonID.MoneyPrinter])}
						</>
					)}
					{!lCash.creations[CreationID.CreationPower].bought.value ? null : (
						<>
							<Spacer />
							<h3>Power</h3>
							<br />
							These can be toggled on and off at will.
							<br />
							Each uses up a slot [{formatWhole(usedPowerSlots.value)}/
							{formatWhole(powerSlots.value)}], next at{" "}
							{formatWhole(powerSlotThresholds[powerSlots.value] ?? Decimal.dInf)}{" "}
							Power. <br />
							Effects are boosted based on current Power. Used slots do not affect
							this bonus.
							<br />
							{renderRow(...Object.values(powers))}
						</>
					)}
				</>
			)}
		</div>
	)
}));

const unlocked: ComputedRef<boolean> = computed(
	() => lCash.creations[CreationID.CreationMachine].bought.value
);

export default machineTab;
