function buyMax(item) {

    // Optimisation levels:
    // Very Bad - bascially just spams the buy button
    // Bad - Very Bad but does multiple per attempt (doesn't get the exact amount right)
    // Good - uses a limited amount of checks that can't scale infinitely / can rarely scale infinitely
    // Very Good - has no noticable lag spike
    // Super Good - uses a set amount of checks that cannot scale
    // Perfect - uses a single check / equation

    // Power Pylons
    // Current Optimisation - Very Good

    if(item === 'Power') {
        const pylons = [{ // PPyA
                pylon() { return player.P.pylobA },
                unlocked() { return tmp.P.clickables[11].unlocked },
                clickableID: 11,
                spends: "points",
                exponent(amount) {
                    let expo = new Decimal(1.5)
                    if(hasMilestone('P', 6)) expo = expo.sub(0.05)
                    if(hasUpgrade('HC', 33)) expo = expo.sub(0.2)
                    if(amount.gte(1001)) expo = expo.add(amount.sub(1000).div(100).pow(2))
                    return expo
                },
                divisor() {
                    let divi = new Decimal(1)
                    if(hasMilestone('P', 9)) divi = divi.times(player.SR.points.add(1).pow(6))
                    if(hasUpgrade('HC', 34)) divi = divi.times(100000)
                    return divi
                },
                purchasing: "pylobA",
                aaaaaaaaaa: "pylonA"
            }, { // PPyB
                pylon() { return player.P.pylobB },
                unlocked() { return tmp.P.clickables[12].unlocked },
                clickableID: 12,
                spends: "pylonA",
                exponent(amount) {
                    let expo = new Decimal(2)
                    if(hasMilestone('P', 6)) expo = expo.sub(0.05)
                    if(hasUpgrade('HC', 33)) expo = expo.sub(0.2)
                    if(amount.gte(1001)) expo = expo.add(amount.sub(1000).div(100).pow(2))
                    return expo
                },
                divisor() {
                    let divi = new Decimal(1)
                    if(hasMilestone('P', 9)) divi = divi.times(player.SR.points.add(1).pow(5))
                    if(hasUpgrade('HC', 34)) divi = divi.times(100000)
                    return divi
                },
                purchasing: "pylobB",
                aaaaaaaaaa: "pylonB"
            }, { // PPyC
                pylon() { return player.P.pylobC },
                unlocked() { return tmp.P.clickables[13].unlocked },
                clickableID: 13,
                spends: "pylonB",
                exponent(amount) {
                    let expo = new Decimal(2.5)
                    if(hasMilestone('P', 6)) expo = expo.sub(0.05)
                    if(hasUpgrade('HC', 33)) expo = expo.sub(0.2)
                    if(amount.gte(1001)) expo = expo.add(amount.sub(1000).div(100))
                    return expo
                },
                divisor() {
                    let divi = new Decimal(1)
                    if(hasMilestone('P', 9)) divi = divi.times(player.SR.points.add(1).pow(4))
                    if(hasUpgrade('HC', 34)) divi = divi.times(100000)
                    return divi
                },
                purchasing: "pylobC",
                aaaaaaaaaa: "pylonC"
            }, { // PPyD
                pylon() { return player.P.pylobD },
                unlocked() { return tmp.P.clickables[14].unlocked },
                clickableID: 14,
                spends: "pylonC",
                exponent(amount) {
                    let expo = new Decimal(3)
                    if(hasMilestone('P', 6)) expo = expo.sub(0.05)
                    if(hasUpgrade('HC', 33)) expo = expo.sub(0.2)
                    if(amount.gte(1001)) expo = expo.add(amount.sub(1000).div(100))
                    return expo
                },
                divisor() {
                    let divi = new Decimal(1)
                    if(hasMilestone('P', 9)) divi = divi.times(player.SR.points.add(1).pow(3))
                    if(hasUpgrade('HC', 34)) divi = divi.times(100000)
                    return divi
                },
                purchasing: "pylobD",
                aaaaaaaaaa: "pylonD"
            }, { // PPyE
                pylon() { return player.P.pylobE },
                unlocked() { return tmp.P.clickables[15].unlocked },
                clickableID: 15,
                spends: "pylonD",
                exponent(amount) {
                    let expo = new Decimal(3.5)
                    if(hasMilestone('P', 6)) expo = expo.sub(0.05)
                    if(hasUpgrade('HC', 33)) expo = expo.sub(0.2)
                    if(amount.gte(1001)) expo = expo.add(amount.sub(1000).div(100))
                    return expo
                },
                divisor() {
                    let divi = new Decimal(1)
                    if(hasMilestone('P', 9)) divi = divi.times(player.SR.points.add(1).pow(2))
                    if(hasUpgrade('HC', 34)) divi = divi.times(100000)
                    return divi
                },
                purchasing: "pylobE",
                aaaaaaaaaa: "pylonE"
            }, { // PPyF
                pylon() { return player.P.pylobF },
                unlocked() { return tmp.P.clickables[16].unlocked },
                clickableID: 16,
                spends: "pylonE",
                exponent(amount) {
                    let expo = new Decimal(4)
                    if(hasMilestone('P', 6)) expo = expo.sub(0.05)
                    if(hasUpgrade('HC', 33)) expo = expo.sub(0.2)
                    if(amount.gte(1001)) expo = expo.add(amount.sub(1000).div(100))
                    return expo
                },
                divisor() {
                    let divi = new Decimal(1)
                    if(hasMilestone('P', 9)) divi = divi.times(player.SR.points.add(1))
                    if(hasUpgrade('HC', 34)) divi = divi.times(100000)
                    return divi
                },
                purchasing: "pylobF",
                aaaaaaaaaa: "pylonF"
            }]
        for (let index = 0; index < pylons.length; index++) {
            const pylondata = pylons[index];
            const baseAmount = pylondata.pylon()
            const id = pylondata.clickableID
            let tobuy = new Decimal(0)

            if(pylondata.unlocked()) {
                if(tmp.P.clickables[id].canClick) {
                    tobuy = baseAmount.div(32).add(1)
                    while (costFormula(baseAmount, pylondata, tobuy).lte(player.P[pylondata.spends])) {
                        tobuy = tobuy.times(2)
                    }

                    let lastamount = tobuy.div(2)
                    let previous = tobuy.div(2)
                    let lastchange = "increase"

                    for (let index = 0; index <= 20; index++) {
                        if(costFormula(baseAmount, pylondata, tobuy).lte(player.P[pylondata.spends]) && lastchange == "increase") {
                            lastchange = "decrease"
                            lastamount = previous
                        }
                        if(costFormula(baseAmount, pylondata, tobuy).gt(player.P[pylondata.spends]) && lastchange == "decrease") {
                            lastchange = "increase"
                            lastamount = previous
                        }
                        previous = tobuy
                        tobuy = tobuy.add(lastamount).div(2)
                    }
                }
                if (tobuy.gte(1)) {
                    if (!hasMilestone('P', 11)) {
                        player.P[pylondata.spends] = player.P[pylondata.spends].sub(costFormula(baseAmount, pylondata, tobuy))
                        if(player.P[pylondata.spends].lt(0)) player.P[pylondata.spends] = new Decimal(0)
                    }
                    player.P[pylondata.purchasing] = player.P[pylondata.purchasing].add(tobuy).floor()
                    player.P[pylondata.aaaaaaaaaa] = player.P[pylondata.aaaaaaaaaa].add(tobuy).floor()
                }
            }
        }
    }

    // Cash Buyables
    // Current Optimisation - Very Good

    if(item === "Cash") {
        let buy1 = player.points.add(1).log(10).sub(5).ceil()
        if(buy1.gte(getBuyableAmount('U', 11))) setBuyableAmount('U', 11, buy1)

        const buy2data = {
            amount() { return getBuyableAmount('U', 12) },
            unlocked() { return tmp.U.buyables[12].unlocked },
            cost(amount) {
                return layers.U.buyables[12].cost(amount)
            },
        }

        let tobuy = new Decimal(0)
        if(buy2data.unlocked() && layers.U.buyables[12].cost(getBuyableAmount('U', 12)).lte(player.points)) {
            tobuy = buy2data.amount().div(32).add(1)
            while (buy2data.cost(tobuy.add(getBuyableAmount('U', 12))).lte(player.points)) {
                tobuy = tobuy.times(2)
            }

            let lastamount = tobuy.div(2)
            let previous = tobuy.div(2)
            let lastchange = "increase"

            for (let index = 0; index <= 20; index++) {
                if(buy2data.cost(tobuy.add(getBuyableAmount('U', 12))).lte(player.points) && lastchange == "increase") {
                    lastchange = "decrease"
                    lastamount = previous
                }
                if(buy2data.cost(tobuy.add(getBuyableAmount('U', 12))).gt(player.points) && lastchange == "decrease") {
                    lastchange = "increase"
                    lastamount = previous
                }
                previous = tobuy
                tobuy = tobuy.add(lastamount).div(2)
            }
        }
        if (tobuy.gte(1)) {
            addBuyables('U', 12, tobuy.ceil())
        }
    }

    // Rebirth Buyables
    // Current Optimisation: Perfect
    
    if(item === "Rebirth") {
        let buy1expo = new Decimal(2)
        if(hasChallenge('SR', 21)) buy1expo = buy1expo.sub(0.5)
        let buy1 = player.R.points.div(20000).add(1).log(10).div(new Decimal(1.2).log(10)).pow(new Decimal(1).div(buy1expo)).ceil()

        if(buy1.gte(getBuyableAmount('R', 11))) setBuyableAmount('R', 11, buy1)

        
        let buy2expo = new Decimal(2)
        if(hasChallenge('SR', 21)) buy2expo = buy2expo.sub(0.25)
        let buy2 = player.R.points.div(1000000).add(1).log(10).div(new Decimal(3).log(10)).pow(new Decimal(1).div(buy2expo)).ceil()

        if(buy2.gte(getBuyableAmount('R', 12))) setBuyableAmount('R', 12, buy2)
    }
}

function costFormula(baseAmount, pylondata, tobuy) {
    const newTotal = baseAmount.add(tobuy)
    const divisor = pylondata.divisor()
    return pylondata.exponent(newTotal).pow(newTotal).div(divisor)
}