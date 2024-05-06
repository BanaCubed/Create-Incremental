const saveImports = {
    0: {
        import: "save",
        onImport() {
            player.SA14 = true
        }
    },
    1: {
        import: "milk",
        onImport() {
            doPopup('none', 'milk', 'milk', 300, '#ffffff')
            player.MILK = true
        }
    },
}