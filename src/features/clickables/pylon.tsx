import { Requirements } from "game/requirements";
import { RepeatableOptions } from "./repeatable";
import { DecimalSource } from "util/bignum";
import { MaybeRef, Ref } from "vue";
import { MaybeGetter } from "util/computed";
import { Renderable, VueFeature } from "util/vue";
import { Persistent } from "game/persistence";

/** A symbol used to identify {@link Pylon} features. */
export const PylonType = Symbol("Pylon");

/** An object that configures a {@link Pylon}. */
export interface PylonOptions extends RepeatableOptions {}

/**
 * An object that represents a feature with multiple "levels" with scaling requirements, that also
 * passively produces a currency or other pylon.
 */
export interface Pylon extends VueFeature {
	/** The requirement(s) to increase this repeatable. */
	requirements: Requirements;
	/** The maximum amount obtainable for this repeatable. */
	limit: MaybeRef<DecimalSource>;
	/** The initial amount this repeatable has on a new save / after reset. */
	initialAmount?: DecimalSource;
	/** The display to use for this repeatable. */
	display?: MaybeGetter<Renderable>;
	/** Whether or not the repeatable may be clicked. */
	canClick: Ref<boolean>;
	/** A function that is called when the repeatable is clicked. */
	onClick: (event?: MouseEvent | TouchEvent) => void;
	/** The current amount this repeatable has. */
	amount: Persistent<DecimalSource>;
	/** Whether or not this repeatable's amount is at it's limit. */
	maxed: Ref<boolean>;
	/** How much amount can be increased by, or 1 if unclickable. * */
	amountToIncrease: Ref<DecimalSource>;
	/** A symbol that helps identify features of the same type. */
	type: typeof PylonType;
}
