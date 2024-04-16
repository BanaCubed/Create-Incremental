function matterGain(matterType) {
    mGain = new Decimal(0)
    if(hasUpgrade('HC', 41)) mGain = mGain.add(1)

    if(matterType === 1) {
        mGain = mGain.div(layers.AM.effect())
        if(hasUpgrade('M', 11)) mGain = mGain.times(2)
        mGain = mGain.times(layers.M.buyables[11].effect())
    }

    if(matterType === 2) {
        mGain = mGain.div(layers.M.effect())
        mGain = mGain.div(layers.M.buyables[11].effect())
    }

    if(matterType === 3) {
        mGain = mGain.div(layers.EM.effect())
    }

    if(matterType === 4) {
        mGain = mGain.div(layers.DM.effect())
    }

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
    row: 3,
    update(diff) {
        player.M.points = player.M.points.add(matterGain(1).times(diff))
    },
    effect() {
        let effect = player.M.points.add(1).pow(0.5)
        if(hasUpgrade('M', 13)) effect = effect.times(1.2)
        return effect
    },
    effect2() {
        let effect = player.M.points.div(10000).add(1).pow(0.5)
        if(hasUpgrade('M', 13)) effect = effect.times(1.2)
        return effect
    },
    effectDescription() {
        return "dividing Antimatter gain by " + format(this.effect()) + ", and multiplying $, RP, SRP, Power and HE gain by " + format(this.effect2()) + "<br>(" + format(matterGain(1)) + "/sec)"
    },
    tabFormat: [
        "main-display",
        "buyables",
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
            title: '""""Normal Upgrade""""',
            cost: new Decimal(15),
            description: "Multiply both of Matter's effect by 1.2"
        },
    },
    buyables: {
        11: {
            cost(x) {
                return new Decimal(5).times(new Decimal(1.1).pow(x))
            },
            title: "Create a Quark",
            tooltip: "Base effect: x/10 + 1<br>Base cost: 5*1.1^x",
            display() {
                return "Multiply Matter gain, but divide Antimatter gain<br>Cost: " + coolDynamicFormat(this.cost(), 3)
                + "<br>Count: " + coolDynamicFormat(getBuyableAmount(this.layer, this.id), 0)
                + "<br>Effect: x" + coolDynamicFormat(this.effect(), 2)
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
                return new Decimal(x).div(10).add(1)
            },
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
    update(diff) {
        player.AM.points = player.AM.points.add(matterGain(2).times(diff))
    },
    effect() {
        let effect = player.AM.points.add(1).pow(0.5)
        if(hasUpgrade('M', 12)) effect = effect.div(3)
        return effect
    },
    effectDescription() {
        return "dividing Matter gain by " + format(this.effect()) + "<br>(" + format(matterGain(2)) + "/sec)"
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
    update(diff) {
        player.DM.points = player.DM.points.add(matterGain(3).times(diff))
    },
    effect() {
        return player.DM.points.add(1).pow(0.5)
    },
    effectDescription() {
        return "dividing Exotic Matter gain by " + format(this.effect()) + "<br>(" + format(matterGain(3)) + "/sec)"
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
    update(diff) {
        player.EM.points = player.EM.points.add(matterGain(4).times(diff))
    },
    effect() {
        return player.EM.points.add(1).pow(0.5)
    },
    effectDescription() {
        return "dividing Dark Matter gain by " + format(this.effect()) + "<br>(" + format(matterGain(4)) + "/sec)"
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