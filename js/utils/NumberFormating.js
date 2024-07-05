const standardSuffixes = [[
    '', ' K', ' M', ' B'
    ], [
        '', 'U', 'D', 'T', 'Qa', 'Qt', 'Sx', 'Sp', 'Oc', 'No'
    ], [
        '', 'Dc', 'Vg', 'Tg', 'Qg', 'Qi', 'He', 'Se', 'Og', 'Nn'
    ], [
        '', 'Ce', 'De', 'Tc', 'Qc', 'Qe', 'Hc', 'Sc', 'Oe', 'Ne'
    ], [
        '', 'Mi', 'Dm', 'Tm', 'Qm', 'Ql', 'Hm', 'Sm', 'Om', 'Nm'
]]

function standardFormat(num, precision) {
    num = new Decimal(num)
    let index = num.max(1).add(1).log(10).div(3).floor().toNumber()
    num = num.div(Decimal.pow(1000, index))
    let suffix = ' '
    let suffindex
    if(index <= 3) suffix = standardSuffixes[0][index]
    else {
        index -= 1;
        index = index.toString()
        for (let loop = 0; loop < index.length; loop++) {
            suffindex = index.charAt(index.length - loop - 1)
            if(loop % 4 == 0 && loop != 0) suffix = suffix + '-'
            suffix = suffix + standardSuffixes[(loop % 4) + 1][suffindex]
        }
    }
    return num.toStringWithDecimalPlaces(precision) + suffix
}

function exponentialFormat(num, precision, mantissa = true) {
    let e = num.log10().floor()
    let m = num.div(Decimal.pow(10, e))
    if (m.toStringWithDecimalPlaces(precision) == 10) {
        m = decimalOne
        e = e.add(1)
    }
    e = (e.gte(1e9) ? format(e, 3) : (e.gte(10000) ? commaFormat(e, 0) : e.toStringWithDecimalPlaces(0)))
    if (mantissa)
        return m.toStringWithDecimalPlaces(precision) + "e" + e
    else return "e" + e
}

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.001) return (0).toFixed(precision)
    let init = num.toStringWithDecimalPlaces(precision)
    let portions = init.split(".")
    portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    if (portions.length == 1) return portions[0]
    return portions[0] + "." + portions[1]
}


function regularFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.0001) return (0).toFixed(precision)
    return num.toStringWithDecimalPlaces(precision)
}

function fixValue(x, y = 0) {
    return x || new Decimal(y)
}

function sumValues(x) {
    x = Object.values(x)
    if (!x[0]) return decimalZero
    return x.reduce((a, b) => Decimal.add(a, b))
}

function format(num, precision = 2, small) {
    small = small || modInfo.allowSmall
    num = new Decimal(num)
    if (isNaN(num.sign) || isNaN(num.layer) || isNaN(num.mag)) {
        player.hasNaN = true;
        return "NaN"
    }
    if (num.sign < 0) return "-" + format(num.neg(), precision, small)
    if (num.mag == Number.POSITIVE_INFINITY) return "Infinity"
    if (num.gte("eeee1000")) {
        var slog = num.slog()
        if (slog.gte(1e6)) return "F" + format(slog.floor())
        else return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0)
    }
    else if (num.gte("1e1000000")) return exponentialFormat(num, 0, false)
    else if (num.gte('1e30003')) return exponentialFormat(num, precision)
    else if (num.gte('1e9') && !options.standardNotate) return exponentialFormat(num, precision)
    else if (num.gte(1e306) && options.standardNotate) return standardFormat(num, 0)
    else if (num.gte(1e6) && options.standardNotate) return standardFormat(num, precision)
    else if (num.gte(1e3)) return commaFormat(num, 0)
    else if (num.gte(0.0001) || !small) return regularFormat(num, precision)
    else if (num.eq(0)) return (0).toFixed(precision)

    num = invertOOM(num)
    let val = ""
    if (num.lt("1e1000")){
        val = exponentialFormat(num, precision)
        return val.replace(/([^(?:e|F)]*)$/, '-$1')
    }
    else   
        return format(num, precision) + "⁻¹"

}

function formatWhole(num) {
    num = new Decimal(num)
    if (num.gte(1e6)) return format(num, 2)
    if (num.lte(0.99) && !num.eq(0)) return format(num, 2)
    return format(num, 0)
}

