var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
	showTree: true,

    treeLayout: [
    ],

    
}

addNode("blank", {
    layerShown: "ghost"
})

addLayer("tree-tab", {
    tabFormat: {
        "Cash": {
            unlocked(){return options.cashTab},
            buttonStyle: {
                "border-color": "rgb(21, 115, 7)",
                "background-color": "rgb(10, 57, 3)",
            },
            embedLayer: 'cash',
        },
        "Rebirths": {
            unlocked(){return player.rebirth.unlocked && options.rebirthTab},
            buttonStyle: {
                "border-color": "#BA0022",
                "background-color": "#5D0011",
            },
            embedLayer: 'rebirth',
        },
        "Options": {
            embedLayer: 'options-tab',
            buttonStyle: {
                "border-color": "rgb(112, 128, 144)",
                "background-color": "rgb(56, 64, 72)",
            },
        },
        "Info": {
            embedLayer: 'info-tab',
            buttonStyle: {
                "border-color": "rgb(112, 128, 144)",
                "background-color": "rgb(56, 64, 72)",
            },
        },
        "Challenges": {
            unlocked(){return player.chall.unlocked && options.challTab},
            buttonStyle: {
                "border-color": "rgb(112, 128, 144)",
                "background-color": "rgb(56, 64, 72)",
            },
            embedLayer: 'chall',
        },
    },
    previousTab: "",
    leftTab: true,
})