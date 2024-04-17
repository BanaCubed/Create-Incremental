function matterGain(matterType) {
    mGain = new Decimal(0)
    if(hasUpgrade('HC', 41)) mGain = mGain.add(1)

    if(matterType === 1) {
        // Matter
        mGain = mGain.div(layers.AM.effect())
        if(hasUpgrade('M', 11)) mGain = mGain.times(2)
        mGain = mGain.times(layers.M.buyables[11].effect())
        if(hasUpgrade('M', 21)) {
            if(hasMilestone('M', 0)) mGain = mGain.times(new Decimal(4).pow(0.7))
            if(hasMilestone('M', 1)) mGain = mGain.times(player.M.points.div(5).add(1).pow(0.2))
            if(hasMilestone('M', 2)) mGain = mGain.times(new Decimal(2).pow(0.7))
        }
        if(hasUpgrade('M', 22)) mGain = mGain.times(4)
        mGain = mGain.times(layers.M.buyables[12].effect())
    }

    if(matterType === 2) {
        // Antimatter
        if(!hasUpgrade('HC', 51)) {
            mGain = mGain.div(layers.M.effect())
            mGain = mGain.div(layers.M.buyables[11].effect())
            mGain = mGain.div(layers.M.buyables[12].effect())
            if(hasMilestone('M', 0)) mGain = mGain.div(4)
            if(hasMilestone('M', 1)) mGain = mGain.div(player.AM.points.div(5).add(1))
            if(hasMilestone('M', 2)) mGain = mGain.div(2)
        }
    }

    if(matterType === 3) {
        // Dark Matter
        mGain = mGain.div(layers.EM.effect())
    }

    if(matterType === 4) {
        // Exotic Matter
        mGain = mGain.div(layers.DM.effect())
    }

    // Global
    mGain = mGain.times(layers.UMF.effect())

    return mGain
}
















addLayer('M', {
    name: "matter",
    resource: "Matter",
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    symbol: "M",
    row: 3,
    update(diff) {
        player.M.points = player.M.points.add(matterGain(1).times(diff))
    },
    effect() {
        let effect = player.M.points.add(1).pow(0.5)
        if(hasUpgrade('M', 13)) effect = effect.times(1.2)
        if(hasUpgrade('HC', 51)) effect = effect.pow(0)
        return effect
    },
    effect2() {
        let effect = player.M.points.div(10000).add(1).pow(0.15)
        if(hasUpgrade('M', 13)) effect = effect.times(1.2)
        return effect
    },
    effectDescription() {
        return "dividing Antimatter gain by " + format(this.effect()) + ", and multiplying $, RP, SRP, Power and HE gain by " + format(this.effect2()) + "<br>(" + format(matterGain(1)) + "/sec)"
    },
    tabFormat: [
        "main-display",
        "buyables",
        "blank",
        "milestones",
        "upgrades"
    ],
    color: "#2dc0d6",
    previousTab: 'HC',
    branches: ["HC"],
    upgrades: {
        11: {
            title: "Matter Dimensions",
            cost: new Decimal(5),
            description: "Double Matter gain"
        },
        12: {
            title: "Anti-Antimatter",
            cost: new Decimal(10),
            description: "Divide Antimatter's nerf by 3"
        },
        13: {
            title: '"Normal Upgrade"',
            cost: new Decimal(15),
            description: "Multiply both of Matter's effect by 1.2"
        },
        14: {
            title: "Proton",
            cost: new Decimal(60),
            description: "Increase Quarks effect",
            tooltip: "x/10 -> x/3"
        },
        21: {
            title: "Nuclear Fission",
            cost: new Decimal(500),
            description: "Milestones now also multiply Matter gain at a reduced rate",
            tooltip: "Mult = Div^0.7<br>Milestone 2 is ^0.2 instead and is based on Matter"
        },
        22: {
            title: "Neutron",
            cost: new Decimal(3000),
            description: "Quadruple Matter gain",
        },
        23: {
            title: "Up and Down",
            cost: new Decimal(15000),
            description: "Square Quark effect",
        },
        24: {
            title: "Efficient Compression",
            cost: new Decimal(100000000000),
            description: "Reduce both Quark and Atom cost scalings",
            tooltip: "-0.1 to exponent"
        },
    },
    buyables: {
        11: {
            cost(x) {
                let expo = new Decimal(1.16)
                if(hasUpgrade('M', 24)) expo = expo.sub(0.1)
                return new Decimal(5).times(new Decimal(expo).pow(x))
            },
            title: "Create a Quark",
            tooltip: "Base effect: x/10 + 1<br>Base cost: 5*1.16^x",
            display() {
                return "Quarks multiply matter and divide antimatter gain<br>Cost: " + coolDynamicFormat(this.cost(), 3)
                + "<br>You have " + coolDynamicFormat(getBuyableAmount(this.layer, this.id), 0)
                + " quarks<br>Currently multiplying/dividing by " + coolDynamicFormat(this.effect(), 2)
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return true
            },
            effect(x) {
                let divisor = new Decimal(10)
                if(hasUpgrade('M', 14)) divisor = divisor.div(3.3333)
                let base = new Decimal(x).div(divisor).add(1)
                if(hasUpgrade('M', 23)) base = base.pow(2)
                return base
            },
        },
        12: {
            cost(x) {
                let expo = new Decimal(1.2)
                if(hasUpgrade('M', 24)) expo = expo.sub(0.1)
                return new Decimal(1000000).times(new Decimal(expo).pow(x))
            },
            title: "Create an Atom",
            tooltip: "Base effect: (x + 1)^1.6<br>Base cost: 5,000,000*1.2^x",
            display() {
                return "Atoms multiply matter and divide antimatter gain<br>Cost: " + coolDynamicFormat(this.cost(), 3)
                + "<br>You have " + coolDynamicFormat(getBuyableAmount(this.layer, this.id), 0)
                + " atoms<br>Currently multiplying/dividing by " + coolDynamicFormat(this.effect(), 2)
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return true
            },
            effect(x) {
                let divisor = new Decimal(1)
                let base = new Decimal(x).div(divisor).add(1).pow(1.6)
                return base
            },
        },
    },
    milestones: {
        0: {
            requirementDescription: "100 Matter",
            effectDescription: "Divide Antimatter gain by 4",
            done() { return player.M.points.gte(100) }
        },
        1: {
            requirementDescription: "1000 Matter",
            effectDescription: "Divide Antimatter gain based on Antimatter",
            done() { return player.M.points.gte(1000) },
            tooltip: "AM/5 + 1"
        },
        2: {
            requirementDescription: "100000 Matter",
            effectDescription: "Divide Antimatter gain by 2",
            done() { return player.M.points.gte(100000) }
        },
    },
    layerShown() {
        return hasAchievement('A', 101)
    }
})
















