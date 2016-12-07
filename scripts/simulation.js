function chooseParents(parentGen) {
    var location = [];

    location.push(Math.floor(Math.random() * parentGen.genSize));
    location.push(Math.floor(Math.random() * parentGen.genSize));
    
    while (location[0] == location[1]) {
        location.pop();
        location.push(Math.floor(Math.random() * parentGen.genSize));
    }

    return location;
}

function assignAlleles(possibleAlleles, allelesDist) {
    var rng = Math.floor(Math.random() * 101) / 100;
    var cnd = [0];
    var i;
    
    for (i = 0; i < allelesDist.length(); i++) {
        cnd.push(cnd[i] + allelesDist[i]);
    }
    
    for (i = allelesDist.length() - 1; i > 0; i--) {
        if (cnd[i] < rng < cnd[i+1]) {
            break;
        }
    }
    return possibleAlleles[i];
}

function member(alleleA, alleleB) {
    this.alleleA = alleleA;
    this.alleleB = alleleB;

    this.chooseAllele_Unif = function() {
        var rng = Math.floor(Math.random() * 101) / 100;
        if (rng < 0.5) {
            return this.alleleA;
        } else {
            return this.alleleB;
        }
    }
}

function generation(genNum, genSize, parentGen) {
    var uprLim = genSize - 1;
    var i;
    this.genNum = genNum;
    this.genSize = genSize;
    this.genPop = [];
    
    var testAlleles = ["A", "B", "C", "D", "E", "F"];
    var testAllelesDist = [0.2, 0.2, 0.2, 0.2, 0.2];
    
    if (typeof arguments[2] === "undefined") {
        for (i = 0; i < uprLim; i++) {
            this.genPop.push(new human(assignAlleles(testAlleles, testAllelesDist),
                                       assignAlleles(testAlleles, testAllelesDist));
        }
    } else {
        var parents;
        for (i = 0; i < uprLim; i++) {
            parents = parentGen.genPop[chooseParents(parentGen)];
            this.genPop.push(new member(parents[0].chooseAllele_Unif()), 
                                        parents[1].chooseAllele_Unif()));
        } 
    }
}
