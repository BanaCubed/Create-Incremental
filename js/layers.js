addLayer('chall', {
    type: "none",
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    tabFormat: {
        "Super": {
            content: [
                ['display-text', `Because nobody likes grinding challenges during each reset,<br>challenges will be retained if you reach a certain point in progression.<br>This bonus is never reset.<br><br>Hyper is absent, so Super challenges aren't ever reset.<br><br>`],
                ['layer-proxy', ['super', [
                    'challenges',
                ]]],
            ],
            buttonStyle: {
                "border-color": "#EB1A3D",
                "background-color": "#750D1E",
            },
            shouldNotify() {
                const challs = [11, 12]
                for (let index = 0; index < challs.length; index++) {
                    const element = challs[index];
                    if(inChallenge('super', element) && tmp.super.challenges[element].canComplete) return true
                }
                return false
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
                    if(inChallenge('super', 11)) {
                        return player.points.div(8000000)
                    }
                    if(inChallenge('super', 12)) {
                        return player.points.div(8000000)
                    }
                    return player.super.points.div(50)
                }
            },
            unlocked(){return true},
            borderStyle: {
                'border-width': '4px',
                'border-radius': '20px',
            },
            baseStyle: {
                'background-color': 'var(--background)',
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
                        return `Unlock the machine to complete<br>${format(player.points)}/$8.00M`
                    }
                    if(inChallenge('super', 12)) {
                        if(canCompleteChallenge('super', 12)) return `Can complete challenge`
                        return `Unlock the machine to complete<br>${format(player.points)}/$8.00M`
                    }
                    return `Purchase Super Rebirth upgrade 4 to unlock Power<br>${formatWhole(player.super.points)}/50 SRP`
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
                    if(inChallenge('super', 11)) {
                        return `rgb(21, 115, 7)`
                    }
                    if(inChallenge('super', 12)) {
                        return `rgb(21, 115, 7)`
                    }
                    return `rgb(251, 26, 61)`
                }
            },
            fillStyle() { return {
                'background-color': this.nextColor()
            }},
        },
    }
})
