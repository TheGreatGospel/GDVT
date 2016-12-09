function alleleObj(pool) {
    this.pool = pool;

    this.grab_Unif = function() {
        var i = 0, 
            toReturn = [];

        for (i = 0; i < 2; i++) {
            toReturn.push(this.pool[
                getRandomInt(0, 4)
            ]);
        }
        return toReturn.toString();
    }
}

function member(alleles) {
    this.pool = alleles;

    this.reciprocate_Bit = function() {
        return this.pool[rng.bop()].toString();
    }
}

function generation(genID, genSize) {
    this.genID = genID;
    this.genSize = genSize;
    this.genPop = [];

    this.create = function() {
        var i = 0;
        for (i = 0; i < this.genSize; i++) {
            this.genPop.push(new member(alleles.grab_Unif()));
        }
    }

    this.procreate = function(parentGen) {
        var i = 0,
            parents = [],
            inherit = [];
        for (i = 0; i < this.genSize; i++) {
            parents = parentGen.chooseTwo_Unif();
            inherit.push(parentGen.genPop[parents[0]].reciprocate_Bit());
            inherit.push(parentGen.genPop[parents[1]].reciprocate_Bit());
            this.genPop.push(new member(inherit));
        }
    }

    this.chooseTwo_Unif = function() {
        var location = [];

        location.push(Math.floor(Math.random() * this.genSize));
        location.push(Math.floor(Math.random() * this.genSize));
        
        while (location[0] == location[1]) {
            location.pop();
            location.push(Math.floor(Math.random() * this.genSize));
        }

        return location;
    }

    this.summaryStats = function() {
        var toReturn = {
            alleles: [0, 0, 0, 0, 0]
            },
            i = 0;

        for (i = 0; i < this.genSize; i++) {
            toReturn.alleles[translate(this.genPop[i].pool[0])] += 1;
            toReturn.alleles[translate(this.genPop[i].pool[1])] += 1;
        }

        return toReturn;
    }
}