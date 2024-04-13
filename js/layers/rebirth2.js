addLayer("SR", {
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        tax: new Decimal(1),
    }},
    row: "2",
    canBuyMax() {
        return hasMilestone(this.layer, 2)
    },
    color: "#eb1a3d",
    resource: "Super Rebirth Points",
    requires() {
        let req = new Decimal(1e19)
        if(hasUpgrade('HC', 31)) req = req.div("1e9")
        if(hasUpgrade('HC', 34)) req = req.div(100000)
        return req
    },
    type: "static",
    base: new Decimal(2),
    exponent: new Decimal(1),
    roundUpCost: true,
    baseResource: "RP",
    branches: ["R"],
    tabFormat: {
        "Boosts": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "upgrades",
                "milestones",
            ]
        },
        "Challenges": {
            content: [
                ["display-text", "Entering a challenge forces a Super Rebirth reset<br>Whilst inside of a challenge, various nerfs are applied to you<br>A challenge can be completed after reaching its goal, which will vary between the challenges<br>After completing a challenge, a powerful upgrade is applied for free"],
                "blank",
                "h-line",
                "blank",
                "challenges",
            ]
        },
    },
    baseAmount() { return player.R.points },
    layerShown() {
        return hasAchievement('A', 41)
    },
    effect() {
        let pow = new Decimal(1)
        if (hasUpgrade('R', 34)) pow = pow.add(1)
        return [player.SR.points.pow(pow).times(1.5).add(1),
        player.SR.points.pow(pow.sub(0.5)).add(1)]
    },
    effectDescription() {
        return "multiplying RP gain by " + coolDynamicFormat(this.effect()[1], 2)
        + " and $ gain by " + coolDynamicFormat(this.effect()[0], 2)
    },
    milestones: {
        0: {
            requirementDescription: "1 SRP",
            effectDescription: "$ upgrades 1-8 are kept on all resets, and RP buyables don't spend RP.",
            done() {
                return player.SR.points.gte(1)
            }
        },
        1: {
            requirementDescription: "2 SRP",
            effectDescription: "Keep first 4 RP upgrades on SRP reset, and keep $ upgrades 9-11 on all resets",
            done() {
                return player.SR.points.gte(2)
            }
        },
        2: {
            requirementDescription: "3 SRP",
            effectDescription: "Unlock a $ buyable (kept on Rebirths), and unlock the ability to buy max SRP",
            done() {
                return player.SR.points.gte(3)
            }
        },
        3: {
            requirementDescription: "5 SRP",
            effectDescription: "ALL buyables are kept on Super Rebirth resets, keep RP upgrade 6 and 7, boost the $ buyable, and unlock the first challenge",
            done() {
                return player.SR.points.gte(5)
            },
            tooltip: "$ buyable boost: 1.1^x -> 1.3^x"
        },
        4: {
            requirementDescription: "8 SRP",
            effectDescription: "Raise $ gain ^1.1",
            done() {
                return player.SR.points.gte(8)
            },
        },
        5: {
            requirementDescription: "12 SRP",
            effectDescription: "Keep ALL $ and RP upgrades on Rebirth and Super Rebirth, and unlock another challenge",
            done() {
                return player.SR.points.gte(12)
            },
        },
        6: {
            requirementDescription: "18 SRP",
            effectDescription: "Unlock more upgrades (above milestone affects them)",
            done() {
                return player.SR.points.gte(18)
            },
        },
        7: {
            requirementDescription: "20 SRP",
            effectDescription: "Automate all currently unlocked buyables",
            done() {
                return player.SR.points.gte(20)
            },
        },
        8: {
            requirementDescription: "25 SRP",
            effectDescription: "Unlock Power",
            done() {
                return player.SR.points.gte(25)
            },
        },
        9: {
            requirementDescription: "100 SRP",
            effectDescription: "Every bought upgrade before Super Rebirth increases $ gain by 40% (exponential)",
            done() {
                return player.SR.points.gte(100)
            },
            effect() {
                let upgs = new Decimal(1)

                if(hasUpgrade('U', 11)) upgs = upgs.times(1.4)
                if(hasUpgrade('U', 12)) upgs = upgs.times(1.4)
                if(hasUpgrade('U', 13)) upgs = upgs.times(1.4)
                if(hasUpgrade('U', 14)) upgs = upgs.times(1.4)

                if(hasUpgrade('U', 21)) upgs = upgs.times(1.4)
                if(hasUpgrade('U', 22)) upgs = upgs.times(1.4)
                if(hasUpgrade('U', 23)) upgs = upgs.times(1.4)
                if(hasUpgrade('U', 24)) upgs = upgs.times(1.4)

                if(hasUpgrade('U', 31)) upgs = upgs.times(1.4)
                if(hasUpgrade('U', 32)) upgs = upgs.times(1.4)
                if(hasUpgrade('U', 33)) upgs = upgs.times(1.4)
                if(hasUpgrade('U', 34)) upgs = upgs.times(1.4)

                if(hasUpgrade('U', 41)) upgs = upgs.times(1.4)
                if(hasUpgrade('U', 42)) upgs = upgs.times(1.4)
                if(hasUpgrade('U', 43)) upgs = upgs.times(1.4)
                if(hasUpgrade('U', 44)) upgs = upgs.times(1.4)

                if(hasUpgrade('U', 51)) upgs = upgs.times(1.4)
                if(hasUpgrade('U', 52)) upgs = upgs.times(1.4)
                if(hasUpgrade('U', 53)) upgs = upgs.times(1.4)
                if(hasUpgrade('U', 54)) upgs = upgs.times(1.4)


                if(hasUpgrade('R', 11)) upgs = upgs.times(1.4)
                if(hasUpgrade('R', 12)) upgs = upgs.times(1.4)
                if(hasUpgrade('R', 13)) upgs = upgs.times(1.4)
                if(hasUpgrade('R', 14)) upgs = upgs.times(1.4)

                if(hasUpgrade('R', 21)) upgs = upgs.times(1.4)
                if(hasUpgrade('R', 22)) upgs = upgs.times(1.4)
                if(hasUpgrade('R', 23)) upgs = upgs.times(1.4)
                if(hasUpgrade('R', 24)) upgs = upgs.times(1.4)

                if(hasUpgrade('R', 31)) upgs = upgs.times(1.4)
                if(hasUpgrade('R', 32)) upgs = upgs.times(1.4)
                if(hasUpgrade('R', 33)) upgs = upgs.times(1.4)
                if(hasUpgrade('R', 34)) upgs = upgs.times(1.4)

                return upgs
            },
            tooltip() {
                return "Currently: x" + coolDynamicFormat(this.effect(), 2)
            }
        },
        10: {
            requirementDescription: "Unlock the Fourth Challenge",
            effectDescription: "Keep the fourth challenge unlocked even when $ Upgrade 19 is locked or removed",
            done() {
                return hasUpgrade('U', 53)
            },
            unlocked() { return hasUpgrade('U', 53) }
        }
    },
    challenges: {
        11: {
            name: "Betrayed Gods",
            challengeDescription: "You cannot Rebirth",
            canComplete() { return player.points.gte(30000000) },
            unlocked() { return hasMilestone(this.layer, 3) },
            rewardDescription: "Gain 20% of RP gain every second",
            goalDescription: "Reach 30,000,000 $"
        },
        12: {
            name: "A Low Income Family<br>in the Midst of<br>Inflation",
            challengeDescription: "$ gain ^0.5 and Rebirth requirement x10",
            canComplete() { return player.R.points.gte("1e15") },
            unlocked() { return hasMilestone(this.layer, 5) },
            rewardDescription: "Rebirth Requirement /10",
            goalDescription: "Reach 1e15 RP"
        },
        21: {
            name: "Clicking Simulator<br>202X",
            challengeDescription: "Nothing is kept on any resets and all automation is disabled",
            canComplete() { return player.R.points.gte("1e20") },
            unlocked() { return hasMilestone('P', 1) },
            rewardDescription: "Multiply automatic RP gain by 10 and also reduce RP buyables scaling",
            goalDescription: "Reach 1e20 RP",
            onEnter() {
                player.U.upgrades = []
                player.R.upgrades = []
                setBuyableAmount('U', 11, new Decimal(0))
                setBuyableAmount('R', 11, new Decimal(0))
                setBuyableAmount('R', 12, new Decimal(0))
            }
        },
        22: {
            name: "Sold Out",
            challengeDescription: "All $ Upgrades and The Machine are disabled, but, you passively gain 1 $ per second",
            canComplete() { return player.R.points.gte("4e36") },
            unlocked() { return hasMilestone('SR', 10) },
            rewardDescription: "Unlock Power Pylon D, and $ boosts SRP gain slightly",
            goalDescription: "Reach 4e36 RP",
            rewardEffect() {
                return player.points.add(10).log(10).pow(0.1)
            },
            rewardDisplay() {
                return "Raising SRP cost by ^" + coolDynamicFormat(new Decimal(1).div(this.rewardEffect()), 4)
            }
        },
        31: {
            name: "Tax Evasion Simulator",
            challengeDescription() { return "There is rapidly increasing Tax that divides $ gain<br>" + formatWhole(challengeCompletions('SR', 31)) + "/4 Completions" },
            canComplete() { return player.R.points.gte(new Decimal("1e50").times(new Decimal(1000).pow(challengeCompletions('SR', 31)))) },
            unlocked() { return hasMilestone('P', 7) },
            rewardDescription: "Boost each Power Pylon based on the previous Power Pylon<br>On first completion unlock Power Pylon E<br>On final completion unlock Power Pylon F",
            goalDescription() {
                let goal = new Decimal("1e50").times(new Decimal(1000).pow(challengeCompletions('SR', 31)))
                return "Reach " + coolDynamicFormat(goal, 0) + " RP"
            },
            rewardEffect() {
                return new Decimal(50).div(new Decimal(1.5).pow(challengeCompletions('SR', 31)))
            },
            rewardDisplay() {
                return "Multiplies by log" + coolDynamicFormat(this.rewardEffect(), 0) + " of previous Pylon"
            },
            completionLimit: new Decimal(4),
            onEnter() {
                player.SR.tax = new Decimal(10).pow(challengeCompletions('SR', 31))
            },
            style: {
                width: "450px"
            }
        },
    },
    position: 0,
    gainExp() {
        let expo = new Decimal(1)
        if(hasChallenge('SR', 22)) expo = expo.times(player.points.add(10).log(10).pow(0.1))
        if(hasUpgrade('SR', 12)) expo = expo.times(1.5)
        return expo
    },
    directMult() {
        let mult = new Decimal(1)
        mult = mult.times(layers.HC.effect()[1])
        if(hasUpgrade('HC', 33)) mult = mult.times(layers.C.effect()[2])
        return mult
    },
    update(diff) {
        if(inChallenge('SR', 31)) {
            player.SR.tax = player.SR.tax.times(new Decimal(0.2).times(new Decimal(2).pow(challengeCompletions('SR', 31))).add(1).pow(diff))
        }
    },
    upgrades: {
        11: {
            unlocked() { return hasMilestone('P', 10) },
            cost: new Decimal("1e600"),
            currencyDisplayName: "$",
            currencyInternalName: "points",
            title: "Δ - Delta",
            description: "Raise RP gain by ^1.05"
        },
        12: {
            unlocked() { return hasMilestone('P', 10) },
            cost: new Decimal("1e270"),
            currencyDisplayName: "RP",
            currencyInternalName: "points",
            currencyLayer() { return 'R' },
            title: "Σ - Sigma",
            description: "Raise SRP cost by ^0.66"
        },
        13: {
            unlocked() { return hasMilestone('P', 10) },
            cost: new Decimal(2600),
            currencyDisplayName: "SRP",
            title: "Ψ - Phi",
            description: "Raise Power Pylon effect by ^1.2"
        },
        14: {
            unlocked() { return hasMilestone('P', 10) },
            cost: new Decimal("1e200"),
            currencyDisplayName: "Power",
            currencyInternalName: "points",
            currencyLayer() { return 'P' },
            title: "Θ - Theta",
            description: "Automate the second $ buyable<br>And unlock another upgrade..."
        },
        21: {
            style: {
                width: "400px",
                height: "200px"
            },
            unlocked() { return hasUpgrade('SR', 14) },
            title: "Ω - Omega",
            description: "Start calculating Hyper Essence<br>Hyper Essence is calculated based on log($), SRP, and log(Power)<br>Unlock another prestige layer...",
            cost: new Decimal(6000),
        }
    },
    doReset(resetlayer) {
        if(resetlayer === 'HC') {
            player.SR.points = new Decimal(0)
            player.SR.milestones = []
            player.SR.upgrades = []
            if(!hasMilestone('HC', 2)) player.SR.challenges = {}
            player.SR.milestones.push(2, 6, 7)
            if(hasUpgrade('HC', 12)) player.SR.milestones.push(8)
            if(hasUpgrade('HC', 31)) player.SR.points.add(12)
        }
        if(resetlayer === 'SR') {
            completeChallenge('SR')
        }
    },
    automate() {
        if(hasMilestone('HC', 3)) {
            buyUpgrade('SR', 11)
            buyUpgrade('SR', 12)
            buyUpgrade('SR', 13)
            buyUpgrade('SR', 14)
        }
    },
    milestonePopups() { return !hasMilestone('HC', 1) },
    resetsNothing() { return hasMilestone('HC', 4) },
    autoPrestige() { return hasMilestone('HC', 5) },
    hotkeys: [
        {
            key: "s", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "S: Super Rebirth up the heavenly hierarchy", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() { if (player.SR.unlocked) doReset("SR") },
            unlocked() {return player.SR.unlocked} // Determines if you can use the hotkey, optional
        }
    ]
})

