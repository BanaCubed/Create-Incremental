import {
	createAdditiveModifier,
	createMultiplicativeModifier,
	createSequentialModifier
} from "game/modifiers";
import Decimal, { DecimalSource } from "util/bignum";
import { computed } from "vue";
import lCash from "./lCash";
import { CreationID } from "../enums";
import effects, { EffectID } from "../effects";

/**
 * Computed Decimal value of the cash gain per second the player should get, per cash printer owned.
 *
 * Default value is 0, then added to all additive modifiers, then multiplied by all multiplicative
 * modifiers.
 *
 * Exponential modifiers will be implemented once relevant.
 *
 * @see {@link cashModifiersAdditive}
 * @see {@link cashModifiersMultiplicative}
 */
export const cashGain = computed<Decimal>(() => {
	// This *could* just be `gain: Decimal` but the world might collapse idk.
	let gain: DecimalSource = Decimal.dZero;
	gain = cashModifiersAdditive.apply(gain);
	gain = cashModifiersMultiplicative.apply(gain);
	return gain as Decimal;
});

/**
 * Additive modifiers affecting cash gain. Modifiers are split up into multiple variables to enforce
 * order of operations, and for those cool collapsible modifiers views eventually.
 */
export const cashModifiersAdditive = createSequentialModifier(() => [
	createAdditiveModifier(() => ({
		addend: 1,
		enabled: lCash.creations[CreationID.CreationCash].bought
	}))
]);

/**
 * Multiplicative modifiers affecting cash gain. Modifiers are split up into multiple variables to
 * enforce order of operations, and for those cool collapsible modifiers views eventually.
 */
export const cashModifiersMultiplicative = createSequentialModifier(() => [
	createMultiplicativeModifier(() => ({
		multiplier: effects[EffectID.PrinterOverclock],
		enabled: true
	})),
	createMultiplicativeModifier(() => ({
		multiplier: effects[EffectID.PrinterInk],
		enabled: true
	})),
	createMultiplicativeModifier(() => ({
		multiplier: effects[EffectID.UselessWires],
		enabled: true
	}))
]);
