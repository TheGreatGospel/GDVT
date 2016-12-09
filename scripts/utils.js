function conditionHack(cnd1, msg1, cnd2, msg2) {
    if (cnd1) {
        return msg1;
    } else if (cnd2) {
        return msg2;
    } else {
        return "";
    }
}

function translate(input) {
    if (input == "A") {
        return 0;
    } else if (input == "B") {
        return 1;
    } else if (input == "C") {
        return 2;
    } else if (input == "D") {
        return 3;
    } else if (input == "E") {
        return 4;
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Pseudo Random functionality */

function pseudoRandom() {
    this.base = getRandomInt(-2147483648, 2147483647);
    this.baseBit = this.base.toString(2);
    this.baseBit = this.baseBit.replace("-", "");
    this.bitSize = this.baseBit.length;
    this.bitArray = this.baseBit.split("");

    this.bop = function() {
        var x = this.bitArray.pop();
        this.bitSize -= 1;
        if (this.bitSize < 1) {
            this.base = getRandomInt(-2147483648, 2147483647);
            this.baseBit = this.base.toString(2);
            this.baseBit = this.baseBit.replace("-", "");
            this.bitSize = this.baseBit.length;
            this.bitArray = this.baseBit.split("");
        }
        return parseInt(x, 2);
    }
}