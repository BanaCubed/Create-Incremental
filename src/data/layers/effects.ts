import { computed, ComputedRef } from "vue";
import Decimal, { DecimalSource } from "util/bignum";
import lCash from "./cash/lCash";
import { CashRepeatableID } from "./enums";

export enum EffectID {
	PrinterOverclock,
	PrinterInk,
	UselessWiresBase,
	UselessWires
}

/**
 * Globals object containing all effects within the game. Basically just a long list of
 * `ComputedRef`s for every dynamic number based on other values.
 */
const effects: Record<EffectID, ComputedRef<DecimalSource>> = {
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
	)
};

export default effects;
