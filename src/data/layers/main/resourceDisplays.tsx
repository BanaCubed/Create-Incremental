import lCash from "../cash/lCash";
import { JSX } from "vue/jsx-runtime";
import MainDisplay from "features/resources/MainDisplay.vue";

export const resourceDisplays: {
	display: () => JSX.Element;
	color: string;
	unlocked: () => boolean;
}[] = [
	{
		// Cash Display
		display: () => (
			<>
				<MainDisplay resource={lCash.cash} color={lCash.color as string} />
			</>
		),
		color: lCash.color as string,
		unlocked() {
			return true;
		}
	}
];
