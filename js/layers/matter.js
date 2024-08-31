addLayer('matter', {
    color: 'var(--matter)',
    symbol: 'M',
    layerShown(){return player.matter.unlocked},
    update(diff) {
        if(hasUpgrade('hyper', 51)) { player.matter.unlocked = true }
    },
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    resource: 'matter',
})