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
    var index = 0;
    this.base = getRandomInt(0, 2147483647);

    this.bop = function() {
        var toReturn = this.base & 1;
        if (index % 32 === 0) {
            this.base = getRandomInt(0, 2147483647);
            index = 0;
        } else {
            this.base >>= 1;
            index++;
        }   
        return toReturn;
    }
}