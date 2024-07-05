addLayer('chall', {
    type: "none",
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        pap: 50, // Power Allocation Percentage (0-100)
    }},
    tabFormat: {
        "Super": {
            content: [
                ['layer-proxy', ['super', [
                    'challenges',
                ]]],
            ],
            buttonStyle: {
                "background-color": "#EA183D",
            },
        },
    },
    update(diff) {
        if(hasUpgrade('super', 11)) player.chall.unlocked = true
    },
    row: 99,
    bars: {
        nextFeature: {
            direction: RIGHT,
            width: 90,
            height: 50,
            progress() {
                if(!player.rebirth.unlocked) {
                    return player.points.div(599.99)
                }
                if(!player.super.unlocked) {
                    return player.rebirth.points.div(1250)
                }
                if(true) {
                    if(inChallenge('super', 11) || inChallenge('super', 12) || inChallenge('super', 13)) {
                        return player.points.div(tmp.cash.upgrades[26].costa)
                    }
                    if(inChallenge('super', 14)) {
                        return player.rebirth.points.div(tmp.super.requires)
                    }
                    if(inChallenge('super', 15)) {
                        return player.rebirth.points.div(1e13)
                    }
                    if(!player.power.unlocked) {
                        return player.super.points.div(50)
                    }
                    if(!hasMilestone('chall', 0)) {
                        return player.power.power.max(0).add(1).log(10).div(50)
                    }
                    return player.power.power.max(0).add(1).log(10).div(65).times(0.75).add(player.power.pylonF.div(16))
                }
            },
            unlocked(){return true},
            borderStyle: {
                'border-width': '4px 4px',
            },
            baseStyle: {
                'background-color': 'var(--background)',
            },
            textStyle: {
                'text-shadow': 'black 0 0 5px'
            },
            display() {
                if(!player.rebirth.unlocked) {
                    return `Purchase cash upgrade 6 to unlock Rebirth<br>${format(player.points)}/$599.99`
                }
                if(!player.super.unlocked) {
                    return `Purchase Rebirth upgrade 12 to unlock Super Rebirth<br>${formatWhole(player.rebirth.points)}/1250 RP`
                }
                if(true) {
                    if(inChallenge('super', 11)) {
                        if(canCompleteChallenge('super', 11)) return `Can complete challenge`
                        return `Unlock the machine to complete<br>${format(player.points)}/$${formatWhole(tmp.cash.upgrades[26].costa)}`
                    }
                    if(inChallenge('super', 12)) {
                        if(canCompleteChallenge('super', 12)) return `Can complete challenge`
                        return `Unlock the machine to complete<br>${format(player.points)}/$${formatWhole(tmp.cash.upgrades[26].costa)}`
                    }
                    if(inChallenge('super', 13)) {
                        if(canCompleteChallenge('super', 13)) return `Can complete challenge`
                        return `Unlock the machine to complete<br>${format(player.points)}/$${formatWhole(tmp.cash.upgrades[26].costa)}`
                    }
                    if(inChallenge('super', 14)) {
                        if(canCompleteChallenge('super', 14)) return `Can complete challenge`
                        return `Reach Super Rebirth requirement to complete<br>${format(player.rebirth.points)}/${formatWhole(tmp.super.requires)} RP`
                    }
                    if(inChallenge('super', 15)) {
                        if(canCompleteChallenge('super', 15)) return `Can complete challenge`
                        return `Reach ${formatWhole(1e13)} RP to complete<br>${format(player.rebirth.points)}/${formatWhole(1e13)} RP`
                    }
                    if(!player.power.unlocked) {
                        return `Purchase Super Rebirth upgrade 4 to unlock Power<br>${formatWhole(player.super.points)}/50 SRP`
                    }
                    if(!hasMilestone('chall', 0)) {
                        return `Reach ${formatWhole(1e50)} Power to permanently improve the first three rows of cash upgrades<br>${format(player.power.power)}/${formatWhole(1e50)} Power`
                    }
                    return `Reach 4 Power Pylon F to unlock Hyper Rebirth<br>${formatWhole(player.power.pylonF)}/4 Pylons | ${formatWhole(player.power.power)}/${formatWhole(1e65)} Power`
                }
            },
            nextColor() {
                if(!player.rebirth.unlocked) {
                    return `rgb(21, 115, 7)`
                }
                if(!player.super.unlocked) {
                    return `#BA0022`
                }
                if(true) {
                    if(inChallenge('super', 11) || inChallenge('super', 12) || inChallenge('super', 13)) {
                        return `rgb(21, 115, 7)`
                    }
                    if(inChallenge('super', 14) || inChallenge('super', 15)) {
                        return `#BA0022`
                    }
                    if(!player.power.unlocked) {
                        return `rgb(251, 26, 61)`
                    }
                    return '#d6c611'
                }
            },
            fillStyle() { return {
                'background-color': this.nextColor()
            }},
        },
    },
    milestones: {
        0: {
            done() {
                return player.power.power.gte(1e45)
            },
            onComplete() {
                player.cash.upgrades = []
            }
        },
    },
    milestonePopups: false,
})
