function maxAffordable(layer, type, id) {
    if(layer === 'rebirth') {
        if(type === 'buyables') {
            if(id === 11) {
                return player.rebirth.points.max(2).log(3).floor()
            }
            if(id === 12) {
                return player.rebirth.points.max(2).log(8).floor()
            }
        }
    }
    if(layer === 'cash') {
        if(type === 'buyables') {
            if(id === 11) {
                return player.points.max(2).log(10).sub(5).floor()
            }
        }
    }
    if(layer === 'power') {
        if(type === 'pylons') {
            if(id === 21) {
                return player.power.power.max(1).log(2).add(1).floor()
            }
            if(id === 22) {
                return player.power.power.max(1).div(50).log(5).add(1).floor()
            }
            if(id === 23) {
                return player.power.power.max(1).div(1e5).log(10).add(1).floor()
            }
            if(id === 24) {
                return player.power.power.max(1).div(1e15).log(100).add(1).floor()
            }
            if(id === 25) {
                return player.power.power.max(1).div(1e21).log(1e3).add(1).floor()
            }
            if(id === 26) {
                return player.power.power.max(1).div(1e50).log(1e5).add(1).floor()
            }
        }
    }
}

function costOfX(layer, type, id, amount) {
    amount = Decimal.floor(amount)
    if(type == 'pylons') return
    return layers[layer][type][id].cost(amount)
}

function buyMax(layer, type, id) {
    let canBuy = maxAffordable(layer, type, id)
    let cost = costOfX(layer, type, id, canBuy)

    if(layer === 'rebirth') { if(!hasMilestone('super', 2)) player.rebirth.points = player.rebirth.points.sub(cost).max(0) }
    if(layer === 'cash') { if(!hasMilestone('super', 5) && layers[layer][type][id].canAfford()) player.points = player.points.sub(cost).max(0) }

    if(type === 'buyables') { setBuyableAmount(layer, id, canBuy.max(getBuyableAmount(layer, id))) }
    if(type === 'pylons') {
        const letter = getPylonLetter(layer, id)
        const increase = canBuy.sub(player[layer]['pylob' + letter]).max(0)
        player[layer]['pylob' + letter] = player[layer]['pylob' + letter].max(canBuy)
        player[layer]['pylon' + letter] = player[layer]['pylon' + letter].add(increase)
    }
}

function getPylonLetter(layer, id) {
    if(layer == 'power') {
        if(id == 21) return 'A'
        if(id == 22) return 'B'
        if(id == 23) return 'C'
        if(id == 24) return 'D'
        if(id == 25) return 'E'
        if(id == 26) return 'F'
    }
}
