addLayer("R", {
    name: "rebirth",
    softcap() {
        cap = new Decimal("1e17")
        if(player.points.gte("1e6363.2")) cap = new Decimal("e1686.89")
        return cap
    },
    softcapPower() {
        let softness = new Decimal(0.25)
        if(player.points.gte("1e6363.2")) softness = softness.div(5)
        return softness
    },
    symbol: "R",
    row: "1",
    type: "custom",
    canReset() { return this.baseAmount().gte(this.requires()) },
    update(diff) {
        player.R.points = player.R.points.add(this.getResetGain().times(this.passiveGen()).times(diff))
    },
    getResetGain() {
        let baseGain = this.baseAmount().times(this.gainMult()).div(this.requires()).pow(this.exponent())
        if(baseGain.gte(1e17)) baseGain = baseGain.div(1e17).pow(0.25).times(1e17)
        if(baseGain.gte("1e2000")) baseGain = baseGain.div("1e2000").pow(0.2).times("1e2000")
        baseGain = baseGain.times(this.directMult())
        return baseGain
    },
    getNextAt() {
        let baseGain = this.getResetGain().add(1)
        baseGain = baseGain.div(this.directMult())
        if(baseGain.gte("1e2000")) baseGain = baseGain.div("1e2000").pow(5).times("1e2000")
        if(baseGain.gte(1e17)) baseGain = baseGain.div(1e17).pow(4).times(1e17)
        baseGain = baseGain.pow(new Decimal(1).div(this.exponent())).div(this.gainMult()).times(this.requires())
    },
    prestigeButtonText() {
        if(!inChallenge('SR', 11)) return "Rebirth for " + formatWhole(this.getResetGain()) + " Rebirth Points"
        if(inChallenge('SR', 11)) return "A Superior being is stopping you from Rebirthing"
    },
    prestigeNotify() { return this.getResetGain().gte(player.R.points.div(5)) && this.passiveGen === 0 },
    baseResource: "$",
    resource: "Rebirth Points",
    baseAmount() { return player.points },
    requires() {
        let requirement = new Decimal(0)
        if(!inChallenge('SR', 11)) requirement = requirement.add(100000)
        if(inChallenge('SR', 11)) requirement = requirement.add("eeeeeeeee10")
        if(hasChallenge('SR', 12)) requirement = requirement.div(10)
        if(inChallenge('SR', 12)) requirement = requirement.times(10)
        if(hasUpgrade('HC', 34)) requirement = requirement.div(100000)
        return requirement
    },
    gainMult() {
        let remult = new Decimal(1)
        if (getClickableState('U', 11)) remult = remult.times(2)
        if (getClickableState('U', 12)) remult = remult.times(3)
        if (getClickableState('U', 13)) remult = remult.times(4)
        if (hasUpgrade('U', 43) && !hasMilestone('P', 8)) remult = remult.times(player.points.add(10).log(10).add(10).log(10))
        if (hasUpgrade('U', 43) && hasMilestone('P', 8)) remult = remult.times(player.points.add(9).log(9).add(8).log(8))
        remult = remult.times(layers.R.buyables[11].effect())
        if (hasUpgrade('R', 32)) remult = remult.times(1.3)
        remult = remult.times(layers.SR.effect()[0])
        remult = remult.times(layers.U.buyables[11].effect())
        remult = remult.times(layers.P.effect())
        if (hasUpgrade('U', 52)) remult = remult.times(player.P.points.add(3).log(3))
        return remult
    },
    directMult() {
        let remult = new Decimal(1)
        if(hasUpgrade('HC', 21)) remult = remult.times(10000)
        if(hasUpgrade('HC', 14)) remult = remult.times(100)
        if(hasUpgrade('HC', 33)) remult = remult.times(layers.C.effect()[1])
        remult = remult.times(layers.M.effect2())
        return remult
    },
    exponent() {
        let power = new Decimal(0.5)
        if (hasUpgrade('U', 32)) power = power.add(0.2)
        if (hasMilestone('P', 8) && hasUpgrade('U', 32)) power = power.add(0.1)
        return power
    },
    gainExp() {
        let expo = new Decimal(1)
        if(hasUpgrade('SR', 11)) expo = expo.times(1.05)
        return expo
    },
    color: "#ba0022",
    branches: ['U'],
    effect() {
        let power = new Decimal(0.6)
        if (hasUpgrade('U', 33)) power = power.add(0.1)
        if (hasUpgrade('U', 42)) power = power.add(0.1)
        if (hasUpgrade('R', 33)) power = power.add(0.2)
        if (hasMilestone('P', 8) && hasUpgrade('U', 33)) power = power.add(0.1)
        if (hasMilestone('P', 8) && hasUpgrade('U', 42)) power = power.add(0.1)
        return player.R.points.pow(power).add(1)
    },
    layerShown() { return hasAchievement('A', 12) },
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    effectDescription() {
        return "multiplying $ gain by " + coolDynamicFormat(this.effect(), 2)
    },
    upgrades: {
        11: {
            title: "$$$$$",
            description: "Multiply $ gain by 5",
            cost: new Decimal(1),
        },
        12: {
            title: "Moneybots",
            description: "Automate $ upgrades 1-8",
            cost: new Decimal(3),
        },
        13: {
            title: "I need more!",
            description: "Unlock another row of $ upgrades",
            cost: new Decimal(15),
        },
        14: {
            title: "Underwhelming",
            description: "Double $ gain",
            cost: new Decimal(100),
        },
        21: {
            title: "Mechanical Reconstruction",
            description: "The Machine starts unlocked",
            cost: new Decimal(10000),
            unlocked() {
                return hasAchievement('A', 31)
            },
        },
        22: {
            title: "Repeated Costs",
            description: "Unlock a RP buyable",
            cost: new Decimal(50000),
            unlocked() {
                return hasAchievement('A', 31)
            },
        },
        23: {
            title: "Repeated Repeated Costs",
            description: "Unlock a second RP buyable",
            cost: new Decimal(1000000),
            unlocked() {
                return hasAchievement('A', 31)
            },
        },
        24: {
            title: "Upgrading Revival",
            description: "Unlock more upgrades (both RP and $)",
            cost: new Decimal("1e8"),
            unlocked() {
                return hasAchievement('A', 31)
            },
        },
        31: {
            title: "Doublatron 3000",
            description: "Allows use of two of The Machines modes at once",
            cost: new Decimal("1e16"),
            unlocked() {
                return hasUpgrade('R', 24)
            },
        },
        32: {
            title: "Machine automating Machine",
            description: "Automatically select all three modes of The Machine<br>The Machine also gets a buff",
            cost: new Decimal("1e18"),
            unlocked() {
                return hasUpgrade('R', 24)
            },
        },
        33: {
            title: "Rebirth Empowerment",
            description: "Boost RP effect, again",
            cost: new Decimal("1e23"),
            unlocked() {
                return hasMilestone('SR', 6)
            },
            tooltip: "^0.8 -> ^1",
        },
        34: {
            title: "Super Rebirth Empowerment",
            description: "Boost SRP's boost to Cash",
            cost: new Decimal("1e25"),
            unlocked() {
                return hasMilestone('SR', 6)
            },
            tooltip: "1.5x -> 1.5(x^2)",
        },
    },
    buyables: {
        11: {
            cost(x) {
                scalar = 2
                if(hasChallenge('SR', 21)) scalar = scalar - 0.5
                return new Decimal(20000).times(new Decimal(1.2).pow(new Decimal(x).pow(scalar)))
            },
            title: "Rebirth Booster",
            tooltip: "Base effect: 1.5^x<br>Base cost:20,000*(1.2^x^2)",
            display() {
                return "Multiply RP gain<br>Cost: " + coolDynamicFormat(this.cost(), 3)
                + "<br>Count: " + coolDynamicFormat(getBuyableAmount(this.layer, this.id), 0)
                + "<br>Effect: x" + coolDynamicFormat(this.effect(), 2)
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(!hasMilestone('SR', 0)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade('R', 22)
            },
            effect(x) {
                return new Decimal(1.5).add(layers.R.buyables[12].effect()).pow(x)
            },
        },
        12: {
            cost(x) {
                scalar = 2
                if(hasChallenge('SR', 21)) scalar = scalar - 0.25
                return new Decimal(1000000).times(new Decimal(3).pow(new Decimal(x).pow(scalar)))
            },
            title: "Rebirth Booster Booster",
            tooltip: "Base effect: +x/4<br>Base cost:1,000,000*(3^x^2)",
            display() {
                return "Boost the previous buyables power<br>Cost: " + coolDynamicFormat(this.cost(), 3)
                + "<br>Count: " + coolDynamicFormat(getBuyableAmount(this.layer, this.id), 0)
                + "<br>Effect: +" + coolDynamicFormat(this.effect(), 2)
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(!hasMilestone('SR', 0)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade('R', 23)
            },
            effect(x) {
                if (!hasUpgrade('U', 44)) return new Decimal(0.25).times(x)
                if (hasUpgrade('U', 44) && !hasMilestone('P', 8)) return new Decimal(0.3).times(x)
                if (hasUpgrade('U', 44) && hasMilestone('P', 8)) return new Decimal(0.4).times(x)
            },
        },
    },
    doReset(resetlayer) {
        if(resetlayer == 'SR') {
            player.R.points = new Decimal(0)
            if(!hasMilestone('SR', 5)) player.R.upgrades = []
            if(!inChallenge('SR', 21)) {
                if(hasMilestone('SR', 1)) player.R.upgrades.push(11, 12, 13, 14)
                if(hasMilestone('SR', 3)) player.R.upgrades.push(22, 23)
                if(!hasMilestone('SR', 3)) setBuyableAmount('R', 11, new Decimal(0))
                if(!hasMilestone('SR', 3)) setBuyableAmount('R', 12, new Decimal(0))
                if(hasAchievement('A', 81)) player.R.upgrades.push(12, 21)
                if(hasMilestone('HC', 0)) player.R.upgrades.push(12, 21, 13, 22, 23, 24)
            }
            if(inChallenge('SR', 21)) player.R.upgrades = []
        }
        if(resetlayer == 'HC') {
            player.R.points = new Decimal(0)
            player.R.upgrades = [12, 21, 13, 22, 23, 24]
            setBuyableAmount('R', 11, new Decimal(0))
            setBuyableAmount('R', 12, new Decimal(0))
        }
    },
    passiveGen() {
        let passive = new Decimal(0)
        if(!inChallenge('SR', 21)) {
            if(hasChallenge('SR', 11)) passive = passive.add(0.2)
            if(hasChallenge('SR', 21)) passive = passive.times(10)
        }
        return passive
    },
    automate() {
        if(!inChallenge('SR', 21)) {
            if(layers.R.buyables[11].canAfford() && (hasMilestone('SR', 7) || hasAchievement('A', 81))) {
                if(!hasMilestone('SR', 0)) player.R.points = player.R.points.sub(layers.R.buyables[11].cost())
                if(!hasMilestone('HC', 1)) setBuyableAmount('R', 11, getBuyableAmount('R', 11).add(1))
                if(hasMilestone('HC', 1)) setBuyableAmount('R', 11, getBuyableAmount('R', 11).add(10))
            }
            if(layers.R.buyables[12].canAfford() && (hasMilestone('SR', 7) || hasAchievement('A', 81))) {
                if(!hasMilestone('SR', 0)) player.R.points = player.R.points.sub(layers.R.buyables[12].cost())
                if(!hasMilestone('HC', 1)) setBuyableAmount('R', 12, getBuyableAmount('R', 12).add(1))
                if(hasMilestone('HC', 1)) setBuyableAmount('R', 12, getBuyableAmount('R', 12).add(10))
            }
            if(hasMilestone('HC', 3)) {
                buyUpgrade('R', 11)
                buyUpgrade('R', 12)
                buyUpgrade('R', 13)
                buyUpgrade('R', 14)
                buyUpgrade('R', 21)
                buyUpgrade('R', 22)
                buyUpgrade('R', 23)
                buyUpgrade('R', 24)
                buyUpgrade('R', 31)
                buyUpgrade('R', 32)
                buyUpgrade('R', 33)
                buyUpgrade('R', 34)
            }
        }
    },
    hotkeys: [
        {
            key: "r", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "R: Rebirth into another life", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() { if (player.R.unlocked) doReset("R") },
            unlocked() {return player.R.unlocked} // Determines if you can use the hotkey, optional
        }
    ]
})