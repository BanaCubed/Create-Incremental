addLayer("A", {
    name: "achievements",
    symbol: "🏆",
    row: "side",
    type: "none",
    resource: "achievements",
    color: "#FFEE88",
    tooltip: "Achievements",
    startData() { return {
        unlocked: true,
    }},
    tabFormat: {
        "Achievements": {
            content: [
                "achievements"
            ]
        },
        "Secrets": {
            content: [
                ["layer-proxy", ["SA", [
                    ["display-text", "Secret Achievements only say what to do to get them after obtaining them<br>Most Secret Achievements will become impossible if too much progression is made before unlocking them<br>Each Secret Achievement will also eventually have its own exclusive visual theme (available in options) once I figure out how to do that<br>There will be a surprise for getting all of them once there are enough of them for it to be interesting"],
                    ["display-text", "<br>There are currently 2 Secret Achievements<br>Every Secret Achievement has a hint when hovering over them to make them possible to obtain without searching up the answers (you'll do it anyways)"],
                    "h-line",
                    "achievements"]]]
            ]
        }
    },
    achievements: {
        11: {
            name: "The Start",
            tooltip: "Start producing $",
            done() {
                if (hasUpgrade('U', 11)) return true
            },
        },
        12: {
            name: "100 antima- I mean cash is a lot",
            tooltip: "Get 100 $ <br>(no, that is not a typo)",
            done() {
                if (player.points.gte(100)) return true
            },
        },
        13: {
            name: "We couldn't afford 9",
            tooltip: "Get the 8th $ upgrade",
            done() {
                if (hasUpgrade('U', 24)) return true
            },
        },
        14: {
            name: "Millionaire",
            tooltip: "Get 1,000,000 $",
            done() {
                if (player.points.gte(1000000)) return true
            },
        },
        15: {
            name: "Very Rich Person",
            tooltip: "Get 5e11 $",
            done() {
                if (player.points.gte("5e11")) return true
            },
        },
        21: {
            name: "Reincarnated",
            tooltip: "Rebirth",
            done() {
                if (player.R.points.gte(1)) return true
            },
        },
        22: {
            name: "Wow, more upgrades...",
            tooltip: "Buy a Rebirth Upgrade",
            done() {
                if (hasUpgrade('R', 11)) return true
            },
        },
        23: {
            name: "We COULD afford 9",
            tooltip: "Get the 9th $ upgrade",
            done() {
                if (hasUpgrade('U', 31)) return true
            },
        },
        24: {
            name: "Life and Death",
            tooltip: "Get the 5th Rebirth upgrade",
            done() {
                if (hasUpgrade('R', 21)) return true
            },
        },
        25: {
            name: "Endless Cycle",
            tooltip: "Get 100,000 Rebirth Points",
            done() {
                if (player.R.points.gte(100000)) return true
            },
        },
        31: {
            name: "Mechanical Mechanic",
            tooltip: "Unlock The Machine<br>Reward: automate $ upgrade 9",
            done() {
                if (hasUpgrade('U', 34)) return true
            },
        },
        32: {
            name: "Secondary Choice",
            tooltip: "Unlock the ability to use two of The Machines modes at once",
            done() {
                if (achievement33()) return true
            },
        },
        33: {
            name: "No thoughts required",
            tooltip: "Use all of the Machine's modes at once<br>Reward: automate $ upgrades 10-12",
            done() {
                if (hasUpgrade('R', 32)) return true
            },
        },
        34: {
            name: "Now with technically infinite upgrades!",
            tooltip: "Purchase the first RP buyable",
            done() {
                if (getBuyableAmount('R', 11).gte(1)) return true
            },
        },
        35: {
            name: "Perfectly Balanced",
            tooltip: "Purchase the second RP buyable",
            done() {
                if (getBuyableAmount('R', 12).gte(1)) return true
            },
        },
        41: {
            name: "Wow, a content",
            tooltip: "Buy RP upgrade 8",
            done() {
                if (hasUpgrade('R', 24)) return true
            },
        },
        42: {
            name: "Super Duper Uber Rebirth",
            tooltip: "Reach 1e19 RP<br>Reward: retain all automation in future",
            done() {
                if (player.R.points.gte("1e19")) return true
            },
        },
        43: {
            name: "Can't wait for Hyper Rebirth",
            tooltip: "Perform a Super Rebirth reset",
            done() {
                if (player.SR.points.gte(1)) return true
            },
        },
        44: {
            name: "Monetary Incentive",
            tooltip: "Purchase the $ buyable",
            done() {
                if (getBuyableAmount('U', 11).gte(1)) return true
            },
        },
        45: {
            name: "The Ninth Milestone is a Lie",
            tooltip: "Get Super Rebirth Milestone 8",
            done() {
                if (hasMilestone('SR', 7)) return true
            },
        },
        51: {
            name: "Unchallenged",
            tooltip: "Complete a challenge",
            done() {
                if (hasChallenge('SR', 11)) return true
            },
        },
        52: {
            name: "Powerful",
            tooltip: "Unlock Power",
            done() {
                if (hasMilestone('SR', 8)) return true
            },
        },
        53: {
            name: "Megawatt",
            tooltip: "Reach 1,000,000 Power",
            done() {
                if (player.P.points.gte(1000000)) return true
            },
        },
        54: {
            name: "Googology",
            tooltip: "Reach e100 $",
            done() {
                if (player.points.gte("1e100")) return true
            },
        },
        55: {
            name: "The Seventh Pylon is a Lie",
            tooltip: "Buy a PPyF",
            done() {
                if (player.P.pylobF.gte(1)) return true
            },
        },
        61: {
            name: "Duo-Googology",
            tooltip: "Reach e200 $",
            done() {
                if (player.points.gte("1e200")) return true
            },
        },
        62: {
            name: "Afterlife Google",
            tooltip: "Reach e100 RP",
            done() {
                if (player.R.points.gte("1e100")) return true
            },
        },
        63: {
            name: "Power Hungry",
            tooltip: "Reach 1e50 Power",
            done() {
                if (player.P.points.gte("1e50")) return true
            },
        },
        64: {
            name: "Hyper Rebirthed",
            tooltip: "Reach 500 SRP",
            done() {
                if (player.SR.points.gte(500)) return true
            },
        },
        65: {
            name: "To Inifinity, and Beyond!",
            tooltip: "Reach Infinity",
            done() {
                if (player.points.gte(new Decimal(2).pow(1024))) return true
            },
        },
        71: {
            name: "Kilometrerock",
            tooltip: "Obtain all Power Milestones",
            done() {
                if (hasMilestone('P', 12)) return true
            },
        },
        72: {
            name: "Super Upgraded",
            tooltip: "Purchase four Super Rebirth layer upgrades",
            done() {
                if (hasUpgrade('SR', 14)) return true
            },
        },
        73: {
            name: "Beeg numba",
            tooltip: "Reach e1000 $",
            done() {
                if (player.points.gte("1e1000")) return true
            },
        },
        74: {
            name: "Infinite^0.3 Power",
            tooltip: "Reach e100 Power",
            done() {
                if (player.P.points.gte("1e100")) return true
            },
        },
        75: {
            name: "Just getting started",
            tooltip: "Purchase Omega",
            done() {
                if (hasUpgrade('SR', 21)) return true
            },
        },
        83: {
            name: "Hyper Rebirth?",
            tooltip: "Go Hyper",
            done() {
                if (player.HC.points.gte(1)) return true
            },
        },
        81: {
            name: "The Basic Path",
            tooltip: "Start the Basic Path",
            done() {
                if (hasUpgrade('HC', 11)) return true
            },
        },
        82: {
            name: "The Machine's Path",
            tooltip: "Start the Machine's Path",
            done() {
                if (hasUpgrade('HC', 12)) return true
            },
        },
        84: {
            name: "The Hyper Path",
            tooltip: "Start the Hyper Path",
            done() {
                if (hasUpgrade('HC', 13)) return true
            },
        },
        85: {
            name: "The Combined Path",
            tooltip: "Start the Combined Path",
            done() {
                if (hasUpgrade('HC', 14)) return true
            },
        },
        91: {
            name: "Learning the Basics",
            tooltip: "Complete the Basic Path",
            done() {
                if (hasUpgrade('HC', 31)) return true
            },
        },
        92: {
            name: "Complex Machinery",
            tooltip: "Complete the Machine's Path",
            done() {
                if (hasUpgrade('HC', 32)) return true
            },
        },
        94: {
            name: "God of Hyperdeath",
            tooltip: "Complete the Hyper Path",
            done() {
                if (hasUpgrade('HC', 33)) return true
            },
        },
        95: {
            name: "By Our Power Combined",
            tooltip: "Complete the Combined Path",
            done() {
                if (hasUpgrade('HC', 34)) return true
            },
        },
        93: {
            name: "Master of Reality",
            tooltip: "Complete all Paths",
            done() {
                if (hasUpgrade('HC', 31) && hasUpgrade('HC', 32) && hasUpgrade('HC', 33) && hasUpgrade('HC', 34)) return true
            },
        },
        101: {
            name: "Material Possesions",
            tooltip: "Unlock the Matter Combustor",
            done() {
                if (hasUpgrade('HC', 41)) return true
            },
        },
    }
})

