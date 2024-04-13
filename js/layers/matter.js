addLayer('M', {
    name: "matter",
    resource: "Matter",
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    row: 3,
    update(diff) {

    },
    effect() {

    },
    effectDescription() {

    },
    color: "#2dc0d6",
    previousTab: 'HC',
    branches: [["DM", 1], ["EM", 1]]
})

addLayer('AM', {
    name: "antimatter",
    resource: "Antimatter",
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    row: 3,
    update(diff) {

    },
    effect() {

    },
    effectDescription() {

    },
    color: "#d6442d",
    branches: [["DM", 1], ["EM", 1]]
})

addLayer('DM', {
    name: "dark-matter",
    resource: "Dark Matter",
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    row: 3,
    update(diff) {

    },
    effect() {

    },
    effectDescription() {

    },
    color: "#303030",
    branches: []
})

addLayer('EM', {
    name: "exotic-matter",
    resource: "Exotic Matter",
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    row: 3,
    update(diff) {

    },
    effect() {

    },
    effectDescription() {

    },
    color: "#cc59de",
})