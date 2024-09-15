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
        if(hasUpgrade('darkmatter', 12)) { gain = gain.times(tmp.darkmatter.upgrades[12].effect) }
        if(getBuyableAmount('darkmatter', 14).gte(1)) { gain = gain.times(tmp.blackhole.effect.times(5).pow(2)) }
        if(hasMilestone('blackhole', 3)) { gain = gain.times(tmp.blackhole.milestones[3].effect[1]) }
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
                return `${options.upgID?'MB1':"Quarks"} divide their own cost<br>Currently: /${format(tmp[this.layer].upgrades[this.id].effect.recip())}`
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
                return `Improve the exponent of ${options.upgID?'MU2s':"Inertia's"} effect`
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
                
                return `Effect: 5<sup>(x+1)<sup>${format(tmp.matter.buyables[12].effect.add(0.75))}</sup>-1</sup><br>Cost: 10,000×5<sup>x</sup>`
            },
        },
        12: {
            title: "Atoms",
            display() {
                return `Increase ${options.upgID?'MB1s':"Quark's"} effect exponent<br>Currently: +${format(tmp[this.layer].buyables[this.id].effect)}`
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
                
                return `Effect: (15-(15/((x+1)<sup>0.15</sup>)))/100<br>Cost: 1e10×3<sup>2<sup>x+1</sup></sup>`
            },
        },
    },
    ultimateEffect() {
        return player.matter.umf.pow_base(65.536)
    },
    row: 3,
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
        if(hasUpgrade('darkmatter', 12)) { gain = gain.times(tmp.darkmatter.upgrades[12].effect) }
        if(getBuyableAmount('darkmatter', 14).gte(1)) { gain = gain.times(tmp.blackhole.effect.times(5).pow(2)) }
        if(hasMilestone('blackhole', 3)) { gain = gain.times(tmp.blackhole.milestones[3].effect[0]) }
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
                return new Decimal(player.matter.upgrades.length+player.antimatter.upgrades.length+1+player.darkmatter.upgrades.length).pow(tmp.antimatter.buyables[12].effect)
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>Anti-Matter up1: Exotic-matter and Dark-matter boost Anti-matter by log<sub>3</sub>(EM+DM) (cost: 6AM)`
                
                return `Upgrades<sup>${format(tmp.antimatter.buyables[12].effect)}</sup>`
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
                return Decimal.pow(Decimal.add(1.125, tmp.antimatter.buyables[11].effect), Decimal.add(bonus, player.matter.upgrades.length+player.antimatter.upgrades.length+player.darkmatter.upgrades.length)).min(1e5)
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>Anti-Matter up2: matter division to antimatter is weaker (√M -> ∛M) (cost: 20AM)`
                
                return `${format(tmp.antimatter.buyables[11].effect.add(1.12))}5<sup>Upgrades</sup><br>Hardcapped at 100,000`
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
                return `Antimatter Buyables are all 50% stronger`
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
                return `${options.upgID?'AmB3':'Tachyon Galaxies'} are counted as half an upgrade for ${options.upgID?'AmU2':"Tickspeed"}`
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
                return `${options.upgID?'MB1':'Quarks'} now also effect Antimatter gain at ^0.5 efficiency`
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
                return `Gain an Ultimate Matter Fragment.<br>Also automate ${options.upgID?'MB1':'Quarks'} and ${options.upgID?'MB2':'Atoms'}.`
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
                return `Increase ${options.upgID?'AmU2':"Tickspeed'"}s base<br>Currently: ${formatBoost(tmp[this.layer].buyables[this.id].effect)}`
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
            unlocked() { return hasUpgrade('antimatter', 15) }
        },
        12: {
            title: "Replicanti Galaxies",
            display() {
                return `Raise the effect of ${options.upgID?'AmU1':"8th Dimension"}<br>Currently: ^${format(tmp[this.layer].buyables[this.id].effect)}`
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
            unlocked() { return hasUpgrade('antimatter', 15) }
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
            unlocked() { return hasUpgrade('antimatter', 15) }
        },
    },
    row: 3,
})

