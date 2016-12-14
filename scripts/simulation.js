function alleleObj(pool) {
    this.pool = pool;

    this.grab_Unif = function() {
        var i = 0, 
            toReturn = [];

        for (i = 0; i < 2; i++) {
            toReturn.push(this.pool[
                getRandomInt(0, this.pool.length - 1)
            ]);
        };
        return toReturn;
    }
}

function member(alleles) {
    this.pool = alleles;

    this.reciprocate_Bit = function() {
        return this.pool[rng.bop()];
    }
}

function species(genSize) {
    this.genNumber = 1;
    this.tree = [];
    this.genSize = genSize;

    var initGen = [],
        i = 0,
        j = 0;

    for (i = 0; i < this.genSize; i++) {
        initGen.push(new member(alleles.grab_Unif()));
    }

    this.tree.push(initGen);

    this.mate = function(numOfTimes) {
        var i = 0,
            j = 0,
            parentGen = [],
            childGen = [],
            inherit = [],
            parentIndices;
        for (i = 0; i < numOfTimes; i++) {
            parentGen = this.tree[this.genNumber - 1];
            childGen = [];
            for (j = 0; j < this.genSize; j++) {
                inherit = [];
                parentIndices = this.rollIndices();
                inherit.push(parentGen[parentIndices[0]].reciprocate_Bit());
                inherit.push(parentGen[parentIndices[1]].reciprocate_Bit());
                childGen.push(new member(inherit));
            };
            this.tree.push(childGen);
            this.genNumber++;
        };
    }

    this.rollIndices = function() {
        var toReturn = [];

        toReturn.push(getRandomInt(0, this.genSize - 1));
        toReturn.push(getRandomInt(0, this.genSize - 1));
        
        while (toReturn[0] == toReturn[1]) {
            toReturn.pop();
            toReturn.push(getRandomInt(0, this.genSize - 1));
        }

        return toReturn;
    }

    this.summaryStats = function(whichGen = 1) {
        var i = 0,
            toReturn = [];
        if (whichGen < 1 || whichGen > this.genNumber) {
            whichGen = this.genNumber;
        }
        whichGen--;
        for (i = 0; i < alleles.pool.length; i++) {
            toReturn.push(0);
        };

        for(i = 0; i < this.genSize; i++) {
            toReturn[alleles.pool.indexOf(this.tree[whichGen][i].pool[0])] += 1;
            toReturn[alleles.pool.indexOf(this.tree[whichGen][i].pool[1])] += 1;
        }

        return toReturn;
    }
}

function simGraphUpdate() {
    var i = 0,
        j = 0,
        allelesLen = alleles.pool.length,
        currentGen = allSpecies[0].genNumber,
        tempArray = [],
        newData = [];
    for (i = 0; i < alleles.pool.length; i++) {
        tempArray = [];
        for (j = 0; j < settings.numOfPop; j++) {
            tempArray.push(allSpecies[j].summaryStats(currentGen)[i]);
        }
        newData.push(tempArray);
        simGraph.data.datasets[i].data = tempArray;
    };
    simGraph.update(); 
    $("#displayCurrentGen").html(currentGen);
}

function sim_n1() {
    var i = 0;
    for (i = 0; i < settings.numOfPop; i++) {
        allSpecies[i].mate(1);
    };
    simGraphUpdate();
}

function sim_n10() {
    var i = 0;
    for (i = 0; i < settings.numOfPop; i++) {
        allSpecies[i].mate(10);
    };
    simGraphUpdate();
}

function sim_nX() {
    var howMany = parseInt($("#sim_input").val(), 10),
        errorMsg = "",
        i = 0;

    errorMsg += conditionHack(isNaN(howMany),
        "\"n =\" has an invalid input! \n",
        howMany < 1,
        "\"n =\" has an invalid input! \n");
    if (errorMsg === "") {
        for (i = 0; i < settings.numOfPop; i++) {
            allSpecies[i].mate(howMany);
        };
        simGraphUpdate();
    } else {
        alert(errorMsg);
    }
}