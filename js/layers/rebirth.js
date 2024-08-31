addLayer('rebirth', {
    tabFormat: {
        "Rebirth": {
            content: [
                ['row', ["prestige-button"]],
                'rp-uhoh-display',
                'blank',
                ['display-text', function() {return `Your RP is increasing cash gain by ${formatBoost(tmp.rebirth.effect.sub(1))}<br>You have rebirthed ${formatWhole(player.rebirth.rebirths)} times`}],
                "blank",
                ['row', [
                    ['buyable', 11],
                    ['buyable', 12],
                ]],
                "upgrades",
            ],
            buttonStyle: {
                "background-color": "var(--rebirth)",
                "border-color": "rgba(255, 255, 255, 0.25)",
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
                return tmp.rebirth.getResetGain.gte(player.rebirth.points.div(8)) && tmp.rebirth.canReset && tmp.rebirth.passiveGeneration.lte(0.1)
            },
        },
        "Super": {
            unlocked(){return player.super.unlocked},
            buttonStyle: {
                "background-color": "var(--super)",
                "border-color": "rgba(255, 255, 255, 0.25)",
            },
            embedLayer: 'super',
        },
        "Hyper": {
            unlocked(){return player.hyper.unlocked},
            buttonStyle: {
                "background-color": "var(--hyper)",
                "border-color": "rgba(255, 255, 255, 0.25)",
            },
            embedLayer: 'hyper',
        },
    },
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        rebirths: new Decimal(0),
        resetTime: 0,
        uResetTime: new Decimal(0),
    }},
    resetTooltip() {
        if(options.tooltipCredits) return `Idea from galaxyuser63274<br>RP gain formula: floor((cash/100,000)<sup>0.5</sup>)<br>RP boost to cash formula: 1+RP<sup>0.5</sup>`

        let base = new Decimal(3)
        if(hasUpgrade('cash', 24)) base = base.times(tmp.cash.upgrades[24].effect)
        
        let effbase = new Decimal(2)
        if(hasUpgrade('cash', 25)) effbase = effbase.pow(tmp.cash.upgrades[25].effect)
        if(hasUpgrade('rebirth', 21)) effbase = effbase.pow(tmp.rebirth.upgrades[21].effect)
        return `Gain formula: floor(${format(base)}<sup>log<sub>${format(tmp.rebirth.requires)}</sub>(cash)-1</sup>)<br>Boost to cash formula: log<sub>${format(effbase)}</sub>(RP+${format(effbase)})`
    },
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
        if(hasMilestone('super', 2)) { player.rebirth.rebirths = player.rebirth.rebirths.add(Decimal.times(2, diff).times(tmp.super.challenges[13].effect).times(tmp.chall.uTime)) }
        
        if(hasUpgrade('cash', 33)) { player.rebirth.points = player.rebirth.points.max(tmp.rebirth.getResetGain.times(tmp.cash.upgrades[33].effect)) }

        if(inChallenge('super', 11)) {
            player.rebirth.points = player.rebirth.points.min(tmp.super.challenges[11].nerf)
            player.rebirth.rebirths = player.rebirth.rebirths.min(tmp.super.challenges[11].nerf)
        }

        player.rebirth.uResetTime = player.rebirth.uResetTime.add(Decimal.times(diff, tmp.chall.uTime))
    },
    passiveGeneration() {
        let gain = new Decimal(0)
        if(maxedChallenge('super', 11)) { gain = gain.add(0.1) }
        if(maxedChallenge('super', 12)) { gain = gain.times(10) }
        if(maxedChallenge('super', 13)) { gain = gain.times(10) }
        gain = gain.times(tmp.chall.uTime)
        return tmp.rebirth.canReset?gain:new Decimal(0)
    },
    color: "var(--rebirth)",
    resource: "RP",
    prestigeButtonText() {
        return tmp.rebirth.canReset ? `Rebirth for ${formatWhole(tmp.rebirth.getResetGain)} Rebirth Points${tmp.rebirth.getResetGain.lte(100)?`<br>Next at $${formatWhole(tmp.rebirth.getNextAt)}`:''}`:`Reach $${format(tmp.rebirth.requires.times(tmp.rebirth.buyables[11].effect.pow(tmp.rebirth.buyables[11].nerfExpo)).times(tmp.cash.buyables[11].effect.pow(tmp.cash.buyables[11].nerfExpo)))} to rebirth`
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
            title: 'Upgrader',
            fullDisplay() {
                return `Multiply cash gain based on rebirth upgrades bought<br>
                Currently: ×${format(tmp[this.layer].upgrades[this.id].effect)}`
            },
            costa: new Decimal(1),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                let exponent = new Decimal(1)
                if(hasUpgrade('rebirth', 14)) exponent = exponent.times(tmp.rebirth.upgrades[14].effect)
                return Decimal.pow(player.rebirth.upgrades.length + 1, exponent).max(1)
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>1RP: $ is boosted by RP upgrades. (Formula: 1+Upgrades)`
                
                let exponent = new Decimal(1)
                if(hasUpgrade('rebirth', 14)) exponent = exponent.times(tmp.rebirth.upgrades[14].effect)
                return `${exponent.neq(1)?'(':''}upgrades+1${exponent.neq(1)?`)<sup>${format(exponent)}</sup>`:''}`
            },
        },
        12: {
            title: 'Retainer',
            fullDisplay() {
                return `Keep up to 6 cash upgrades based on rebirths done<br>
                Currently: ${formatWhole(tmp[this.layer].upgrades[this.id].effect)}`
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
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>2RP: Keep 1 $ Upgrade per best RP.`
                
                return `floor(rebirths<sup>0.7</sup>)`
            },
        },
        13: {
            title: 'Unlocker',
            fullDisplay() {
                return `Unlock some more cash upgrades and increase ${options.upgID?'RU2s':"the previous upgrade's"} limit to 11`
            },
            costa: new Decimal(3),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>3RP: Unlock more $ upgrades.`
                
                return
            },
        },
        14: {
            title: 'Enhancer',
            fullDisplay() {
                return `Improve the effect of ${options.upgID?'RU1':'Upgrader'}`
            },
            costa: new Decimal(5),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return new Decimal(1.5)
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>20RP: Change the first upgrades formula to 2xUpgrade#`
                
                return `upgrades+1 to (upgrades+1)<sup>1.5</sup>`
            },
        },
        15: {
            title: 'Inflater',
            fullDisplay() {
                return `Unlock the first rebirth buyable`
            },
            costa: new Decimal(15),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return new Decimal(1.2)
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>100,000RP: Unlock a RP buyable!?`
                
                return
            },
        },
        16: {
            title: 'Improver',
            fullDisplay() {
                return `Unlock the second rebirth buyable`
            },
            costa: new Decimal(30),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return new Decimal(1.2)
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>10,000,000RP: Unlock a second RP buyable!`
                
                return
            },
        },
        21: {
            title: 'Empowerer',
            fullDisplay() {
                return `Increase RP effect base again`
            },
            costa: new Decimal(100),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {if(challengeCompletions('super', 12) < 1)player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return new Decimal(0.8)
            },
            unlocked(){return hasUpgrade('rebirth', 16)},
            tooltip() {
                if(options.tooltipCredits) return `Idea from galacyuser63274<br>2.40e14$: improve rp boost to cash formula again x<sup>0.7</sup> to x<sup>0.8</sup>`
                
                return `log<sub>${format(Decimal.pow(2, tmp.cash.upgrades[25].effect))}</sub>(x) to log<sub>${format(Decimal.pow(2, tmp.cash.upgrades[25].effect).pow(tmp[this.layer].upgrades[this.id].effect))}</sub>(x)`
            },
        },
        22: {
            title: 'Focuser',
            fullDisplay() {
                return `Increase all machine mode's power by ×1.5`
            },
            costa: new Decimal(200),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {if(challengeCompletions('super', 12) < 2)player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return new Decimal(1.5)
            },
            unlocked(){return hasUpgrade('rebirth', 16)},
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
                
                return
            },
        },
        23: {
            title: 'Synergiser',
            fullDisplay() {
                return `Increase Cash Mode's effect based on cash<br>
                Currently: ×${format(tmp[this.layer].upgrades[this.id].effect)}`
            },
            costa: new Decimal(300),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {if(challengeCompletions('super', 12) < 3)player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return player.points.max(1).log(8000000).add(1)
            },
            unlocked(){return hasUpgrade('rebirth', 16)},
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
                
                return `log<sub>${format(8e6)}</sub>(cash)+1`
            },
        },
        24: {
            title: 'Synergiser II',
            fullDisplay() {
                return `Increase Rebirth Mode's effect based on RP<br>
                Currently: ×${format(tmp[this.layer].upgrades[this.id].effect)}`
            },
            costa: new Decimal(500),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {if(challengeCompletions('super', 12) < 4)player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return player.rebirth.points.max(1).log(100).add(1)
            },
            unlocked(){return hasUpgrade('rebirth', 16)},
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
                
                return `log<sub>${formatWhole(100)}</sub>(RP)+1`
            },
        },
        25: {
            title: 'Constructor',
            fullDisplay() {
                return `Increase Neutral Mode's effect based on rebirths<br>
                Currently: ×${format(tmp[this.layer].upgrades[this.id].effect)}`
            },
            costa: new Decimal(750),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {if(challengeCompletions('super', 12) < 5)player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            effect() {
                return player.rebirth.rebirths.max(1).log(250).add(1)
            },
            unlocked(){return hasUpgrade('rebirth', 16)},
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
                
                return `log<sub>${formatWhole(250)}</sub>(rebirths)+1`
            },
        },
        26: {
            title: 'Automator',
            fullDisplay() {
                return `Automatically select Neutral Mode and increase ${options.upgID?'RU2':"Retainer's"} limit to 12`
            },
            costa: new Decimal(1250),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {if(challengeCompletions('super', 12) < 6)player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            unlocked(){return hasUpgrade('rebirth', 16)},
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
                
                return
            },
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
        if(hasChallenge('super', 14)) { gain = gain.times(tmp.super.challenges[14].effect) }
        gain = gain.times(tmp.hyper.effect[1])
        if(hasUpgrade('hyper', 12)) { gain = gain.times(500) }
        if(hasUpgrade('hyper', 33)) { gain = gain.times(tmp.hyper.upgrades[33].effect) }
        if(hasUpgrade('hyper', 41)) { gain = gain.times(10) }
        if(hasUpgrade('hyper', 43)) { gain = gain.times(5) }
        if(hasUpgrade('hyper', 44)) { gain = gain.times(10) }
        return gain
    },
    buyables: {
        11: {
            title: "Virtues",
            display() {
                return `Increase RP gain${maxedChallenge('super', 12)?'':', but also increase cash required to rebirth'}<br>Currently: ×${format(tmp.rebirth.buyables[11].effect)}${maxedChallenge('super', 12)?'':` RP, ×${format(tmp.rebirth.buyables[11].effect.pow(tmp.rebirth.buyables[11].nerfExpo))} req`}`
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
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>RP Buyable 1: Increase RP gain.<br>Price formula: [Times Bought]<sup>4</sup><br>Effect formula: 1.5<sup>[Times bought]</sup>`
                
                return `Effect: (x+1)<sup>0.6</sup><br>Cost: 3<sup>x+1</sup>${maxedChallenge('super', 12)?'':`<br>Nerf: (x+1)<sup>${tmp.rebirth.buyables[11].nerfExpo.times(0.6)}</sup>`}`
            },
        },
        12: {
            title: "Anti-Sins",
            display() {
                return `Increase functional amount of ${options.upgID?'RB11':'Virtues'}<br>Currently: ×${formatWhole(tmp.rebirth.buyables[12].effect)}`
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
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>RP Buyable 2: Increase RP buyable 1 base.<br>Price formula: [Times Bought]<sup>8</sup><br>Changes RPB1 effect formula to: (1.5+0.25×[Times RBP2 bought])<sup>[Times RPB1 bought]</sup>`
                
                return `Effect: (x+1)<br>Cost: 8<sup>x+1</sup>`
            },
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
        if(tmp[layer].row == tmp[this.layer].row) { return }
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
        if(hasMilestone('super', 3)) { buyMax('rebirth', 'buyables', 11) }
        if(hasMilestone('super', 4)) { buyMax('rebirth', 'buyables', 12) }
        if(hasMilestone('hyper', 3)) { autoUpg.push(11, 12, 13, 14, 15, 16) }
        if(challengeCompletions('super', 12) >= 1 || hasMilestone('hyper', 3)){ autoUpg.push(21) }
        if(challengeCompletions('super', 12) >= 2 || hasMilestone('hyper', 3)){ autoUpg.push(22) }
        if(challengeCompletions('super', 12) >= 3 || hasMilestone('hyper', 3)){ autoUpg.push(23) }
        if(challengeCompletions('super', 12) >= 4 || hasMilestone('hyper', 3)){ autoUpg.push(24) }
        if(challengeCompletions('super', 12) >= 5 || hasMilestone('hyper', 3)){ autoUpg.push(25) }
        if(challengeCompletions('super', 12) >= 6 || hasMilestone('hyper', 3)){ autoUpg.push(26) }
        for (let index = 0; index < autoUpg.length; index++) {
            const element = autoUpg[index];
            const upg = layers.rebirth.upgrades[element]
            if(upg.canAfford() && !hasUpgrade('rebirth', element)) { upg.pay(); player.rebirth.upgrades.push(element) }
        }
    },
    resetName: 'Rebirth',
    resetDescription() {
        let text = 'Rebirth will reset Cash, Cash Upgrades'
        if(tmp.cash.buyables[11].unlocked) text = text + ', Cash Buyables'
        if(player.machine.unlocked) text = text + ", the Machine's State"
        return text
    },
})

