addLayer('super', {
    color: "var(--super)",
    tabFormat: [
        ['row', [
            "prestige-button",
            "milestones-scroll",
        ]],
        'srp-uhoh-display',
        "blank",
        ['display-text', function() {return `Your total SRP is increasing cash gain by ${formatBoost(tmp.super.effect[1].sub(1))}, and RP gain by ${formatBoost(tmp.super.effect[0].sub(1))}<br>You have super rebirthed ${formatWhole(player.super.rebirths)} times, and have ${formatWhole(player.super.total)} total SRP`}],
        "blank",
        "upgrades",
        "blank",
    ],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        rebirths: new Decimal(0),
        resetTime: 0,
        total: new Decimal(0),
        tax: new Decimal(1),
    }},
    shouldNotify() {
        let state = false
        for (const upgrades in tmp.super.upgrades) {
            if (Object.hasOwnProperty.call(tmp.super.upgrades, upgrades)) {
                const upgrade = tmp.super.upgrades[upgrades];
                if(upgrade.canAfford && !hasUpgrade('rebirth', upgrades)) state = true
            }
        }
        return state
    },
    type: 'custom',
    getNextAt() {
        let base = new Decimal(3.14)
        let has = tmp.super.baseAmount.max(1).log(tmp.super.requires).sub(1).pow_base(base).times(tmp.super.gainMult).floor()
        has = has.add(1)
        return has.div(tmp.super.gainMult).log(base).add(1).pow_base(tmp.super.requires).max(1)
    },
    getResetGain() {
        let base = new Decimal(3.14)
        return tmp.super.baseAmount.max(1).log(tmp.super.requires).sub(1).pow_base(base).times(tmp.super.gainMult).floor()
    },
    requires() {
        let base = new Decimal(2500)
        if(hasUpgrade('cash', 35)) { base = base.sub(1000) }
        return base
    },
    update(diff) {
        if(hasUpgrade('rebirth', 26)) player.super.unlocked = true
        if(inChallenge('super', 15)) {
            player.super.tax = player.super.tax.times(tmp.super.challenges[15].nerf.pow(diff))
        }
        if(hasMilestone('hyper', 6)) { player.super.rebirths = player.super.rebirths.add(Decimal.times(25, diff).times(tmp.chall.uTime)) }
    },
    resource: "SRP",
    prestigeButtonText() {
        return tmp.super.canReset ? `Super Rebirth for ${formatWhole(tmp.super.getResetGain)} Super Rebirth Points${tmp.super.getResetGain.lte(1000)?`<br>Next at ${formatWhole(tmp.super.getNextAt)} RP`:''}`:`Reach ${format(tmp.super.requires)} RP to super rebirth`
    },
    canReset() {
        return tmp.super.baseAmount.gte(tmp.super.requires)
    },
    effect() {
        let base = new Decimal(2)
        return [player.super.total.max(0).add(base).log(base), player.super.total.max(0).times(3).add(1).log(2).pow(1.25).add(1)]
    },
    row: 2,
    prestigeNotify() {
        return tmp.super.getResetGain.gte(player.super.points.div(8)) && tmp.super.canReset
    },
    baseResource: 'RP',
    baseAmount() {return player.rebirth.points},
    onPrestige(gain) {
        player.super.rebirths = player.super.rebirths.add(1)
    },
    resetTooltip() {
        if(options.tooltipCredits) return `Idea from galaxyuser63274<br>Super Rebirth resets everything rebirth points do including rebirth points, all upgrades, THE MACHINE, and RP buyables, but you gain super rebirth points (SRP)<br>1st SRP at 1.00e10RP<br>SRP gain formula: 1+log<sub>2</sub>(RP/1.00e10)<br>SRP boost to cash: 1+0.1x<br>SRP boost to RP: 1+x<sup>0.5</sup>`

        let base = new Decimal(3)
        if(hasUpgrade('cash', 24)) base = base.times(tmp.cash.upgrades[24].effect)
        
        let effbase = new Decimal(2)
        if(hasUpgrade('cash', 25)) effbase = effbase.pow(tmp.cash.upgrades[25].effect)
        if(hasUpgrade('rebirth', 21)) effbase = effbase.pow(tmp.rebirth.upgrades[21].effect)
        return `Gain formula: floor(3.14<sup>log<sub>${format(tmp.super.requires)}</sub>(RP)-1</sup>)<br>Boost to cash: log<sub>2</sub>(SRP×3+1)<sup>1.25</sup>+1<br>Boost to RP: log<sub>2</sub>(SRP+2)`
    },
    milestones: {
        0: {
            requirementDescription: "1 Super Rebirth",
            effectDescription: "Automate the first 6 cash upgrades, and they no longer spend any cash",
            done() { return player.super.rebirths.gte(1) },
            tooltip() {
                if(options.tooltipCredits) return `Idea from galaxyuser63274 / EchoingLycanthrope<br>1SRP Milestone: Automate first 8 cash upgrades and RBP1, and they cost nothing.`
        
                return
            },
        },
        1: {
            requirementDescription: "2 Super Rebirths",
            effectDescription: "Keep a rebirth upgrade for each super rebirth, up to 6<br>Also unlock a cash buyable",
            done() { return player.super.rebirths.gte(2) },
            unlocked() {return hasMilestone('super', 0)},
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>2SRP Milestone: Keep the first 5 RP upgrades on SRP reset.`
        
                return
            },
        },
        2: {
            requirementDescription: "3 Super Rebirths",
            effectDescription: "Rebirth buyables no longer spend RP, and passively earn 2 rebirths per second",
            done() { return player.super.rebirths.gte(3) },
            unlocked() {return hasMilestone('super', 1)},
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
        
                return
            },
        },
        3: {
            requirementDescription: "5 Super Rebirths",
            effectDescription: "Automate the first rebirth and cash buyables",
            done() { return player.super.rebirths.gte(5) },
            unlocked() {return hasMilestone('super', 2)},
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>5SRP Milestone: Automate the first $ buyable, and its effect is increased. (From 1.1<sup>x</sup> to 1.3<sup>x</sup>)`
        
                return
            },
        },
        4: {
            requirementDescription: "8 Super Rebirths",
            effectDescription: "Automate the second rebirth buyable and buyables affect rebirth requirement less",
            done() { return player.super.rebirths.gte(8) },
            unlocked() {return hasMilestone('super', 3)},
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
        
                return `Nerf exponent/2`
            },
        },
        5: {
            requirementDescription: "10 Super Rebirths",
            effectDescription: "The cash buyable no longer spends cash",
            done() { return player.super.rebirths.gte(10) },
            unlocked() {return hasMilestone('super', 4)},
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
        
                return
            },
        },
        6: {
            requirementDescription: "15 Super Rebirths",
            effectDescription() {return `Keep rebirths upgrades from 7-12 on super rebirth based on total super rebirths | Currently: ${formatWhole(tmp.super.milestones[6].effect)}`},
            done() { return player.super.rebirths.gte(15) },
            unlocked() {return hasMilestone('super', 5)},
            effect() {
                return player.super.rebirths.max(1).log(5).times(2).floor()
            },
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
        
                return `floor(log<sub>5</sub>(SRP)×2)`
            },
        },
        7: {
            requirementDescription: "35 Super Rebirths",
            effectDescription: "Keep all cash upgrades on rebirth and super rebirth<br>Doesn't work in challenges",
            done() { return player.super.rebirths.gte(35) },
            unlocked() {return hasMilestone('super', 6)},
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
        
                return
            },
        },
    },
    resetName: 'Super Rebirth',
    upgrades: {
        11: {
            title: 'Challenged',
            fullDisplay() {
                return `Unlock a challenge`
            },
            costa: new Decimal(5),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>5SRP Upgrade: Unlock Challenges!`
        
                return 
            },
        },
        12: {
            title: 'Unhomed',
            fullDisplay() {
                return `Unlock another challenge`
            },
            costa: new Decimal(10),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            tooltip() {
                if(options.tooltipCredits) return `Idea from galaxyuser63274<br>20SRP milestone: automate first 5 rebirth upgrades, they no longer cost RP, and unlock another challenge`
        
                return 
            },
        },
        13: {
            title: 'Extended',
            fullDisplay() {
                return `Unlock another row of cash upgrades`
            },
            costa: new Decimal(15),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            tooltip() {
                if(options.tooltipCredits) return `Idea from galaxyuser63274<br>25SRP upg: Unlock more RP and cash upgrades`
        
                return 
            },
        },
        14: {
            title: 'Unlocked',
            fullDisplay() {
                return `Unlock power, which is found under the machine and kept on Rebirth/Super Rebirth`
            },
            costa: new Decimal(50),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            tooltip() {
                if(options.tooltipCredits) return `Idea from galaxyuser63274<br>150SRP upg: Extend THE MACHINE with a unique currency... (Power)`
        
                return 
            },
        },
        15: {
            title: 'Empowered',
            fullDisplay() {
                return `Neutral Mode also effects ${options.upgID?'PPyA':'Power Pylon A'}'s effect`
            },
            costa: new Decimal(500),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            unlocked() { return player.power.unlocked },
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
        
                return
            },
        },
        16: {
            title: 'Cheapened',
            fullDisplay() {
                return `SRP boost to cash now also divides cash upgrades cost`
            },
            costa: new Decimal(2500),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
            unlocked() { return player.power.unlocked },
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
        
                return
            },
        },
    },
    hotkeys: [
        {
            key: "s", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "S: Super Rebirth", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() { if (player.super.unlocked) doReset("super") },
            unlocked() {return player.super.unlocked} // Determines if you can use the hotkey, optional
        }
    ],
    resetDescription() {
        let text = 'Super Rebirth reset all Rebirth does, and also RP, Rebirth Upgrades, Rebirth Buyables'
        return text
    },
    challenges: {
        11: {
            name: "<h2>Anti-Rebirth</h2><br>",
            fullDisplay(){return `RP and Rebirths are capped at ${formatWhole(tmp[this.layer].challenges[this.id].nerf)}<br>Unlock The Machine to complete<br>Completed ${formatWhole(challengeCompletions('super', 11))}/7 times<br><br>Reward: Automate another cash upgrade per completion, from 7-12<br>When fully completed, automatically earn 10% of RP gained on reset each second`},
            canComplete(){return hasUpgrade('cash', 26)},
            nerf(x = challengeCompletions(this.layer, this.id)) {
                x = new Decimal(x)
                if(x.gte(6)) return new Decimal(0)
                return x.pow_base(0.5).times(100)
            },
            completionLimit: 7,
            unlocked(){return hasUpgrade('super', 11)},
            onEnter() {
                player.cash.upgrades = []
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>Challenge 1: Wait, wasn't there something else?<br>Challenge effect: Removes the ability to get RP.<br>Challenge goal: Unlock THE MACHINE (Again.)<br>Challenge reward: Gain 20% of your RP on reset per second.`

                return `Nerf scaling:<br>Level 1: 100<br>Level 2: 50<br>Level 3: 25<br>Level 4: 12<br>Level 5: 6<br>Level 6: 3<br>Level 7: 0`
            },
        },
        12: {
            name: "<h2>Low-Income Family</h2><br>",
            fullDisplay(){return `Divide cash gain and multiply rebirth requirement by ${format(tmp[this.layer].challenges[this.id].nerf)}<br>Unlock The Machine to complete<br>Completed ${formatWhole(challengeCompletions('super', 12))}/10 times<br><br>Reward: Automate a rebirth upgrade from 7-12 per completion<br>Completions also reduce nerfs of ${options.upgID?'RB1 & $B1':'first rebirth and cash buyables'}<br>When fully completed, ×10 passive RP/s`},
            canComplete(){return hasUpgrade('cash', 26)},
            nerf(x = challengeCompletions(this.layer, this.id)) {
                x = new Decimal(x)
                return x.add(2).pow_base(1.3)
            },
            completionLimit: 10,
            unlocked(){return hasUpgrade('super', 12)},
            onEnter() {
                player.cash.upgrades = []
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>Challenge 2 (A low-income family in the midst of inflation): Cash gain is gain<sup>0.5</sup> and rebirth requirement is 10x higher<br>Goal: 10RP<br>Reward: Rebirth requirement is 10× lower`

                return `Nerf scaling:<br>Level 1: 1.69<br>Level 2: 2.20<br>Level 3: 2.86<br>Level 4: 3.71<br>Level 5: 4.83<br>Level 6: 6.27<br>Level 7: 8.16<br>Level 8: 10.60<br>Level 9: 13.79<br>Level 10: 17.92<br>Reduces nerfs by -^0.1 per completion additive`
            },
        },
        13: {
            name: "<h2>Waiting Simulator</h2><br>",
            fullDisplay(){return `Cash upgrades are ${formatBoost(tmp[this.layer].challenges[this.id].nerf, false)} more expensive<br>Unlock The Machine to complete<br>Completed ${formatWhole(challengeCompletions('super', 13))}/4 times<br><br>Reward: Each completion triples the effect of all power pylons and passive rebirth generation<br>Second completion unlocks another Power Pylon<br>When fully completed, ×10 passive RP/s`},
            canComplete(){return hasUpgrade('cash', 26)},
            nerf(x = challengeCompletions(this.layer, this.id)) {
                x = new Decimal(x)
                return x.add(2).pow_base(40).div(1000)
            },
            completionLimit: 4,
            unlocked(){return hasMilestone('power', 3)},
            onEnter() {
                player.cash.upgrades = []
            },
            effect(x = challengeCompletions(this.layer, this.id)) {
                x = new Decimal(x)
                return x.pow_base(3)
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>Challenge 3: Clicking simulator 202X<br>Goal: SRP Reset<br>Effect: All automation is disabled, each upgrade must be clicked twice to buy it, and disable holding down on buyables to buy multiple.<br>Reward: Gain 100% RP/s, and reduce all RP buyable scaling by ^1. (RPB1 X<sup>4</sup> -> X<sup>3</sup>, so on so forth.) Also unlock more Power milestones.`

                return `Nerf scaling:<br>Level 1: 160%<br>Level 2: ×64<br>Level 3: ×2,560<br>Level 4: ×102,400`
            },
        },
        14: {
            name: "<h2>Sold Out</h2><br>",
            fullDisplay(){return `Cash upgrades cannot be bougt<br>Reach Super Rebirth requirement to complete<br>Completed ${formatWhole(challengeCompletions('super', 14))}/1 times<br><br>Reward: Cash boosts Cash, RP, SRP and Power gain<br>Currently: ${formatBoost(tmp.super.challenges[14].effect.sub(1))}`},
            canComplete(){return tmp.super.canReset},
            completionLimit: 1,
            unlocked(){return hasMilestone('power', 7)},
            onEnter() {
                player.cash.upgrades = []
            },
            effect() {
                return player.points.max(0).add(1).log(10).add(1)
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from galaxyuser63274<br>Challenge 4: Sold Out<br>Goal: Super rebirth reset<br>Effect: You cannot buy cash upgrades<br>Reward: Cash boosts SRP gain at a very reduced rate (log<sub>10</sub>(cash))<sup>0.1</sup>`

                return `Effect formula:<br>log<sub>10</sub>(cash)+1`
            },
        },
        15: {
            name: "<h2>World of Reversal</h2><br>",
            fullDisplay(){return `There is exponentially rising tax that divides cash gain<br>Reach ${formatWhole(1e13)} RP to complete<br>Completed ${formatWhole(challengeCompletions('super', 15))}/3 times<br><br>Reward: Each completion multiplies the effectiveness of eaech power pylon by the log of the previous power pylon`},
            canComplete(){return player.rebirth.points.gte(1e13)},
            completionLimit: 3,
            unlocked(){return hasMilestone('power', 8)},
            onEnter() {
                player.cash.upgrades = []
                player.super.tax = new Decimal(1)
            },
            nerf(x = challengeCompletions('super', 15)) {
                return Decimal.pow(2, x+1).pow(tmp.chall.uTime)
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>Challenge 5: World of reversal (completable 4 times)<br>Goal: 1.00e5 RP<br>Effect: You have 1 Tax that divides your cash gain by it. every seconds Tax is multiplied by 1+(0.005*2<sup>challenge completion+1</sup>)<br>Reward: all PPy are boosted by log<sub>50</sub>(PPy(n-2)) (log divides by 1.5 per completion)`

                return `Nerf scaling:<br>Level 1: ×2/sec<br>Level 2: ×4/sec<br>Level 3: ×8/sec`
            },
        },
    },
    gainMult() {
        let gain = new Decimal(1)
        if(hasUpgrade('cash', 36)) { gain = gain.times(tmp.cash.upgrades[36].effect) }
        if(hasChallenge('super', 14)) { gain = gain.times(tmp.super.challenges[14].effect) }
        gain = gain.times(tmp.hyper.effect[2])
        if(hasUpgrade('hyper', 13)) { gain = gain.times(50) }
        if(hasUpgrade('hyper', 33)) { gain = gain.times(tmp.hyper.upgrades[33].effect) }
        if(hasUpgrade('hyper', 41)) { gain = gain.times(10) }
        if(hasUpgrade('hyper', 43)) { gain = gain.times(5) }
        if(hasUpgrade('hyper', 44)) { gain = gain.times(10) }
        gain = gain.times(tmp.matter.ultimateEffect)
        return gain
    },
    passiveGeneration() {
        let gain = new Decimal(0)
        if(hasMilestone('hyper', 0)) { gain = gain.add(0.05) }
        gain = gain.times(tmp.chall.uTime)
        return tmp.super.canReset?gain:new Decimal(0)
    },
    doReset(layer) {
        if(tmp[layer].row == tmp[this.layer].row) { return; }
        let keep = [];
        if(hasMilestone('hyper', 1) && layer == 'hyper') {
            keep.push('challenges');
            if(player.hyper.rebirths.lt(5)) {
                player.super.challenges[15] = 0
                if(player.hyper.rebirths.lt(4)) { player.super.challenges[14] = 0 }
                if(player.hyper.rebirths.lt(3)) { player.super.challenges[13] = 0 }
            }
        }
        layerDataReset('super', keep);
    },
    automate() {
        let autoUpg = []
        if(hasMilestone('hyper', 5)) { autoUpg.push(11, 12, 13, 14, 15, 16) }
        for (let index = 0; index < autoUpg.length; index++) {
            const element = autoUpg[index];
            const upg = layers.super.upgrades[element]
            if(upg.canAfford() && !hasUpgrade('super', element) && tmp[this.layer].upgrades[element].unlocked) { upg.pay(); player.super.upgrades.push(element) }
        }
    },
    milestonePopups() { return !hasMilestone('hyper', 4) },
})

