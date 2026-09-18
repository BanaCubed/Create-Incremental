// These are order-sensitive, so changing orders will fuck up save data.
// When removing things remember to offset the values.

/** Name-indexed enum of all creation IDs. */
export enum CreationID {
	CreationCash,
	CreationMachine,
	CreationPower,
	CreationRebirth
}

/** Name-indexed enum of all cash repeatable IDs. */
export enum CashRepeatableID {
	PrinterOverclock,
	PrinterInk,
	UselessWires,
	UsefulWires
}

/** Name-indexed enum of all cash upgrade IDs. */
export enum CashUpgradeID {
	PylonShed
}

/** Name-indexed enum of all cash pylon IDs. */
export enum CashPylonID {
	MoneyPrinter
}

/** Name-indexed enum of all cash power IDs. */
export enum MachinePowerID {
	CashDiscount,
	CashBooster
}
