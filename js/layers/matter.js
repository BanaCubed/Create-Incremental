addLayer('matter', {
    color: 'var(--matter)',
    symbol: 'M',
    layerShown(){return player.matter.unlocked},
    update(diff) {
        if(hasUpgrade('hyper', 51)) { player.matter.unlocked = true; player.matter.points = player.matter.points.add(tmp.matter.matterGain.times(diff)) }
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
        return player.matter.umf.pow_base(3).pow_base(2).pow_base(2).div(4)
    },
})