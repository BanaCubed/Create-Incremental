addLayer('rebirth', {
    color: "rgb(21, 115, 7)",
    tabFormat: [
        "prestige-button",
        "blank",
        ['display-text', function() {return `Your RP is increasing cash gain by ×${format(tmp.rebirth.effect)}<br>You have rebirthed ${formatWhole(player.rebirth.rebirths)} times`}],
        "blank",
        ['row', [
            ['buyable', 11],
            ['buyable', 12],
        ]],
        "upgrades",
    ],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        rebirths: new Decimal(0),
        resetTime: 0,
    }},
    shouldNotify() {
        let state = false
        for (const upgrades in tmp.rebirth.upgrades) {
            if (Object.hasOwnProperty.call(tmp.rebirth.upgrades, upgrades)) {
                const upgrade = tmp.rebirth.upgrades[upgrades];
                if(upgrade.canAfford && !hasUpgrade('rebirth', upgrades)) state = true
            }
        }
        for (const buyables in tmp.rebirth.buyables) {
            if (Object.hasOwnProperty.call(tmp.rebirth.buyables, buyables)) {
                const buyable = tmp.rebirth.buyables[buyables];
                if(buyable.canAfford) state = true
            }
        }
        return state
    },
    type: 'custom',
    getNextAt() {
        return this.requires
    },
    getResetGain() {
        let base = new Decimal(3)
        if(hasUpgrade('cash', 24)) base = base.times(tmp.cash.upgrades[24].effect)
        return tmp.rebirth.baseAmount.max(1).log(tmp.rebirth.requires).sub(1).pow_base(base).times(tmp.rebirth.gainMult).floor()
    },
    requires: new Decimal(1500),
    update(diff) {
        if(hasUpgrade('cash', 16)) player.rebirth.unlocked = true
    },
    color: "#BA0022",
    resource: "RP",
    prestigeButtonText() {
        return tmp.rebirth.canReset ? `Rebirth for ${formatWhole(tmp.rebirth.getResetGain)} rebirth points`:`Reach $${format(tmp.rebirth.requires.times(tmp.rebirth.buyables[11].effect.pow(5)))} to rebirth`
    },
    canReset() {
        return tmp.rebirth.baseAmount.gte(this.requires.times(tmp.rebirth.buyables[11].effect.pow(5)))
    },
    effect() {
        let base = new Decimal(2)
        if(hasUpgrade('cash', 25)) base = base.pow(tmp.cash.upgrades[25].effect)
        if(hasUpgrade('rebirth', 21)) base = base.pow(tmp.rebirth.upgrades[21].effect)
        return player.rebirth.points.max(0).add(base).log(base)
    },
    row: 1,
    prestigeNotify() {
        return tmp.rebirth.getResetGain.gte(player.rebirth.points.div(8)) && tmp.rebirth.canReset
    },
    baseResource: '$',
    baseAmount() {return player.points},
    upgrades: {
        11: {
            fullDisplay() {
                return `<h3>Upgrader</h3><br>
                Multiply cash gain based on rebirth upgrades bought<br>
                Currently: ×${formatWhole(tmp[this.layer].upgrades[this.id].effect)}<br><br>
                Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].costa)} RP`
            },
            costa: new Decimal(1),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                let exponent = new Decimal(1)
                if(hasUpgrade('rebirth', 14)) exponent = exponent.times(tmp.rebirth.upgrades[14].effect)
                return Decimal.pow(player.rebirth.upgrades.length + 1, exponent).max(1)
            },
        },
        12: {
            fullDisplay() {
                return `<h3>Retainer</h3><br>
                Keep one cash upgrade for each rebirth^0.5 done<br>
                Currently: ${formatWhole(tmp[this.layer].upgrades[this.id].effect)}<br><br>
                Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].costa)} RP`
            },
            costa: new Decimal(2),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return player.rebirth.rebirths.pow(0.5).floor().min(hasUpgrade('rebirth', 13)?12:6)
            },
        },
        13: {
            fullDisplay() {
                return `<h3>Unlocker</h3><br>
                Unlock some more cash upgrades<br><br>
                Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].costa)} RP`
            },
            costa: new Decimal(3),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
        },
        14: {
            fullDisplay() {
                return `<h3>Enhancer</h3><br>
                Improve the first rebirth upgrade's effect<br><br>
                Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].costa)} RP`
            },
            costa: new Decimal(5),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return new Decimal(1.5)
            }
        },
        15: {
            fullDisplay() {
                return `<h3>Inflater</h3><br>
                Unlock the first rebirth buyable<br><br>
                Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].costa)} RP`
            },
            costa: new Decimal(15),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return new Decimal(1.2)
            }
        },
        16: {
            fullDisplay() {
                return `<h3>Improver</h3><br>
                Unlock the second rebirth buyable<br><br>
                Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].costa)} RP`
            },
            costa: new Decimal(30),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return new Decimal(1.2)
            }
        },
        21: {
            fullDisplay() {
                return `<h3>Empowerer</h3><br>
                Increase RP effect base again<br><br>
                Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].costa)} RP`
            },
            costa: new Decimal(100),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return new Decimal(0.8)
            },
            unlocked(){return hasUpgrade('rebirth', 16)}
        },
        22: {
            fullDisplay() {
                return `<h3>Focuser</h3><br>
                Increase all machine mode's power by ×1.5<br><br>
                Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].costa)} RP`
            },
            costa: new Decimal(200),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return new Decimal(1.5)
            },
            unlocked(){return hasUpgrade('rebirth', 16)}
        },
        23: {
            fullDisplay() {
                return `<h3>Synergiser</h3><br>
                Increase Cash Mode's effect based on cash<br>
                Currently: ×${format(tmp[this.layer].upgrades[this.id].effect)}<br><br>
                Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].costa)} RP`
            },
            costa: new Decimal(300),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return player.points.max(1).log(8000000).add(1)
            },
            unlocked(){return hasUpgrade('rebirth', 16)}
        },
        24: {
            fullDisplay() {
                return `<h3>Synergiser II</h3><br>
                Increase Rebirth Mode's effect based on RP<br>
                Currently: ×${format(tmp[this.layer].upgrades[this.id].effect)}<br><br>
                Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].costa)} RP`
            },
            costa: new Decimal(500),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return player.rebirth.points.max(1).log(100).add(1)
            },
            unlocked(){return hasUpgrade('rebirth', 16)}
        },
        25: {
            fullDisplay() {
                return `<h3>Constructor</h3><br>
                Increase Neutral Mode's effect based on rebirths<br>
                Currently: ×${format(tmp[this.layer].upgrades[this.id].effect)}<br><br>
                Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].costa)} RP`
            },
            costa: new Decimal(750),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return player.rebirth.rebirths.max(1).log(250).add(1)
            },
            unlocked(){return hasUpgrade('rebirth', 16)}
        },
        26: {
            fullDisplay() {
                return `<h3>Automator</h3><br>
                Automatically select Neutral Mode<br><br>
                Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].costa)} RP`
            },
            costa: new Decimal(1250),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            unlocked(){return hasUpgrade('rebirth', 16)}
        },
    },
    onPrestige(gain) {
        player.rebirth.rebirths = player.rebirth.rebirths.add(1)
    },
    gainMult() {
        let gain = new Decimal(1)
        if(player.machine.state === 3) { gain = gain.times(tmp.machine.clickables[13].effect.add(1)) }
        if(player.machine.state === 2) { gain = gain.times(tmp.machine.clickables[13].effect.times(tmp.machine.clickables[12].effect).add(1)) }
        gain = gain.times(tmp.rebirth.buyables[11].effect)
        return gain
    },
    buyables: {
        11: {
            title: "Virtues",
            display() {
                return `Increase RP gain, but also increase cash required to rebirth<br><br>Currently: ×${format(tmp.rebirth.buyables[11].effect)} RP, ×${format(tmp.rebirth.buyables[11].effect.pow(5))} req<br>Count: ${formatWhole(getBuyableAmount('rebirth', 11))}${getBuyableAmount('rebirth', 12).gte(1)?'×'+formatWhole(tmp.rebirth.buyables[12].effect):''}<br>Cost: ${formatWhole(tmp.rebirth.buyables[11].cost)} RP`
            },
            cost(x) {
                return x.add(1).pow_base(3)
            },
            effect(x) {
                return x.times(tmp.rebirth.buyables[12].effect).add(1).pow(0.6)
            },
            unlocked(){return hasUpgrade('rebirth', 15)},
            canAfford(){return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer, this.id)))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer), this.id))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        12: {
            title: "Anti-Sins",
            display() {
                return `Increase functional amount of previous buyable<br><br>Currently: ×${formatWhole(tmp.rebirth.buyables[12].effect)}<br>Count: ${formatWhole(getBuyableAmount('rebirth', 12))}<br>Cost: ${formatWhole(tmp.rebirth.buyables[12].cost)} RP`
            },
            cost(x) {
                return x.add(1).pow_base(8)
            },
            effect(x) {
                return x.add(1)
            },
            unlocked(){return hasUpgrade('rebirth', 16)},
            canAfford(){return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer, this.id)))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer), this.id))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
    },
})

