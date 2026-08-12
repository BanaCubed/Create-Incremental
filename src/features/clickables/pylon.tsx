import {
	createVisibilityRequirement,
	displayRequirements,
	maxRequirementsMet,
	payRequirements,
	Requirements,
	requirementsMet
} from "game/requirements";
import { RepeatableOptions } from "./repeatable";
import Decimal, { DecimalSource, formatWhole } from "util/bignum";
import { computed, ComputedRef, MaybeRef, MaybeRefOrGetter, Ref, unref } from "vue";
import { MaybeGetter, processGetter } from "util/computed";
import { isJSXElement, render, Renderable, VueFeature, vueFeatureMixin } from "util/vue";
import { DefaultValue, persistent, Persistent, SkipPersistence } from "game/persistence";
import { createLazyProxy } from "util/proxies";
import Clickable from "./Clickable.vue";
import { findFeatures, Visibility } from "features/feature";
import { Unsubscribe } from "nanoevents";
import { globalBus } from "game/events";

/** A symbol used to identify {@link Pylon} features. */
export const PylonType = Symbol("Pylon");

/** An object that configures a {@link Pylon}. */
export interface PylonOptions extends RepeatableOptions {
	/** The amount of the target to produce each second. */
	gain?: MaybeRefOrGetter<DecimalSource>;
	/** The target value to increase. */
	target: Ref<DecimalSource>;
	/** The initial produced amount this pylon has on a new save / after reset. */
	initialProduced?: DecimalSource;
}

/**
 * An object that represents a feature with multiple "levels" with scaling requirements, that also
 * passively produces a currency or other pylon.
 */
export interface Pylon extends VueFeature {
	/** The requirement(s) to increase this pylon. */
	requirements: Requirements;
	/** The maximum amount obtainable for this pylon. */
	limit: MaybeRef<DecimalSource>;
	/** The initial amount this pylon has on a new save / after reset. */
	initialAmount?: DecimalSource;
	/** The initial produced amount this pylon has on a new save / after reset. */
	initialProduced?: DecimalSource;
	/** The display to use for this pylon. */
	display?: MaybeGetter<Renderable>;
	/** Whether or not the pylon may be clicked. */
	canClick: Ref<boolean>;
	/** A function that is called when the pylon is clicked. */
	onClick: (event?: MouseEvent | TouchEvent) => void;
	/** The current amount this pylon has. */
	amount: Persistent<DecimalSource>;
	/** The current produced amount this pylon has. */
	produced: Persistent<DecimalSource>;
	/** The effective amount of this pylon, combined both bought and produced. */
	effectiveAmount: ComputedRef<DecimalSource>;
	/** Whether or not this pylon's amount is at it's limit. */
	maxed: Ref<boolean>;
	/** How much amount can be increased by, or 1 if unclickable. * */
	amountToIncrease: Ref<DecimalSource>;
	/** The amount of the target to produce each second, per pylon. */
	gain: MaybeRef<DecimalSource>;
	/** The actual amount of the target produced per second, accounting for pylon amount. */
	effectiveGain: ComputedRef<DecimalSource>;
	/** The target value to increase. */
	target: Ref<DecimalSource>;
	/** A symbol that helps identify features of the same type. */
	type: typeof PylonType;
}

/**
 * Lazily creates a pylon with the given options.
 *
 * @param optionsFunc Pylon options.
 */
