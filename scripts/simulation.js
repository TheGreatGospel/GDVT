function chooseParents(parentGen) {
    var location = [];

    location.push(Math.floor(Math.random()*parentGen.genSize));
    location.push(Math.floor(Math.random()*parentGen.genSize));
    
    while (location[0] == location[1]) {
        location.pop();
        location.push(Math.floor(Math.random()*parentGen.genSize));
    }

    return location;
}

function member(alleleA, alleleB) {
    this.alleleA = alleleA;
    this.alleleB = alleleB;

    this.chooseAllele_Unif = function() {
        var rng = Math.floor(Math.random()*101)/100;
        if (rng < 0.5) {
            return this.alleleA;
        } else {
            return this.alleleB;
        }
    }
}

function generation(genNum, genSize, parentGen) {
    var uprLim = genSize - 1;
    this.genNum = genNum;
    this.genSize = genSize;
    this.genPop = [];
    

    if (typeof arguments[2] === "undefined") {
        for (i = 0; i < uprLim; i++) {
            this.genPop.push(new human()); // Needs arguments
        }
    } else {
        var parentA;
        var parentB;
        for (i = 0; i < uprLim; i++) {
            parentA = parentGen.genPop[unitRandomInt(0, parentGen.genSize - 1)];
            parentB = parentGen.genPop[unitRandomInt(0, parentGen.genSize - 1)];
            this.genPop.push(new human()); // Needs arguments
        } 
    }
}
