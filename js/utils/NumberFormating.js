/*   --- GLOBAL NUMBER FORMATTING FUNCTION ---

   --- INPUTS ---

n         - Number to format
int       - Whether or not to force whole numbers from 1-10,000
small     - Whether or not to allow formatting of numbers below 0.01 (unfinished)
type      - Formatting to use (see below key)


   --- NOTATIONS ---
    (type variable)


    0 - Mixed Scientific
        Standard notation until e306 (all prefixes up to and including centillion)
        Scientific notation until ee6 (beyond this point the number before the e becomes meaningless)
        Logarithmic notation beyond ee6 (after ee9, will start to have notation in the exponent)
    
    1 - Scientific
        Scientific notation until ee6 (beyond this point the number before the e becomes meaningless)
        Logarithmic notation beyond ee6  (after ee9, will start to have notation in the exponent)
    
    2 - Logarithm
        Logarithmic notation beyond ee6  (after ee9, will start to have notation in the exponent)
    
    3 - Standard
        Currently unfinished

    4 - Letters
        Standard, but uses an infinite base-26 system, and also is likely to break at higher numbers
        Pseudo-Joke Notation
    
    5 - Mixed Logarithm
        Scientific notation until e100
        Logarithmic notation beyond e100  (after ee9, will start to have notation in the exponent)
        This is different to sicentific, as it actually uses the decimal portion of the exponent in logarithmic notation meaningfully
    
    6 - YESNO
        Zero is NO
        All other numbers are YES
        Joke Notation
    
    7 - Blind
        All numbers are replaced with a space
        Joke Notation
    
    8 - Infinity
        Logarithmic but scaled differently, and also more "impactful"
        Pseudo-Joke Notation
    
    9 - Greek Letters
        Letters but different...
        Joke Notation

    10- Ordinal
        Pseudo-Joke Notation

    11- Standard?
        Joke Notation

    12- Cows
        Serious Notation

    13- Cows Rotating
        Serious Notation

*/

function format(n, int = false, small = false, type = options.notation) {
    n = new Decimal(n);
    // NaNCheck
    if (isNaN(n.sign) || isNaN(n.layer) || isNaN(n.mag)) {
        player.hasNaN = true;
        return "NaN"
    }
    // Notations with complete format override
    if(type == 6) { return n.eq(0)?'NO':'YES'; }
    if(type == 7) { return ' '; }
    if(type == 10) { return formatOrdinal(n, 10) }
    if(type == 13) { return formatCowSpin(n, 10) }

    // Default formatting (unnaffected by notations)
    if(n.lt(0.01)) {
        if(small) {
            // TODO
        } else return int?'0':'0.00';
    }

    if(n.gte('(e^5)1')) {
        return 'F' + format(n.slog())
    }

    if(n.lt('10000')) {
        if(int) { return n.toStringWithDecimalPlaces(0) }
        if(n.lt('100')) { return n.toStringWithDecimalPlaces(2); }
        return n.toStringWithDecimalPlaces(1);
    }
    
    if(type == 4) { return formatLetters(n, letters); }
    if(type == 9) { return formatLetters(n, greek); }
    if(type == 11) { return formatLetters(n, standardQ); }
    if(type == 12) { return formatLetters(n, cow, 2, false); }
    if(type == 8) { return formatInf(n, 8); }

    if(n.lt('1e9')) { return formatComma(n); }

    // Actual notations
    if(type == 0) { if(n.lt('1e306')) { return formatStandard(n) } if(n.lt('1e1000000')) { return formatScience(n, 0) } return formatLog(n, 0); }
    if(type == 1) { if(n.lt('1e1e6')) { return formatScience(n, 1) } return formatLog(n, 1); }
    if(type == 2) { return formatLog(n, 2); }
    if(type == 3) { if(n.lt('1e30006')) { return formatStandard(n) } if(n.lt('1e1000000')) { return formatScience(n, 0) } return formatLog(n, 0); }
    if(type == 5) { if(n.lt('1e1e2')) { return formatScience(n, 5) } return formatLog(n, 5) }
}

// For consistency with TMT
function formatWhole(n) { return format(n, true) }
function formatSmall(n) { return format(n, false, true) }

// Useful for numbers that change length rapidly (has some issues with some formattings)
function formatLength(n, int = false, minlength = 0) {
    let text = format(n, int);
    if(text.length < minlength && options.notation != 6 && options.notation != 7) {
        let toAdd = minlength - text.length;
        while (toAdd > 0) {
            text = '0' + text;
            toAdd--;
        }
    }
    return text
}

// This is hell
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const greek = 'αβγδεζηθικλμνξοπρστυφχψω';
const standardQ = 'KMBTqQsSOND';
const cow = ['<span class="cowR">🐄</span>', '<span class="cowO">🐄</span>', '<span class="cowY">🐄</span>', '<span class="cowG">🐄</span>', '<span class="cowC">🐄</span>', '<span class="cowB">🐄</span>', '<span class="cowP">🐄</span>', '<span class="cowM">🐄</span>'];
function formatLetters(n, str=letters, base=1000, hasNumber=true) {
    let position = n.times(1.001).log(base).floor();
    n = n.div(position.pow_base(base));
    length = n.times(1.001).log(10).floor().toNumber();
    let text = hasNumber?n.toStringWithDecimalPlaces(3-length):''
    let suffix
    while(position.gte(1)) {
        suffix = str[position.sub(1).mod(str.length).floor().toNumber()] + suffix
        position = position.div(str.length)
    }
    suffix = suffix.slice(0, suffix.length-9)
    return text + (hasNumber?' ':'') + suffix
}

