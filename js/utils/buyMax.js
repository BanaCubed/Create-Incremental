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
}

function costOfX(layer, type, id, amount) {
    amount = Decimal.floor(amount)
    return layers[layer][type][id].cost(amount)
}

function buyMax(layer, type, id) {
    let canBuy = maxAffordable(layer, type, id)
    let cost = costOfX(layer, type, id, canBuy)

    let toBuy = new Decimal(0)
    if(type === 'buyables') { toBuy = canBuy.sub(getBuyableAmount(layer, id)) }

    if(layer === 'rebirth') { if(!hasMilestone('super', 2)) player.rebirth.points = player.rebirth.points.sub(cost).max(0) }
    if(layer === 'cash') { if(!hasMilestone('super', 5) && layers[layer][type][id].canAfford()) player.points = player.points.sub(cost).max(0) }

    if(type === 'buyables') { setBuyableAmount(layer, id, canBuy.max(getBuyableAmount(layer, id))) }
}