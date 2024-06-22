addLayer('super', {
    color: "rgb(251, 26, 61)",
    tabFormat: [
        ['display-text', function() { return options.superPin?'':`You have <h2 style="color: rgb(251, 26, 61); text-shadow: rgb(251, 26, 61) 0px 0px 10px;">${formatWhole(player.super.points)}</h2> SRP<br><br>`}],
        "prestige-button",
        "blank",
        ['display-text', function() {return `Your total SRP is increasing cash gain by ×${format(tmp.super.effect[1])} and RP gain by ×${format(tmp.super.effect[0])}<br>You have rebirthed+ ${formatWhole(player.super.rebirths)} times, and have ${formatWhole(player.super.total)} total SRP`}],
        "blank",
        "upgrades",
        "blank",
        "milestones",
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
        let base = new Decimal(2)
        let has = tmp.super.baseAmount.max(1).log(tmp.super.requires).sub(1).pow_base(base).times(tmp.super.gainMult).floor()
        has = has.add(1)
        return has.div(tmp.super.gainMult).log(base).add(1).pow_base(tmp.super.requires).max(1)
    },
    getResetGain() {
        let base = new Decimal(2)
        return tmp.super.baseAmount.max(1).log(tmp.super.requires).sub(1).pow_base(base).times(tmp.super.gainMult).floor()
    },
    requires: new Decimal(2500),
    update(diff) {
        if(hasUpgrade('rebirth', 26)) player.super.unlocked = true
    },
    resource: "RP",
    prestigeButtonText() {
        return tmp.super.canReset ? `Rebirth+ for ${formatWhole(tmp.super.getResetGain)} super rebirth points${player.super.points.lte(1000)?`<br>Next at ${formatWhole(tmp.super.getNextAt)} RP`:''}`:`Reach ${format(tmp.super.requires)} RP to rebirth+`
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
            requirementDescription: "1 Rebirth+",
            effectDescription: "Automate the first 6 cash upgrades, and they no longer spend any cash",
            done() { return player.super.rebirths.gte(1) },
        },
        1: {
            requirementDescription: "2 Rebirths+",
            effectDescription: "Keep a rebirth upgrade for each rebirth+, up to 6<br>Also unlock a cash buyable",
            done() { return player.super.rebirths.gte(2) },
            unlocked() {return hasMilestone('super', 0)},
        },
        2: {
            requirementDescription: "3 Rebirths+",
            effectDescription: "Rebirth buyables no longer spend RP, and passively earn 2 rebirths per second",
            done() { return player.super.rebirths.gte(3) },
            unlocked() {return hasMilestone('super', 1)},
        },
        3: {
            requirementDescription: "5 Rebirths+",
            effectDescription: "Automate the first rebirth and cash buyables",
            done() { return player.super.rebirths.gte(5) },
            unlocked() {return hasMilestone('super', 2)},
        },
        4: {
            requirementDescription: "8 Rebirths+",
            effectDescription: "Automate the second rebirth buyable and buyables affect rebirth requirement less",
            done() { return player.super.rebirths.gte(8) },
            unlocked() {return hasMilestone('super', 3)},
        },
        5: {
            requirementDescription: "10 Rebirths+",
            effectDescription: "The cash buyable no longer spends cash",
            done() { return player.super.rebirths.gte(10) },
            unlocked() {return hasMilestone('super', 4)},
        },
        6: {
            requirementDescription: "25 Rebirths+",
            effectDescription() {return `Keep a rebirth upgrade for each OOM/2 of rebirths+, starting at 1 rebirth upgrade at 25 supremes, and ending at 6 rebirth upgrades at ~8,000 supremes<br>Currently: ${formatWhole(tmp.super.milestones[6].effect)}`},
            done() { return player.super.rebirths.gte(25) },
            unlocked() {return hasMilestone('super', 5)},
            effect() {
                return player.super.rebirths.max(24).div(25).log(10).floor().times(2).add(1)
            }
        },
        7: {
            requirementDescription: "100 Rebirths+",
            effectDescription: "Keep the first 18 cash upgrades on rebirth and supreme",
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
            costa: new Decimal(50),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
        },
        14: {
            fullDisplay() {
                return `<h3>Unlocked</h3><br>
                Unlock power<br><br>
                Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].costa)} SRP`
            },
            costa: new Decimal(150),
            canAfford() {return player[this.layer].points.gte(tmp[this.layer].upgrades[this.id].costa)},
            pay() {player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].costa)},
        },
    },
    hotkeys: [
        {
            key: "s", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "S: Supreme", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() { if (player.super.unlocked) doReset("super") },
            unlocked() {return player.super.unlocked} // Determines if you can use the hotkey, optional
        }
    ],
    challenges: {
        11: {
            name: "<h2>Anti-Rebirth</h2><br>",
            fullDisplay(){return `<br>RP and Rebirths are capped at ${formatWhole(tmp[this.layer].challenges[this.id].nerf)}<br>Unlock The Machine to complete<br>Completed ${formatWhole(challengeCompletions('super', 11))}/7 times<br><br>Reward: automate another cash upgrade per completion, up to 6<br>When fully completed, automatically earn 0.1% of RP gained on reset each second`},
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
            fullDisplay(){return `Divide cash gain and multiply rebirth requirement by ${formatWhole(tmp[this.layer].challenges[this.id].nerf)}<br>Unlock The Machine to complete<br>Completed ${formatWhole(challengeCompletions('super', 12))}/10 times<br><br>Reward: automate a rebirth upgrade from 7-12 per completion<br>Completions also reduce increases to rebirth cost<br>When fully completed, ×10 passive RP/s`},
            canComplete(){return hasUpgrade('cash', 26)},
            nerf(x = challengeCompletions(this.layer, this.id)) {
                x = new Decimal(x)
                return x.add(2).pow_base(2)
            },
            completionLimit: 10,
            unlocked(){return hasUpgrade('super', 12)},
        },
    }
})