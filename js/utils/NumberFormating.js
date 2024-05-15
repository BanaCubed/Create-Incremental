function coolDynamicFormat(num, precision) {
    if(precision !== 0) return format(num)
    if(precision == 0) return formatWhole(num)
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
    if (num.mag < 0.1 && precision !==0) precision = Math.max(precision, 4)
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

function format(decimal, precision = 2, small) {
    small = small || modInfo.allowSmall
    decimal = new Decimal(decimal)
    if (isNaN(decimal.sign) || isNaN(decimal.layer) || isNaN(decimal.mag)) {
        player.hasNaN = true;
        return "NaN"
    }
    if (decimal.sign < 0) return "-" + format(decimal.neg(), precision, small)
    if (decimal.mag == Number.POSITIVE_INFINITY) return "Infinity"
    if (decimal.gte("eeee1000")) {
        var slog = decimal.slog()
        if (slog.gte(1e6)) return "F" + format(slog.floor())
        else return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0)
    }
    else if (decimal.gte("1e1000000")) return exponentialFormat(decimal, 0, false)
    else if (decimal.gte("1e10000")) return exponentialFormat(decimal, 0)
    else if (decimal.gte(1e9)) return exponentialFormat(decimal, precision)
    else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
    else if (decimal.gte(0.0001) || !small) return regularFormat(decimal, precision)
    else if (decimal.eq(0)) return (0).toFixed(precision)

    decimal = invertOOM(decimal)
    let val = ""
    if (decimal.lt("1e1000")){
        val = exponentialFormat(decimal, precision)
        return val.replace(/([^(?:e|F)]*)$/, '-$1')
    }
    else   
        return format(decimal, precision) + "⁻¹"

}

function formatWhole(decimal) {
    decimal = new Decimal(decimal)
    if (decimal.gte(1e9)) return format(decimal, 2)
    if (decimal.lte(0.99) && !decimal.eq(0)) return format(decimal, 2)
    return format(decimal, 0)
}

function formatZero(decimal) {
    decimal = new Decimal(decimal)
    let number
    if (decimal.gte(1e9)) number = format(decimal, 2)
    if (decimal.lte(0.99) && !decimal.eq(0)) number = format(decimal, 2)
    else number = format(decimal, 0)

    if (number.length == 1) number = " " + number
    return number
}

function formatZeroo(decimal) {
    decimal = new Decimal(decimal)
    let number
    if (decimal.gte(1e9)) number = format(decimal, 2)
    if (decimal.lte(0.99) && !decimal.eq(0)) number = format(decimal, 2)
    else number = format(decimal, 0)

    if (number.length == 1) number = " " + number
    if (number.length == 2) number = " " + number
    return number
}

function iDontWantToNameThis(decimal, mantissa) {
    let number
    if (mantissa !== 0) {
        decimal = new Decimal(decimal)
        number = format(decimal, mantissa)
    
        if(number.length == 2 + mantissa) number = " " + number
    } else {
        decimal = new Decimal(decimal)
        number = formatWhole(decimal)
    
        if(number.length == 1) number = " " + number
    }

    return number
}

function formatTime(s, mantissa = 3) {
    let sec = new Decimal(s)
    if (sec.lt(60)) return format(sec, mantissa) + "s"
    else if (sec.lt(3600)) return formatWhole(sec.div(60).floor()) + "m " + iDontWantToNameThis(sec.sub(sec.div(60).floor().mul(60)), mantissa) + "s"
    else if (sec.lt(86400)) return formatWhole(sec.div(3600).floor()) + "h " + formatZero(sec.div(60).floor().sub(sec.div(3600).floor().mul(60))) + "m " + iDontWantToNameThis(sec.sub(sec.div(60).floor().mul(60)), mantissa) + "s"
    else if (sec.lt(31536000)) return formatWhole(sec.div(86400).floor()) + "d " + formatZero(sec.div(3600).floor().sub(sec.div(86400).floor().mul(24))) + "h " + formatZero(sec.div(60).floor().sub(sec.div(3600).floor().mul(60))) + "m " + iDontWantToNameThis(sec.sub(sec.div(60).floor().mul(60)), mantissa) + "s"
    else if (sec.lt(31536000000)) return formatWhole(sec.div(31536000).floor()) + "y " + formatZeroo(sec.div(86400).floor().sub(sec.div(31536000).floor().mul(365))) + "d " + formatZero(sec.div(3600).floor().sub(sec.div(86400).floor().mul(24))) + "h"
    else if (sec.lt(31536000000000000)) return formatWhole(sec.div(31536000).floor()) + "y " + formatZeroo(sec.div(86400).floor().sub(sec.div(31536000).floor().mul(365))) + "d"
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