addLayer("U", {
    name: "upgrades", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "$", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        softcapPower: new Decimal(0)
    }},
    color: "#157307",
    tooltip() {
        if(inChallenge('SR', 31)) return coolDynamicFormat(player.SR.tax, 2) + " Tax";
        else return coolDynamicFormat(player.points, 2) + " $"
    },
    deactivated() {
        return inChallenge('SR', 22)
    },
    resource: "$",
    type: "none",
    row: 0, // Row the layer is in on the tree (0 is the first row)
    tabFormat: {
        "Upgrades": {
            content: [
                "main-display",
                "buyables",
                "upgrades",
            ],
        },
        "The Machine": {
            content: [
                "main-display",
                ["display-text", function() {
                    if(hasUpgrade('U', 34) || hasUpgrade('R', 21)) return "The Machine can provide boosts to both $ and RP, but be aware that you can't change your selection once you make it.<br>Bonus is reset on Rebirth."; else return "The Machine is currently disabled because you don't have $ upgrade 12"
                }],
                "clickables",
                ["display-text", function() {
                    if(hasAchievement('A', 33)) return "Your bonuses to The Machine are multiplying $ and RP gain by " + coolDynamicFormat(machineBonuses(), 2)
                }],
            ],
            unlocked() {
                return hasAchievement('A', 31)
            }
        }
    },
    upgrades: {
        11: {
            title: "Economic Inflation",
            description()  {
                if(!hasMilestone('P', 8)) return "Start generating 1$ every second"
                if(hasMilestone('P', 8)) return "Start generating 100$ every second"
            },
            cost: new Decimal(0),
            currencyDisplayName: "$",
            currencyInternalName: "points",
        },
        12: {
            title: "Money Printer",
            description()  {
                if(!hasMilestone('P', 8)) return "Quadruple $ gain"
                if(hasMilestone('P', 8)) return "Quintuple $ gain"
            },
            cost: new Decimal(10),
            currencyDisplayName: "$",
            currencyInternalName: "points",
        },
        13: {
            title: "Superinflation",
            description: "Multiply $ gain based on $",
            tooltip()  {
                if(!hasMilestone('P', 8)) return "log5($ + 5)"
                if(hasMilestone('P', 8)) return "log4.5($ + 4.5)"
            },
            cost: new Decimal(50),
            currencyDisplayName: "$",
            currencyInternalName: "points",
            effectDisplay() {
                if(!hasMilestone('P', 8)) {
                    if (hasUpgrade('U', 23) === false) return 'x' + coolDynamicFormat(player.points.add(5).max(1).log(5), 2)
                    if (hasUpgrade('U', 23) === true) return 'x' + coolDynamicFormat(player.points.add(3).max(1).log(3), 2)
                }
                if(hasMilestone('P', 8)) {
                    if (hasUpgrade('U', 23) === false) return 'x' + coolDynamicFormat(player.points.add(4.5).max(1).log(4.5), 2)
                    if (hasUpgrade('U', 23) === true) return 'x' + coolDynamicFormat(player.points.add(2.5).max(1).log(2.5), 2)
                }
            },
        },
        14: {
            title: "Another Money Printer",
            description()  {
                if(!hasMilestone('P', 8)) return "Double $ gain"
                if(hasMilestone('P', 8)) return "Triple $ gain"
            },
            cost: new Decimal(200),
            currencyDisplayName: "$",
            currencyInternalName: "points",
        },
        21: {
            title: "Hyperinflation",
            description()  {
                if(!hasMilestone('P', 8)) return "Raise $ gain by ^1.25"
                if(hasMilestone('P', 8)) return "Raise $ gain by ^1.3"
            },
            cost: new Decimal(500),
            currencyDisplayName: "$",
            currencyInternalName: "points",
            tooltip: "All exponents are applied after all multipliers in the same layer",
        },
        22: {
            title: "Ultrainflation",
            description: "Multiply $ gain based on $ again",
            tooltip()  {
                if(!hasMilestone('P', 8)) return "sqrt(log8($^1.5 + 8))"
                if(hasMilestone('P', 8)) return "sqrt(log7($^1.55 + 7))"
            },
            cost: new Decimal(2000),
            currencyDisplayName: "$",
            currencyInternalName: "points",
            effectDisplay() {
                if(!hasMilestone('P', 8)) return 'x' + coolDynamicFormat(player.points.pow(1.5).add(8).max(1).log(8).pow(0.5), 2)
                if(hasMilestone('P', 8)) return 'x' + coolDynamicFormat(player.points.pow(1.55).add(7).max(1).log(7).pow(0.5), 2)
            },
        },
        23: {
            title: "Super-Superinflation",
            description: "Improve the above upgrades effect",
            tooltip()  {
                if(!hasMilestone('P', 8)) return "log5 -> log3"
                if(hasMilestone('P', 8)) return "log4.5 -> log2.5"
            },
            cost: new Decimal(15000),
            currencyDisplayName: "$",
            currencyInternalName: "points",
        },
        24: {
            title: "Yet Another Money Printer",
            description()  {
                if(!hasMilestone('P', 8)) return "Multiply $ gain by 1.5"
                if(hasMilestone('P', 8)) return "Double $ gain"
            },
            cost: new Decimal(30000),
            currencyDisplayName: "$",
            currencyInternalName: "points",
        },
        31: {
            title: "Gigainflation",
            description: "Multiply $ gain based on $ yet again",
            tooltip()  {
                if(!hasMilestone('P', 8)) return "sqrt(log($ + 10))"
                if(hasMilestone('P', 8)) return "sqrt(log8($ + 8))"
            },
            cost: new Decimal(5000000),
            currencyDisplayName: "$",
            currencyInternalName: "points",
            unlocked() {
                return hasUpgrade('R', 13)
            },
            effectDisplay() {
                if(!hasMilestone('P', 8)) return 'x' + coolDynamicFormat(player.points.add(10).max(1).log(10).pow(0.5), 2)
                if(hasMilestone('P', 8)) return 'x' + coolDynamicFormat(player.points.add(8).max(1).log(8).pow(0.5), 2)
            },
        },
        32: {
            title: "Certainly a concept",
            description: "Reduce RP gain scaling",
            tooltip()  {
                if(!hasMilestone('P', 8)) return "^0.5 -> ^0.7"
                if(hasMilestone('P', 8)) return "^0.5 -> ^0.8"
            },
            cost: new Decimal(35000000),
            currencyDisplayName: "$",
            currencyInternalName: "points",
            unlocked() {
                return hasUpgrade('R', 13)
            },
        },
        33: {
            title: "Blessing from the gods",
            description: "Increase RP's effect",
            tooltip()  {
                if(!hasMilestone('P', 8)) return "^0.6 -> ^0.7"
                if(hasMilestone('P', 8)) return "^0.6 -> ^0.8"
            },
            cost: new Decimal(250000000),
            currencyDisplayName: "$",
            currencyInternalName: "points",
            unlocked() {
                return hasUpgrade('R', 13)
            },
        },
        34: {
            title: "THE MACHINE",
            description() {
                if(!hasMilestone('P', 8)) return "Unlock The Machine"
                if(hasMilestone('P', 8)) return "Unlock The Machine<br>Boosts to the machine are raised ^1.25"
            },
            cost: new Decimal("1e9"),
            currencyDisplayName: "$",
            currencyInternalName: "points",
            unlocked() {
                return hasUpgrade('R', 13)
            },
        },
        41: {
            title: "Payrise",
            description() {
                if(!hasMilestone('P', 8)) return "Multiply $ gain by 10"
                if(hasMilestone('P', 8)) return "Multiply $ gain by 1,000"
            },
            cost: new Decimal("1e13"),
            currencyDisplayName: "$",
            currencyInternalName: "points",
            unlocked() {
                return hasUpgrade('R', 24)
            },
        },
        42: {
            title: "Relativity",
            description: "Boost RP's effect again",
            tooltip()  {
                if(!hasMilestone('P', 8)) return "^0.7 -> ^0.8"
                if(hasMilestone('P', 8)) return "^0.8 -> ^1"
            },
            cost: new Decimal("5e14"),
            currencyDisplayName: "$",
            currencyInternalName: "points",
            unlocked() {
                return hasUpgrade('R', 24)
            },
        },
        43: {
            title: "Synergism",
            description: "RP and $ boost each other",
            tooltip()  {
                if(!hasMilestone('P', 8)) return "RP*log(log($ + 10) + 10)<br>$*log(RP + 10)"
                if(hasMilestone('P', 8)) return "RP*log8(log9($ + 9) + 8)<br>$*log8(RP + 8)"
            },
            cost: new Decimal("3e15"),
            currencyDisplayName: "$",
            currencyInternalName: "points",
            unlocked() {
                return hasUpgrade('R', 24)
            },
            effectDisplay() {
                if(!hasMilestone('P', 8)) return 'RP x' + coolDynamicFormat(player.points.add(10).max(1).log(10).add(10).max(1).log(10), 2)
                + '<br>$ x' + coolDynamicFormat(player.R.points.add(10).max(1).log(10), 2)
                if(hasMilestone('P', 8)) return 'RP x' + coolDynamicFormat(player.points.add(9).max(1).log(9).add(8).max(1).log(8), 2)
                + '<br>$ x' + coolDynamicFormat(player.R.points.add(8).max(1).log(8), 2)
            },
        },
        44: {
            title: "Ankh",
            description: "Boost the second RP buyables effect slightly",
            cost: new Decimal("1e25"),
            currencyDisplayName: "$",
            currencyInternalName: "points",
            tooltip() {
                if(!hasMilestone('P', 8)) return "+0.05 to base"
                if(hasMilestone('P', 8)) return "+0.15 to base"
            },
            unlocked() {
                return hasUpgrade('R', 24)
            },
        },
        51: {
            title: "Tesla Coils",
            description: "Multiply $ gain by Power",
            cost: new Decimal("1e80"),
            currencyDisplayName: "$",
            currencyInternalName: "points",
            unlocked() {
                return hasMilestone('P', 6)
            },
            effectDisplay() { return "x" + coolDynamicFormat(player.P.points, 2)}
        },
        52: {
            title: "Heavenly Batteries",
            description: "Multiply RP gain based on Power",
            cost: new Decimal("1e92"),
            currencyDisplayName: "$",
            currencyInternalName: "points",
            tooltip: "log3(Power + 3)",
            unlocked() {
                return hasMilestone('P', 6)
            },
            effectDisplay() { return "x" + coolDynamicFormat(player.P.points.add(3).max(1).log(3), 2)}
        },
        53: {
            title: "Maybe too much inflation",
            description: "Unlock another challenge<br>The challenge is permanently unlocked after buying this upgrade",
            cost: new Decimal("1e95"),
            currencyDisplayName: "$",
            currencyInternalName: "points",
            unlocked() {
                return hasMilestone('P', 6)
            },
        },
        54: {
            title: "Powerup",
            description: "Double efficiency of the first three Power Pylons",
            cost: new Decimal("1e100"),
            currencyDisplayName: "$",
            currencyInternalName: "points",
            unlocked() {
                return hasMilestone('P', 6)
            },
        },
    },
    layerShown(){return true},
    clickables: {
        11: {
            title: "Money Mode",
            display() {
                if(!getClickableState(this.layer, this.id)) return "Quadruples $ gain<br>Doubles RP gain"; else return "Quadruples $ gain<br>Doubles RP gain<br>ACTIVE"
            },
            canClick() {
                if(hasUpgrade('R', 32)) return true;
                if(!hasUpgrade('R', 31)) {
                    if(!getClickableState(this.layer, 12) && !getClickableState(this.layer, 13)) return true; else return false
                }
                if(hasUpgrade('R', 31)) {
                    if(!getClickableState(this.layer, 12) || !getClickableState(this.layer, 13)) return true; else return false
                }
            },
            onClick() {
                setClickableState(this.layer, this.id, true)
            },
        },
        12: {
            title: "Neutral Mode",
            display() {
                if(!getClickableState(this.layer, this.id)) return "Triples $ gain<br>Triples RP gain"; else return "Triples $ gain<br>Triples RP gain<br>ACTIVE"
            },
            canClick() {
                if(hasUpgrade('R', 32)) return true;
                if(!hasUpgrade('R', 31)) {
                    if(!getClickableState(this.layer, 11) && !getClickableState(this.layer, 13)) return true; else return false
                }
                if(hasUpgrade('R', 31)) {
                    if(!getClickableState(this.layer, 11) || !getClickableState(this.layer, 13)) return true; else return false
                }
            },
            onClick() {
                setClickableState(this.layer, this.id, true)
            },
        },
        13: {
            title: "Rebirth Mode",
            display() {
                if(!getClickableState(this.layer, this.id)) return "Doubles $ gain<br>Quadruples RP gain"; else return "Doubles $ gain<br>Quadruples RP gain<br>ACTIVE"
            },
            canClick() {
                if(hasUpgrade('R', 32)) return true;
                if(!hasUpgrade('R', 31)) {
                    if(!getClickableState(this.layer, 11) && !getClickableState(this.layer, 12)) return true; else return false
                }
                if(hasUpgrade('R', 31)) {
                    if(!getClickableState(this.layer, 11) || !getClickableState(this.layer, 12)) return true; else return false
                }
            },
            onClick() {
                setClickableState(this.layer, this.id, true)
            },
        },
    },
    buyables: {
        11: {
            cost(x) {
                let y = x
                if(hasMilestone('UMF', 2)) y = y.div(tmp.UMF.milestones[2].effect)
                let base = new Decimal(1000000).times(new Decimal(10).pow(y))
                return base
            },
            title: "Pay to Win Afterlife",
            effect(x) {
                let base
                if(!hasMilestone('SR', 3)) base = new Decimal(1.1).pow(x)
                if(hasMilestone('SR', 3)) base = new Decimal(1.3).pow(x)
                if(base.gte("1e500000")) base = base.div("1e500000").pow(new Decimal(1).div(base.max(1).log(10).sub(499999).pow(0.2))).times("1e500000")
                return base
            },
            softcap(x) {
                let base
                let softcaps
                if(!hasMilestone('SR', 3)) base = new Decimal(1.1).pow(x)
                if(hasMilestone('SR', 3)) base = new Decimal(1.3).pow(x)
                if(base.gte("1e500000")) {
                    softcaps = base.div(base.div("1e500000").pow(new Decimal(1).div(base.max(1).log(10).sub(499999).pow(0.2))).times("1e500000"))
                    base = base.div("1e500000").pow(new Decimal(1).div(base.max(1).log(10).sub(499999).pow(0.2))).times("1e500000")
                }
                return softcaps
            },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            canAfford() { return player.points.gte(this.cost()) },
            display() {
                let text = "Boost RP gain<br>Cost: " + coolDynamicFormat(this.cost(), 3)
                + "<br>Count: " + coolDynamicFormat(getBuyableAmount(this.layer, this.id), 0)
                + "<br>Effect: x" + coolDynamicFormat(this.effect(), 2)

                if(this.softcap(getBuyableAmount('U', 11)) !== null) text = text + "<br>Effect past 1e500,000 is softcapped, dividing the effect by " + format(this.softcap(getBuyableAmount('U', 11)))

                return text
            },
            tooltip: "Base effect: 1.1^x<br>Base cost: 1,000,000*(10^x)",
            unlocked() { return hasMilestone('SR', 2) }
        },
        12: {
            cost(x) {
                return new Decimal("1e400").times(new Decimal(100000).pow(x).pow(0.1).pow(x))
            },
            title: "Time Manipulator",
            effect(x) {
                return new Decimal(1.2).pow(x)
            },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            canAfford() { return player.points.gte(this.cost()) },
            display() {
                return "Boost Power Pylon effect<br>Cost: " + coolDynamicFormat(this.cost(), 3)
                + "<br>Count: " + coolDynamicFormat(getBuyableAmount(this.layer, this.id), 0)
                + "<br>Effect: x" + coolDynamicFormat(this.effect(), 2)
            },
            tooltip: "Base effect: 1.2^x<br>Base cost: 1e450*((1e5^x)^0.1)^x",
            unlocked() { return hasMilestone('P', 10) }
        },
    },
    doReset(resetlayer) {
        if(resetlayer == 'R') {
            if(!hasMilestone('SR', 5)) player.U.upgrades = []
            if(!inChallenge('SR', 21)) {
                if(hasMilestone('SR', 0)) player.U.upgrades.push(11, 12, 13, 14, 21, 22, 23, 24)
                if(hasMilestone('SR', 1)) player.U.upgrades.push(31, 32, 33)
                if(hasUpgrade('R', 21)) player.U.upgrades.push(34)
                if(hasMilestone('SR', 5)) player.U.upgrades.push(34, 41, 42, 43, 44)
            }
            if(inChallenge('SR', 21)) player.U.upgrades = []
        };
        if(resetlayer == 'SR') {
            if(!hasMilestone('SR', 5)) player.U.upgrades = []
            if(!inChallenge('SR', 21)) {
                if(hasMilestone('SR', 0)) player.U.upgrades.push(11, 12, 13, 14, 21, 22, 23, 24)
                if(hasMilestone('SR', 1)) player.U.upgrades.push(31, 32, 33)
                if(!hasMilestone('SR', 3)) setBuyableAmount('U', 11, new Decimal(0))
                if(hasMilestone('SR', 5)) player.U.upgrades.push(34, 41, 42, 43, 44)
            }
            if(inChallenge('SR', 21)) player.U.upgrades = []
        };
        if(resetlayer == 'HC') {
            player.U.points = new Decimal(0)
            player.U.upgrades = []
            setBuyableAmount('U', 11, new Decimal(0))
            setBuyableAmount('U', 12, new Decimal(0))
            player.U.upgrades.push[34]
        }
        if(!hasUpgrade('R', 32)) {
            setClickableState('U', 11, false)
            setClickableState('U', 12, false)
            setClickableState('U', 13, false)
        };
        if(hasUpgrade('R', 32)) {
            setClickableState('U', 11, true)
            setClickableState('U', 12, true)
            setClickableState('U', 13, true)
        };
    },
    automate() {
        player.U.points = player.points
        if(!inChallenge('SR', 21)) {
            if(hasUpgrade('R', 12) || hasAchievement('A', 43)) {
                buyUpgrade('U', 11)
                buyUpgrade('U', 12)
                buyUpgrade('U', 13)
                buyUpgrade('U', 14)
                buyUpgrade('U', 21)
                buyUpgrade('U', 22)
                buyUpgrade('U', 23)
                buyUpgrade('U', 24)
            };
            if(hasAchievement('A', 31)) {
                buyUpgrade('U', 31)
            };
            if(hasAchievement('A', 33)) {
                buyUpgrade('U', 32)
                buyUpgrade('U', 33)
                buyUpgrade('U', 34)
            };
            if (!hasMilestone('UMF', 1)) {
                if(tmp.U.buyables[11].canAfford && (hasMilestone('SR', 7) || hasAchievement('A', 81))) {
                    setBuyableAmount('U', 11, getBuyableAmount('U', 11).add(1))
                    if(hasMilestone('HC', 1)) setBuyableAmount('U', 11, getBuyableAmount('U', 11).add(9))
                    if(hasMilestone('UMF', 1)) setBuyableAmount('U', 11, getBuyableAmount('U', 11).add(9990))
                }
                if(tmp.U.buyables[12].canAfford && (hasUpgrade('SR', 14) || hasAchievement('A', 81))) {
                    setBuyableAmount('U', 12, getBuyableAmount('U', 12).add(1))
                    if(hasMilestone('HC', 1)) setBuyableAmount('U', 12, getBuyableAmount('U', 12).add(9))
                    if(hasMilestone('UMF', 1)) setBuyableAmount('U', 12, getBuyableAmount('U', 12).add(40))
                }
            } else {
                buyMax("Cash")
            }
            if(hasMilestone('HC', 3)) {
                buyUpgrade('U', 41)
                buyUpgrade('U', 42)
                buyUpgrade('U', 43)
                buyUpgrade('U', 44)
                buyUpgrade('U', 51)
                buyUpgrade('U', 52)
                buyUpgrade('U', 53)
                buyUpgrade('U', 54)
            }
        }

        if(!hasUpgrade('U', 34) && !hasAchievement('A', 81)) {
            setClickableState('U', 11, false)
            setClickableState('U', 12, false)
            setClickableState('U', 13, false)
        };
        if(hasUpgrade('R', 32)) {
            setClickableState('U', 11, true)
            setClickableState('U', 12, true)
            setClickableState('U', 13, true)
        };
    },
    update(diff) {
        if(getPointGen().gte("1e5000000")) player.U.softcapPower = getPointGen(false).div(getPointGen(true))
    }
})
