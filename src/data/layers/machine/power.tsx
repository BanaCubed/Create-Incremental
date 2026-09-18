import { createAdditiveModifier, createSequentialModifier } from "game/modifiers";
import Decimal, { DecimalSource, format } from "util/bignum";
import { computed, ComputedRef } from "vue";
import lCash from "../cash/lCash";
import { CashUpgradeID, CreationID, MachinePowerID } from "../enums";
import Formula from "game/formulas/formulas";
import { InvertibleFormula } from "game/formulas/types";
import { Clickable, createClickable } from "features/clickables/clickable";
import effects, { EffectID } from "../effects";
import { Resource } from "features/resources/resource";

/** The color associated with power. */
export const powerColor = "#d6c611";

/**
 * Computed Decimal value of power the player should have.
 *
 * Default value is 0, then added to all additive modifiers.
 *
 * Multiplicative and exponential modifiers will be implemented once relevant.
 *
 * @see {@link powerSlotThresholds}
 * @see {@link powerModifiersAdditive}
 */
export const powerAmount: Resource<DecimalSource> = computed<Decimal>(() => {
	let amount: DecimalSource = Decimal.dZero;
	amount = powerModifiersAdditive.apply(amount);
	return amount as Decimal;
}) as unknown as Resource;

powerAmount.displayName = "Power";
powerAmount.precision = 2;

/**
 * Additive modifiers affecting power. Modifiers are split up into multiple variables to enforce
 * order of operations, and for those cool collapsible modifiers views eventually.
 */
export const powerModifiersAdditive = createSequentialModifier(() => [
	createAdditiveModifier(() => ({
		addend: effects[EffectID.UsefulWires],
		enabled: true
	}))
]);

/**
 * Array of the thresholds for gaining extra power slots. Might change in future to automagically
 * add Decimal.dInf
 */
export const powerSlotThresholds: DecimalSource[] = [1, 5, 100];

/**
 * ComputedRef of the current numer of power slots the player has access to.
 *
 * Important to note that this is a number rather than DecimalSource. This is because I'm not going
 * to make an array with more than 179 uncentillion entries.
 */
export const powerSlots: ComputedRef<number> = computed(() => {
	for (let i = 0; i < powerSlotThresholds.length; i++) {
		const threshold = powerSlotThresholds[i];
		if (Decimal.lt(powerAmount.value, threshold)) {
			return i;
		}
	}
	return powerSlotThresholds.length;
});

/**
 * ComputedRef of the current number of power slots the player is using.
 *
 * Important to note that unlike {@link powerSlots}, this is a DecimalSource. This is because I'm
 * lazy as fuck.
 */
export const usedPowerSlots: ComputedRef<DecimalSource> = computed(() => {
	let used = Decimal.dZero;
	for (let i = 0; i < Object.values(lCash.powers).length; i++) {
		const persist = Object.values(lCash.powers)[i];
		used = Decimal.add(used, persist.value);
	}
	return used;
});

/** Record of all the powers in the machine. */
export const powers: Record<MachinePowerID, Clickable> = {
	[MachinePowerID.CashDiscount]: createClickable(() => ({
		display: () => (
			<>
				Cash discount, divides the cash cost of Machine purchases by /
				{format(effects[EffectID.CashDiscount].value)}.
			</>
		)
	})),
	[MachinePowerID.CashBooster]: createClickable(() => ({
		display: () => (
			<>
				Cash booster, multiplies production of cash printers by &times;
				{format(effects[EffectID.CashBooster].value)}.
			</>
		)
	}))
};
