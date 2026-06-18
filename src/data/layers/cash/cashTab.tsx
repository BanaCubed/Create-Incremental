import { createTab, Tab } from "features/tabs/tab";
import Resource from "features/resources/Resource.vue";
import lCash from "./lCash";
import Decimal from "util/bignum";
import { cashGain } from "./resourceGain";
import Spacer from "components/layout/Spacer.vue";
import { renderRow } from "util/vue";

export const cashTab: Tab = createTab(() => ({
	display: () => (
		<div style={{ ["--layer-color"]: lCash.color as string } as any}>
			You have <Resource resource={lCash.cash} color={lCash.color as string} /> Cash
			{Decimal.gt(cashGain.value, 0) ? (
				<>
					<br />
					{lCash.oomps.value}
				</>
			) : null}
			<Spacer />
			<h2>Creations</h2>
			{renderRow(...Object.values(lCash.upgrades))}
		</div>
	)
}));
