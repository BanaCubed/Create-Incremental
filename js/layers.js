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
        },
    },
    update(diff) {
        if(hasUpgrade('super', 11)) player.chall.unlocked = true
    },
    row: 99,
})
