function buyMax(item) {

    // Power Pylons
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