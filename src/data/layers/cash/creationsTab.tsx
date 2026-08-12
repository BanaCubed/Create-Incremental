import { createTab, Tab } from "features/tabs/tab";
import lCash from "./lCash";
import { renderRow } from "util/vue";
import { computed, ComputedRef } from "vue";

const creationsTab: Tab = createTab(() => ({
	display: () => (
		<div style={{ ["--layer-color"]: lCash.color as string } as any}>
			<h2>Creations</h2>
			<br />
			Descriptions and general UI are under heavy construction.
			<br />
			After pre-Rebirth is implemented I will make things more playable.
			<br />
			{renderRow(...Object.values(lCash.creations))}
		</div>
	)
}));

const unlocked: ComputedRef<boolean> = computed(() => true);

export default creationsTab;