addLayer('machine', {
    color: "var(--tech)",
    tabFormat: [
        ["row", [
            "machine-display",
            "power-pylons",
        ]],
        "blank",
    ],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        state: 0,
        main: true,
        power: true,
        matter: true,
    }},
    type: 'none',
    row: 0,
    shouldNotify() {
        return hasUpgrade('cash', 26) && player.machine.state == 0 && !hasUpgrade('rebirth', 26)
    },
    clickables: {
        11: {
            title: "Cash",
            display() {
                return `<h2>Cash</h2>`
            },
            canClick() {
                return hasUpgrade('cash', 26) && player.machine.state == 0
            },
            onClick() {
                player.machine.state = 1
            },
            effect() {
                let base = new Decimal(1)
                base = base.add(player.power.cashPower.max(0).add(1).log(2).div(10))
                if(hasMilestone('power', 5)) { base = base.pow(1.6) }
                if(hasUpgrade('rebirth', 22)) { base = base.times(tmp.rebirth.upgrades[22].effect) }
                if(hasUpgrade('rebirth', 23)) { base = base.times(tmp.rebirth.upgrades[23].effect) }
                return base
            },
            style: {
                'width': '110px',
            },
        },
        12: {
            title: "Neutral",
            display() {
                return `<h2>Neutral</h2>`
            },
            canClick() {
                return hasUpgrade('cash', 26) && player.machine.state == 0
            },
            onClick() {
                player.machine.state = 2
            },
            effect() {
                let base = new Decimal(0.5)
                base = base.add(player.power.neutralPower.max(0).add(1).log(2).div(10))
                if(hasUpgrade('rebirth', 22)) { base = base.times(tmp.rebirth.upgrades[22].effect) }
                if(hasUpgrade('rebirth', 25)) { base = base.times(tmp.rebirth.upgrades[25].effect) }
                if(hasUpgrade('hyper', 21)) { base = base.times(25) }
                return base
            },
            style: {
                'width': '110px',
            },
        },
        13: {
            title: "Rebirth",
            display() {
                return `<h2>Rebirth</h2>`
            },
            canClick() {
                return hasUpgrade('cash', 26) && player.machine.state == 0
            },
            onClick() {
                player.machine.state = 3
            },
            effect() {
                let base = new Decimal(0.5)
                base = base.add(player.power.rebirthPower.max(0).add(1).log(2).div(10))
                if(hasMilestone('power', 6)) { base = base.pow(1.4) }
                if(hasUpgrade('rebirth', 22)) { base = base.times(tmp.rebirth.upgrades[22].effect) }
                if(hasUpgrade('rebirth', 24)) { base = base.times(tmp.rebirth.upgrades[24].effect) }
                return base
            },
            style: {
                'width': '110px',
            },
        },
    },
    update(diff) {
        if(hasUpgrade('rebirth', 26) && hasUpgrade('cash', 26)) player.machine.state = 2
        if(hasUpgrade('cash', 26)) {player.machine.unlocked = true}
    },
})