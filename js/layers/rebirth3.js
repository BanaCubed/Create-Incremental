addLayer('HC', {
    name: "hyper-rebirth",
    tabFormat: {
        "Hyper": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                ["layer-proxy", ['C', ["main-display"]]],
                "blank",
                "milestones",
            ]
        },
        "Paths": {
            content: [
                ["display-text", "Starting a path doubles the cost of all unstarted paths"],
                "blank",
				["upgrade-tree", [[11, 12, 13, 14], [21, 22, 23, 24], [31, 32, 33, 34], [41]]]
            ]
        },
        // "Matter": {
        //     content: [
        //         ["tree", [
        //             ["M", "blank", "AM"],
        //             [],
        //             ["DM", "blank", "EM"]
        //         ]]
        //     ],
        //     unlocked() { return hasAchievement('A', 101) }
        // }
    },
    symbol: "HR",
    row: "3",
    resource: "Hyper Rebirth Points",
    color: "#2ed5e8",
    type: "custom",
    update(diff) {
        let hypEss = new Decimal(1)
        hypEss = hypEss.times(player.points.add(10).log(10).pow(0.6).times(player.SR.points.add(1).pow(0.4)).times(player.P.points.add(10).log(10)).pow(0.25))
        if(hasUpgrade('HC', 33)) hypEss = hypEss.times(layers.C.effect()[3])
        player.HC.hyperNumber = hypEss
    },
    effect() {
        return [new Decimal(3).pow(player['HC'].total.add(1)).div(3),
            player['HC'].total.add(25).div(25).pow(0.5),
            new Decimal(2).pow(player['HC'].total.add(2).div(2)).div(2)]
    },
    effectDescription() {
        return "multiplying $ gain by " + formatWhole(this.effect()[0]) + ", SRP gain by " + format(this.effect()[1]) + ", and Power Pylon effectiveness by " + format(this.effect()[2]) + "<br>Based on total HRP"
    },
    baseAmount() { return player.HC.hyperNumber },
    baseResource: "Hyper Essence",
    branches: ['SR', 'P'],
    layerShown() { return hasAchievement('A', 75) },
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            hyperNumber: new Decimal(1),
            hyperCash: new Decimal(0),
			total: new Decimal(0),
            paths: []
        }
    },
    getResetGain() {
        return player.HC.hyperNumber.add(1).div(25).pow(1.6).floor()
    },
    getNextAt() {
        return this.getResetGain().add(1).pow(0.625).times(25).floor()
    },
    requires: new Decimal(25),
    canReset() {
        return player.HC.hyperNumber.gte(25) && hasUpgrade('SR', 21)
    },
    prestigeNotify() { return this.canReset() },
    prestigeButtonText() {
        if(!this.getResetGain().gte(1024)) return "Go Hyper for " + formatWhole(this.getResetGain(), 0) + " Hyper Rebirth Points"
        + "<br><br>Next at " + formatWhole(this.getNextAt(), 0) + " Hyper Essence"
        if(this.getResetGain().gte(1024)) return "Reset for " + formatWhole(this.getResetGain(), 2) + " Hyper Rebirth Points"
    },
    milestones: {
        0: {
            requirementDescription: "1 Total HRP",
            effectDescription: "The Machine is now permanently unlocked, keep $ Upgrades v2 on Hyper Reset, unlock Hyper Cash, and keep all buyables, upgrades and automation unlocked",
            done() {
                return player.HC.total.gte(1)
            }
        },
        1: {
            requirementDescription: "6 Total HRP",
            effectDescription: "All Buyables (including Pylons) automation is 10 times as effective",
            done() {
                return player.HC.total.gte(6)
            }
        },
        2: {
            requirementDescription: "18 Total HRP",
            effectDescription: "Keep challenges on Hyper Reset",
            done() {
                return player.HC.total.gte(18)
            }
        },
        3: {
            requirementDescription: "42 Total HRP",
            effectDescription: "Automate all pre-Hyper upgrades except Omega",
            done() {
                return player.HC.total.gte(42)
            }
        },
        4: {
            requirementDescription: "90 Total HRP",
            effectDescription: "Super Rebirth resets nothing",
            done() {
                return player.HC.total.gte(90)
            }
        },
        5: {
            requirementDescription: "130 Total HRP",
            effectDescription: "Automatically Super Rebirth",
            done() {
                return player.HC.total.gte(130)
            }
        },
    },
    upgrades: {
        11: {
            cost() {
                base = new Decimal(1)
                base = base.times(new Decimal(2).pow(findIndex(player.HC.paths, 1)))
                return base
            },
            onPurchase() {
                player.HC.paths.push(1)
            },
            title: "The Basic Path",
            description: "Multiply $ gain by 10,000"
        },
        21: {
            cost() {
                base = new Decimal(2)
                base = base.times(new Decimal(2).pow(findIndex(player.HC.paths, 1)))
                return base
            },
            description: "Multiply RP gain by 10,000",
			branches: [11, 31],
            canAfford() { return hasUpgrade('HC', 11) }
        },
        31: {
            cost() {
                base = new Decimal(3)
                base = base.times(new Decimal(2).pow(findIndex(player.HC.paths, 1)))
                return base
            },
            description: "Start with 12 SRP, and reduce SRP base cost by 1e9",
            canAfford() { return hasUpgrade('HC', 21) }
        },

        12: {
            cost() {
                base = new Decimal(1)
                base = base.times(new Decimal(2).pow(findIndex(player.HC.paths, 2)))
                return base
            },
            onPurchase() {
                player.HC.paths.push(2)
            },
            title: "The Machine's Path",
            description: "Start with Power unlocked and Power Pylons are twice as effective"
        },
        22: {
            cost() {
                base = new Decimal(2)
                base = base.times(new Decimal(2).pow(findIndex(player.HC.paths, 2)))
                return base
            },
            description: "Power Pylons become 5 times more effective",
			branches: [12, 32],
            canAfford() { return hasUpgrade('HC', 12) }
        },
        32: {
            cost() {
                base = new Decimal(3)
                base = base.times(new Decimal(2).pow(findIndex(player.HC.paths, 2)))
                return base
            },
            description: "You start with all Power Pylons unlocked, keep all Power milestones on Hyper reset, and reduce Power Pylon scaling",
            canAfford() { return hasUpgrade('HC', 22) }
        },

        13: {
            cost() {
                base = new Decimal(1)
                base = base.times(new Decimal(2).pow(findIndex(player.HC.paths, 3)))
                return base
            },
            onPurchase() {
                player.HC.paths.push(3)
            },
            title: "The Hyper Path",
            description: "Multiply Hyper Cash gain based on $",
			tooltip: "log10($ + 10)^0.4"
        },
        23: {
            cost() {
                base = new Decimal(2)
                base = base.times(new Decimal(2).pow(findIndex(player.HC.paths, 3)))
                return base
            },
            description: "Multiply Hyper Cash gain by 10",
			branches: [13, 33],
            canAfford() { return hasUpgrade('HC', 13) }
        },
        33: {
            cost() {
                base = new Decimal(3)
                base = base.times(new Decimal(2).pow(findIndex(player.HC.paths, 3)))
                return base
            },
            description: "Hyper Cash also boosts RP, SRP and Hyper Essence at drastically reduced rates",
			tooltip: "RP: x(HC + 1)<br>SRP: x(log(log(HC + 10) + 10))<br>HE: x(HC^0.1/3 + 1)",
            canAfford() { return hasUpgrade('HC', 23) }
        },

        14: {
            cost() {
                base = new Decimal(1)
                base = base.times(new Decimal(2).pow(findIndex(player.HC.paths, 4)))
                return base
            },
            onPurchase() {
                player.HC.paths.push(4)
            },
            title: "The Combined Path",
            description: "Multiply $, Power, and RP gain by 100"
        },
        24: {
            cost() {
                base = new Decimal(2)
                base = base.times(new Decimal(2).pow(findIndex(player.HC.paths, 4)))
                return base
            },
            description: "Multiply $ gain and PPy effect by 200",
			branches: [14, 34],
            canAfford() { return hasUpgrade('HC', 14) }
        },
        34: {
            cost() {
                base = new Decimal(3)
                base = base.times(new Decimal(2).pow(findIndex(player.HC.paths, 4)))
                return base
            },
            description: "Divide RP, SRP, and PPy cost by 100,000, and increase both of the $ buyables bases",
            canAfford() { return hasUpgrade('HC', 24) }
        },

        41: {
            title: "The Matter Combustor",
            cost: new Decimal(40),
            description: "Unlock the Matter Paths",
            canAfford() { return hasUpgrade('HC', 31) && hasUpgrade('HC', 32) && hasUpgrade('HC', 33) && hasUpgrade('HC', 34) },
            branches: [31, 32, 33, 34]
        }
    },
    hotkeys: [
        {
            key: "h", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "H: Hyper Rebirth, bringing inflation to another galaxy", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() { if (player.HC.unlocked) doReset("HC") },
            unlocked() {return player.HC.unlocked} // Determines if you can use the hotkey, optional
        }
    ]
})

addLayer('C', {
    name: "hyper-cash",
    resource: "Hyper Cash",
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    layerShown: false,
    row: 2,
    update(diff) {
        if(hasMilestone('HC', 0)) {
            player.C.points = player.C.points.add(new Decimal(hyperCashGain()).times(diff))
        }
    },
    effect() {
        return [
            hCashB1(),
            player.C.points.add(1),
            player.C.points.add(10).log(10).add(10).log(10),
            player.C.points.pow(0.1).div(3).add(1)
        ]
    },
    effectDescription() {
        if(!hasUpgrade('HC', 33)) return "raising $ gain by " + format(layers.C.effect()[0])
        + "<br>Producing " + format(hyperCashGain()) + "/sec"
        + "<br>Hyper Cash is reset on Hyper Reset"

        if(hasUpgrade('HC', 33)) return "raising $ gain by " + format(layers.C.effect()[0])
        + ", multiplying RP gain by  " + format(layers.C.effect()[1])
        + ", multiplying SRP gain by  " + format(layers.C.effect()[2])
        + ", multiplying Hyper Essence gain by  " + format(layers.C.effect()[3])
        + "<br>Producing " + format(hyperCashGain()) + "/sec"
    },
    color: "#34eb67"
})