function buyMax(item) {

    // Power Pylons
    // This is something that I would appreciate someone making more optimized since it currently just buys each pylon repeatedly

    // If you want to help, start by looking at the cost formula for power pylons
    // (the <1000 formula is quite simple, >1000 is too hard to reverse so I don't want to)

    if(item === 'Power') {

        // Power Pylon A
        if(layers.P.clickables[11].unlocked()) {
            let obj = layers.P.clickables[11]
            while(obj.canClick()) {
                obj.onClick()
            }
        }

        // Power Pylon B
        if(layers.P.clickables[12].unlocked()) {
            let obj = layers.P.clickables[12]
            while(obj.canClick()) {
                obj.onClick()
            }
        }

        // Power Pylon C
        if(layers.P.clickables[13].unlocked()) {
            let obj = layers.P.clickables[13]
            while(obj.canClick()) {
                obj.onClick()
            }
        }

        // Power Pylon D
        if(layers.P.clickables[14].unlocked()) {
            let obj = layers.P.clickables[14]
            while(obj.canClick()) {
                obj.onClick()
            }
        }

        // Power Pylon E
        if(layers.P.clickables[15].unlocked()) {
            let obj = layers.P.clickables[15]
            while(obj.canClick()) {
                obj.onClick()
            }
        }

        // Power Pylon F
        if(layers.P.clickables[16].unlocked()) {
            let obj = layers.P.clickables[16]
            while(obj.canClick()) {
                obj.onClick()
            }
        }
    }
}