/*

   --- GLOBAL NUMBER FORMATTING FUNCTION ---


   --- INPUTS ---

n         - Number to format
int       - Whether or not to force whole numbers from 1-10,000
small     - Whether or not to allow formatting of numbers below 0.01 (unfinished)
type      - Formatting to use (see below key)
minlength - Adds leading zeroes to ensure a fixed length (does nothing if length is above minlength)


   --- NOTATIONS ---
    (type variable)

    0 - Mixed Scientific
        Standard notation until e306 (all prefixes up to and including centillion)
        Scientific notation until ee6 (beyond this point the number before the e becomes meaningless)
        Logarithmic notation beyond ee6 (after ee9, will start to have notation in the exponent)
    
    1 - Scientific
        Scientific notation until ee6 (beyond this point the number before the e becomes meaningless)
        Logarithmic notation beyond ee6  (after ee9, will start to have notation in the exponent)
    
    2 - Logarithmic
        Logarithmic notation beyond ee6  (after ee9, will start to have notation in the exponent)
    
    3 - Standard
        Currently unimplemented
    
    4 - Letters
        Currently unimplemented
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
        Logarithmic but the initial exponent is divided by log10(2)*1024, and the leftmost 'e' is now an infinity at the right of the format
        Currently Unimplemented
        Pseudo-Joke Notation
    
    9 - Binary
        Scientific but worse
        Currently Unimplemented
        Joke Notation

*/

function format(n, int = false, small = false, type = player.options.notation) {
    n = new Decimal(n);
    // Notations with complete format override
    if(type == 6) { return n.eq(0)?'NO':'YES'; }
    if(type == 7) { return ' '; }

    // Default formatting (unnaffected by notations)
    if(n.lt(0.01)) {
        if(small) {
            // TODO
        } else return int?'0':'0.00';
    }
    if(n.lt(10000)) { if(int) { return n.toStringWithDecimalPlaces(0) } return n.toStringWithDecimalPlaces(2); }
    if(n.lt(1e9)) { return formatComma(n); }

    // Actual notations
    if(type == 0) { if(n.lt('1e306')) { return formatStandard(n) } if(n.lt('1e1e6')) { return formatScience(n, type) } return formatLog(n, type); }
    if(type == 1) { if(n.lt('1e1e6')) { return formatScience(n, type) } return formatLog(n, type); }
    if(type == 2) { return formatLog(n, type); }
    if(type == 5) { if(n.lt('1e1e2')) { return formatScience(n, type) } return formatLog(n, type) }
}

// For consistency with TMT
function formatWhole(n) { return format(n, true) }
function formatSmall(n) { return format(n, false, true) }

// Useful for numbers that change length rapidly (has some issues with some formattings)
function formatLength(n, int = false, minlength = 0) {
    let text = format(n, int);
    if(text.length < minlength) {
        let toAdd = minlength - text.length;
        while (toAdd > 0) {
            text = '0' + text;
            toAdd--;
        }
    }
    return text;
}

// For use in the (unfinished/unstarted) letters notation option (4)
const letters = 'abcdefghjklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function formatLetters(n) {
    return 'abcdefghjklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
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
function formatScience(n, type) { const mag = n.times(1.001).log(10).floor(); n = n.div(mag.pow_base(10)); return n.toStringWithDecimalPlaces(2) + 'e' + format(mag, true, false, type); }

// Hopefully works
function formatTime(n) {
    n = new Decimal(n);
    if(n.lt(60)) { return format(n) + 's' }
    if(n.lt(3600)) { return format(n.div(60), true) + ':' + formatLength(modulo(n, 60), false, 5) }
    if(n.lt(31536000)) { return format(n.div(3600), true) + ':' + formatLength(modulo(n.div(60), 60), true, 2) + ':' + formatLength(modulo(n, 60), false, 5) }
    if(n.lt(315360000)) { return format(n.div(86400)) + ' days'  }
    return format(n.div(31536000), true) + ' years'
}
