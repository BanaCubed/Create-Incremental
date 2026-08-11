import {
	createAdditiveModifier,
	createMultiplicativeModifier,
	createSequentialModifier
} from "game/modifiers";
import Decimal, { DecimalSource } from "util/bignum";
import { computed } from "vue";
import lCash from "./lCash";
import { CreationID } from "./enums";

/**
 * Computed Decimal value of the cash gain per second the player should get.
 *
 * Default value is 0,
 * then added to all additive modifiers,
 * then multiplied by all multiplicative modifiers.
 *
 * Exponential modifiers will be implemented once relevant.
 */
export const cashGain = computed<Decimal>(() => {
	let gain: DecimalSource = Decimal.dZero;
	gain = cashModifiersAdditive.apply(gain);
	gain = cashModifiersMultiplicative.apply(gain);
	// Convert from DecimalSource to Decimal by adding 0.
	// If this somehow changes the value god save us all.
	return Decimal.add(gain, 0);
});

/**
 * Additive modifiers affecting cash gain.
 * Modifiers are split up into multiple variables to enforce order of operations,
 * and for those cool collapsible modifiers views eventually.
 */
export const cashModifiersAdditive = createSequentialModifier(() => [
	createAdditiveModifier(() => ({
		addend: 1,
		enabled: lCash.upgrades[CreationID.CreationCash].bought
	}))
]);

/**
 * Multiplicative modifiers affecting cash gain.
 * Modifiers are split up into multiple variables to enforce order of operations,
 * and for those cool collapsible modifiers views eventually.
 */
export const cashModifiersMultiplicative = createSequentialModifier(() => [
	createMultiplicativeModifier(() => ({
		multiplier: 1,
		enabled: false
	}))
]);
