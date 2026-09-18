import { computed, ComputedRef } from "vue";
import Decimal, { DecimalSource } from "util/bignum";
import lCash from "./cash/lCash";
import { CashRepeatableID } from "./enums";
import { powerAmount } from "./machine/power";

/**
 * Name-indexed enum of all effect IDs.
 *
 * @see {@link effects}
 */
export enum EffectID {
	/** In reference to {@link CashRepeatableID.PrinterOverclock}. */
	PrinterOverclock,
	/** In reference to {@link CashRepeatableID.PrinterInk}. */
	PrinterInk,
	/** In reference to {@link CashRepeatableID.UselessWires}. */
	UselessWiresBase,
	/** In reference to {@link CashRepeatableID.UselessWires}. */
	UselessWires,
	/** In reference to {@link CashRepeatableID.UsefulWires}. */
	UsefulWires,

	/** In reference to {@link CashPowerID.CashDiscount}. */
	CashDiscount,
	/** In reference to {@link CashPowerID.CashBooster}. */
	CashBooster
}

/**
 * Globals object containing all effects within the game. Basically just a long list of
 * `ComputedRef`s for every dynamic number based on other values.
 */
const effects: Record<EffectID, ComputedRef<DecimalSource>> = {
	// CASH REATABLES
	[EffectID.PrinterOverclock]: computed(() =>
		Decimal.add(
			1,
			Decimal.mul(0.2, lCash.repeatables[CashRepeatableID.PrinterOverclock].amount.value)
		)
	),
	[EffectID.PrinterInk]: computed(() =>
		Decimal.pow(1.2, lCash.repeatables[CashRepeatableID.PrinterInk].amount.value)
	),
	[EffectID.UselessWiresBase]: computed(() =>
		Decimal.log(Decimal.max(lCash.cash.value, 1), 10).div(6).add(1)
	),
	[EffectID.UselessWires]: computed(() =>
		Decimal.pow(
			effects[EffectID.UselessWiresBase].value,
			lCash.repeatables[CashRepeatableID.UselessWires].amount.value
		)
	),
	[EffectID.UsefulWires]: computed(() =>
		Decimal.mul(1, lCash.repeatables[CashRepeatableID.UsefulWires].amount.value)
	),

	// MACHINE POWERS
	[EffectID.CashDiscount]: computed(() =>
		Decimal.pow(1.4, Decimal.pow(Decimal.max(powerAmount.value, 1), 0.5))
	),
	[EffectID.CashBooster]: computed(() =>
		Decimal.pow(1.25, Decimal.pow(Decimal.max(powerAmount.value, 1), 0.5))
	)
};

export default effects;