addLayer('darkmatter', {
    color: 'var(--dmatter)',
    symbol: 'DM',
    layerShown(){return player.darkmatter.unlocked},
    update(diff) {
        if(hasUpgrade('hyper', 53)) { player.darkmatter.unlocked = true; player.darkmatter.points = player.darkmatter.points.add(tmp.darkmatter.matterGain.times(diff)) }
    },
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    resource: 'dark matter',
    tooltip: 'darkmatter-display',
    matterGain() {
        let gain =  Decimal.dOne
        if(hasUpgrade('darkmatter', 11)) { gain = gain.times(tmp.darkmatter.upgrades[11].effect) }
        if(hasUpgrade('darkmatter', 12)) { gain = gain.times(tmp.darkmatter.upgrades[12].effect) }
        if(hasUpgrade('darkmatter', 14)) { gain = gain.times(tmp.darkmatter.upgrades[14].effect) }
        if(hasUpgrade('darkmatter', 15)) { gain = gain.times(tmp.blackhole.effect.div(3).pow(tmp.blackhole.dmExpo)) }
        if(hasMilestone('blackhole', 2)) { gain = gain.times(tmp.blackhole.milestones[2].effect) }
        if(hasMilestone('blackhole', 4)) { gain = gain.times(tmp.blackhole.milestones[4].effect[3]) }
        return gain.times(tmp.chall.uTime)
    },
    tabFormat: [
        ['row', [
            'darkmatter-display',
        ]],
        "buyables",
        'upgrades',
        ['row', [
            'blackhole-display',
        ]],
        'blank',
        ['display-text', function(){return player.blackhole.unlocked?`Your Black Hole's Volume is boosting:<br><div style="text-align: left; width: fit-content; min-width: 30rem;">
            Universal Time ${formatBoost(tmp.blackhole.effect.sub(1))}<br>
            Dark Matter ${formatBoost(tmp.blackhole.effect.div(3).pow(tmp.blackhole.dmExpo).sub(1))}<br>
            Power Pylon F Effect ${formatBoost(tmp.blackhole.effect.pow(11).sub(1))}
            ${getBuyableAmount('darkmatter', 14).gte(1)?`<br>Antimatter & Matter Gain ${formatBoost(tmp.blackhole.effect.times(5).pow(2).sub(1))}`:''}
            ${getBuyableAmount('darkmatter', 14).gte(2)?`<br>Hyper Cash Gain ${formatBoost(tmp.blackhole.effect.times(2).pow(3).sub(1))}`:''}
            ${getBuyableAmount('darkmatter', 14).gte(3)?`<br>$, RP, SRP Gain ${formatBoost(tmp.blackhole.effect.times(10).pow(2.5).sub(1))}`:''}
            ${getBuyableAmount('darkmatter', 14).gte(4)?`<br>HRP Gain ${formatBoost(tmp.blackhole.effect.pow(1.5).sub(1))}`:''}
            ${getBuyableAmount('darkmatter', 14).gte(5)?`<br>Exotic Matter Gain ${formatBoost(tmp.blackhole.effect.times(5).pow(0.66).sub(1))}`:''}</div>`:``}
        ],
        'blank',
        ['layer-proxy', ['blackhole', [
            "milestones-upgbox",
        ]]],
        'blank',
    ],
    row: 3,
    upgrades: {
        11: {
            title: 'The Abyss',
            fullDisplay() {
                return `Product of Rebirth Points boosts Dark Matter gain<br>Currently: ${formatBoost(tmp[this.layer].upgrades[this.id].effect.sub(1), false)}`
            },
            costa: new Decimal(5e8),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return player.rebirth.points.mul(player.super.points.mul(player.hyper.points)).max(27).log(3).log(3)
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>DM up1: ×1.5 and ^1.1 Dark Matter (cost: 8DM)`
                
                return `log<sub>3</sub>(log<sub>3</sub>(RP×SRP×HRP))`
            },
        },
        12: {
            title: 'Void Expansion',
            fullDisplay() {
                return `Dark Matter boosts All Matters gain<br>Currently: ${formatBoost(tmp[this.layer].upgrades[this.id].effect.sub(1), false)}`
            },
            costa: new Decimal(5e9),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return player.darkmatter.points.max(1).log(100).pow(2)
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>DM up2: Dark Matter boosts itself by log<sub>5</sub>(DM<sup>1.5</sup>) (cost: 20DM)`
                
                return `log<sub>100</sub>(DM)<sup>2</sup>`
            },
        },
        13: {
            title: 'Evil Upgrade',
            fullDisplay() {
                return `Remove the nerf exponent from the effects of ${options.upgID?'$B1':"'Pay a Megachurch',"} and ${options.upgID?'RB1':"'Virtues'"}`
            },
            costa: new Decimal(2.5e10),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>DM up3: ×1e10 previous recourses (cost: 35DM)`
                
                return
            },
        },
        14: {
            title: 'Void Bribe',
            fullDisplay() {
                return `Cash boosts Dark Matter gain<br>Currently: ${formatBoost(tmp[this.layer].upgrades[this.id].effect.sub(1), false)}`
            },
            costa: new Decimal(1e11),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return player.points.max(1).pow(0.25).log(10).add(1)
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>DM up4: Dark Matter is boosted by log<sub>10</sub>(Cash<sup>0.08</sup>) (cost: 50DM)`
                
                return `log<sub>10</sub>($<sup>0.25</sup>)+1`
            },
        },
        15: {
            title: 'Black Hole',
            fullDisplay() {
                return `Unlock the Black Hole`
            },
            costa: new Decimal(2.5e12),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>DM up5: unlock the blackhole (cost: 80DM)<br><br>BH is increasing in size by x2 and ^1.2 every second (starting at 1 plank length)<br>but it also decreases in size by /BH<sup>0.6</sup> every second<br>BH also boost DM gain by sqrt(BH<sup>0.8</sup>)`
                
                return
            },
        },
        16: {
            title: 'Event Horion',
            fullDisplay() {
                return `Unlock Black Hole Milestones`
            },
            costa: new Decimal(1e14),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>DM up6: unlock Black hole milestones (cost:1T DM)`
                
                return
            },
        },
        17: {
            title: 'Embrace the Void',
            fullDisplay() {
                return `Gain a third Ultimate Matter Fragment`
            },
            costa: new Decimal(1e38),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa); player.matter.umf = player.matter.umf.add(1)},
            tooltip() {
                return `Can someone make a game called Dark Matter Dimensions and upload it to galaxy`
            },
        },
    },
    buyables: {
        11: {
            title: "Dark Matter Galaxies",
            display() {
                return `Increase Black Hole's Volume's gain<br>Currently: ${formatBoost(tmp[this.layer].buyables[this.id].effect.sub(1))}`
            },
            cost(x) {
                return x.pow_base(5).times(5e12)
            },
            effect(x) {
                let base = new Decimal(1.5)
                base = base.times(tmp.darkmatter.buyables[12].effect.add(1))
                return x.pow_base(base)
            },
            canAfford(){return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer, this.id))) && getBuyableAmount(this.layer, this.id).lt(tmp[this.layer].buyables[this.id].purchaseLimit)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer), this.id))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            auto(){return false},
            tooltip() {
                if(options.tooltipCredits) return `DM buy1: increase the multiplicative gain of BH by ×1.5 (Cost: 100DM (×2 per buy))`

                return `Effect: 1.5<sup>x</sup><br>Cost: 5e12×5<sup>x</sup>`
            },
            unlocked(){return player.blackhole.unlocked},
        },
        12: {
            title: "Dark Matter Dimensions",
            display() {
                return `Increase the base of Dark Matter Galaxies<br>Currently: ${format(tmp[this.layer].buyables[this.id].effect.add(1).times(1.5))}`
            },
            cost(x) {
                let ef = x.pow(2).times(3).pow_base(10).times(1e13)
                return ef
            },
            effect(x) {
                if(hasMilestone('blackhole', 1)) { x = x.times(tmp.blackhole.milestones[1].effect) }
                let ef = x.pow_base(1.125).sub(1)
                if(ef.gte(2.5)) { ef = ef.log(2.5).times(2.5) }
                return ef
            },
            canAfford(){return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer, this.id))) && getBuyableAmount(this.layer, this.id).lt(tmp[this.layer].buyables[this.id].purchaseLimit)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer), this.id))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            auto(){return false},
            tooltip() {
                if(options.tooltipCredits) return `DM buy1: increase the multiplicative gain of BH by ×1.5 (Cost: 100DM (×2 per buy))`

                return `Effect: 1.125<sup>x</sup><br>Cost: 1e13×10<sup>3x<sup>2</sup></sup><br>Softcaps at 2.5`
            },
            unlocked(){return player.blackhole.unlocked},
        },
        13: {
            title: "Dark Energy",
            display() {
                return `Increase the exponent of Black Hole's boost to Dark Matter<br>Currently: +${format(tmp[this.layer].buyables[this.id].effect)}`
            },
            cost(x) {
                return x.pow_base(1e6).times(1e14)
            },
            effect(x) {
                return x.div(2)
            },
            canAfford(){return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer, this.id))) && getBuyableAmount(this.layer, this.id).lt(tmp[this.layer].buyables[this.id].purchaseLimit)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer), this.id))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            auto(){return false},
            tooltip() {
                if(options.tooltipCredits) return `BH buy1: Dark Matter is boosted by X<sup>0.75</sup> (X is the amount of bought) (Cost: 10,000 Plank Length (×4 per buy))`

                return `Effect: x/2<br>Cost: 1e14×1e6<sup>x</sup>`
            },
            unlocked(){return player.blackhole.unlocked},
        },
        14: {
            title: "Dark Power",
            display() {
                return `Add another effect to the Black Hole<br>Currently: +${formatWhole(getBuyableAmount('darkmatter', 14))}`
            },
            cost(x) {
                let costs = [new Decimal('1e15'), new Decimal('1e23'), new Decimal('1e30'), new Decimal('1e38'), new Decimal('1e5000')]
                return costs[x.toNumber()]
            },
            effect(x) {
                return x
            },
            canAfford(){return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer, this.id))) && getBuyableAmount(this.layer, this.id).lt(tmp[this.layer].buyables[this.id].purchaseLimit)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer), this.id))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            auto(){return false},
            tooltip() {
                if(options.tooltipCredits) return `BH buy1: Dark Matter is boosted by X<sup>0.75</sup> (X is the amount of bought) (Cost: 10,000 Plank Length (×4 per buy))`

                return 
            },
            unlocked(){return player.blackhole.unlocked},
            purchaseLimit: new Decimal(5),
        },
    },
})

