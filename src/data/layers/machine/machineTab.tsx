import { createTab, Tab } from "features/tabs/tab";
import lCash from "../cash/lCash";
import { renderRow } from "util/vue";

const machineTab: Tab = createTab(() => ({
	display: () => (
		<div style={{ ["--layer-color"]: lCash.color as string } as any}>
			<h2>The Machine</h2>
			{renderRow(...Object.values(lCash.upgrades))}
		</div>
	)
}));

export default machineTab;
