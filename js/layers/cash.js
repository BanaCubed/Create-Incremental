addLayer('cash', {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    row: 0,
    upgrades: {
        11: {
            fullDisplay() {
                return `<h3>Passive Income</h3><br>
                Start passively earning $1.00 per second<br><br>
                Cost: ${"$" + format(tmp.cash.upgrades[this.id].costa)}`
            },
            costa: new Decimal(0),
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(!hasMilestone('super', 0)) {player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)}},
            effect() {
                return new Decimal(1)
            }
        },
        12: {
            fullDisplay() {
                return `<h3>Double Shifts</h3><br>
                Double cash gain<br><br>
                Cost: ${"$" + format(tmp.cash.upgrades[this.id].costa)}`
            },
            costa: new Decimal(9.99),
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(!hasMilestone('super', 0)) {player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)}},
            effect() {
                return new Decimal(2)
            }
        },
        13: {
            fullDisplay() {
                return `<h3>Stop Working at McDonalds</h3><br>
                Increase cash gain based on current cash<br>
                Currently: ×${format(tmp[this.layer].upgrades[this.id].effect)}<br><br>
                Cost: ${"$" + format(tmp.cash.upgrades[this.id].costa)}`
            },
            costa: new Decimal(24.99),
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(!hasMilestone('super', 0)) {player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)}},
            effect() {
                let exponent = new Decimal(1)
                if(hasUpgrade('cash', 23)) exponent = exponent.times(tmp.cash.upgrades[23].effect)
                return player.points.max(1).log(10).add(1).pow(exponent)
            },
        },
        14: {
            fullDisplay() {
                return `<h3>Get a<br>Full-Time Job</h3><br>
                Increase cash gain based on current cash again<br>
                Currently: ×${format(tmp[this.layer].upgrades[this.id].effect)}<br><br>
                Cost: ${"$" + format(tmp.cash.upgrades[this.id].costa)}`
            },
            costa: new Decimal(99.99),
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(!hasMilestone('super', 0)) {player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)}},
            effect() {
                return player.points.max(1).log(1.5).add(1).pow(0.4)
            },
        },
        15: {
            fullDisplay() {
                return `<h3>Compensate for Inflation</h3><br>
                Double cash gain again<br><br>
                Cost: ${"$" + format(tmp.cash.upgrades[this.id].costa)}`
            },
            costa: new Decimal(249.99),
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(!hasMilestone('super', 0)) {player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)}},
            effect() {
                return new Decimal(2)
            },
        },
        16: {
            fullDisplay() {
                return `<h3>Overcompensate for Inflation</h3><br>
                Double cash gain again<br><br>
                Cost: ${"$" + format(tmp.cash.upgrades[this.id].costa)}`
            },
            costa: new Decimal(599.99),
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(!hasMilestone('super', 0)) {player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)}},
            effect() {
                return new Decimal(2)
            },
        },
        21: {
            fullDisplay() {
                return `<h3>Accellerate Inflation</h3><br>
                Increase cash gain absed on time in current rebirth<br>
                Currently: ×${format(tmp[this.layer].upgrades[this.id].effect)}<br><br>
                Cost: ${"$" + format(tmp.cash.upgrades[this.id].costa)}`
            },
            costa: new Decimal(2500),
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(challengeCompletions('super', 11) < 1)player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)},
            effect() {
                return Decimal.max(player.rebirth.resetTime, 1).log(10).add(1)
            },
            unlocked(){return hasUpgrade('rebirth', 13)}
        },
        22: {
            fullDisplay() {
                return `<h3>Triple Shifts</h3><br>
                Increase cash gain based on amount of cash upgrades<br>
                Currently: ×${format(tmp[this.layer].upgrades[this.id].effect)}<br><br>
                Cost: ${"$" + format(tmp.cash.upgrades[this.id].costa)}`
            },
            costa: new Decimal(10000),
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(challengeCompletions('super', 11) < 2)player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)},
            effect() {
                return Decimal.max(player.cash.upgrades.length, 1).pow(0.5).add(1)
            },
            unlocked(){return hasUpgrade('rebirth', 13)}
        },
        23: {
            fullDisplay() {
                return `<h3>Buy a McDonalds</h3><br>
                Increase above upgrades effect<br><br>
                Cost: ${"$" + format(tmp.cash.upgrades[this.id].costa)}`
            },
            costa: new Decimal(100000),
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(challengeCompletions('super', 11) < 3)player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)},
            effect() {
                return new Decimal(1.3)
            },
            unlocked(){return hasUpgrade('rebirth', 13)}
        },
        24: {
            fullDisplay() {
                return `<h3>Buy a Church</h3><br>
                Increase RP gain base<br><br>
                Cost: ${"$" + format(tmp.cash.upgrades[this.id].costa)}`
            },
            costa: new Decimal(500000),
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(challengeCompletions('super', 11) < 4)player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)},
            effect() {
                return new Decimal(1.25)
            },
            unlocked(){return hasUpgrade('rebirth', 13)}
        },
        25: {
            fullDisplay() {
                return `<h3>Buy a Relgious Artifact</h3><br>
                Increase RP effect base<br><br>
                Cost: ${"$" + format(tmp.cash.upgrades[this.id].costa)}`
            },
            costa: new Decimal(2500000),
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(challengeCompletions('super', 11) < 5)player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)},
            effect() {
                return new Decimal(0.8)
            },
            unlocked(){return hasUpgrade('rebirth', 13)}
        },
        26: {
            fullDisplay() {
                return `<h3>Buy a Money Printer</h3><br>
                Unlock The Machine<br><br>
                Cost: ${"$" + format(tmp.cash.upgrades[this.id].costa)}`
            },
            costa: new Decimal(8000000),
            canAfford() {return player.points.gte(tmp.cash.upgrades[this.id].costa)},
            pay() {if(challengeCompletions('super', 11) < 6)player.points = player.points.sub(tmp.cash.upgrades[this.id].costa)},
            unlocked(){return hasUpgrade('rebirth', 13)}
        },
    },
    color: "rgb(21, 115, 7)",
    tabFormat: {
        "Main": {
            unlocked(){return player.machine.unlocked},
            content: [
                ['display-text', function() { return options.cashPin?'':`You have <h2 style="color: rgb(21, 115, 7); text-shadow: rgb(21, 115, 7) 0px 0px 10px;">$${format(player.points)}</h2><br>(${format(getPointGen())}/sec)<br><br>`}],
                "buyables",
                'upgrades'
            ],
            buttonStyle: {
                "border-color": "rgb(21, 115, 7)",
                "background-color": "rgb(10, 57, 3)",
            },
            shouldNotify() {
                let state = false
                for (const upgrades in tmp.cash.upgrades) {
                    if (Object.hasOwnProperty.call(tmp.cash.upgrades, upgrades)) {
                        const upgrade = tmp.cash.upgrades[upgrades];
                        if(upgrade.canAfford && !hasUpgrade('cash', upgrades)) state = true
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
                "border-color": "#444444",
                "background-color": "#222222",
            },
            embedLayer: 'machine',
        },
    },
    doReset(layer) {
        layerDataReset('cash', [])
        let upgs = []
        if(layer === 'rebirth') {
            if(hasUpgrade('rebirth', 12)) {
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
                return `Increase RP gain, but also increase cash required to rebirth<br><br>Currently: ×${format(tmp.cash.buyables[11].effect)} RP, ×${format(tmp.cash.buyables[11].effect.pow(tmp.cash.buyables[11].nerfExpo))} req<br>Count: ${formatWhole(getBuyableAmount('cash', 11))}<br>Cost: $${formatWhole(tmp.cash.buyables[11].cost)}`
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
        },
    },
})