addLayer('AM', {
    name: "antimatter",
    resource: "Antimatter",
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    row: 3,
    symbol: "AM",
    update(diff) {
        player.AM.points = player.AM.points.add(matterGain(2).times(diff))
    },
    effect() {
        let effect = player.AM.points.add(1).pow(0.5)
        if(hasUpgrade('M', 12)) effect = effect.div(3)
        return effect
    },
    effect2() {
        let effect = player.AM.points.div(10000).add(1).pow(0.5)
        return effect
    },
    effectDescription() {
        return "dividing Matter gain by " + format(this.effect()) + ", and multiplying $, RP, SRP, Power and HE gain by " + format(this.effect2()) + "<br>(" + format(matterGain(2)) + "/sec)"
    },
    tabFormat: [
        "main-display"
    ],
    color: "#d6442d",
    branches: ["HC"],
    layerShown() {
        return hasAchievement('A', 101)
    }
})
















addLayer('DM', {
    name: "dark-matter",
    resource: "Dark Matter",
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    row: 3,
    symbol: "DM",
    update(diff) {
        player.DM.points = player.DM.points.add(matterGain(3).times(diff))
    },
    effect() {
        return player.DM.points.add(1).pow(0.5)
    },
    effect2() {
        let effect = player.DM.points.div(10000).add(1).pow(0.5)
        return effect
    },
    effectDescription() {
        return "dividing Exotic Matter gain by " + format(this.effect()) + ", and multiplying $, RP, SRP, Power and HE gain by " + format(this.effect2()) + "<br>(" + format(matterGain(3)) + "/sec)"
    },
    tabFormat: [
        "main-display"
    ],
    color: "#303030",
    branches: ["HC"],
    layerShown() {
        return hasAchievement('A', 101)
    }
})
















addLayer('EM', {
    name: "exotic-matter",
    resource: "Exotic Matter",
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    row: 3,
    symbol: "EM",
    update(diff) {
        player.EM.points = player.EM.points.add(matterGain(4).times(diff))
    },
    effect() {
        return player.EM.points.add(1).pow(0.5)
    },
    effect2() {
        let effect = player.DM.points.div(10000).add(1).pow(0.5)
        return effect
    },
    effectDescription() {
        return "dividing Dark Matter gain by " + format(this.effect()) + ", and multiplying $, RP, SRP, Power and HE gain by " + format(this.effect2()) + "<br>(" + format(matterGain(4)) + "/sec)"
    },
    tabFormat: [
        "main-display"
    ],
    color: "#cc59de",
    branches: ["HC"],
    layerShown() {
        return hasAchievement('A', 101)
    }
})
















addLayer('UMF', {
    name: "ultimate-matter-fragments",
    resource: "Ultimate Matter Fragments",
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    row: 3,
    symbol: "UMF",
    effect() {
        return new Decimal(5).pow(player.UMF.points).div(10).add(1).pow(0.5).sub(0.05)
    },
    effect2() {
        return layers.M.effect2().times(layers.AM.effect2()).times(layers.DM.effect2()).times(layers.EM.effect2())
    },
    effectDescription() {
        return "multiplying all matters gain by " + format(this.effect()) + "<br>Your matters are multiplying $, RP, SRP, Power and HE gain by " + format(this.effect2())
    },
    tabFormat: [
        "main-display"
    ],
    color: "#472961",
    branches: ["M", "AM", "DM", "EM"],
    layerShown: false
})