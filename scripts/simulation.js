function alleleObj(allelesPool) {
    this.allelesPool = allelesPool;

    this.grabAlleles_Unif = function() {
        var toReturn = [];

        for (i = 0; i < 2; i++) {
            toReturn.push(allelesPool[Math.floor(Math.random() * this.allelesPool.length())]);
        }

        return toReturn;
    }
}

function member(allelesPool) {
    this.allelesPool = allelesPool;

    this.reproduceAlleles_Unif = function() {
        var rng = Math.random();
        if (rng < 0.5) {
            return this.allelePool[0];
        } else {
            return this.allelePool[1];
        }
    }
}

function generation(genID, genSize) {
    this.genID = genID;
    this.genSize = genSize;
    this.genPopMakeUp = [];

    this.new = function() {
        for (i = 0; i < this.genSize; i++) {
            this.genPopMakeUp.push(new member(allelesPool.grabAlleles_Unif()));
        }
    }

    this.breed = function(parentGen) {
        var whoTo;
        for (i = 0; i < this.genSize; i++) {
            
        }
    }

    this.chooseTwo = function() {
        var location = [];

        location.push(Math.floor(Math.random() * parentGen.genSize));
        location.push(Math.floor(Math.random() * parentGen.genSize));
        
        while (location[0] == location[1]) {
            location.pop();
            location.push(Math.floor(Math.random() * parentGen.genSize));
        }

        return location;
    }
}