addLayer('power', {
    row: 2,
    resource: 'power',
    color: '#d6c611',
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        power: new Decimal(0),
        pylonA: new Decimal(0),
        pylonB: new Decimal(0),
        pylonC: new Decimal(0),
        pylonD: new Decimal(0),
        pylonE: new Decimal(0),
        pylonF: new Decimal(0),
        pylobA: new Decimal(0),
        pylobB: new Decimal(0),
        pylobC: new Decimal(0),
        pylobD: new Decimal(0),
        pylobE: new Decimal(0),
        pylobF: new Decimal(0),
        cashPower: new Decimal(0),
        rebirthPower: new Decimal(0),
        neutralPower: new Decimal(0),
    }},
    resetName: 'Power',
    doReset(layer) {
        if(tmp[layer].row == tmp[this.layer].row) { return }
        let keep = []
        layerDataReset('power', keep)
        if(hasMilestone('hyper', 4)) { player.power.pylonE = player.power.pylonE.max(10); player.power.pylobE = player.power.pylobE.max(10) }
        if(hasUpgrade('hyper', 23)) { player.power.pylonF = player.power.pylonF.max(10); player.power.pylobF = player.power.pylobF.max(10) }
    },
    update(diff) {
        player.power.pylonE = player.power.pylonE.add(tmp.power.pylons.f.effect.times(diff))
        player.power.pylonD = player.power.pylonD.add(tmp.power.pylons.e.effect.times(diff))
        player.power.pylonC = player.power.pylonC.add(tmp.power.pylons.d.effect.times(diff))
        player.power.pylonB = player.power.pylonB.add(tmp.power.pylons.c.effect.times(diff))
        player.power.pylonA = player.power.pylonA.add(tmp.power.pylons.b.effect.times(diff))
        player.power.power = player.power.power.add(tmp.power.pylons.a.effect.times(diff))

        if(hasUpgrade('super', 14)) {
            player.power.unlocked = true
            player.power.pylonA = player.power.pylonA.max(1)
        }
        if(hasMilestone('power', 6)) {
            let gain = new Decimal(0.01)
            if(hasMilestone('power', 10)) { gain = gain.times(100) }
            if(hasUpgrade('hyper', 34)) { gain = gain.times(tmp.hyper.cashEffect) }
            if(hasUpgrade('hyper', 42)) { gain = gain.times(10) }
            gain = gain.times(tmp.chall.uTime)
            player.power.cashPower = player.power.cashPower.add(player.power.power.times(gain).times(diff))
            player.power.rebirthPower = player.power.rebirthPower.add(player.power.power.times(gain).times(diff))
            player.power.neutralPower = player.power.neutralPower.add(player.power.power.times(gain).times(diff))
        }
    },
    automate() {
        if(hasMilestone('power', 9)) { buyMax('power', 'pylons', 21); buyMax('power', 'pylons', 22); buyMax('power', 'pylons', 23); }
        if(hasMilestone('power', 10)) { buyMax('power', 'pylons', 24) }
        if(hasUpgrade('hyper', 23)) { buyMax('power', 'pylons', 25) }
    },
    pylons: {
        a: {
            effect() {
                let gain = player.power.pylonA
                if(hasMilestone('power', 1)) { gain = gain.times(player.power.pylobA.div(2.5).add(1)) }
                gain = gain.times(tmp.super.challenges[13].effect)
                if(hasUpgrade('super', 15)) { gain = gain.times(tmp.machine.clickables[12].effect.add(1)) }
                if(hasChallenge('super', 14)) { gain = gain.times(tmp.super.challenges[14].effect) }
                gain = gain.times(player.power.power.max(10).log(10).pow(challengeCompletions('super', 15)))
                gain = gain.times(tmp.hyper.effect[2])
                if(hasUpgrade('hyper', 14)) { gain = gain.times(1000) }
                if(hasUpgrade('hyper', 22)) { gain = gain.times(10) }
                if(hasUpgrade('hyper', 24)) { gain = gain.times(Decimal.pow(1.04, player.power.pylobA.min(1000))) }
                if(hasUpgrade('hyper', 34)) { gain = gain.times(tmp.hyper.cashEffect) }
                if(hasUpgrade('hyper', 42)) { gain = gain.times(100) }
                if(hasUpgrade('hyper', 43)) { gain = gain.times(5) }
                if(hasUpgrade('antimatter', 13)) { gain = gain.times(tmp.antimatter.upgrades[13].effect) }
                gain = gain.times(tmp.matter.ultimateEffect)
                gain = gain.times(tmp.chall.uTime)
                return gain
            },
            cost(x = player.power.pylobA) {
                return x.pow_base(2)
            },
        },
        b: {
            effect() {
                let gain = player.power.pylonB
                if(hasMilestone('power', 1)) { gain = gain.times(player.power.pylobB.div(1.25).add(1)) }
                gain = gain.times(tmp.super.challenges[13].effect)
                gain = gain.times(player.power.pylonA.max(10).log(10).pow(challengeCompletions('super', 15)))
                gain = gain.times(tmp.hyper.effect[2])
                if(hasUpgrade('hyper', 22)) { gain = gain.times(10) }
                if(hasUpgrade('hyper', 24)) { gain = gain.times(Decimal.pow(1.08, player.power.pylobB.min(1000))) }
                if(hasUpgrade('hyper', 34)) { gain = gain.times(tmp.hyper.cashEffect) }
                if(hasUpgrade('hyper', 42)) { gain = gain.times(10) }
                if(hasUpgrade('antimatter', 13)) { gain = gain.times(tmp.antimatter.upgrades[13].effect) }
                gain = gain.times(tmp.matter.ultimateEffect)
	            gain = gain.times(tmp.chall.uTime)
                return gain
            },
            cost(x = player.power.pylobB) {
                return x.pow_base(5).times(50)
            },
        },
        c: {
            effect() {
                let gain = player.power.pylonC
                if(hasMilestone('power', 1)) { gain = gain.times(player.power.pylobC.times(1.6).add(1)) }
                gain = gain.times(tmp.super.challenges[13].effect)
                gain = gain.times(player.power.pylonB.max(10).log(10).pow(challengeCompletions('super', 15)))
                gain = gain.times(tmp.hyper.effect[2])
                if(hasUpgrade('hyper', 22)) { gain = gain.times(10) }
                if(hasUpgrade('hyper', 24)) { gain = gain.times(Decimal.pow(1.16, player.power.pylobC.min(1000))) }
                if(hasUpgrade('hyper', 34)) { gain = gain.times(tmp.hyper.cashEffect) }
                if(hasUpgrade('hyper', 42)) { gain = gain.times(10) }
                if(hasUpgrade('antimatter', 13)) { gain = gain.times(tmp.antimatter.upgrades[13].effect) }
                gain = gain.times(tmp.matter.ultimateEffect)
	            gain = gain.times(tmp.chall.uTime)
                return gain
            },
            cost(x = player.power.pylobC) {
                return x.pow_base(10).times(100000)
            },
        },
        d: {
            effect() {
                let gain = player.power.pylonD
                if(hasMilestone('power', 1)) { gain = gain.times(player.power.pylobD.times(3.2).add(1)) }
                gain = gain.times(tmp.super.challenges[13].effect)
                gain = gain.times(player.power.pylonC.max(10).log(10).pow(challengeCompletions('super', 15)))
                gain = gain.times(tmp.hyper.effect[2])
                if(hasUpgrade('hyper', 22)) { gain = gain.times(10) }
                if(hasUpgrade('hyper', 24)) { gain = gain.times(Decimal.pow(1.32, player.power.pylobD.min(1000))) }
                if(hasUpgrade('hyper', 34)) { gain = gain.times(tmp.hyper.cashEffect) }
                if(hasUpgrade('hyper', 42)) { gain = gain.times(10) }
                if(hasUpgrade('antimatter', 13)) { gain = gain.times(tmp.antimatter.upgrades[13].effect) }
                gain = gain.times(tmp.matter.ultimateEffect)
	            gain = gain.times(tmp.chall.uTime)
                return gain
            },
            cost(x = player.power.pylobD) {
                return x.pow_base(100).times(1e15)
            },
        },
        e: {
            effect() {
                let gain = player.power.pylonE
                if(hasMilestone('power', 1)) { gain = gain.times(player.power.pylobE.times(6.4).add(1)) }
                gain = gain.times(tmp.super.challenges[13].effect)
                gain = gain.times(player.power.pylonD.max(10).log(10).pow(challengeCompletions('super', 15)))
                gain = gain.times(tmp.hyper.effect[2])
                if(hasUpgrade('hyper', 22)) { gain = gain.times(10) }
                if(hasUpgrade('hyper', 24)) { gain = gain.times(Decimal.pow(1.64, player.power.pylobE.min(1000))) }
                if(hasUpgrade('hyper', 34)) { gain = gain.times(tmp.hyper.cashEffect) }
                if(hasUpgrade('hyper', 42)) { gain = gain.times(10) }
                if(hasUpgrade('antimatter', 13)) { gain = gain.times(tmp.antimatter.upgrades[13].effect) }
                gain = gain.times(tmp.matter.ultimateEffect)
	            gain = gain.times(tmp.chall.uTime)
                return gain
            },
            cost(x = player.power.pylobE) {
                return x.pow_base(1e3).times(1e21)
            },
        },
        f: {
            effect() {
                let gain = player.power.pylonF
                if(hasMilestone('power', 1)) { gain = gain.times(player.power.pylobF.times(128).add(1)) }
                gain = gain.times(tmp.super.challenges[13].effect)
                gain = gain.times(player.power.pylonE.max(10).log(10).pow(challengeCompletions('super', 15)))
                gain = gain.times(tmp.hyper.effect[2])
                if(hasUpgrade('hyper', 22)) { gain = gain.times(10) }
                if(hasUpgrade('hyper', 24)) { gain = gain.times(Decimal.pow(2.28, player.power.pylobF.min(1000))) }
                if(hasUpgrade('hyper', 34)) { gain = gain.times(tmp.hyper.cashEffect) }
                if(hasUpgrade('hyper', 42)) { gain = gain.times(10) }
                if(hasUpgrade('antimatter', 13)) { gain = gain.times(tmp.antimatter.upgrades[13].effect) }
                gain = gain.times(tmp.matter.ultimateEffect)
	            gain = gain.times(tmp.chall.uTime)
                return gain
            },
            cost(x = player.power.pylobF) {
                return x.pow_base(1e5).times(1e50)
            },
        },
    },
    clickables: {
        21: {
            display() {
                return `${player.power.pylobA.lte(10)?'Buy for ':''}${formatWhole(tmp.power.pylons.a.cost)}`
            },
            canClick() {
                return player.power.power.gte(tmp.power.pylons.a.cost)
            },
            onClick() {
                player.power.power = player.power.power.sub(tmp.power.pylons.a.cost).max(0)
                player.power.pylonA = player.power.pylonA.add(1)
                player.power.pylobA = player.power.pylobA.add(1)
            },
            title: 'Power Pylon A',
            id: 'PPyA',
            unlocked(){return hasUpgrade('super', 14)},
            style: {
                'width': '130px',
            },
        },
        22: {
            display() {
                return `${player.power.pylobB.lte(5)?'Buy for ':''}${formatWhole(tmp.power.pylons.b.cost)}`
            },
            canClick() {
                return player.power.power.gte(tmp.power.pylons.b.cost)
            },
            onClick() {
                player.power.power = player.power.power.sub(tmp.power.pylons.b.cost).max(0)
                player.power.pylonB = player.power.pylonB.add(1)
                player.power.pylobB = player.power.pylobB.add(1)
            },
            unlocked(){return hasMilestone('power', 0)},
            title: 'Power Pylon B',
            id: 'PPyB',
            style: {
                'width': '130px',
            },
        },
        23: {
            display() {
                return `${player.power.pylobC.lte(1)?'Buy for ':''}${formatWhole(tmp.power.pylons.c.cost)}`
            },
            canClick() {
                return player.power.power.gte(tmp.power.pylons.c.cost)
            },
            onClick() {
                player.power.power = player.power.power.sub(tmp.power.pylons.c.cost).max(0)
                player.power.pylonC = player.power.pylonC.add(1)
                player.power.pylobC = player.power.pylobC.add(1)
            },
            unlocked(){return challengeCompletions('super', 13) >= 2},
            title: 'Power Pylon C',
            id: 'PPyC',
            style: {
                'width': '130px',
            },
        },
        24: {
            display() {
                return `${player.power.pylobD.lte(0)?'Buy for ':''}${formatWhole(tmp.power.pylons.d.cost)}`
            },
            canClick() {
                return player.power.power.gte(tmp.power.pylons.d.cost)
            },
            onClick() {
                player.power.power = player.power.power.sub(tmp.power.pylons.d.cost).max(0)
                player.power.pylonD = player.power.pylonD.add(1)
                player.power.pylobD = player.power.pylobD.add(1)
            },
            unlocked(){return hasMilestone('power', 7)},
            title: 'Power Pylon D',
            id: 'PPyD',
            style: {
                'width': '130px',
            },
        },
        25: {
            display() {
                return `${formatWhole(tmp.power.pylons.e.cost)}`
            },
            canClick() {
                return player.power.power.gte(tmp.power.pylons.e.cost)
            },
            onClick() {
                player.power.power = player.power.power.sub(tmp.power.pylons.e.cost).max(0)
                player.power.pylonE = player.power.pylonE.add(1)
                player.power.pylobE = player.power.pylobE.add(1)
            },
            unlocked(){return hasMilestone('power', 8)},
            title: 'Power Pylon E',
            id: 'PPyE',
            style: {
                'width': '130px',
            },
        },
        26: {
            display() {
                return `${formatWhole(tmp.power.pylons.f.cost)}`
            },
            canClick() {
                return player.power.power.gte(tmp.power.pylons.f.cost)
            },
            onClick() {
                player.power.power = player.power.power.sub(tmp.power.pylons.f.cost).max(0)
                player.power.pylonF = player.power.pylonF.add(1)
                player.power.pylobF = player.power.pylobF.add(1)
            },
            unlocked(){return hasMilestone('power', 9)},
            title: 'Power Pylon F',
            id: 'PPyF',
            style: {
                'width': '130px',
            },
        },
        11: {
            display() {
                return `Allocate Cash`
            },
            canClick() {
                return true
            },
            onClick() {
                player.power.cashPower = player.power.cashPower.add(player.power.power.times(player.chall.pap/100))
                player.power.power = player.power.power.times(1-(player.chall.pap/100))
            },
            unlocked(){return hasMilestone('power', 2)},
            style: {
                "width": "110px",
                "min-height": "35px",
                "font-size": "14px"
            },
        },
        12: {
            display() {
                return `Allocate Neutral`
            },
            canClick() {
                return true
            },
            onClick() {
                player.power.neutralPower = player.power.neutralPower.add(player.power.power.times(player.chall.pap/100))
                player.power.power = player.power.power.times(1-(player.chall.pap/100))
            },
            unlocked(){return hasMilestone('power', 2)},
            style: {
                "width": "110px",
                "min-height": "35px",
                "font-size": "14px"
            },
        },
        13: {
            display() {
                return `Allocate Rebirth`
            },
            canClick() {
                return true
            },
            onClick() {
                player.power.rebirthPower = player.power.rebirthPower.add(player.power.power.times(player.chall.pap/100))
                player.power.power = player.power.power.times(1-(player.chall.pap/100))
            },
            unlocked(){return hasMilestone('power', 2)},
            style: {
                "width": "110px",
                "min-height": "35px",
                "font-size": "14px"
            },
        },
    },
    milestones: {
        0: {
            requirementDescription: "60 Power",
            effectDescription: "Unlock Power Pylon B",
            done() { return player.power.power.gte(60) },
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>20 Power Milestone: Unlock PPyB`
        
                return 
            },
        },
        1: {
            requirementDescription: "100 Power Pylon A",
            effectDescription: "Each bought Power Pylon boosts its effect by (20×2<sup>Pylon Number</sup>)%",
            done() { return player.power.pylonA.gte(100) },
            unlocked() { return hasMilestone('power', this.id - 1) },
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>3 PPyB Milestone: Each Power Pylon bought (Not created) grants that Power Pylon a multiplicative 1.2x boost.`
        
                return 
            },
        },
        2: {
            requirementDescription: "100,000 Power",
            effectDescription: "Unlock Power Allocation",
            done() { return player.power.power.gte(100000) },
            unlocked() { return hasMilestone('power', this.id - 1) },
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
        
                return `+(log<sub>2</sub>(Allocated)×10)%`
            },
        },
        3: {
            requirementDescription: "6 Power Pylon B",
            effectDescription: "Unlock a third challenge",
            done() { return player.power.pylonB.gte(6) },
            unlocked() { return hasMilestone('power', this.id - 1) },
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>1 PPyA Milestone: Unlock a challenge!`
        
                return
            },
        },
        4: {
            requirementDescription: "6 Power Pylon C",
            effectDescription() {return "Every bought cash, rebirth and super rebirth upgrade increases cash gain by 40% | Currently: ×" + format(tmp[this.layer].milestones[this.id].effect)},
            done() { return player.power.pylonC.gte(6) },
            unlocked() { return challengeCompletions('super', 13) >= 2 },
            effect() {
                let amt = player.cash.upgrades.length
                amt += player.rebirth.upgrades.length
                amt += player.super.upgrades.length
                amt = new Decimal(amt)
                return amt.div(2.5).add(1)
            },
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>500 SRP: every bought upgrade increases cash tickspeed by +40% non-compounding`
        
                return `×(1+upgrades/2.5)`
            },
        },
        5: {
            requirementDescription: "8 Power Pylon C",
            effectDescription: "Improve power allocation's effect on Cash Mode",
            done() { return player.power.pylonC.gte(8) },
            unlocked() { return hasMilestone('power', this.id - 1) },
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>$1.00e40: cash gain ×Power`
        
                return `Multiplier from allocation ^1.6`
            },
        },
        6: {
            requirementDescription: "10 Power Pylon C",
            effectDescription: "Improve power allocation's effect on Rebirth Mode, and automatically get 1% of allocated power in each mode per second",
            done() { return player.power.pylonC.gte(10) },
            unlocked() { return hasMilestone('power', this.id - 1) },
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>$1.00e45: RP gain ×log<sub>10</sub>(Power)`
        
                return `Multiplier from allocation ^1.4`
            },
        },
        7: {
            requirementDescription: "13 Power Pylon C",
            effectDescription: "Unlock a fourth challenge and Power Pylon D",
            done() { return player.power.pylonC.gte(13) },
            unlocked() { return hasMilestone('power', this.id - 1) },
            tooltip() {
                if(options.tooltipCredits) return `Idea from EchoingLycanthrope<br>5000 Power milestone: unlock a new challenge and PPyD`
        
                return
            },
        },
        8: {
            requirementDescription: "5 Power Pylon D",
            effectDescription: "Unlock a fifth challenge and Power Pylon E",
            done() { return player.power.pylonD.gte(5) },
            unlocked() { return hasMilestone('power', this.id - 1) },
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br>2.50e5 Power Milestone: Unlocks a new challenges, 3 more upgrades and PPyE`
        
                return
            },
        },
        9: {
            requirementDescription: "10 Power Pylon E",
            effectDescription: "Automate Power Pylons A-C and unlock Power Pylon F",
            done() { return player.power.pylonE.gte(10) },
            unlocked() { return hasMilestone('power', this.id - 1) },
            tooltip() {
                if(options.tooltipCredits) return `Idea from galaxyuser63274<br>5.00e6 Power milestone: Unlock the final Power Pylon, PPyF`
        
                return
            },
        },
        10: {
            requirementDescription: "4 Power Pylon F",
            effectDescription: "Automate Power Pylon D, unlock Hyper Rebirth, and increase automatic power allocation to 100%",
            done() { return player.power.pylonF.gte(4) },
            unlocked() { return hasMilestone('power', this.id - 1) },
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
        
                return
            },
        },
    },
    milestonePopups() { return !hasMilestone('hyper', 4) },
})
