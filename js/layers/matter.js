addLayer('matter', {
    color: 'var(--matter)',
    symbol: 'M',
    layerShown(){return player.matter.unlocked},
    update(diff) {
        if(hasUpgrade('hyper', 51)) { player.matter.unlocked = true; player.matter.points = player.matter.points.add(tmp.matter.matterGain.times(diff)) }
    },
    automate() {
        if(hasUpgrade('antimatter', 17)) {
            buyMax('matter', 'buyables', 11)
            buyMax('matter', 'buyables', 12)
        }
    },
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        umf: new Decimal(0),
    }},
    resource: 'matter',
    tooltip: 'matter-display',
    matterGain() {
        let gain =  Decimal.dOne
        if(hasUpgrade('matter', 11)) { gain = gain.times(2) }
        if(hasUpgrade('matter', 13)) { gain = gain.times(tmp.matter.upgrades[13].effect) }
        if(hasUpgrade('matter', 14)) { gain = gain.times(tmp.matter.upgrades[14].effect) }
        gain = gain.times(tmp.matter.buyables[11].effect)
        return gain.times(tmp.chall.uTime)
    },
    tabFormat: [
        ['row', [
            'matter-display',
        ]],
        "buyables",
        'upgrades',
    ],
    upgrades: {
        11: {
            title: 'Planck',
            fullDisplay() {
                return `Double Matter gain`
            },
            costa: new Decimal(100),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return Decimal.dTwo
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from Shadow69420<br>Matter up1:Double matter gain (cost:5 matter)`
                
                return
            },
        },
        12: {
            title: 'Inertia',
            fullDisplay() {
                return `Boost Universal Time based on Matter<br>Currently: ${formatBoost(tmp[this.layer].upgrades[this.id].effect.sub(1), false)}`
            },
            costa: new Decimal(300),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                let exponent = new Decimal(0.4)
                if(hasUpgrade('matter', 16)) { exponent = exponent.add(0.25) }
                return player.matter.points.max(1).log(3).add(1).pow(exponent)
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from Shadow69420<br>Matter up2:Divide antimatter gain by 3 (cost:10 matter)`
                
                return `log<sub>3</sub>(Matter)<sup>0.${hasUpgrade('matter', 16)?'65':'4'}</sup>`
            },
        },
        13: {
            title: 'Photonic',
            fullDisplay() {
                return `Matter boosts itself<br>Currently: ${formatBoost(tmp[this.layer].upgrades[this.id].effect.sub(1), false)}`
            },
            costa: new Decimal(1000),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return player.matter.points.max(1).log(5).add(1).pow(1.1)
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from Shadow69420<br>Matter up2:Divide antimatter gain by 3 (cost:10 matter)`
                
                return `log<sub>5</sub>(Matter)<sup>1.1</sup>`
            },
        },
        14: {
            title: 'Gravitonic',
            fullDisplay() {
                return `Matter upgrades bought boosts Matter gain<br>Currently: ${formatBoost(tmp[this.layer].upgrades[this.id].effect.sub(1), false)}`
            },
            costa: new Decimal(100000),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return Decimal.pow(1.4, player.matter.upgrades.length)
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from Shadow69420<br>Matter mile1:<br>Name: That's a lot of matter!<br>Req:100 matter<br>Effect:Divide antimatter gain by milestones/2 + 1`
                
                return `×1.4<sup>Upgrades</sup>`
            },
        },
        15: {
            title: 'Neutronic',
            fullDisplay() {
                return `Quarks divide their own cost<br>Currently: /${format(tmp[this.layer].upgrades[this.id].effect.recip())}`
            },
            costa: new Decimal(1e7),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return getBuyableAmount('matter', 11).add(1).pow(0.75).sub(1).pow_base(5).add(1).pow(0.5).times(2).recip()
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from Shadow69420<br>Matter mile1:<br>Matter mile2:<br>Name: I need more matter!<br>Req:1000 matter<br>Effect:Antimatter divides itself by Antim/5 + 1`
                
                return `2(5<sup>(x+1)<sup>0.75</sup>-1</sup>+1)<sup>0.5</sup>`
            },
        },
        16: {
            title: 'Vacuumic',
            fullDisplay() {
                return `Improve the exponent of Inertias effect`
            },
            costa: new Decimal(1e9),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return tmp.matter.buyables[11].effect.add(1).pow(0.5).times(2).recip()
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from Shadow69420<br>Matter mile1:<br>Matter mile2:<br>Name: I need more matter!<br>Req:1000 matter<br>Effect:Antimatter divides itself by Antim/5 + 1`
                
                return `log<sub>3</sub>(Matter)<sup>0.4</sup> to log<sub>3</sub>(Matter)<sup>0.65</sup>`
            },
        },
        17: {
            title: 'Annihilation',
            fullDisplay() {
                return `Gain an Ultimate Matter Fragment (UMF)`
            },
            costa: new Decimal(1e12),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa); player.matter.umf = player.matter.umf.add(1)},
            tooltip() {
                return `It's called Ultimate, so it must be good`
            },
            unlocked(){return player.matter.upgrades.length>=6&&getBuyableAmount('matter', 12).gte(1)}
        },
    },
    buyables: {
        11: {
            title: "Quarks",
            display() {
                return `Increase Matter gain<br>Currently: ${formatBoost(tmp[this.layer].buyables[this.id].effect.sub(1))}`
            },
            cost(x) {
                let cost = x.add(1).pow_base(5).times(2000)
                if(hasUpgrade('matter', 15)) { cost = cost.mul(tmp.matter.upgrades[15].effect) }
                return cost
            },
            effect(x) {
                return x.add(1).pow(Decimal.add(0.75, tmp.matter.buyables[12].effect)).sub(1).pow_base(5)
            },
            canAfford(){return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer, this.id)))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer), this.id))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            auto(){return false},
            tooltip() {
                if(options.tooltipCredits) return `Idea from Shadow69420<br>Matter buy1:get a quark (cost:5 matter, ×1.1 cost per purchase)<br>Quark effect:<br>Quarks multiply matter and divide antimatter gain by<br>Q/10 + 1`
                
                return `Effect: 5<sup>(x+1)<sup>0.75</sup>-1</sup><br>Cost: 10,000×5<sup>x</sup>`
            },
        },
        12: {
            title: "Atoms",
            display() {
                return `Increase Quark effect exponent<br>Currently: +${format(tmp[this.layer].buyables[this.id].effect)}`
            },
            cost(x) {
                let cost = x.add(1).pow_base(2).pow_base(3).times(1e10)
                return cost
            },
            effect(x) {
                return Decimal.sub(15, Decimal.div(15, x.add(1).pow(0.15))).div(100)
            },
            canAfford(){return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer, this.id)))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer), this.id))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            auto(){return false},
            tooltip() {
                if(options.tooltipCredits) return `Idea from Shadow69420<br>Matter buy2:Get an atom (cost:10m matter, ×1.1 cost per purchase)<br>Atoms multiply matter and milestones by:<br>Atoms/2 + 1`
                
                return `Effect: 5<sup>(x+1)<sup>0.75</sup>-1</sup><br>Cost: 1e10×3<sup>2<sup>x+1</sup></sup>`
            },
        },
    },
    ultimateEffect() {
        return player.matter.umf.pow_base(65.536)
    },
})

