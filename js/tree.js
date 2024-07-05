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
                "background-color": "rgb(21, 115, 7)",
            },
            embedLayer: 'cash',
        },
        "Rebirths": {
            unlocked(){return player.rebirth.unlocked && options.rebirthTab},
            buttonStyle: {
                "background-color": "#BA0022",
            },
            embedLayer: 'rebirth',
        },
        "Options": {
            embedLayer: 'options-tab',
        },
        "Info": {
            embedLayer: 'info-tab',
        },
        "Challenges": {
            unlocked(){return player.chall.unlocked && options.challTab},
            embedLayer: 'chall',
        },
    },
    previousTab: "",
    leftTab: true,
})