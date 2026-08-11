import lCash from "../../cash/lCash";
import { JSX } from "vue/jsx-runtime";
import { computed, ComputedRef } from "vue";
import SidebarResource from "./SidebarResource.vue";

/**
 * Interface of a resource display entry.
 */
export interface resourceDisplay {
	display: () => JSX.Element;
	unlocked: () => boolean;
}

/**
 * Array of all the resource displays used ingame.
 */
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
		unlocked() {
			return true;
		}
	}
];

/**
 * Computed array of JSX elements that represents the components for the
 * resource displays that the player has access to. Locked resources are not
 * included.
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