addLayer("P", {
    name: "power",
    symbol: "P",
    row: "2",
    resource: "Power",
    color: "#d6c611",
    type: "custom",
    baseAmount() { return player.SR.points },
    baseResource: "SRP",
    resetsNothing: true,
    requires: new Decimal(25),
    getResetGain() { return new Decimal(1) },
    getNextAt() { return new Decimal(25) },
    canReset() { return !hasMilestone('P', 0) && player.SR.points.gte(25) },
    tooltip() { return coolDynamicFormat(player.P.points, 2) + " Power" },
    prestigeButtonText() {
        return "Unlock Power"
    },
    branches: [['SR', 1]],
    layerShown() { return hasAchievement('A', 45) },
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            pylonA: new Decimal(1),
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
        }
    },
    update(diff) {
        if (hasMilestone('SR', 8)) player.P.unlocked = true
        if (hasMilestone('SR', 8)) player.P.points = player.P.points.add(layers.P.clickables[11].effect().times(diff))
        if (hasMilestone('SR', 8)) player.P.pylonA = player.P.pylonA.add(layers.P.clickables[12].effect().times(diff))
        if (hasMilestone('SR', 8)) player.P.pylonB = player.P.pylonB.add(layers.P.clickables[13].effect().times(diff))
        if (hasMilestone('SR', 8)) player.P.pylonC = player.P.pylonC.add(layers.P.clickables[14].effect().times(diff))
        if (hasMilestone('SR', 8)) player.P.pylonD = player.P.pylonD.add(layers.P.clickables[15].effect().times(diff))
        if (hasMilestone('SR', 8)) player.P.pylonE = player.P.pylonE.add(layers.P.clickables[16].effect().times(diff))
    },
    effect() {
        return player.P.points.div(100).add(1)
    },
    effectDescription() {
        return "boosting The Machine by x" + coolDynamicFormat(layers.P.effect(), 3)
    },
    position: 1,
    milestones: {
        0: {
            requirementDescription: "1 Power",
            effectDescription: "Unlock Power Pylons",
            done() {
                return player.P.points.gte(1)
            }
        },
        1: {
            requirementDescription: "2 Power Pylon A (PPyA)",
            effectDescription: "Unlock another challenge",
            done() {
                return player.P.pylobA.gte(2)
            }
        },
        2: {
            requirementDescription: "20 Power",
            effectDescription: "Unlock Power Pylon B (PPyB)",
            done() {
                return player.P.points.gte(20)
            }
        },
        3: {
            requirementDescription: "5 PPyB",
            effectDescription: "Each manually bought PPy boosts its own type by x1.15 (exponential)",
            done() {
                return player.P.pylobB.gte(5)
            }
        },
        4: {
            requirementDescription: "15,000 Power",
            effectDescription: "Boost PPyA's effect by x5",
            done() {
                return player.P.points.gte(15000)
            }
        },
        5: {
            requirementDescription: "100,000 Power",
            effectDescription: "Unlock Power Pylon C",
            done() {
                return player.P.points.gte(100000)
            }
        },
        6: {
            requirementDescription: "1,000,000 Power",
            effectDescription: "Slightly reduce Power Pylon Costs, unlock some more upgrades",
            done() {
                return player.P.points.gte("1e6")
            }
        },
        7: {
            requirementDescription: "123,456,789 Power",
            effectDescription: "Unlock the final challenge",
            done() {
                return player.P.points.gte("123456789")
            }
        },
        8: {
            requirementDescription: "1e18 Power",
            effectDescription: "Boost the first 16 $ upgrades ($ Upgrades v2)",
            done() {
                return player.P.points.gte("1e18")
            }
        },
        9: {
            requirementDescription: "1e20 Power",
            effectDescription: "Divide PPyF cost by SRP, PPyE by SRP^2, PPyD by SRP^3, PPyC by SRP^4, PPyB by SRP^5, PPyA by SRP^6",
            done() {
                return player.P.points.gte("1e20")
            }
        },
        10: {
            requirementDescription: "12 PPyF",
            effectDescription: "Unlock another $ buyable, and unlock some more upgrades (in SR layer)",
            done() {
                return player.P.pylobF.gte(12)
            }
        },
        11: {
            requirementDescription: "1e60 Power",
            effectDescription: "Automate Power Pylons A-C",
            done() {
                return player.P.points.gte("1e60")
            }
        },
        12: {
            requirementDescription: "1e120 Power",
            effectDescription: "Automate Power Pylons D and E",
            done() {
                return player.P.points.gte("1e120")
            }
        },
    },
    tabFormat: {
        "Boosts": {
            content: [
                "main-display",
                "blank",
                "milestones",
                "upgrades",
            ]
        },
        "Power Pylons": {
            content: [
                "main-display",
                "clickables",
            ]
        },
    },
    automate() {
        if(hasMilestone('P', 11) || hasAchievement('A', 81)) {
            if(player.P.points.gte(layers.P.clickables[11].cost()) && (hasMilestone('P', 0) || hasUpgrade('HC', 32))) {
                player.P.pylonA = player.P.pylonA.add(1)
                player.P.pylobA = player.P.pylobA.add(1)
                if(hasMilestone('HC', 1)) {
                    player.P.pylonA = player.P.pylonA.add(9)
                    player.P.pylobA = player.P.pylobA.add(9)
                }
            }
            if(player.P.pylonA.gte(layers.P.clickables[12].cost()) && (hasMilestone('P', 2) || hasUpgrade('HC', 32))) {
                player.P.pylonB = player.P.pylonB.add(1)
                player.P.pylobB = player.P.pylobB.add(1)
                if(hasMilestone('HC', 1)) {
                    player.P.pylonB = player.P.pylonB.add(9)
                    player.P.pylobB = player.P.pylobB.add(9)
                }
            }
            if(player.P.pylonB.gte(layers.P.clickables[13].cost()) && (hasMilestone('P', 5) || hasUpgrade('HC', 32))) {
                player.P.pylonC = player.P.pylonC.add(1)
                player.P.pylobC = player.P.pylobC.add(1)
                if(hasMilestone('HC', 1)) {
                    player.P.pylonC = player.P.pylonC.add(9)
                    player.P.pylobC = player.P.pylobC.add(9)
                }
            }
        }
        if(hasMilestone('P', 12) || hasAchievement('A', 81)) {
            if(player.P.pylonC.gte(layers.P.clickables[14].cost()) && (hasChallenge('SR', 22) || hasUpgrade('HC', 32))) {
                player.P.pylonD = player.P.pylonD.add(1)
                player.P.pylobD = player.P.pylobD.add(1)
                if(hasMilestone('HC', 1)) {
                    player.P.pylonD = player.P.pylonD.add(9)
                    player.P.pylobD = player.P.pylobD.add(9)
                }
            }
            if(player.P.pylonD.gte(layers.P.clickables[15].cost()) && (hasChallenge('SR', 31) || hasUpgrade('HC', 32))) {
                player.P.pylonE = player.P.pylonE.add(1)
                player.P.pylobE = player.P.pylobE.add(1)
                if(hasMilestone('HC', 1)) {
                    player.P.pylonE = player.P.pylonE.add(9)
                    player.P.pylobE = player.P.pylobE.add(9)
                }
            }
        }
        if(hasUpgrade('HC', 32)) {
            if(player.P.pylonE.gte(layers.P.clickables[16].cost())) {
                player.P.pylonF = player.P.pylonF.add(10)
                player.P.pylobF = player.P.pylobF.add(10)
            }

        }
    },
    clickables: {
        11: {
            style: {
                height: '100px',
                width: '200px'
            },
            title: "Power Pylon A",
            display() {
                return "Cost: " + coolDynamicFormat(this.cost(), 2) + " Power"
                + "<br>Count: " + coolDynamicFormat(player.P.pylonA, 2) + " [" + coolDynamicFormat(player.P.pylobA, 0) + "]"
                + "<br>Producing +" + coolDynamicFormat(this.effect(), 3) + " Power/s"
            },
            canClick() { return player[this.layer].points.gte(this.cost()) },
            onClick() {
                player[this.layer].points = player[this.layer].points.sub(this.cost());
                player.P.pylonA = player.P.pylonA.add(1)
                player.P.pylobA = player.P.pylobA.add(1)
            },
            unlocked() {
                return (hasMilestone('P', 0) || hasUpgrade('HC', 33))
            },
            effect() {
                return pPylon('A', player.P.pylonA, player.P.pylobA)
            },
            cost() {
                let expo = new Decimal(1.5)
                let divi = new Decimal(1)
                if(hasMilestone('P', 6)) expo = expo.sub(0.05)
                if(hasMilestone('P', 9)) divi = divi.times(player.SR.points.add(1).pow(6))
                if(hasUpgrade('HC', 33)) expo = expo.sub(0.2)
                if(player.P.pylobA.gte(1001)) expo = expo.add(player.P.pylobA.sub(1000).div(100).pow(2))
                if(hasUpgrade('HC', 34)) divi = divi.times(100000)
                return expo.pow(player.P.pylobA).div(divi)
            }
        },
        12: {
            style: {
                height: '100px',
                width: '200px'
            },
            title: "Power Pylon B",
            display() {
                return "Cost: " + coolDynamicFormat(this.cost(), 2) + " PPyA"
                + "<br>Count: " + coolDynamicFormat(player.P.pylonB, 2) + " [" + coolDynamicFormat(player.P.pylobB, 0) + "]"
                + "<br>Producing +" + coolDynamicFormat(this.effect(), 3) + " PPyA/s"
            },
            canClick() { return player[this.layer].pylonA.gte(this.cost()) },
            onClick() {
                player[this.layer].pylonA = player[this.layer].pylonA.sub(this.cost());
                player.P.pylonB = player.P.pylonB.add(1)
                player.P.pylobB = player.P.pylobB.add(1)
            },
            unlocked() {
                return (hasMilestone('P', 2) || hasUpgrade('HC', 33))
            },
            effect() {
                return pPylon('B', player.P.pylonB, player.P.pylobB)
            },
            cost() {
                let expo = new Decimal(2)
                let divi = new Decimal(1)
                if(hasMilestone('P', 6)) expo = expo.sub(0.05)
                if(hasMilestone('P', 9)) divi = divi.times(player.SR.points.add(1).pow(5))
                if(hasUpgrade('HC', 33)) expo = expo.sub(0.2)
                if(player.P.pylobB.gte(1001)) expo = expo.add(player.P.pylobB.sub(1000).div(100).pow(2))
                if(hasUpgrade('HC', 34)) divi = divi.times(100000)
                return expo.pow(player.P.pylobB).div(divi)
            }
        },
        13: {
            style: {
                height: '100px',
                width: '200px'
            },
            title: "Power Pylon C",
            display() {
                return "Cost: " + coolDynamicFormat(this.cost(), 2) + " PPyB"
                + "<br>Count: " + coolDynamicFormat(player.P.pylonC, 2) + " [" + coolDynamicFormat(player.P.pylobC, 0) + "]"
                + "<br>Producing +" + coolDynamicFormat(this.effect(), 3) + " PPyB/s"
            },
            canClick() { return player[this.layer].pylonB.gte(this.cost()) },
            onClick() {
                player[this.layer].pylonB = player[this.layer].pylonB.sub(this.cost());
                player.P.pylonC = player.P.pylonC.add(1)
                player.P.pylobC = player.P.pylobC.add(1)
            },
            unlocked() {
                return (hasMilestone('P', 5) || hasUpgrade('HC', 33))
            },
            effect() {
                return pPylon('C', player.P.pylonC, player.P.pylobC)
            },
            cost() {
                let expo = new Decimal(2.5)
                let divi = new Decimal(1)
                if(hasMilestone('P', 6)) expo = expo.sub(0.05)
                if(hasMilestone('P', 9)) divi = divi.times(player.SR.points.add(1).pow(4))
                if(hasUpgrade('HC', 33)) expo = expo.sub(0.2)
                if(player.P.pylobC.gte(1001)) expo = expo.add(player.P.pylobC.sub(1000).div(100))
                if(hasUpgrade('HC', 34)) divi = divi.times(100000)
                return expo.pow(player.P.pylobC).div(divi)
            }
        },
        14: {
            style: {
                height: '100px',
                width: '200px'
            },
            title: "Power Pylon D",
            display() {
                return "Cost: " + coolDynamicFormat(this.cost(), 2) + " PPyC"
                + "<br>Count: " + coolDynamicFormat(player.P.pylonD, 2) + " [" + coolDynamicFormat(player.P.pylobD, 0) + "]"
                + "<br>Producing +" + coolDynamicFormat(this.effect(), 3) + " PPyC/s"
            },
            canClick() { return player[this.layer].pylonC.gte(this.cost()) },
            onClick() {
                player[this.layer].pylonC = player[this.layer].pylonC.sub(this.cost());
                player.P.pylonD = player.P.pylonD.add(1)
                player.P.pylobD = player.P.pylobD.add(1)
            },
            unlocked() {
                return (hasChallenge('SR', 22) || hasUpgrade('HC', 33))
            },
            effect() {
                return pPylon('D', player.P.pylonD, player.P.pylobD)
            },
            cost() {
                let expo = new Decimal(3)
                let divi = new Decimal(1)
                if(hasMilestone('P', 6)) expo = expo.sub(0.05)
                if(hasMilestone('P', 9)) divi = divi.times(player.SR.points.add(1).pow(3))
                if(hasUpgrade('HC', 33)) expo = expo.sub(0.2)
                if(player.P.pylobD.gte(1001)) expo = expo.add(player.P.pylobD.sub(1000).div(100))
                if(hasUpgrade('HC', 34)) divi = divi.times(100000)
                return expo.pow(player.P.pylobD).div(divi)
            }
        },
        15: {
            style: {
                height: '100px',
                width: '200px'
            },
            title: "Power Pylon E",
            display() {
                return "Cost: " + coolDynamicFormat(this.cost(), 2) + " PPyD"
                + "<br>Count: " + coolDynamicFormat(player.P.pylonE, 2) + " [" + coolDynamicFormat(player.P.pylobE, 0) + "]"
                + "<br>Producing +" + coolDynamicFormat(this.effect(), 3) + " PPyD/s"
            },
            canClick() { return player[this.layer].pylonD.gte(this.cost()) },
            onClick() {
                player[this.layer].pylonD = player[this.layer].pylonD.sub(this.cost());
                player.P.pylonE = player.P.pylonE.add(1)
                player.P.pylobE = player.P.pylobE.add(1)
            },
            unlocked() {
                return (hasChallenge('SR', 31) || hasUpgrade('HC', 33))
            },
            effect() {
                return pPylon('E', player.P.pylonE, player.P.pylobE)
            },
            cost() {
                let expo = new Decimal(3.5)
                let divi = new Decimal(1)
                if(hasMilestone('P', 6)) expo = expo.sub(0.05)
                if(hasMilestone('P', 9)) divi = divi.times(player.SR.points.add(1).pow(2))
                if(hasUpgrade('HC', 33)) expo = expo.sub(0.2)
                if(player.P.pylobE.gte(1001)) expo = expo.add(player.P.pylobE.sub(1000).div(100))
                if(hasUpgrade('HC', 34)) divi = divi.times(100000)
                return expo.pow(player.P.pylobE).div(divi)
            }
        },
        16: {
            style: {
                height: '100px',
                width: '200px'
            },
            title: "Power Pylon F",
            display() {
                return "Cost: " + coolDynamicFormat(this.cost(), 2) + " PPyE"
                + "<br>Count: " + coolDynamicFormat(player.P.pylonF, 2) + " [" + coolDynamicFormat(player.P.pylobF, 0) + "]"
                + "<br>Producing +" + coolDynamicFormat(this.effect(), 3) + " PPyE/s"
            },
            canClick() { return player[this.layer].pylonE.gte(this.cost()) },
            onClick() {
                player[this.layer].pylonE = player[this.layer].pylonE.sub(this.cost());
                player.P.pylonF = player.P.pylonF.add(1)
                player.P.pylobF = player.P.pylobF.add(1)
            },
            unlocked() {
                return (maxedChallenge('SR', 31) || hasUpgrade('HC', 33))
            },
            effect() {
                return pPylon('F', player.P.pylonF, player.P.pylobF)
            },
            cost() {
                let expo = new Decimal(3.5)
                let divi = new Decimal(1)
                if(hasMilestone('P', 6)) expo = expo.sub(0.05)
                if(hasMilestone('P', 9)) divi = divi.times(player.SR.points.add(1))
                if(hasUpgrade('HC', 33)) expo = expo.sub(0.2)
                if(player.P.pylobF.gte(1001)) expo = expo.add(player.P.pylobF.sub(1000).div(100))
                if(hasUpgrade('HC', 34)) divi = divi.times(100000)
                return expo.pow(player.P.pylobF).div(divi)
            }
        },
    },
    doReset(resetlayer) {
        if(resetlayer == 'HC') {
            if(!hasUpgrade('HC', 32)) player.P.milestones = [8, 10]
            player.P.points = new Decimal(0)

            player.P.pylonA = new Decimal(1)
            player.P.pylonB = new Decimal(0)
            player.P.pylonC = new Decimal(0)
            player.P.pylonD = new Decimal(0)
            player.P.pylonE = new Decimal(0)
            player.P.pylonF = new Decimal(0)

            player.P.pylobA = new Decimal(0)
            player.P.pylobB = new Decimal(0)
            player.P.pylobC = new Decimal(0)
            player.P.pylobD = new Decimal(0)
            player.P.pylobE = new Decimal(0)
            player.P.pylobF = new Decimal(0)
            if(hasUpgrade('HC', 12)) player.P.points = player.P.points.add(1)
        }
    },
    milestonePopups() { return !hasMilestone('HC', 1) }
})