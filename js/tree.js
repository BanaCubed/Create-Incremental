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
            buttonStyle: {
                "background-color": "var(--cash)",
            },
            embedLayer: 'cash',
        },
        "Rebirths": {
            unlocked(){return player.rebirth.unlocked},
            buttonStyle: {
                "background-color": "var(--rebirth)",
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
            unlocked(){return player.chall.unlocked},
            embedLayer: 'chall',
        },
    },
    previousTab: "",
    leftTab: true,
})