export function createPylon<T extends PylonOptions>(optionsFunc: () => T) {
	const amount = persistent<DecimalSource>(0);
	const produced = persistent<DecimalSource>(0);
	return createLazyProxy(() => {
		const options = optionsFunc();
		const {
			requirements: _requirements,
			display: _display,
			gain,
			limit,
			onClick,
			initialAmount,
			initialProduced,
			...props
		} = options;

		if (options.classes == null) {
			options.classes = computed(() => ({ bought: unref(pylon.maxed) }));
		} else {
			const classes = processGetter(options.classes);
			options.classes = computed(() => ({
				...unref(classes),
				bought: unref(pylon.maxed)
			}));
		}
		const vueFeature = vueFeatureMixin("pylon", options, () => (
			<Clickable
				canClick={pylon.canClick}
				onClick={pylon.onClick}
				onHold={pylon.onClick}
				display={pylon.display}
			/>
		));

		const limitRequirement = {
			requirementMet: computed(
				(): DecimalSource => Decimal.sub(unref(pylon.limit), unref(amount))
			),
			requiresPay: false,
			visibility: Visibility.None,
			canMaximize: true,
			[SkipPersistence]: true
		} satisfies Requirements;
		const requirements: Requirements = [
			...(Array.isArray(_requirements) ? _requirements : [_requirements]),
			limitRequirement
		];
		if (vueFeature.visibility != null) {
			requirements.push(createVisibilityRequirement(vueFeature.visibility));
		}

		let display;
		if (typeof _display === "object" && !isJSXElement(_display)) {
			const { title, description, effectDisplay, showAmount } = _display;

			display = () => (
				<span>
					{title == null ? null : (
						<div>
							{render(title, el => (
								<h3>{el}</h3>
							))}
						</div>
					)}
					{render(description)}
					{showAmount === false ? null : (
						<div>
							<br />
							<>Amount: {formatWhole(unref(amount))}</>
							{Decimal.isFinite(unref(pylon.limit)) ? (
								<> / {formatWhole(unref(pylon.limit))}</>
							) : undefined}
						</div>
					)}
					{effectDisplay == null ? null : (
						<div>
							<br />
							Currently: {render(effectDisplay)}
						</div>
					)}
					{unref(pylon.maxed) ? null : (
						<div>
							<br />
							{displayRequirements(requirements, unref(pylon.amountToIncrease))}
						</div>
					)}
				</span>
			);
		} else if (_display != null) {
			display = _display;
		}

		amount[DefaultValue] = initialAmount ?? 0;
		produced[DefaultValue] = initialProduced ?? 0;

		const pylon: Pylon = {
			type: PylonType,
			...(props as Omit<typeof props, keyof VueFeature | keyof RepeatableOptions>),
			...vueFeature,
			amount,
			produced,
			effectiveAmount: computed(() => Decimal.add(amount.value, produced.value)),
			effectiveGain: computed(() =>
				Decimal.mul(pylon.effectiveAmount.value, unref(pylon.gain))
			),
			requirements,
			initialAmount,
			initialProduced,
			limit: processGetter(limit) ?? Decimal.dInf,
			gain: processGetter(gain) ?? Decimal.dOne,
			classes: computed(() => {
				const currClasses = unref(vueFeature.classes) || {};
				if (unref(pylon.maxed)) {
					currClasses.bought = true;
				}
				return currClasses;
			}),
			maxed: computed((): boolean => Decimal.gte(unref(amount), unref(pylon.limit))),
			canClick: computed(() => requirementsMet(requirements)),
			amountToIncrease: computed(() => Decimal.clampMin(maxRequirementsMet(requirements), 1)),
			onClick(event?: MouseEvent | TouchEvent) {
				if (!unref(pylon.canClick)) {
					return;
				}
				const purchaseAmount = unref(pylon.amountToIncrease) ?? 1;
				payRequirements(requirements, purchaseAmount);
				amount.value = Decimal.add(unref(amount), purchaseAmount);
				onClick?.(event);
			},
			display
		} satisfies Pylon;

		return pylon;
	});
}

const listeners: Record<string, Unsubscribe | undefined> = {};
globalBus.on("addLayer", layer => {
	const pylons: Pylon[] = findFeatures(layer, PylonType) as Pylon[];
	listeners[layer.id] = layer.on("postUpdate", diff => {
		pylons.forEach(pylon => {
			pylon.target.value = Decimal.add(
				pylon.target.value,
				Decimal.mul(diff, unref(pylon.effectiveGain))
			);
		});
	});
});
globalBus.on("removeLayer", layer => {
	listeners[layer.id]?.();
	listeners[layer.id] = undefined;
});