addLayer('machine', {
    color: "rgb(128, 128, 128)",
    tabFormat: [
        ['display-text', function() {return `<h1>The Machine</h1><br>The Machine is currently ${hasUpgrade('cash', 26)?`unlocked and ${player.machine.state == 0?'inactive':`set to ${player.machine.state == 1?'Cash':player.machine.state == 2?'Neutral':'Rebirth'} Mode`}`:'locked'}`}],
        'blank',
        'clickables'
    ],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        state: 0,
    }},
    type: 'none',
    row: 0,
    shouldNotify() {
        return hasUpgrade('cash', 26) && player.machine.state == 0
    },
    update(diff) {
        if(hasUpgrade('cash', 26)) player.machine.unlocked = true
    },
    clickables: {
        11: {
            title: "Cash",
            display() {
                return `Put the machine into Cash Mode<br>This increases cash gain by +${formatWhole(tmp.machine.clickables[11].effect.times(100))}%`
            },
            canClick() {
                return hasUpgrade('cash', 26) && player.machine.state == 0
            },
            onClick() {
                player.machine.state = 1
            },
            effect() {
                let base = new Decimal(1)
                if(hasUpgrade('rebirth', 22)) base = base.times(tmp.rebirth.upgrades[22].effect)
                if(hasUpgrade('rebirth', 23)) base = base.times(tmp.rebirth.upgrades[23].effect)
                return base
            },
        },
        12: {
            title: "Neutral",
            display() {
                return `Put the machine into Neutral Mode<br>This applies both Cash Mode and Rebirth Mode at ${formatWhole(tmp.machine.clickables[12].effect.times(100))}% efficiency`
            },
            canClick() {
                return hasUpgrade('cash', 26) && player.machine.state == 0
            },
            onClick() {
                player.machine.state = 2
            },
            effect() {
                let base = new Decimal(0.5)
                if(hasUpgrade('rebirth', 22)) base = base.times(tmp.rebirth.upgrades[22].effect)
                if(hasUpgrade('rebirth', 25)) base = base.times(tmp.rebirth.upgrades[25].effect)
                return base
            },
        },
        13: {
            title: "Rebirth",
            display() {
                return `Put the machine into Rebirth Mode<br>This increases rebirth point gain by +${formatWhole(tmp.machine.clickables[13].effect.times(100))}%`
            },
            canClick() {
                return hasUpgrade('cash', 26) && player.machine.state == 0
            },
            onClick() {
                player.machine.state = 3
            },
            effect() {
                let base = new Decimal(0.5)
                if(hasUpgrade('rebirth', 22)) base = base.times(tmp.rebirth.upgrades[22].effect)
                if(hasUpgrade('rebirth', 24)) base = base.times(tmp.rebirth.upgrades[24].effect)
                return base
            },
        },
    },
    doReset(layer) {
        layerDataReset('machine', [])
        if(hasUpgrade('rebirth', 26)) player.machine.state = 2
    }
})