import lCash from "../../cash/lCash";
import { JSX } from "vue/jsx-runtime";
import { computed, ComputedRef, ref } from "vue";
import SidebarResource from "./SidebarResource.vue";
import { powerAmount, powerColor, powerSlots } from "data/layers/machine/power";
import { formatWhole } from "util/bignum";
import { CreationID } from "data/layers/enums";
import { Resource } from "features/resources/resource";

/** Interface of a resource display entry. */
export interface resourceDisplay {
	display: () => JSX.Element;
	unlocked: () => boolean;
}

/** Array of all the resource displays used ingame. */
export const resourceDisplays: resourceDisplay[] = [
	{
		// Cash Display
		display: () => (
			<>
				<SidebarResource
					color={lCash.color as string}
					resource={lCash.cash}
					oomps={lCash.oomps}
				/>
			</>
		),
		unlocked: () => lCash.creations[CreationID.CreationCash].bought.value
	},
	{
		// Power Display
		display: () => (
			<>
				<SidebarResource
					color={powerColor as string}
					resource={powerAmount as unknown as Resource}
					oomps={computed(() => formatWhole(powerSlots.value) + " Slots")}
				/>
			</>
		),
		unlocked: () => lCash.creations[CreationID.CreationPower].bought.value
	}
];

/**
 * Computed array of JSX elements that represents the components for the resource displays that the
 * player has access to. Locked resources are not included.
 */
export const renderedDisplays: ComputedRef<JSX.Element[]> = computed(() => {
	let outputs: JSX.Element[] = [];

	for (let i = 0; i < resourceDisplays.length; i++) {
		const display = resourceDisplays[i];
		if (display.unlocked()) {
			outputs.push(display.display());
		}
	}

	return outputs;
});
