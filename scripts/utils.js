function conditionHack(cnd1, msg1, cnd2, msg2) {
    if (cnd1) {
        return msg1;
    } else if (cnd2) {
        return msg2;
    } else {
        return "";
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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