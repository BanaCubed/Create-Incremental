import { createTab, Tab } from "features/tabs/tab";
import lCash from "./lCash";
import { render, renderRow } from "util/vue";
import { ComputedRef, computed } from "vue";
import { CashRepeatableID, CashUpgradeID, CreationID } from "../enums";
import Spacer from "components/layout/Spacer.vue";

const machineTab: Tab = createTab(() => ({
	display: () => (
		<div style={{ ["--layer-color"]: lCash.color as string } as any}>
			<h2>The Machine</h2>
			{!unlocked.value ? (
				"\nLocked"
			) : (
				<>
					<Spacer />
					{render(lCash.upgrades[CashUpgradeID.PylonShed])}
					<Spacer />
					<h3>Printer Upgrades</h3>
					{renderRow(
						lCash.repeatables[CashRepeatableID.PrinterOverclock],
						lCash.repeatables[CashRepeatableID.PrinterInk],
						lCash.repeatables[CashRepeatableID.UselessWires]
					)}
					{!lCash.upgrades[CashUpgradeID.PylonShed].bought.value ? null : (
						<>
							<Spacer />
							<h3>Cash Printers</h3>
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