addLayer('antimatter', {
    color: 'var(--amatter)',
    symbol: 'AM',
    layerShown(){return player.antimatter.unlocked},
    update(diff) {
        if(hasUpgrade('hyper', 52)) { player.antimatter.unlocked = true; player.antimatter.points = player.antimatter.points.add(tmp.antimatter.matterGain.times(diff)) }
    },
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    resource: 'antimatter',
    tooltip: 'antimatter-display',
    matterGain() {
        let gain =  Decimal.dOne
        if(hasUpgrade('antimatter', 11)) { gain = gain.times(tmp.antimatter.upgrades[11].effect) }
        if(hasUpgrade('antimatter', 14)) { gain = gain.times(tmp.antimatter.upgrades[14].effect) }
        if(hasUpgrade('antimatter', 23)) { gain = gain.times(tmp.matter.buyables[11].effect.pow(0.5)) }
        return gain.times(tmp.chall.uTime)
    },
    tabFormat: [
        ['row', [
            'antimatter-display',
        ]],
        "buyables",
        'upgrades',
    ],
    upgrades: {
        11: {
            title: '8th Dimension',
            fullDisplay() {
                return `Total Matter-Based upgrades bought boosts Antimatter Gain<br>Currently: ${formatBoost(tmp[this.layer].upgrades[this.id].effect.sub(1), false)}`
            },
            costa: new Decimal(2500),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return new Decimal(player.matter.upgrades.length+player.antimatter.upgrades.length+1).pow(tmp.antimatter.buyables[12].effect)
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>Anti-Matter up1: Exotic-matter and Dark-matter boost Anti-matter by log<sub>3</sub>(EM+DM) (cost: 6AM)`
                
                return
            },
        },
        12: {
            title: 'Tickspeed',
            fullDisplay() {
                return `Total Matter-Based upgrades bought boosts Universal Time<br>Currently: ${formatBoost(tmp[this.layer].upgrades[this.id].effect, true)}`
            },
            costa: new Decimal(35000),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                let bonus = Decimal.dZero
                if(hasUpgrade('antimatter', 22)) { bonus = bonus.add(getBuyableAmount('antimatter', 13).div(2)) }
                return Decimal.pow(Decimal.add(1.125, tmp.antimatter.buyables[11].effect), Decimal.add(bonus, player.matter.upgrades.length+player.antimatter.upgrades.length))
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>Anti-Matter up2: matter division to antimatter is weaker (√M -> ∛M) (cost: 20AM)`
                
                return `1.125<sup>Upgrades</sup>`
            },
        },
        13: {
            title: 'Dimboost',
            fullDisplay() {
                return `Total unlocked Pylons boosts all Power Pylon production<br>Currently: ${formatBoost(tmp[this.layer].upgrades[this.id].effect, true)}`
            },
            costa: new Decimal(100000),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                let pylons = Decimal.dZero
                if(tmp.power.clickables[21].unlocked) { pylons = pylons.add(1) }
                if(tmp.power.clickables[22].unlocked) { pylons = pylons.add(1) }
                if(tmp.power.clickables[23].unlocked) { pylons = pylons.add(1) }
                if(tmp.power.clickables[24].unlocked) { pylons = pylons.add(1) }
                if(tmp.power.clickables[25].unlocked) { pylons = pylons.add(1) }
                if(tmp.power.clickables[26].unlocked) { pylons = pylons.add(1) }
                return pylons.pow_base(2)
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>Anti-Matter up3: anti-matter boost to all resources is changed (log<sub>5</sub> -> log<sub>4</sub>) (cost: 35AM)`
                
                return `2<sup>Pylons</sup>`
            },
        },
        14: {
            title: 'Replicanti',
            fullDisplay() {
                return `Real time played has an exponential boost to Antimatter Gain<br>Currently: ${formatBoost(tmp[this.layer].upgrades[this.id].effect.sub(1), false)}`
            },
            costa: new Decimal(250000),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return Decimal.pow(player.timePlayed, 0.125).pow_base(2).min(100)
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>Anti-Matter up4: ^1.2 Anti-Matter (cost: 50AM)`
                
                return `2<sup>Playtime<sup>0.125</sup></sup><br>Hardcapped at 100`
            },
        },
        15: {
            title: 'galaxy(.click)',
            fullDisplay() {
                return `Unlock three buyables`
            },
            costa: new Decimal(5000000),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>Anti-Matter up5: unlock 3 buyables (cost: 75AM)`
                
                return
            },
        },
        21: {
            title: 'Infinity',
            fullDisplay() {
                return `The 'Galaxy' Buyables are all 50% stronger`
            },
            costa: new Decimal(1e8),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>Anti-Matter up6: buyables cost scailing is decreased by -^0.05 (cost:10,000 AM)`
                
                return
            },
        },
        22: {
            title: 'Eternity',
            fullDisplay() {
                return `Tachyon Galaxies are counted as half an upgrade for Tickspeed`
            },
            costa: new Decimal(5e8),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>Anti-Matter up7: buff AM buy1 to (×1.25 -> ×1.35) (cost: 100,000AM)`
                
                return
            },
        },
        23: {
            title: 'Reality',
            fullDisplay() {
                return `Quarks now also effect Antimatter gain at ^0.5 efficiency`
            },
            costa: new Decimal(1e9),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>Anti-Matter up8: ×10 AM`
                
                return
            },
        },
        17: {
            title: 'The Celestials',
            fullDisplay() {
                return `Gain an Ultimate Matter Fragment.<br>Also automate Quarks and Atoms.`
            },
            costa: new Decimal(1e18),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa); player.matter.umf = player.matter.umf.add(1)},
            tooltip() {
                return `Wait, it's all Antimatter Dimensions Refernces?`
            },
        },
    },
    buyables: {
        11: {
            title: "Antimatter Galaxies",
            display() {
                return `Increase Tickspeed's base<br>Currently: ${formatBoost(tmp[this.layer].buyables[this.id].effect)}`
            },
            cost(x) {
                return x.pow_base(1e2).times(1e6)
            },
            effect(x) {
                if(hasUpgrade('antimatter', 21)) { x = x.mul(1.5) }
                return x.div(50)
            },
            canAfford(){return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer, this.id))) && getBuyableAmount(this.layer, this.id).lt(tmp[this.layer].buyables[this.id].purchaseLimit)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer), this.id))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            auto(){return false},
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>Anti-Matter buy1: AM ×1.25 (cost: 100AM ^1.1 per buy)`
                
                return `Effect: x/50<br>Cost: 1,000,000×100<sup>x</sup>`
            },
            purchaseLimit: new Decimal(8),
        },
        12: {
            title: "Replicanti Galaxies",
            display() {
                return `Raise the effect of 8th Dimension<br>Currently: ^${format(tmp[this.layer].buyables[this.id].effect)}`
            },
            cost(x) {
                return x.pow_base(50).times(2e6)
            },
            effect(x) {
                if(hasUpgrade('antimatter', 21)) { x = x.mul(1.5) }
                return x.div(3.08).add(1)
            },
            canAfford(){return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer, this.id))) && getBuyableAmount(this.layer, this.id).lt(tmp[this.layer].buyables[this.id].purchaseLimit)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer), this.id))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            auto(){return false},
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>Anti-Matter buy2: decrease AM up1 log by /1.05 (cost: 200AM ^1.15 per buy)`
                
                return `Effect: (x/3.08)+1<br>Cost: 2,000,000×50<sup>x</sup>`
            },
            purchaseLimit: new Decimal(10),
        },
        13: {
            title: "Tachyon Galaxies",
            display() {
                return `Increase Matter gain<br>Currently: ${formatBoost(tmp[this.layer].buyables[this.id].effect.sub(1))}`
            },
            cost(x) {
                return x.pow_base(2).times(5e7)
            },
            effect(x) {
                if(hasUpgrade('antimatter', 21)) { x = x.mul(1.5) }
                return x.pow_base(1.145)
            },
            canAfford(){return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer, this.id))) && getBuyableAmount(this.layer, this.id).lt(tmp[this.layer].buyables[this.id].purchaseLimit)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer), this.id))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            auto(){return false},
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>Anti-Matter buy2: decrease AM up1 log by /1.05 (cost: 200AM ^1.15 per buy)`
                
                return `Effect: 1.145<sup>x</sup><br>Cost: 50,000,000×2<sup>x</sup>`
            },
            purchaseLimit: new Decimal(40),
        },
    },
})