addLayer("SA", {
    name: "secret-achievements",
    symbol: "🔮",
    // row: "side",
    type: "none",
    resource: "secretachievements",
    color: "#9966BB",
    tooltip: "SecretAchievements",
    tabFormat: [
        ["display-text", "Secret Achievements are only visible once completed<br>Most Secret Achievements will become impossible if too much progression is made before unlocking them<br>Each Secret Achievement will also eventually have its own exclusive visual theme (available in options) once I figure out how to do that<br>There will be a surprise for getting all of them once there are enough of them for it to be interesting"],
        ["display-text", "<br>There is currently 1 Secret Achievement<br>Every Secret Achievement has a hint when hovering over them to make them possible to obtain without searching up the answers (you'll do it anyways)"],
        "h-line",
        "achievements"
    ],
    unlocked: true,
    achievements: {
        11: {
            name: "Out of Order",
            tooltip() { if(!hasAchievement(this.layer, this.id)) return "That's not going to do anything"; else return "Buy $ Upgrade 7 before $ Upgrade 3<br>That's not going to do anything"},
            unlocked() { return true },
            done() { return !hasUpgrade('U', 13) && hasUpgrade('U', 23) }
        },
        12: {
            name: "Minimum Wage",
            tooltip() { if(!hasAchievement(this.layer, this.id)) return "Infinite Tax"; else return "Get 1e308 tax<br>Infinite Tax"},
            unlocked() { return true },
            done() { return player.SR.tax.gte("1e308") }
        },
    },
})

