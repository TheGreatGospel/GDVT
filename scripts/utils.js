function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function pseudoRandom() {
    var index = 0;
    var base = getRandomInt(-2147483648 , 2147483647);

    this.bop = function() {
        var toReturn = base & 1;
        if (index % 32 === 0) {
            base = getRandomInt(-2147483648 , 2147483647);
            index = 0;
        } else {
            base >>= 1;
            index++;
        }   
        return toReturn;
    }
};