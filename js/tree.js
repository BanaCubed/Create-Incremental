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
            unlocked(){return true},
            buttonStyle: {
                "border-color": "rgb(21, 115, 7)",
                "background-color": "rgb(10, 57, 3)",
            },
            embedLayer: 'cash',
        },
        "Rebirth": {
            unlocked(){return player.rebirth.unlocked},
            buttonStyle: {
                "border-color": "#BA0022",
                "background-color": "#5D0011",
            },
            embedLayer: 'rebirth',
        },
        "Options": {
            unlocked(){return true},
            buttonStyle: {
                "border-color": "rgb(128, 128, 128)",
                "background-color": "rgb(64, 64, 64)",
            },
            content: [
                "options-tab"
            ],
        },
        "Info": {
            unlocked(){return true},
            buttonStyle: {
                "border-color": "rgb(128, 128, 128)",
                "background-color": "rgb(64, 64, 64)",
            },
            content: [
                "info-tab"
            ],
        },
    },
    previousTab: "",
    leftTab: true,
})