addLayer("Sft", {
    name: "softcaps",
    symbol: "📈",
    row: "side",
    type: "none",
    resource: "(softcapped)",
    color: "#cccccc",
    tooltip: "Softcaps",
    startData() { return {
        unlocked: true,
    }},
    infoboxes: {
        general: {
            title: "Overall Information",
            body: "Softcaps have a start value and a power.<br>The power of a softcap is basically a divisor on the amount of OoM's (Order's of Magnitude) beyond the start value.<br>Some softcaps are also logarithmic, meaning that the amount of extra OoM's past the starting value is based on the log of OoM's past the start amount."
        },
        rebirth: {
            title: "Rebirth Layer",
            body: "Rebirth Point Gain<br>Beyond 1e17 Rebirth Points, gain is softcapped with a power of 4<br>Beyond 1e2000 Rebirth Points, gain is softcapped again with a power of 5, multiplying to 20",
            unlocked() { return player.R.unlocked }
        },
        hyper: {
            title: "Hyper Rebirth Layer",
            body: "Hyper Cash First Effect<br>Beyond 100, the effect is logarithmically reduced with a base of 10",
            unlocked() { return player.HC.unlocked }
        },
    },
    tabFormat: [
        ["infobox", "general"],
        ["infobox", "rebirth"],
        ["infobox", "hyper"],
    ]
})