// These are order-sensitive, so changing orders will fuck up save data.

/** Name-indexed enum of all creation IDs. */
export enum CreationID {
	CreationCash,
	CreationMachine
}

/** Name-indexed enum of all cash repeatable IDs. */
export enum CashRepeatableID {
	PrinterOverclock,
	PrinterInk,
	UselessWires
}

/** Name-indexed enum of all cash upgrade IDs. */
export enum CashUpgradeID {
	PylonShed
}

/** Name-indexed enum of all cash pylon IDs. */
export enum CashPylonID {
	MoneyPrinter
}
