addLayer('cash', {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    row: 0,
    costFactor() {
        let factor = new Decimal(1)
        if(inChallenge('super', 13)) { factor = factor.times(tmp.super.challenges[13].nerf.add(1)) }
        if(inChallenge('super', 14)) { factor = factor.times('1e1.79e308') }
        if(hasUpgrade('super', 16)) { factor = factor.div(tmp.super.effect[1]) }
        return factor
    },
    upgrades: {
        11: {
            title: 'Passive Income',
            fullDisplay() {
                return `Start passively earning $${format(tmp[this.layer].upgrades[this.id].effect)} per second`
            },
            costa: new Decimal(0),
            canAfford() {return true},
            effect() {
                let effect = new Decimal(1)
                if(hasMilestone('chall', 0)) { effect = effect.times(5) }
                return effect
            },
            pay() {},
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>0$: start generating 1$ per second`
                return
            },
        },
        12: {
            title: 'Double Shifts',
            fullDisplay() {
                return `${hasMilestone('chall', 0)?'Quadruple':'Double'} cash gain`
            },
            costa() {return Decimal.times(9.99, tmp.cash.costFactor)},
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(!hasMilestone('super', 0)) {player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)}},
            effect() {
                let effect = new Decimal(2)
                if(hasMilestone('chall', 0)) { effect = effect.times(2) }
                return effect
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>10$: multiply your cash gain by ×4`
                return
            },
        },
        13: {
            title: 'Get a Promotion',
            fullDisplay() {
                return `Increase <span class="cash infoText">cash</span> gain based on current <span class="cash infoText">cash</span><br>
                Currently: <span class="cash infoText">×${format(tmp[this.layer].upgrades[this.id].effect)}</span>`
            },
            costa() {return Decimal.times(24.99, tmp.cash.costFactor)},
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(!hasMilestone('super', 0)) {player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)}},
            effect() {
                let exponent = new Decimal(1)
                if(hasUpgrade('cash', 23)) exponent = exponent.times(tmp.cash.upgrades[23].effect)
                if(hasMilestone('chall', 0)) { exponent = exponent.times(1.5) }
                return player.points.max(1).log(10).add(1).pow(exponent)
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>50$: boost cash by log<sub>5</sub>(cash)`
                
                let exponent = new Decimal(1)
                if(hasUpgrade('cash', 23)) exponent = exponent.times(tmp.cash.upgrades[23].effect)
                if(hasMilestone('chall', 0)) { exponent = exponent.times(1.5) }
                return `${exponent.neq(1)?'(':''}log<sub>10</sub>(cash)+1${exponent.neq(1)?`)<sup>${format(exponent)}</sup>`:''}`
            },
        },
        14: {
            title: 'Get a Second Job',
            fullDisplay() {
                return `Increase <span class="cash infoText">cash</span> gain based on current <span class="cash infoText">cash</span> again<br>
                Currently: <span class="cash infoText">×${format(tmp[this.layer].upgrades[this.id].effect)}</span>`
            },
            costa() {return Decimal.times(99.99, tmp.cash.costFactor)},
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(!hasMilestone('super', 0)) {player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)}},
            effect() {
                let effect = player.points.max(1).log(1.5).add(1).pow(0.4)
                if(hasMilestone('chall', 0)) { effect = effect.pow(2) }
                return effect
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>2,000$: boost cash by log<sub>8</sub>(cash<sup>1.5</sup>)<sup>0.5</sup>`
                
                let exponent = new Decimal(0.4)
                if(hasMilestone('chall', 0)) { exponent = exponent.times(2) }
                return `${exponent.neq(1)?'(':''}log<sub>1.5</sub>(cash)+1${exponent.neq(1)?`)<sup>${format(exponent)}</sup>`:''}`
            },
        },
        15: {
            title: 'Compensate for Inflation',
            fullDisplay() {
                return `${hasMilestone('chall', 0)?'Quadruple':'Double'} <span class="cash infoText">cash</span> gain again`
            },
            costa() {return Decimal.times(249.99, tmp.cash.costFactor)},
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(!hasMilestone('super', 0)) {player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)}},
            effect() {
                let effect = new Decimal(2)
                if(hasMilestone('chall', 0)) { effect = effect.times(2) }
                return effect
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>200$: tickspeed ×2`
                
                return
            },
        },
        16: {
            title: 'Overcompensate for Inflation',
            fullDisplay() {
                return `${hasMilestone('chall', 0)?'Quadruple':'Double'} <span class="cash infoText">cash</span> gain yet again`
            },
            costa() {return Decimal.times(599.99, tmp.cash.costFactor)},
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(!hasMilestone('super', 0)) {player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)}},
            effect() {
                let effect = new Decimal(2)
                if(hasMilestone('chall', 0)) { effect = effect.times(2) }
                return effect
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from galaxyuser63274<br>60,000$: tickspeed ×1.5`
                
                return
            },
        },
        21: {
            title: 'Accellerate Inflation',
            fullDisplay() {
                return `Increase <span class="cash infoText">cash</span> gain absed on time in current <span class="rebirth infoText">rebirth</span><br>
                Currently: <span class="cash infoText">×${format(tmp[this.layer].upgrades[this.id].effect)}</span>`
            },
            costa() {return Decimal.times(2500, tmp.cash.costFactor)},
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(challengeCompletions('super', 11) < 1)player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)},
            effect() {
                let effect = Decimal.max(player.rebirth.uResetTime, 1).log(10).add(1)
                if(hasMilestone('chall', 0)) { effect = effect.pow(2) }
                return effect
            },
            unlocked(){return hasUpgrade('rebirth', 13)},
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
                
                let exponent = new Decimal(1)
                if(hasMilestone('chall', 0)) { exponent = exponent.times(2) }
                return `${exponent.neq(1)?'(':''}log<sub>10</sub>(seconds)+1${exponent.neq(1)?`)<sup>${format(exponent)}</sup>`:''}`
            },
        },
        22: {
            title: 'Triple Shifts',
            fullDisplay() {
                return `Increase <span class="cash infoText">cash</span> gain based on amount of <span class="cash infoText">cash</span> upgrades<br>
                Currently: <span class="cash infoText">×${format(tmp[this.layer].upgrades[this.id].effect)}</span>`
            },
            costa() {return Decimal.times(1e4, tmp.cash.costFactor)},
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(challengeCompletions('super', 11) < 2)player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)},
            effect() {
                let effect = Decimal.max(player.cash.upgrades.length, 1).pow(0.5).add(1)
                if(hasMilestone('chall', 0)) { effect = effect.pow(3) }
                return effect
            },
            unlocked(){return hasUpgrade('rebirth', 13)},
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
                
                let exponent = new Decimal(0.5)
                if(hasMilestone('chall', 0)) { exponent = exponent.times(3) }
                return `upgrades${exponent.neq(1)?`<sup>${format(exponent)}</sup>`:''}`
            },
        },
        23: {
            title: 'Buy a Workplace',
            fullDisplay() {
                return `Increase <span class="cash infoText">${options.upgID?"$U3s":"Get a Promotion's"}</span> effect`
            },
            costa() {return Decimal.times(1e5, tmp.cash.costFactor)},
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(challengeCompletions('super', 11) < 3)player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)},
            effect() {
                let effect = new Decimal(1.3)
                if(hasMilestone('chall', 0)) { effect = effect.add(0.3) }
                return effect
            },
            unlocked(){return hasUpgrade('rebirth', 13)},
            tooltip() {
                if(options.tooltipCredits) return `Idea from galaxyuser63274<br>20,000$: change the 50$ upgrade (${options.upgID?'$U3':'Get a Promotion'}) log to log<sub>3</sub>(cash)`
                
                let exponent = new Decimal(1)
                let boost = new Decimal(1.3)
                if(hasMilestone('chall', 0)) { exponent = exponent.times(1.5); boost = boost.add(0.3) }
                return `${exponent.neq(1)?'(':''}log<sub>10</sub>(cash)+1${exponent.neq(1)?`)<sup>${format(exponent)}</sup>`:''} to (log<sub>10</sub>(cash)+1)<sup>${format(exponent.times(boost))}</sup>`
            },
        },
        24: {
            title: 'Buy a Church',
            fullDisplay() {
                return `Increase <span class="rebirth infoText">RP</span> gain base`
            },
            costa() {return Decimal.times(5e5, tmp.cash.costFactor)},
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(challengeCompletions('super', 11) < 4)player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)},
            effect() {
                let effect = new Decimal(1.25)
                if(hasMilestone('chall', 0)) { effect = effect.add(0.25) }
                return effect
            },
            unlocked(){return hasUpgrade('rebirth', 13)},
            tooltip() {
                if(options.tooltipCredits) return `Idea from galaxyuser63274<br>80,000,000$: improve rp gain formula x<sup>0.5</sup> to x<sup>0.7</sup>`
                
                return `3<sup>x</sup> to ${format(tmp[this.layer].upgrades[this.id].effect.times(3))}<sup>x</sup>`
            },
        },
        25: {
            title: 'Buy an Artifact',
            fullDisplay() {
                return `Improve <span class="rebirth infoText">RP</span> effect base`
            },
            costa() {return Decimal.times(2.5e6, tmp.cash.costFactor)},
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(challengeCompletions('super', 11) < 5)player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)},
            effect() {
                let effect = new Decimal(0.8)
                if(hasMilestone('chall', 0)) { effect = effect.sub(0.2) }
                return effect
            },
            unlocked(){return hasUpgrade('rebirth', 13)},
            tooltip() {
                if(options.tooltipCredits) return `Idea from galaxyuser63274<br>250,000,000$: improve rp boost to cash formula x<sup>0.5</sup> to x<sup>0.7</sup>`
                
                return `log<sub>2</sub>(x) to log<sub>${format(Decimal.pow(2, tmp[this.layer].upgrades[this.id].effect))}</sub>(x)`
            },
        },
        26: {
            title: 'Discover Something',
            fullDisplay() {
                return `Unlock <span class="machine infoText">The Machine</span>`
            },
            costa() {return Decimal.times(8e6, tmp.cash.costFactor)},
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(challengeCompletions('super', 11) < 6)player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)},
            unlocked(){return hasUpgrade('rebirth', 13)},
            tooltip() {
                if(options.tooltipCredits) return `Idea from galaxyuser63274<br>1.00e9$: unlock a useful machine...<br><br>

                    THE MACHINE<br>
                    lets you give boosts to cash and RP gain, but you have to make a decision<br>
                    Cash mode: ×4 cash, ×2 RP<br>
                    Neutral mode: ×3 cash, ×3 RP<br>
                    Rebirth mode: ×2 cash, ×4 RP`
                
                return
            },
        },
        31: {
            title: 'Capitalism',
            fullDisplay() {
                return `Increase <span class="cash infoText">cash</span> gain based on <span class="rebirth infoText">RP</span> gain on <span class="rebirth infoText">Rebirth</span><br>
                Currently: <span class="cash infoText">×${format(tmp[this.layer].upgrades[this.id].effect)}</span>`
            },
            costa() {return Decimal.times(1e10, tmp.cash.costFactor)},
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)},
            unlocked(){return hasUpgrade('super', 13)},
            effect() {
                let effect = tmp.rebirth.getResetGain.max(0).add(1).log(150).add(1)
                if(hasMilestone('chall', 0)) { effect = effect.pow(1.5) }
                return effect
            },
            tooltip() {
                if(options.tooltipCredits) return `Split from idea from galaxyuser63274<br>4.00e15$: Create a synergy boost between cash and RP<br>RP: log<sub>10</sub>(log<sub>10</sub>(cash)), cash: log<sub>10</sub>(RP)`
                
                let exponent = new Decimal(1)
                if(hasMilestone('chall', 0)) { exponent = exponent.times(1.5) }
                return `${exponent.neq(1)?'(':''}log<sub>150</sub>(RP)${exponent.neq(1)?')<sup>'+format(exponent)+'</sup>':''}`
            },
        },
        32: {
            title: 'Socialism',
            fullDisplay() {
                return `Increase <span class="rebirth infoText">RP</span> gain based on <span class="cash infoText">cash</span> upgrades<br>
                Currently: <span class="rebirth infoText">×${format(tmp[this.layer].upgrades[this.id].effect)}</span>`
            },
            costa() {return Decimal.times(1e11, tmp.cash.costFactor)},
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)},
            unlocked(){return hasUpgrade('super', 13)},
            effect() {
                let effect = Decimal.add(player.cash.upgrades.length, 3).div(3).max(1)
                if(hasMilestone('chall', 0)) { effect = effect.pow(1.5) }
                return effect
            },
            tooltip() {
                if(options.tooltipCredits) return `Split from idea from galaxyuser63274<br>4.00e15$: Create a synergy boost between cash and RP<br>RP: log<sub>10</sub>(log<sub>10</sub>(cash)), cash: log<sub>10</sub>(RP)`
                
                let exponent = new Decimal(1)
                if(hasMilestone('chall', 0)) { exponent = exponent.times(1.5) }
                return `${exponent.neq(1)?'(':''}(upgrades + 3)/3${exponent.neq(1)?')<sup>'+format(exponent)+'</sup>':''}`
            },
        },
        33: {
            title: 'Communism',
            fullDisplay() {
                return `${hasMilestone('chall', 0)?'If RP on Rebirth ×300 is greater than current RP, set current RP to RP on Rebirth ×300':'If RP on Rebirth is greater than current RP, set current RP to RP on Rebirth'}`
            },
            costa() {return Decimal.times(1e12, tmp.cash.costFactor)},
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)},
            unlocked(){return hasUpgrade('super', 13)},
            effect() {
                let effect = new Decimal(1)
                if(hasMilestone('chall', 0)) { effect = effect.times(300) }
                return effect
            },
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
                
                return
            },
        },
        34: {
            title: 'Buy a Country',
            fullDisplay() {
                return `Reduce Rebirth requirement to $1000`
            },
            costa() {return Decimal.times(1e13, tmp.cash.costFactor)},
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)},
            unlocked(){return hasUpgrade('super', 13)},
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
                
                return
            },
        },
        35: {
            title: 'Buy a Continent',
            fullDisplay() {
                return `Reduce Super Rebirth requirement to 1500 RP`
            },
            costa() {return Decimal.times(1e14, tmp.cash.costFactor)},
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)},
            unlocked(){return hasUpgrade('super', 13)},
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
                
                return
            },
        },
        36: {
            title: 'Buy the Earth',
            fullDisplay() {
                return `Neutral Mode's effect also boosts SRP gain at a reduced rate<br>
                Currently: ×${format(tmp[this.layer].upgrades[this.id].effect)}`
            },
            costa() {return Decimal.times(1.0001e15, tmp.cash.costFactor)},
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)},
            unlocked(){return hasUpgrade('super', 13)},
            effect() {
                let effect = tmp.machine.clickables[12].effect.max(0).add(1).pow(0.5)
                if(hasMilestone('chall', 0)) { effect = effect.pow(1.25) }
                return effect
            },
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
                
                let exponent = new Decimal(0.5)
                if(hasMilestone('chall', 0)) { exponent = exponent.times(1.25) }
                return `(effect+1)<sup>${format(exponent)}</sup>`
            },
        },
    },
    color: "rgb(21, 115, 7)",
    tabFormat: {
        "Main": {
            unlocked(){return player.machine.unlocked},
            content: [
                'tax-uhoh-display',
                "buyables",
                'upgrades'
            ],
            buttonStyle: {
                "background-color": "rgb(21, 115, 7)",
                "border-color": "rgba(255, 255, 255, 0.25)",
            },
            shouldNotify() {
                let state = false
                for (const upgrades in tmp.cash.upgrades) {
                    if (Object.hasOwnProperty.call(tmp.cash.upgrades, upgrades)) {
                        const upgrade = tmp.cash.upgrades[upgrades];
                        if(upgrade.canAfford && !hasUpgrade('cash', upgrades) && upgrade.unlocked) state = true
                    }
                }
                for (const buyables in tmp.cash.buyables) {
                    if (Object.hasOwnProperty.call(tmp.cash.buyables, buyables)) {
                        const buyable = tmp.cash.buyables[buyables];
                        if(buyable.canAfford && buyable.unlocked && !buyable.auto) state = true
                    }
                }
                return state
            },
        },
        "The Machine": {
            unlocked(){return player.machine.unlocked},
            buttonStyle: {
                "background-color": "#444444",
                "border-color": "rgba(255, 255, 255, 0.25)",
            },
            embedLayer: 'machine',
        },
    },
    doReset(layer) {
        let keep = []
        if(hasMilestone('super', 7) && (layer == 'rebirth' || layer == 'super')) keep.push('upgrades')
        if(hasMilestone('hyper', 2) && (layer == 'hyper')) keep.push('upgrades')
        layerDataReset('cash', keep)
        let upgs = []
        if(layer === 'rebirth') {
            if(hasUpgrade('rebirth', 12) && !hasMilestone('super', 7)) {
                if(layers.rebirth.upgrades[12].effect().gte(1)) upgs.push(11)
                if(layers.rebirth.upgrades[12].effect().gte(2)) upgs.push(12)
                if(layers.rebirth.upgrades[12].effect().gte(3)) upgs.push(13)
                if(layers.rebirth.upgrades[12].effect().gte(4)) upgs.push(14)
                if(layers.rebirth.upgrades[12].effect().gte(5)) upgs.push(15)
                if(layers.rebirth.upgrades[12].effect().gte(6)) upgs.push(16)
                if(layers.rebirth.upgrades[12].effect().gte(7)) upgs.push(21)
                if(layers.rebirth.upgrades[12].effect().gte(8)) upgs.push(22)
                if(layers.rebirth.upgrades[12].effect().gte(9)) upgs.push(23)
                if(layers.rebirth.upgrades[12].effect().gte(10)) upgs.push(24)
                if(layers.rebirth.upgrades[12].effect().gte(11)) upgs.push(25)
                if(layers.rebirth.upgrades[12].effect().gte(12)) upgs.push(26)
                for (let index = 0; index < upgs.length; index++) {
                    const element = upgs[index];
                    
                    player.cash.upgrades.push(element)
                }
            }
        }
    },
    automate() {
        let autoUpg = []
        if(hasMilestone('super', 0)){ autoUpg.push(11, 12, 13, 14, 15, 16) }
        if(challengeCompletions('super', 11) >= 1){ autoUpg.push(21) }
        if(challengeCompletions('super', 11) >= 2){ autoUpg.push(22) }
        if(challengeCompletions('super', 11) >= 3){ autoUpg.push(23) }
        if(challengeCompletions('super', 11) >= 4){ autoUpg.push(24) }
        if(challengeCompletions('super', 11) >= 5){ autoUpg.push(25) }
        if(challengeCompletions('super', 11) >= 6){ autoUpg.push(26) }
        for (let index = 0; index < autoUpg.length; index++) {
            const element = autoUpg[index];
            const upg = layers.cash.upgrades[element]
            if(upg.canAfford() && !hasUpgrade('cash', element)) { upg.pay(); player.cash.upgrades.push(element) }
        }
        if(hasMilestone('super', 3)) {
            buyMax('cash', 'buyables', 11)
        }
    },
    buyables: {
        11: {
            title: "Pay a Megachurch",
            display() {
                return `Increase RP gain${maxedChallenge('super', 12)?'':', but also increase cash required to rebirth'}<br>Currently: ×${format(tmp.cash.buyables[11].effect)}${maxedChallenge('super', 12)?'':` RP, ×${format(tmp.cash.buyables[11].effect.pow(tmp.cash.buyables[11].nerfExpo))} req`}`
            },
            cost(x) {
                return x.add(6).pow_base(10)
            },
            effect(x) {
                return x.add(1).pow(0.5)
            },
            unlocked(){return hasMilestone('super', 1)},
            canAfford(){return player.points.gte(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer, this.id)))},
            buy() {
                if(!hasMilestone('super', 5)) player.points = player.points.sub(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer), this.id))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            auto(){return hasMilestone('super', 3)},
            nerfExpo() {
                let base = new Decimal(5)
                base = base.sub(Decimal.times(0.5, challengeCompletions('super', 12)))
                if(hasMilestone('super', 4)){base = base.div(2)}
                return base
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>$ Buyable 1: Increase RP gain.<br>Price formula: [Times Bought]<sup>6</sup><br>Effect formula: 1.1<sup>[Times bought]</sup>`
                
                return `Effect: (x+1)<sup>0.5</sup><br>Cost: 10<sup>x+6</sup>${maxedChallenge('super', 12)?'':`<br>Nerf: (x+1)<sup>${tmp.cash.buyables[11].nerfExpo.times(0.5)}</sup>`}`
            },
        },
    },
})
