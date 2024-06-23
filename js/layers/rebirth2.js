addLayer('super', {
    color: "rgb(251, 26, 61)",
    tabFormat: [
        "prestige-button",
        "blank",
        ['display-text', function() {return `Your total SRP is increasing cash gain by ×${format(tmp.super.effect[1])} and RP gain by ×${format(tmp.super.effect[0])}<br>You have super rebirthed ${formatWhole(player.super.rebirths)} times, and have ${formatWhole(player.super.total)} total SRP`}],
        "blank",
        "upgrades",
        "blank",
        ["milestones", [7,6,5,4,3,2,1,0]],
    ],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        rebirths: new Decimal(0),
        resetTime: 0,
        total: new Decimal(0),
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
    },
    resource: "SRP",
    prestigeButtonText() {
        return tmp.super.canReset ? `Super Rebirth for ${formatWhole(tmp.super.getResetGain)} Super Rebirth Points${player.super.points.add(tmp.super.getResetGain).lte(1000)?`<br>Next at ${formatWhole(tmp.super.getNextAt)} RP`:''}`:`Reach ${format(tmp.super.requires)} RP to super rebirth`
    },
    canReset() {
        return tmp.super.baseAmount.gte(this.requires)
    },
    effect() {
        let base = new Decimal(2)
        return [player.super.total.max(0).add(base).log(base), player.super.total.max(0).times(3).add(1).log(2).pow(1.25)]
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
    milestones: {
        0: {
            requirementDescription: "1 Super Rebirth",
            effectDescription: "Automate the first 6 cash upgrades, and they no longer spend any cash",
            done() { return player.super.rebirths.gte(1) },
        },
        1: {
            requirementDescription: "2 Super Rebirths",
            effectDescription: "Keep a rebirth upgrade for each super rebirth, up to 6<br>Also unlock a cash buyable",
            done() { return player.super.rebirths.gte(2) },
            unlocked() {return hasMilestone('super', 0)},
        },
        2: {
            requirementDescription: "3 Super Rebirths",
            effectDescription: "Rebirth buyables no longer spend RP, and passively earn 2 rebirths per second",
            done() { return player.super.rebirths.gte(3) },
            unlocked() {return hasMilestone('super', 1)},
        },
        3: {
            requirementDescription: "5 Super Rebirths",
            effectDescription: "Automate the first rebirth and cash buyables",
            done() { return player.super.rebirths.gte(5) },
            unlocked() {return hasMilestone('super', 2)},
        },
        4: {
            requirementDescription: "8 Super Rebirths",
            effectDescription: "Automate the second rebirth buyable and buyables affect rebirth requirement less",
            done() { return player.super.rebirths.gte(8) },
            unlocked() {return hasMilestone('super', 3)},
        },
        5: {
            requirementDescription: "10 Super Rebirths",
            effectDescription: "The cash buyable no longer spends cash",
            done() { return player.super.rebirths.gte(10) },
            unlocked() {return hasMilestone('super', 4)},
        },
        6: {
            requirementDescription: "15 Super Rebirths",
            effectDescription() {return `Keep rebirths upgrades from 7-12 on super rebirth based on total super rebirths<br>Currently: ${formatWhole(tmp.super.milestones[6].effect)}`},
            done() { return player.super.rebirths.gte(15) },
            unlocked() {return hasMilestone('super', 5)},
            effect() {
                return player.super.rebirths.max(1).log(10).times(2).floor()
            }
        },
        7: {
            requirementDescription: "25 Super Rebirths",
            effectDescription: "Keep all cash upgrades on rebirth and supreme",
            done() { return player.super.rebirths.gte(50) },
            unlocked() {return hasMilestone('super', 6) && hasUpgrade('super', 13)},
        },
    },
    upgrades: {
        11: {
            fullDisplay() {
                return `<h3>Challenged</h3><br>
                Unlock a challenge<br><br>
                Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].costa)} SRP`
            },
            costa: new Decimal(5),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
        },
        12: {
            fullDisplay() {
                return `<h3>Unhomed</h3><br>
                Unlock another challenge<br><br>
                Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].costa)} SRP`
            },
            costa: new Decimal(10),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
        },
        13: {
            fullDisplay() {
                return `<h3>Extended</h3><br>
                Unlock another row of cash upgrades<br><br>
                Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].costa)} SRP`
            },
            costa: new Decimal(15),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
        },
        14: {
            fullDisplay() {
                return `<h3>Unlocked⁕</h3><br>
                Unlock power<br><br>
                Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].costa)} SRP`
            },
            costa: new Decimal(50),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
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
    challenges: {
        11: {
            name: "<h2>Anti-Rebirth</h2><br>",
            fullDisplay(){return `<br>RP and Rebirths are capped at ${formatWhole(tmp[this.layer].challenges[this.id].nerf)}<br>Unlock The Machine to complete<br>Completed ${formatWhole(challengeCompletions('super', 11))}/7 times<br><br>Reward: automate another cash upgrade per completion, from 7-12<br>When fully completed, automatically earn 2.5% of RP gained on reset each second`},
            canComplete(){return hasUpgrade('cash', 26)},
            nerf(x = challengeCompletions(this.layer, this.id)) {
                x = new Decimal(x)
                if(x.gte(6)) return new Decimal(0)
                return x.pow_base(0.5).times(100)
            },
            completionLimit: 7,
            unlocked(){return hasUpgrade('super', 11)},
        },
        12: {
            name: "<h2>Low-Income Family</h2><br>",
            fullDisplay(){return `Divide cash gain and multiply rebirth requirement by ${format(tmp[this.layer].challenges[this.id].nerf)}<br>Unlock The Machine to complete<br>Completed ${formatWhole(challengeCompletions('super', 12))}/10 times<br><br>Reward: automate a rebirth upgrade from 7-12 per completion<br>Completions also reduce increases to rebirth cost<br>When fully completed, ×10 passive RP/s`},
            canComplete(){return hasUpgrade('cash', 26)},
            nerf(x = challengeCompletions(this.layer, this.id)) {
                x = new Decimal(x)
                return x.add(2).pow_base(1.3)
            },
            completionLimit: 10,
            unlocked(){return hasUpgrade('super', 12)},
        },
    },
    gainMult() {
        let gain = new Decimal(1)
        if(hasUpgrade('cash', 36)) { gain = gain.times(tmp.cash.upgrades[36].effect) }
        return gain
    }
})