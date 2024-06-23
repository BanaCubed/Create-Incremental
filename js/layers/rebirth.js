addLayer('rebirth', {
    tabFormat: {
        "Rebirth": {
            content: [
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
            buttonStyle: {
                "border-color": "#BA0022",
                "background-color": "#5D0011",
            },
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
                        if(buyable.canAfford && buyable.unlocked && !buyable.auto) state = true
                    }
                }
                return state
            },
            prestigeNotify() {
                return tmp.rebirth.getResetGain.gte(player.rebirth.points.div(8)) && tmp.rebirth.canReset
            },
        },
        "Super": {
            unlocked(){return player.super.unlocked && options.superTab},
            buttonStyle: {
                "border-color": "#EB1A3D",
                "background-color": "#750D1E",
            },
            embedLayer: 'super',
        },
    },
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        rebirths: new Decimal(0),
        resetTime: 0,
    }},
    type: 'custom',
    getNextAt() {
        let base = new Decimal(3)
        if(hasUpgrade('cash', 24)) base = base.times(tmp.cash.upgrades[24].effect)
        let has = tmp.rebirth.baseAmount.max(1).log(tmp.rebirth.requires).sub(1).pow_base(base).times(tmp.rebirth.gainMult).floor()
        has = has.add(1)
        return has.div(tmp.rebirth.gainMult).log(base).add(1).pow_base(tmp.rebirth.requires).max(1)
    },
    getResetGain() {
        let base = new Decimal(3)
        if(hasUpgrade('cash', 24)) base = base.times(tmp.cash.upgrades[24].effect)
        return tmp.rebirth.baseAmount.max(1).log(tmp.rebirth.requires).sub(1).pow_base(base).times(tmp.rebirth.gainMult).floor()
    },
    requires() {
        let base = new Decimal(1500)
        if(inChallenge('super', 12)) { base = base.times(tmp.super.challenges[12].nerf) }
        if(hasUpgrade('cash', 34)) { base = base.sub(500) }
        return base
    },
    update(diff) {
        if(hasUpgrade('cash', 16)) { player.rebirth.unlocked = true }
        if(hasMilestone('super', 2)) { player.rebirth.rebirths = player.rebirth.rebirths.add(Decimal.times(2, diff)) }
        
        if(hasUpgrade('cash', 33)) { player.rebirth.points = player.rebirth.points.max(tmp.rebirth.getResetGain) }

        if(inChallenge('super', 11)) {
            player.rebirth.points = player.rebirth.points.min(tmp.super.challenges[11].nerf)
            player.rebirth.rebirths = player.rebirth.rebirths.min(tmp.super.challenges[11].nerf)
        }

    },
    passiveGeneration() {
        let gain = new Decimal(0)
        if(maxedChallenge('super', 11)) gain = gain.add(0.025)
        if(maxedChallenge('super', 12)) gain = gain.times(10)
        return gain
    },
    color: "#BA0022",
    resource: "RP",
    prestigeButtonText() {
        return tmp.rebirth.canReset ? `Rebirth for ${formatWhole(tmp.rebirth.getResetGain)} Rebirth Points${player.rebirth.points.add(tmp.rebirth.getResetGain).lte(100)?`<br>Next at $${formatWhole(tmp.rebirth.getNextAt)}`:''}`:`Reach $${format(tmp.rebirth.requires.times(tmp.rebirth.buyables[11].effect.pow(tmp.rebirth.buyables[11].nerfExpo)).times(tmp.cash.buyables[11].effect.pow(tmp.cash.buyables[11].nerfExpo)))} to rebirth`
    },
    canReset() {
        return tmp.rebirth.baseAmount.gte(tmp.rebirth.requires.times(tmp.rebirth.buyables[11].effect.pow(tmp.rebirth.buyables[11].nerfExpo)).times(tmp.cash.buyables[11].effect.pow(tmp.cash.buyables[11].nerfExpo)))
    },
    effect() {
        let base = new Decimal(2)
        if(hasUpgrade('cash', 25)) base = base.pow(tmp.cash.upgrades[25].effect)
        if(hasUpgrade('rebirth', 21)) base = base.pow(tmp.rebirth.upgrades[21].effect)
        return player.rebirth.points.max(0).add(base).log(base)
    },
    row: 1,
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
                Keep up to 6 cash upgrades based on rebirths done<br>
                Currently: ${formatWhole(tmp[this.layer].upgrades[this.id].effect)}<br><br>
                Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].costa)} RP`
            },
            costa: new Decimal(2),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                let limit = 6
                if(hasUpgrade('rebirth', 13)) limit += 5
                if(hasUpgrade('rebirth', 26)) limit += 1
                return player.rebirth.rebirths.pow(0.7).floor().min(limit)
            },
        },
        13: {
            fullDisplay() {
                return `<h3>Unlocker</h3><br>
                Unlock some more cash upgrades and increase previous upgrade's limit to 11<br><br>
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
            pay() {if(challengeCompletions('super', 12) < 1)player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
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
            pay() {if(challengeCompletions('super', 12) < 2)player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
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
            pay() {if(challengeCompletions('super', 12) < 3)player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
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
            pay() {if(challengeCompletions('super', 12) < 4)player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
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
            pay() {if(challengeCompletions('super', 12) < 5)player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return player.rebirth.rebirths.max(1).log(250).add(1)
            },
            unlocked(){return hasUpgrade('rebirth', 16)}
        },
        26: {
            fullDisplay() {
                return `<h3>Automator</h3><br>
                Automatically select Neutral Mode and increase Retainer's limit to 12<br><br>
                Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].costa)} RP`
            },
            costa: new Decimal(1250),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {if(challengeCompletions('super', 12) < 6)player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
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
        if(hasUpgrade('cash', 32)) { gain = gain.times(tmp.cash.upgrades[32].effect) }
        gain = gain.times(tmp.rebirth.buyables[11].effect)
        gain = gain.times(tmp.cash.buyables[11].effect)
        gain = gain.times(tmp.super.effect[0])
        return gain
    },
    buyables: {
        11: {
            title: "Virtues",
            display() {
                return `Increase RP gain${maxedChallenge('super', 12)?'':', but also increase cash required to rebirth'}<br><br>Currently: ×${format(tmp.rebirth.buyables[11].effect)}${maxedChallenge('super', 12)?'':` RP, ×${format(tmp.rebirth.buyables[11].effect.pow(tmp.rebirth.buyables[11].nerfExpo))} req`}<br>Count: ${formatWhole(getBuyableAmount('rebirth', 11))}${getBuyableAmount('rebirth', 12).gte(1)?'×'+formatWhole(tmp.rebirth.buyables[12].effect):''}<br>Cost: ${formatWhole(tmp.rebirth.buyables[11].cost)} RP`
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
                if(!hasMilestone('super', 2)) player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer), this.id))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            auto(){return hasMilestone('super', 3)},
            nerfExpo() {
                let base = new Decimal(4)
                base = base.sub(Decimal.times(0.4, challengeCompletions('super', 12)))
                if(hasMilestone('super', 4)){base = base.div(2)}
                return base
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
                if(!hasMilestone('super', 2)) player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer), this.id))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            auto(){return hasMilestone('super', 4)},
        },
    },
    hotkeys: [
        {
            key: "r", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "R: Rebirth", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() { if (player.rebirth.unlocked) doReset("rebirth") },
            unlocked() {return player.rebirth.unlocked} // Determines if you can use the hotkey, optional
        }
    ],
    doReset(layer) {
        if(layer == 'rebirth') return
        layerDataReset('rebirth')
        let savedUpgs = []
        if(layer == 'super') {
            if(hasMilestone('super', 1)) {
                if(player.super.rebirths.gte(1)) savedUpgs.push(11)
                if(player.super.rebirths.gte(2)) savedUpgs.push(12)
                if(player.super.rebirths.gte(3)) savedUpgs.push(13)
                if(player.super.rebirths.gte(4)) savedUpgs.push(14)
                if(player.super.rebirths.gte(5)) savedUpgs.push(15)
                if(player.super.rebirths.gte(6)) savedUpgs.push(16)
            }
            if(hasMilestone('super', 6)) {
                if(milestoneEffect('super', 6).gte(1)) savedUpgs.push(21)
                if(milestoneEffect('super', 6).gte(2)) savedUpgs.push(22)
                if(milestoneEffect('super', 6).gte(3)) savedUpgs.push(23)
                if(milestoneEffect('super', 6).gte(4)) savedUpgs.push(24)
                if(milestoneEffect('super', 6).gte(5)) savedUpgs.push(25)
                if(milestoneEffect('super', 6).gte(6)) savedUpgs.push(26)
            }
            for (let index = 0; index < savedUpgs.length; index++) {
                const element = savedUpgs[index];
                player.rebirth.upgrades.push(element)
            }
        }
    },
    automate() {
        let autoUpg = []
        if(hasMilestone('super', 3)) {
            buyMax('rebirth', 'buyables', 11)
        }
        if(hasMilestone('super', 4)) {
            buyMax('rebirth', 'buyables', 12)
        }
        if(challengeCompletions('super', 12) >= 1){ autoUpg.push(21) }
        if(challengeCompletions('super', 12) >= 2){ autoUpg.push(22) }
        if(challengeCompletions('super', 12) >= 3){ autoUpg.push(23) }
        if(challengeCompletions('super', 12) >= 4){ autoUpg.push(24) }
        if(challengeCompletions('super', 12) >= 5){ autoUpg.push(25) }
        if(challengeCompletions('super', 12) >= 6){ autoUpg.push(26) }
        for (let index = 0; index < autoUpg.length; index++) {
            const element = autoUpg[index];
            const upg = layers.rebirth.upgrades[element]
            if(upg.canAfford() && !hasUpgrade('rebirth', element)) { upg.pay(); player.rebirth.upgrades.push(element) }
        }
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
        return hasUpgrade('cash', 26) && player.machine.state == 0 && !hasUpgrade('rebirth', 26)
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
    update(diff) {
        if(hasUpgrade('rebirth', 26) && hasUpgrade('cash', 26)) player.machine.state = 2
    }
})