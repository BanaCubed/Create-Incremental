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
}

function costOfX(layer, type, id, amount) {
    amount = amount.floor()
    return layers[layer][type][id].cost(amount)
}

function buyMax(layer, type, id) {
    let canBuy = maxAffordable(layer, type, id)
    let cost = costOfX(layer, type, id, canBuy)

    let toBuy = new Decimal(0)
    if(type === 'buyable') { toBuy = canBuy.sub(getBuyableAmount(layer, id)) }

    if(layer === 'rebirth') { player.rebirth.points = player.rebirth.points.sub(cost) }

    if(type === 'buyable') { setBuyableAmount(layer, id, canBuy) }
}