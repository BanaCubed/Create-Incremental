addLayer('hyper', {
    color: "var(--hyper)",
    tabFormat: [
        ['row', [
            "prestige-button",
            "milestones-scroll",
        ]],
        "hcash-display",
        'blank',
        ['display-text', function() {return `Your total HRP is increasing cash gain by ${formatBoost(tmp.hyper.effect[0].sub(1))}, RP gain by ${formatBoost(tmp.hyper.effect[1].sub(1))}, and SRP gain and Power Pylon effects by ${formatBoost(tmp.hyper.effect[2].sub(1))}<br>You have hyper rebirthed ${formatWhole(player.hyper.rebirths)} times, and have ${formatWhole(player.hyper.total)} total HRP<br>Your Hyper Cash is boosting universal time by ${formatBoost(tmp.hyper.cashEffect.sub(1))}`}],
        "blank",
        ['row', [
            ["clickable", 98],
            ["clickable", 97],
        ]],
        'blank',
        "hyper-paths",
    ],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        rebirths: new Decimal(0),
        resetTime: 0,
        total: new Decimal(0),
        cash: new Decimal(0),
        paths: [],
        subLayers: 0,
    }},
    shouldNotify() {
        let state = false
        for (const upgrades in tmp.hyper.upgrades) {
            if (Object.hasOwnProperty.call(tmp.hyper.upgrades, upgrades)) {
                const upgrade = tmp.hyper.upgrades[upgrades];
                if(upgrade.canAfford && !hasUpgrade('rebirth', upgrades)) state = true
            }
        }
        return state
    },
    type: 'custom',
    getNextAt() {
        let base = new Decimal(19)
        let has = tmp.hyper.baseAmount.max(1).log(tmp.hyper.requires).sub(1).pow_base(base).times(tmp.hyper.gainMult).pow(0.8).floor()
        has = has.add(1)
        return has.pow(1.25).div(tmp.hyper.gainMult).log(base).add(1).pow_base(tmp.hyper.requires).max(1)
    },
    getResetGain() {
        let base = new Decimal(19)
        return tmp.hyper.baseAmount.max(1).log(tmp.hyper.requires).sub(1).pow_base(base).times(tmp.hyper.gainMult).pow(0.8).floor()
    },
    requires() {
        let base = new Decimal(1e6)
        return base
    },
    gainMult() {
        let gain = new Decimal(1)
        gain = gain.times(tmp.matter.ultimateEffect)
        return gain
    },
    update(diff) {
        if(hasMilestone('power', 10)) { player.hyper.unlocked = true }
        if(player.hyper.rebirths.gte(1)) {
            player.hyper.cash = player.hyper.cash.add(tmp.hyper.cashGain.times(tmp.chall.uTime).times(diff))
        }
        if(hasMilestone('hyper', 4) && player.hyper.subLayers < 1) { player.hyper.subLayers = 1 }
    },
    resetTooltip() {
        if(options.tooltipCredits) return `Idea from galaxyuser63274<br>HYPER REBIRTH<br>resets everything up until this point except automation to gain hyper rebirth points (HRP). Numbers are about to get big.<br>First HRP at 1.00e110$, 5.00e8 SRP, and 5.00e7 Power<br>Cost formulas:<br>Cash: sqrt(2×log<sub>10</sub>(cash)-220)<br>SRP: log<sub>2</sub>(SRP/2.50e8)<br>Power: log<sub>2</sub>(Power/2.50e7)<br><br>HRP boosts to:<br>Cash: ×3<sup>HRP</sup><br>SRP: ×(1+HRP)<br>Power: ×2<sup>(HRP/2)</sup>`

        return `Gain formula: floor(19<sup>log<sub>${format(tmp.hyper.requires)}</sub>(HRP)-1</sup>)<br>Boost to cash: log<sub>10</sub>(HRP×1.5+1)<sup>4</sup>+1<br>Boost to RP: log<sub>1.25</sub>(SRP+1)+1<br>Boost to SRP and Power: log<sub>25</sub>(HRP+1)×3+1`
    },
    resource: "HRP",
    prestigeButtonText() {
        return tmp.hyper.canReset ? `Hyper Rebirth for ${formatWhole(tmp.hyper.getResetGain)} Hyper Rebirth Points${tmp.hyper.getResetGain.lte(1000)?`<br>Next at ${formatWhole(tmp.hyper.getNextAt)} SRP`:''}`:`Reach ${format(tmp.hyper.requires)} SRP to hyper rebirth`
    },
    canReset() {
        return tmp.hyper.baseAmount.gte(tmp.hyper.requires)
    },
    effect() {
        return [
            player.hyper.total.max(0).add(1).log(10).times(1.5).add(1).pow(4),
            player.hyper.total.max(0).add(1).log(1.25).add(1),
            player.hyper.total.max(0).add(1).log(25).times(3).add(1),
        ]
    },
    row: 3,
    prestigeNotify() {
        return tmp.hyper.getResetGain.gte(player.hyper.points.div(8)) && tmp.hyper.canReset
    },
    baseResource: 'SRP',
    baseAmount() {return player.super.points},
    onPrestige(gain) {
        player.hyper.rebirths = player.hyper.rebirths.add(1)
    },
    hotkeys: [
        {
            key: "h", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "H: Hyper Rebirth", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() { if (player.hyper.unlocked) doReset("hyper") },
            unlocked() {return player.hyper.unlocked} // Determines if you can use the hotkey, optional
        }
    ],
    resetDescription() {
        let text = 'Hyper Rebirth resets all Super Rebirth does, but also all Super Rebirth and Power related features'
        return text
    },
    resetName: 'Hyper Rebirth',
    cashEffect() {
        let effect = player.hyper.cash.max(0).add(1).log(10).add(1).pow(0.4)
        if(hasUpgrade('hyper', 34)) { effect = effect.pow(1.5) }
        return effect
    },
    cashGain() {
        let gain = new Decimal(1)
        if(hasMilestone('hyper', 5)) { gain = gain.times(player.hyper.rebirths.div(10).add(1).max(1)) }
        if(hasMilestone('hyper', 6)) { gain = gain.times(tmp.hyper.milestones[6].effect) }
        if(hasUpgrade('hyper', 31)) { gain = gain.times(tmp.hyper.upgrades[31].effect) }
        if(hasUpgrade('hyper', 32)) { gain = gain.times(10) }
        if(hasUpgrade('hyper', 34)) { gain = gain.times(tmp.hyper.cashEffect) }
        if(hasUpgrade('hyper', 43)) { gain = gain.times(5) }
        if(hasUpgrade('hyper', 44)) { gain = gain.times(tmp.hyper.effect[1]) }
        return gain
    },
    milestones: {
        0: {
            requirementDescription: "1 Hyper Rebirth",
            effectDescription: "Passively generate 5% of SRP on reset and unlock Hyper Cash",
            done() { return player.hyper.rebirths.gte(1) },
            unlocked() {return player.hyper.unlocked},
            tooltip() {
                if(options.tooltipCredits) return `Idea from galaxyuser63274<br>Unlock Hyper-cash Base Hyper-cash (HC) gain is .1/sec, and Hyper-cash boosts Cash gain a lot (gain<sup>1+(HC/100)</sup>)`
        
                return `Hyper Cash boost to Universal Time:<br>(log<sub>10</sub>(HC)+1)<sup>0.4</sup>`
            },
        },
        1: {
            requirementDescription: "2 Hyper Rebirths",
            effectDescription: "Keep one super challenge for each total Hyper Rebirth",
            done() { return player.hyper.rebirths.gte(2) },
            unlocked() {return hasMilestone(this.layer, this.id - 1)},
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
        
                return
            },
        },
        2: {
            requirementDescription: "3 Hyper Rebirths",
            effectDescription: "Automate all existing cash upgrades",
            done() { return player.hyper.rebirths.gte(3) },
            unlocked() {return hasMilestone(this.layer, this.id - 1)},
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
        
                return
            },
        },
        3: {
            requirementDescription: "4 Hyper Rebirths",
            effectDescription: "Automate all existing RP upgrades",
            done() { return player.hyper.rebirths.gte(4) },
            unlocked() {return hasMilestone(this.layer, this.id - 1)},
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
        
                return
            },
        },
        4: {
            requirementDescription: "5 Hyper Rebirths",
            effectDescription: "Unlock Paths and start each Hyper Rebirth with 10 Power Pylon E",
            done() { return player.hyper.rebirths.gte(5) },
            unlocked() {return hasMilestone(this.layer, this.id - 1)},
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
        
                return
            },
        },
        5: {
            requirementDescription: "7 Hyper Rebirths",
            effectDescription: "Increase Hyper Cash gain by +10% per hyper rebirth, and automate all existing SRP upgrades",
            done() { return player.hyper.rebirths.gte(7) },
            unlocked() {return hasMilestone(this.layer, this.id - 1)},
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
        
                return `×(Hyper Rebirths/10+1)`
            },
        },
        6: {
            requirementDescription: "10 Hyper Rebirths",
            effectDescription() { return `Automatically produce 25 Super Rebirths per second, and product of all rebirths multiplies Hyper Cash gain | ${formatBoost(tmp[this.layer].milestones[this.id].effect.sub(1))}` },
            done() { return player.hyper.rebirths.gte(10) },
            unlocked() {return hasMilestone(this.layer, this.id - 1)},
            effect() {
                return player.rebirth.rebirths.times(player.super.rebirths).times(player.hyper.rebirths).max(1).log(100).add(1)
            },
            tooltip() {
                if(options.tooltipCredits) return `Uninspired`
        
                return `R = Rebirths×Super Rebirths×Hyper Rebirths<br>log<sub>100</sub>(R)+1`
            },
        },
    },
    upgrades: {
        11: {
            cost() {
                let pos = player.hyper.paths.indexOf(1)
                if(pos == -1) { pos = player.hyper.paths.length }
                return Decimal.times(1, Decimal.pow(3, pos))
            },
            onPurchase() {
                player.hyper.paths.push(1)
            },
            description: `Increase cash gain by ×1,000`,
            title: `Basic 1`,
        },
        12: {
            cost() {
                let pos = player.hyper.paths.indexOf(1)
                if(pos == -1) { pos = player.hyper.paths.length }
                return Decimal.times(4, Decimal.pow(3, pos))
            },
            description: `Increase RP gain by ×500`,
            canAfford() { return hasUpgrade(this.layer, this.id-1) },
            title: `Basic 2`,
        },
        13: {
            cost() {
                let pos = player.hyper.paths.indexOf(1)
                if(pos == -1) { pos = player.hyper.paths.length }
                return Decimal.times(10, Decimal.pow(3, pos))
            },
            description: `Increase SRP gain by ×50`,
            canAfford() { return hasUpgrade(this.layer, this.id-1) },
            title: `Basic 3`,
        },
        14: {
            cost() {
                let pos = player.hyper.paths.indexOf(1)
                if(pos == -1) { pos = player.hyper.paths.length }
                return Decimal.times(25, Decimal.pow(3, pos))
            },
            description: `Increase Power gain by ×1,000`,
            canAfford() { return hasUpgrade(this.layer, this.id-1) },
            title: `Basic 4`,
        },
        
        21: {
            cost() {
                let pos = player.hyper.paths.indexOf(2)
                if(pos == -1) { pos = player.hyper.paths.length }
                return Decimal.times(1, Decimal.pow(3, pos))
            },
            onPurchase() {
                player.hyper.paths.push(2)
            },
            description: `Neutral mode is ×25 as effective`,
            title: `Machine 1`,
        },
        22: {
            cost() {
                let pos = player.hyper.paths.indexOf(2)
                if(pos == -1) { pos = player.hyper.paths.length }
                return Decimal.times(4, Decimal.pow(3, pos))
            },
            description: `Power Pylons are ×10 as effective`,
            canAfford() { return hasUpgrade(this.layer, this.id-1) },
            title: `Machine 2`,
        },
        23: {
            cost() {
                let pos = player.hyper.paths.indexOf(2)
                if(pos == -1) { pos = player.hyper.paths.length }
                return Decimal.times(10, Decimal.pow(3, pos))
            },
            description: `Start all Hyper Rebirths with 10 Power Pylon F, and automate Power Pylon E`,
            canAfford() { return hasUpgrade(this.layer, this.id-1) },
            title: `Machine 3`,
        },
        24: {
            cost() {
                let pos = player.hyper.paths.indexOf(2)
                if(pos == -1) { pos = player.hyper.paths.length }
                return Decimal.times(25, Decimal.pow(3, pos))
            },
            description: `Add another Power Pylon self-boost that's exponential, but has 10% as much of an individual boost<br>Boost caps at 1000 Pylons`,
            canAfford() { return hasUpgrade(this.layer, this.id-1) },
            title: `Machine 4`,
        },
        
        31: {
            cost() {
                let pos = player.hyper.paths.indexOf(3)
                if(pos == -1) { pos = player.hyper.paths.length }
                return Decimal.times(1, Decimal.pow(3, pos))
            },
            onPurchase() {
                player.hyper.paths.push(3)
            },
            description() {return `Hyper Cash gain is boosted based on hyper cash<br>log<sub>3</sub>(HC)+1<br>Currently ${formatBoost(tmp[this.layer].upgrades[this.id].effect.sub(1))}`},
            effect() {
                return player.hyper.cash.max(1).log(3).add(1)
            },
            title: `Hyper 1`,
        },
        32: {
            cost() {
                let pos = player.hyper.paths.indexOf(3)
                if(pos == -1) { pos = player.hyper.paths.length }
                return Decimal.times(4, Decimal.pow(3, pos))
            },
            description: `Increase Hyper Cash gain by ×10`,
            canAfford() { return hasUpgrade(this.layer, this.id-1) },
            title: `Hyper 2`,
        },
        33: {
            cost() {
                let pos = player.hyper.paths.indexOf(3)
                if(pos == -1) { pos = player.hyper.paths.length }
                return Decimal.times(10, Decimal.pow(3, pos))
            },
            description() {return `Hyper Cash's boost to Universal Time also applies directly to Cash, RP, and SRP, at ^3 efficiency<br>Currently: ${formatBoost(tmp[this.layer].upgrades[this.id].effect.sub(1))}`},
            canAfford() { return hasUpgrade(this.layer, this.id-1) },
            title: `Hyper 3`,
            effect() {
                return tmp.hyper.cashEffect.pow(3)
            },
        },
        34: {
            cost() {
                let pos = player.hyper.paths.indexOf(3)
                if(pos == -1) { pos = player.hyper.paths.length }
                return Decimal.times(25, Decimal.pow(3, pos))
            },
            description: `Hyper Cash's boost to Universal Time also applies directly to Power Pylons, Power Allocation, and HC, and improve HC's boost to Universal Time`,
            canAfford() { return hasUpgrade(this.layer, this.id-1) },
            title: `Hyper 4`,
        },
        
        41: {
            cost() {
                let pos = player.hyper.paths.indexOf(4)
                if(pos == -1) { pos = player.hyper.paths.length }
                return Decimal.times(1, Decimal.pow(3, pos))
            },
            onPurchase() {
                player.hyper.paths.push(4)
            },
            description: `Increase Cash, RP, and SRP gain by ×10`,
            title: `Combined 1`,
        },
        42: {
            cost() {
                let pos = player.hyper.paths.indexOf(4)
                if(pos == -1) { pos = player.hyper.paths.length }
                return Decimal.times(4, Decimal.pow(3, pos))
            },
            description: `Increase Power, Power Pylons, and Power Allocation by ×10`,
            canAfford() { return hasUpgrade(this.layer, this.id-1) },
            title: `Combined 2`,
        },
        43: {
            cost() {
                let pos = player.hyper.paths.indexOf(4)
                if(pos == -1) { pos = player.hyper.paths.length }
                return Decimal.times(10, Decimal.pow(3, pos))
            },
            description: `Increase Hyper Cash, Power, RP, and SRP gain by ×5`,
            canAfford() { return hasUpgrade(this.layer, this.id-1) },
            title: `Combined 3`,
        },
        44: {
            cost() {
                let pos = player.hyper.paths.indexOf(4)
                if(pos == -1) { pos = player.hyper.paths.length }
                return Decimal.times(25, Decimal.pow(3, pos))
            },
            description: `Increase RP and SRP ×10, and HRP's boost to RP now also applies to Cash and HC`,
            canAfford() { return hasUpgrade(this.layer, this.id-1) },
            title: `Combined 4`,
        },
        
        51: {
            cost: new Decimal(2500),
            description: `Unlock the Matter Combustor in the machine`,
            canAfford() {
                return hasUpgrade(this.layer, 14) && hasUpgrade(this.layer, 24) && hasUpgrade(this.layer, 34) && hasUpgrade(this.layer, 44)
            }
        },
        52: {
            cost: new Decimal(250000),
            description: `Add an Antimatter Chamber to the Matter Combustor`,
            canAfford() {
                return hasUpgrade(this.layer, this.id-1)
            },
        },
        53: {
            cost: new Decimal(2.5e8),
            description: `Add a Black Hole Container to the Matter Combustor`,
            canAfford() {
                return hasUpgrade(this.layer, this.id-1)
            },
        },
        54: {
            cost: new Decimal(1e15),
            description: `Add a Matter Stabiliser to the Matter Combustor`,
            canAfford() {
                return hasUpgrade(this.layer, this.id-1)
            },
        },
    },
    clickables: {
        11: {
            style: {
                'background-image': 'url(resources/cash.png)',
                'position': 'relative',
                'top': '0px',
                'left': '-90px',
                'width': '120px',
                'height': '120px',
                'min-height': '120px',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': 'contain',
                'border-radius': '50%',
            },
            tooltip() {
                return `Basic 1<br>${tmp[this.layer].upgrades[this.id].description}<br>Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].cost)} HRP`
            },
            canClick(){return canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id)}, has(){return hasUpgrade(this.layer, this.id)}, onClick() { buyUpg(this.layer, this.id) },
            unlocked(){return hasMilestone('hyper', 4)},
        },
        12: {
            style: {
                'background-image': 'url(resources/rp.png)',
                'position': 'relative',
                'top': '60px',
                'left': '-210px',
                'width': '120px',
                'height': '120px',
                'min-height': '120px',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': '120px 120px',
                'border-radius': '50%',
            },
            branches: [11],
            tooltip() {
                return `Basic 2<br>${tmp[this.layer].upgrades[this.id].description}<br>Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].cost)} HRP`
            },
            canClick(){return canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id)}, has(){return hasUpgrade(this.layer, this.id)}, onClick() { buyUpg(this.layer, this.id) },
            unlocked(){return hasMilestone('hyper', 4)},
        },
        13: {
            style: {
                'background-image': 'url(resources/srp.png)',
                'position': 'relative',
                'top': '180px',
                'left': '-270px',
                'width': '120px',
                'height': '120px',
                'min-height': '120px',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': '120px 120px',
                'border-radius': '50%',
            },
            branches: [12],
            tooltip() {
                return `Basic 3<br>${tmp[this.layer].upgrades[this.id].description}<br>Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].cost)} HRP`
            },
            canClick(){return canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id)}, has(){return hasUpgrade(this.layer, this.id)}, onClick() { buyUpg(this.layer, this.id) },
            unlocked(){return hasMilestone('hyper', 4)},
        },
        14: {
            style: {
                'background-image': 'url(resources/power.png)',
                'position': 'relative',
                'top': '300px',
                'left': '-210px',
                'width': '120px',
                'height': '120px',
                'min-height': '120px',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': '120px 120px',
                'border-radius': '50%',
            },
            branches: [13],
            tooltip() {
                return `Basic 4<br>${tmp[this.layer].upgrades[this.id].description}<br>Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].cost)} HRP`
            },
            canClick(){return canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id)}, has(){return hasUpgrade(this.layer, this.id)}, onClick() { buyUpg(this.layer, this.id) },
            unlocked(){return hasMilestone('hyper', 4)},
        },
        
        21: {
            style: {
                'background-image': 'url(resources/theMachine.png)',
                'position': 'relative',
                'top': '0px',
                'left': '90px',
                'width': '120px',
                'height': '120px',
                'min-height': '120px',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': '120px 120px',
                'border-radius': '50%',
            },
            tooltip() {
                return `Machine 1<br>${tmp[this.layer].upgrades[this.id].description}<br>Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].cost)} HRP`
            },
            canClick(){return canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id)}, has(){return hasUpgrade(this.layer, this.id)}, onClick() { buyUpg(this.layer, this.id) },
            unlocked(){return hasMilestone('hyper', 4)},
        },
        22: {
            style: {
                'background-image': 'url(resources/powerPylon.png)',
                'position': 'relative',
                'top': '60px',
                'left': '210px',
                'width': '120px',
                'height': '120px',
                'min-height': '120px',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': '120px 120px',
                'border-radius': '50%',
            },
            branches: [21],
            tooltip() {
                return `Machine 2<br>${tmp[this.layer].upgrades[this.id].description}<br>Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].cost)} HRP`
            },
            canClick(){return canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id)}, has(){return hasUpgrade(this.layer, this.id)}, onClick() { buyUpg(this.layer, this.id) },
            unlocked(){return hasMilestone('hyper', 4)},
        },
        23: {
            style: {
                'background-image': 'url(resources/powerPylonHyper.png)',
                'position': 'relative',
                'top': '180px',
                'left': '270px',
                'width': '120px',
                'height': '120px',
                'min-height': '120px',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': '120px 120px',
                'border-radius': '50%',
            },
            branches: [22],
            tooltip() {
                return `Machine 3<br>${tmp[this.layer].upgrades[this.id].description}<br>Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].cost)} HRP`
            },
            canClick(){return canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id)}, has(){return hasUpgrade(this.layer, this.id)}, onClick() { buyUpg(this.layer, this.id) },
            unlocked(){return hasMilestone('hyper', 4)},
        },
        24: {
            style: {
                'background-image': 'url(resources/powerPylonLinearExponential.png)',
                'position': 'relative',
                'top': '300px',
                'left': '210px',
                'width': '120px',
                'height': '120px',
                'min-height': '120px',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': '120px 120px',
                'border-radius': '50%',
            },
            branches: [23],
            tooltip() {
                return `Machine 4<br>${tmp[this.layer].upgrades[this.id].description}<br>Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].cost)} HRP`
            },
            canClick(){return canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id)}, has(){return hasUpgrade(this.layer, this.id)}, onClick() { buyUpg(this.layer, this.id) },
            unlocked(){return hasMilestone('hyper', 4)},
        },
        
        31: {
            style: {
                'background-image': 'url(resources/hyperCash.png)',
                'position': 'relative',
                'top': '150px',
                'left': '520px',
                'width': '120px',
                'height': '120px',
                'min-height': '120px',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': 'contain',
                'border-radius': '50%',
            },
            tooltip() {
                return `Hyper 1<br>${tmp[this.layer].upgrades[this.id].description}<br>Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].cost)} HRP`
            },
            canClick(){return canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id)}, has(){return hasUpgrade(this.layer, this.id)}, onClick() { buyUpg(this.layer, this.id) },
            unlocked(){return hasMilestone('hyper', 4)},
        },
        32: {
            style: {
                'background-image': 'url(resources/hyperCash.png)',
                'position': 'relative',
                'top': '280px',
                'left': '470px',
                'width': '120px',
                'height': '120px',
                'min-height': '120px',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': 'contain',
                'border-radius': '50%',
            },
            branches: [31],
            tooltip() {
                return `Hyper 2<br>${tmp[this.layer].upgrades[this.id].description}<br>Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].cost)} HRP`
            },
            canClick(){return canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id)}, has(){return hasUpgrade(this.layer, this.id)}, onClick() { buyUpg(this.layer, this.id) },
            unlocked(){return hasMilestone('hyper', 4)},
        },
        33: {
            style: {
                'background-image': 'url(resources/cashAndMoreFriends.png)',
                'position': 'relative',
                'top': '400px',
                'left': '400px',
                'width': '120px',
                'height': '120px',
                'min-height': '120px',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': '120px 120px',
                'border-radius': '50%',
            },
            branches: [32],
            tooltip() {
                return `Hyper 3<br>${tmp[this.layer].upgrades[this.id].description}<br>Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].cost)} HRP`
            },
            canClick(){return canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id)}, has(){return hasUpgrade(this.layer, this.id)}, onClick() { buyUpg(this.layer, this.id) },
            unlocked(){return hasMilestone('hyper', 4)},
        },
        34: {
            style: {
                'background-image': 'url(resources/absoluteHell.png)',
                'position': 'relative',
                'top': '460px',
                'left': '275px',
                'width': '120px',
                'height': '120px',
                'min-height': '120px',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': '120px 120px',
                'border-radius': '50%',
            },
            branches: [33],
            tooltip() {
                return `Hyper 4<br>${tmp[this.layer].upgrades[this.id].description}<br>Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].cost)} HRP`
            },
            canClick(){return canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id)}, has(){return hasUpgrade(this.layer, this.id)}, onClick() { buyUpg(this.layer, this.id) },
            unlocked(){return hasMilestone('hyper', 4)},
        },
        
        41: {
            style: {
                'background-image': 'url(resources/cashAndFriends.png)',
                'position': 'relative',
                'top': '150px',
                'left': '-520px',
                'width': '120px',
                'height': '120px',
                'min-height': '120px',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': 'contain',
                'border-radius': '50%',
            },
            tooltip() {
                return `Combined 1<br>${tmp[this.layer].upgrades[this.id].description}<br>Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].cost)} HRP`
            },
            canClick(){return canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id)}, has(){return hasUpgrade(this.layer, this.id)}, onClick() { buyUpg(this.layer, this.id) },
            unlocked(){return hasMilestone('hyper', 4)},
        },
        42: {
            style: {
                'background-image': 'url(resources/machinePower.png)',
                'position': 'relative',
                'top': '280px',
                'left': '-470px',
                'width': '120px',
                'height': '120px',
                'min-height': '120px',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': 'contain',
                'border-radius': '50%',
            },
            branches: [41],
            tooltip() {
                return `Combined 2<br>${tmp[this.layer].upgrades[this.id].description}<br>Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].cost)} HRP`
            },
            canClick(){return canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id)}, has(){return hasUpgrade(this.layer, this.id)}, onClick() { buyUpg(this.layer, this.id) },
            unlocked(){return hasMilestone('hyper', 4)},
        },
        43: {
            style: {
                'background-image': 'url(resources/absoluteHell2.png)',
                'position': 'relative',
                'top': '400px',
                'left': '-400px',
                'width': '120px',
                'height': '120px',
                'min-height': '120px',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': 'contain',
                'border-radius': '50%',
            },
            branches: [42],
            tooltip() {
                return `Combined 3<br>${tmp[this.layer].upgrades[this.id].description}<br>Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].cost)} HRP`
            },
            canClick(){return canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id)}, has(){return hasUpgrade(this.layer, this.id)}, onClick() { buyUpg(this.layer, this.id) },
            unlocked(){return hasMilestone('hyper', 4)},
        },
        44: {
            style: {
                'background-image': 'url(resources/theRebirthFamily.png)',
                'position': 'relative',
                'top': '460px',
                'left': '-275px',
                'width': '120px',
                'height': '120px',
                'min-height': '120px',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': '120px 120px',
                'border-radius': '50%',
            },
            branches: [43],
            tooltip() {
                return `Combined 4<br>${tmp[this.layer].upgrades[this.id].description}<br>Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].cost)} HRP`
            },
            canClick(){return canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id)}, has(){return hasUpgrade(this.layer, this.id)}, onClick() { buyUpg(this.layer, this.id) },
            unlocked(){return hasMilestone('hyper', 4)},
        },
        
        51: {
            style: {
                'background-image': 'url(resources/matterCombustor.png)',
                'position': 'relative',
                'top': '260px',
                'left': '0px',
                'width': '120px',
                'height': '120px',
                'min-height': '120px',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': 'contain',
                'border-radius': '50%',
            },
            branches: [14, 24, 34, 44],
            tooltip() {
                return `Matter 1<br>${tmp[this.layer].upgrades[this.id].description}<br>Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].cost)} HRP`
            },
            canClick(){return canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id)}, has(){return hasUpgrade(this.layer, this.id)}, onClick() { buyUpg(this.layer, this.id) },
            unlocked(){return hasMilestone('hyper', 4)},
        },
        52: {
            style: {
                'background-image': 'url(resources/antimatterChamber.png)',
                'position': 'relative',
                'top': '400px',
                'left': '0px',
                'width': '120px',
                'height': '120px',
                'min-height': '120px',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': 'contain',
                'border-radius': '50%',
            },
            branches: [51],
            tooltip() {
                return `Matter 2<br>${tmp[this.layer].upgrades[this.id].description}<br>Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].cost)} HRP`
            },
            canClick(){return canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id)}, has(){return hasUpgrade(this.layer, this.id)}, onClick() { buyUpg(this.layer, this.id) },
            unlocked(){return hasUpgrade(this.layer, this.id-1)},
        },
        53: {
            style: {
                'background-image': 'url(resources/blackHoleContainer.png)',
                'position': 'relative',
                'top': '540px',
                'left': '0px',
                'width': '120px',
                'height': '120px',
                'min-height': '120px',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': 'contain',
                'border-radius': '50%',
            },
            branches: [52],
            tooltip() {
                return `Matter 3<br>${tmp[this.layer].upgrades[this.id].description}<br>Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].cost)} HRP`
            },
            canClick(){return canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id)}, has(){return hasUpgrade(this.layer, this.id)}, onClick() { buyUpg(this.layer, this.id) },
            unlocked(){return hasUpgrade(this.layer, this.id-1)},
        },
        54: {
            style: {
                'background-image': 'url(resources/strangeMatterCreator.png)',
                'position': 'relative',
                'top': '680px',
                'left': '0px',
                'width': '120px',
                'height': '120px',
                'min-height': '120px',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': 'contain',
                'border-radius': '50%',
            },
            branches: [53],
            tooltip() {
                return `Matter 4<br>${tmp[this.layer].upgrades[this.id].description}<br>Cost: ${formatWhole(tmp[this.layer].upgrades[this.id].cost)} HRP`
            },
            canClick(){return canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id)}, has(){return hasUpgrade(this.layer, this.id)}, onClick() { buyUpg(this.layer, this.id) },
            unlocked(){return hasUpgrade(this.layer, this.id-1)},
        },

        99: {
            style: {
                'position': 'relative',
                'top': '710px',
                'height': '120px',
                'min-height': '120px',
                'visibility': 'hidden',

            },
            canClick(){return false},
            unlocked(){return hasMilestone('hyper', 4)},
        },
        98: {
            style: {
                "height": '45px',
                'width': '130px',
            },
            canClick(){return !hasUpgrade('hyper', 51)},
            onClick() {
                player.hyper.upgrades = []
                doReset('hyper', true)
                player.hyper.points = player.hyper.total
                player.hyper.paths = []
            },
            display(){return `<h2>Respec</h2>`},
            unlocked(){return hasMilestone('hyper', 4)},
        },
        97: {
            style: {
                "height": '45px',
                'width': '45px',
                "border-radius": '50%',
                'margin-left': '15px',
                'background-color': 'var(--background)',
                'color': '#2eb5c8',
                'border-color': '#2eb5c8',
            },
            canClick(){return false},
            display(){return `<h2>?</h2>`},
            tooltip() {
                if(options.tooltipCredits) return `Idea from adoplayzz<br><span style="font-size: 11px;">HRP upgrades are split into 4 categories: Basic, Machine, Hyper and Combined. Each time you buy the first upgrade in that category the other categories cost increases by *2<br><br>Basic: 1HRP: *100 Cash, 2HRP: *15 RP and *5 SRP, 3HRP: you start with 100 SRP, 5HRP: *10 cash and SRP<br>Machine: 1HRP: all modes are applied twice, 2HRP: *5 PPy generation, 3HRP: You start with 1 PPy3, 5HRP: decrease all cost scailing of PPy by -^0.2<br>Hyper: 1HRP: hyper cash boost cash by log3(HC), 2HRP: hyper cash *10, 3HRP: hyper cash boosts RP and SRP by log5(HC), 5HRP: hyper cash boosts HRP by log10(HC), also hyper cash *3<br>Combined: 2HRP: *5 Cash, *3 RP, *2 SRP, *5 Power, 3HRP: *2 Tickspeed, *2 PPy generation, *2 cash, 5HRP: HC,RP,SRP,Power *5, 10HRP: unlocks a new extension to the machine<br><br>The matter combustor:<br>in the matter combustor you generate Matter, Anti-Matter, Dark-Matter and Exotic-Matter or (M,AM,DM,EM) +1/s<br><br>Matter and Anti-Matter divide each others gain by sqrt(M)/sqrt(AM) Dark-Matter and Exotic-Matter do the same`
                return `<h2>Hyper Paths</h2><br>Hyper Paths are sets of four upgrades.<br>Starting a path increases the cost of all unstarted paths.<br>The Matter Path is exempt from this.` },
            unlocked(){return hasMilestone('hyper', 4)},
        },
    },
})