addLayer('blackhole', {
    color: 'var(--universe)',
    update(diff) {
        if(hasUpgrade('darkmatter', 15)) { player.blackhole.unlocked = true; player.blackhole.points = player.blackhole.points.add(tmp.blackhole.matterGain.times(diff)) }
    },
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    resource: 'Planck Volumes of Black Hole',
    matterGain() {
        let gain =  Decimal.dOne
        gain = gain.times(tmp.darkmatter.buyables[11].effect)
        if(hasMilestone('blackhole', 0)) { gain = gain.times(tmp.blackhole.milestones[0].effect) }
        return gain.times(tmp.chall.uTime)
    },
    dmExpo() {
        return Decimal.add(2.5, tmp.darkmatter.buyables[13].effect)
    },
    effect() {
        return player.blackhole.points.max(0).add(1).log(1e3).add(1).pow(1.25)
    },
    resetName: 'the Void',
    milestones: {
        0: {
            requirementDescription() {return `${format(1e12)} BHV`},
            effectDescription() {return `Dark Matter now boosts Black Hole<br>Currently ${formatBoost(tmp[this.layer].milestones[this.id].effect.sub(1))}`},
            done() { return player.blackhole.points.gte(1e12)&&hasUpgrade('darkmatter', 16) },
            unlocked() {return hasUpgrade('darkmatter', 16)},
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
        
                return `log<sub>2</sub>(DM)<sup>3</sup>+1`
            },
            effect() {
                return player.darkmatter.points.max(1).log(2).pow(3).add(1)
            }
        },
        1: {
            requirementDescription() {return `${format(1.5e17)} BHV`},
            effectDescription() {return `Void Milestones boost Dark Matter Dimensions effect<br>Currently ^${format(tmp[this.layer].milestones[this.id].effect)}`},
            done() { return player.blackhole.points.gte(1.5e17)&&hasUpgrade('darkmatter', 16) },
            unlocked() {return hasUpgrade('darkmatter', 16)},
            tooltip() {
                if(options.tooltipCredits) return `BH ms1<br>Requierment: 1Qa plank lenght<br>Effect: decrese all scailing of DM and BH buyables by /1.5`
        
                return `^1+(x/8)`
            },
            effect() {
                return Decimal.div(player.blackhole.milestones.length, 8).add(1)
            }
        },
        2: {
            requirementDescription() {return `${format(5e17)} BHV`},
            effectDescription() {return `Dark Matter boosts itself, a lot<br>Currently ${formatBoost(tmp[this.layer].milestones[this.id].effect.sub(1))}`},
            done() { return player.blackhole.points.gte(5e17)&&hasUpgrade('darkmatter', 16) },
            unlocked() {return hasUpgrade('darkmatter', 16)},
            tooltip() {
                if(options.tooltipCredits) return `BH ms2<br>Requierment: 10<sup>18</sup> plank length<br>Effect: up1,up2,up3 and up4 are aplied twice`
        
                return `log<sub>100</sub>(DM)<sup>10</sup>`
            },
            effect() {
                return player.darkmatter.points.max(1).log(100).pow(10).add(1)
            }
        },
        3: {
            requirementDescription() {return `${format(1e29)} BHV`},
            effectDescription() {return `Dark Matter boosts Antimatter gain, Antimatter boosts Matter gain, and Matter boosts Cash Gain<br>Currently ${formatBoost(tmp[this.layer].milestones[this.id].effect[0].sub(1))}, ${formatBoost(tmp[this.layer].milestones[this.id].effect[1].sub(1))}, ${formatBoost(tmp[this.layer].milestones[this.id].effect[2].sub(1))}`},
            done() { return player.blackhole.points.gte(1e29)&&hasUpgrade('darkmatter', 16) },
            unlocked() {return hasUpgrade('darkmatter', 16)},
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
        
                return `log<sub>100</sub>(DM)<sup>10</sup><br>log<sub>1e4</sub>(AM)<sup>10</sup><br>log<sub>1e8</sub>(M)<sup>10</sup>`
            },
            effect() {
                return [player.darkmatter.points.max(1).log(100).pow(10).add(1), player.antimatter.points.max(1).log(1e4).pow(10).add(1), player.matter.points.max(1).log(1e8).pow(10).add(1)]
            }
        },
        4: {
            requirementDescription() {return `${format(1e33)} BHV`},
            effectDescription() {return `Cash boosts RP gain, RP boosts SRP gain, SRP boosts HRP gain, and HRP boosts Dark Matter gain<br>Currently ${formatBoost(tmp[this.layer].milestones[this.id].effect[0].sub(1))}, ${formatBoost(tmp[this.layer].milestones[this.id].effect[1].sub(1))}, ${formatBoost(tmp[this.layer].milestones[this.id].effect[2].sub(1))}, ${formatBoost(tmp[this.layer].milestones[this.id].effect[3].sub(1))}`},
            done() { return player.blackhole.points.gte(1e33)&&hasUpgrade('darkmatter', 16) },
            unlocked() {return hasUpgrade('darkmatter', 16)},
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
        
                return `log<sub>2</sub>($)<sup>3</sup><br>log<sub>10</sub>(RP)<sup>3</sup><br>log<sub>10</sub>(SRP)<sup>2.5</sup><br>log<sub>10</sub>(HRP)<sup>5</sup>`
            },
            effect() {
                return [player.points.max(1).log(2).pow(3).add(1), player.rebirth.points.max(1).log(10).pow(3).add(1), player.super.points.max(1).log(10).pow(2.5).add(1), player.hyper.points.max(1).log(10).pow(5).add(1)]
            }
        },
    },
    row: 3,
})