// For use in the Mixed Scientific and Standard notation options
// Mixed Scientific goes up to e306, Standard goes up to e30,006 (will extend later)
// Numbers here are the index values of the array that contains the suffixes/prefixes (idk what one they are)
// 0 = K/M/B | 1 = Millions | 2 = Decillions | 3 = Centillions | 4 = Millillions
const standardSuffixes = [['', 'K', 'M', 'B'], ['', 'U', 'D', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No'], ['', 'Dc', 'Vg', 'Tg', 'Qg', 'Qq', 'Sg', 'Su', 'Og', 'Ng'], ['', 'Ce', 'Du', 'Tc', 'Qc', 'Qe', 'Sc', 'Se', 'Oe', 'Nc'], ['', 'Mi', 'Dm', 'Tm', 'Qm', 'Qn', 'Sm', 'Sl', 'Om', 'Nm'], ]
function formatStandard(n) {
    const position = n.times(1.001).log(1000).floor();
    if(position.lt(4)) {
        n = n.div(position.pow_base(1000));
        length = n.times(1.001).log(10).floor().toNumber();
        return n.toStringWithDecimalPlaces(3-length) + ' ' + standardSuffixes[0][position.toNumber()];
    }
    n = n.div(position.pow_base(1000));
    length = n.times(1.001).log(10).floor().toNumber();
    return n.toStringWithDecimalPlaces(3-length) + ' ' + standardSuffixes[1][(position.toNumber()-1)%10] + standardSuffixes[2][Math.floor((position.toNumber()-1)/10)%10] + standardSuffixes[3][Math.floor((position.toNumber()-1)/100)%10] + standardSuffixes[4][Math.floor((position.toNumber()-1)/1000)%10];
}

// These should need no explanation, aside from type in formatLog() and formatScience(), which determine the notation for the exponent
function formatComma(n) { return n.toStringWithDecimalPlaces(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") }
function formatLog(n, type) { return 'e' + format(n.log(10), false, false, type) }
function formatInf(n, type) { return format(n.log(10).div(Decimal.dTwo.log(10).mul(1024)), false, false, type) + '∞' }
function formatScience(n, type) { const mag = n.times(1.001).log(10).floor(); n = n.div(mag.pow_base(10)); return n.toStringWithDecimalPlaces(2) + 'e' + format(mag, true, false, type); }

// Hopefully works
function formatTime(n) {
    n = new Decimal(n);
    if(n.lt(60)) { return format(n) + ' seconds' }
    if(n.lt(3600)) { return format(n.div(60).floor(), true) + ':' + formatLength(n.mod(60), false, 5) }
    if(n.lt(864000)) { return format(n.div(3600).floor(), true) + ':' + formatLength(n.div(60).mod(60).floor(), true, 2) + ':' + formatLength(n.mod(60), false, 5) }
    if(n.lt(315360000)) { return format(n.div(86400)) + ' days'  }
    return format(n.div(31536000)) + ' years'
}

const notations = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
const no_names = ['Mixed Scientific', 'Scientific', 'Logarithm', 'Standard', 'Letters', 'Mixed Logarithm', 'YES/NO', 'Blind', 'Infinity', 'Greek Letters', 'Ordinal', 'Standard?', ':cow2:', ':cow2spin:']
function toggleNotation() {
    if(options.notation == 13) { options.notation = 0; return }
    options.notation = notations[notations.indexOf(options.notation) + 1]
}
function viewNotation() {
    return no_names[notations.indexOf(options.notation)]
}

function formatBoost(n, mult=false) {
    n = new Decimal(n)
    if(mult) {
        if(n.gte(100)) { return `×${format(n, true)}` }
        if(n.gte(20)) { return `×${format(n)}` }
        if(n.gte(1)) { return `${format(n.times(100), true)}%` }
        if(n.gte(0.05)) { return `${format(n.times(100))}%` }
        if(n.gte(0.0001)) { return `/${format(n.recip())}` }
        return `/${format(n.recip(), true)}`
    } else {
        if(n.gte(100)) { return `×${format(n.add(1), true)}` }
        if(n.gte(20)) { return `×${format(n.add(1))}` }
        if(n.gte(1)) { return `+${format(n.times(100), true)}%` }
        return `+${format(n.times(100))}%`
    }
}

function formatOrdinal(n, base=10) {
    let exp = n.times(1.001).max(1).log(base).floor();
    n = n.div(exp.pow_base(base));
    return `${exp.lt(1000)?n.toStringWithDecimalPlaces(exp.gt(1)?2:1):''}ω${exp.gt(1)?`<sup>${formatOrdinalExponent(exp, base)}</sup>`:''}`;
}

function formatOrdinalExponent(n, b=Decimal.dTen, i=0) {
    if(i>=3) { return ''; }
    const exp = n.max(1).log(b).floor()
    let text = `${ n.div(exp.pow_base(b)).floor().toStringWithDecimalPlaces(0) }`;
    if(exp.neq(0)) {
        text = text + 'ω'
        if(exp.neq(1)) { text = text + `<sup>${exp.toStringWithDecimalPlaces(0)}</sup>` }
    }
    if(n.div(b).gte(1) && i<2 && n.mod(exp.pow_base(b)).gt(0)) {
        text = text + '+' + formatOrdinalExponent(n.mod(exp.pow_base(b)), b, i+1)
    }
    return text;
}

function formatCowSpin(n, base=10) {
    n = n.max(1).log(base).max(1).floor().times(200).pow(0.33).pow_base(1.15)
    return `<span class="cow anim" style="animation-duration: calc(360s/${n.toNumber()});">🐄</span>`
}