function formatZero(num) {
    num = new Decimal(num)
    let number
    if (num.gte(1e9)) number = format(num, 2)
    if (num.lte(0.99) && !num.eq(0)) number = format(num, 2)
    else number = format(num, 0)

    if (number.length == 1) number = "0" + number
    return number
}

function formatCost(num, layer) {
    if(layer == 'cash') {
        return '$' + format(num)
    } else if(layer == 'rebirth') {
        return formatWhole(num) + ' RP'
    } else if(layer == 'super') {
        return formatWhole(num) + ' SRP'
    } else if(layer == 'power') {
        return formatWhole(num) + ' Power'
    }
}

function formatBoost(num, additive = true) {
    if(additive) {
        if(num.lt(0.1)){return '+' + format(num.times(100)) + '%'}
        if(num.lt(9)) {return '+' + formatWhole(num.times(100)) + '%'}
        if(num.lt(100)){return '×' + format(num.add(1))}
        else return '×' + formatWhole(num.add(1))
    } else {
        if(num.lt(0.1)){return format(num.times(100)) + '%'}
        if(num.lt(9)) {return formatWhole(num.times(100)) + '%'}
        if(num.lt(100)){return '×' + format(num)}
        else return '×' + formatWhole(num)
    }
}

function machineText() {
    if(player.machine.state == 1) return 'active and set to Cash Mode'
    if(player.machine.state == 2) return 'active and set to Neutral Mode'
    if(player.machine.state == 3) return 'active and set to Rebirth Mode'
    return 'inactive'
}

function formatLayer(layer) {
    if(layer == 'cash') { return '$' }
    if(layer == 'rebirth') { return 'R' }
    if(layer == 'super') { return 'S' }
    if(layer == 'power') { return 'P' }
}

function formatZeroo(num) {
    num = new Decimal(num)
    let number
    if (num.gte(1e9)) number = format(num, 2)
    if (num.lte(0.99) && !num.eq(0)) number = format(num, 2)
    else number = format(num, 0)

    if (number.length == 1) number = "0" + number
    if (number.length == 2) number = "0" + number
    return number
}

function iDontWantToNameThis(num, precision) {
    let number
    if (precision !== 0) {
        num = new Decimal(num)
        number = format(num, precision)
    
        if(number.length == 2 + precision) number = "0" + number
    } else {
        num = new Decimal(num)
        number = formatWhole(num)
    
        if(number.length == 1) number = "0" + number
    }

    return number
}

function formatTime(s, precision = 3) {
    let sec = new Decimal(s)
    if (sec.lt(60)) return format(sec, precision) + "s"
    else if (sec.lt(3600)) return formatWhole(sec.div(60).floor()) + ":" + iDontWantToNameThis(sec.sub(sec.div(60).floor().mul(60)), precision)
    else if (sec.lt(86400)) return formatWhole(sec.div(3600).floor()) + ":" + formatZero(sec.div(60).floor().sub(sec.div(3600).floor().mul(60))) + ":" + iDontWantToNameThis(sec.sub(sec.div(60).floor().mul(60)), precision)
    else if (sec.lt(31536000)) return formatWhole(sec.div(86400).floor()) + "d " + formatZero(sec.div(3600).floor().sub(sec.div(86400).floor().mul(24))) + ":" + formatZero(sec.div(60).floor().sub(sec.div(3600).floor().mul(60))) + ":" + iDontWantToNameThis(sec.sub(sec.div(60).floor().mul(60)), precision)
    else if (sec.lt(31536000000000)) return formatWhole(sec.div(31536000).floor()) + "y " + formatZeroo(sec.div(86400).floor().sub(sec.div(31536000).floor().mul(365))) + "d"
    else return formatWhole(sec.div(31536000).floor()) + "y"
}

function toPlaces(x, precision, maxAccepted) {
    x = new Decimal(x)
    let result = x.toStringWithDecimalPlaces(precision)
    if (new Decimal(result).gte(maxAccepted)) {
        result = new Decimal(maxAccepted - Math.pow(0.1, precision)).toStringWithDecimalPlaces(precision)
    }
    return result
}

// Will also display very small numbers
function formatSmall(x, precision=2) { 
    return format(x, precision, true)    
}

function invertOOM(x){
    let e = x.log10().ceil()
    let m = x.div(Decimal.pow(10, e))
    e = e.neg()
    x = new Decimal(10).pow(e).times(m)

    return x
}