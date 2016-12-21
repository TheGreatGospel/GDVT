function alleleObj() {
    var fullPool = [
        {code: "A", colour: "rgba(127, 201, 127, 1)"}, 
        {code: "B", colour: "rgba(190, 174, 212, 1)"}, 
        {code: "C", colour: "rgba(253, 192, 134, 1)"}, 
        {code: "D", colour: "rgba(255, 255, 153, 1)"}, 
        {code: "E", colour: "rgba(56, 108, 176, 1)"}, 
        {code: "F", colour: "rgba(240, 2, 127, 1)"}, 
        {code: "G", colour: "rgba(191, 91, 23, 1)"}, 
        {code: "H", colour: "rgba(102, 102, 102 ,1)"}
    ];

    this.pool = [];
    this.colours = [];
    
    this.create = function(poolSize) {
        var i = 0;
        if (poolSize > 8) {
            poolSize = 8;
        };

        for (i = 0; i < poolSize; i++) {
            this.pool.push(fullPool[i].code);
            this.colours.push(fullPool[i].colour);
        };
    };

    this.grab_Unif = function() {
        var i = 0, 
            toReturn = [];

        for (i = 0; i < 2; i++) {
            toReturn.push(this.pool[
                getRandomInt(0, this.pool.length - 1)
            ]);
        };
        return toReturn;
    };
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
        allelesLen = settings.numOfAlleles,
        currentGen = allSpecies[0].genNumber,
        tempArray = [],
        newData = [];
    //console.log("Hi");
    for (i = 0; i < alleles.pool.length; i++) {
        tempArray = [];
        for (j = 0; j < settings.numOfPop; j++) {
            tempArray.push(allSpecies[j].summaryStats(currentGen)[i]);
            //console.log(allSpecies[j].summaryStats(currentGen)[i]);
        }
        newData.push(tempArray);
        simGraph.data.datasets[i].data = tempArray;
    };
    //console.log(simGraph.data);
    //console.log(newData);
    
    $("#displayCurrentGen").html(allSpecies[0].genNumber);
    simGraph.update(); 
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

function simulation_Init() {
    var i = 0,
        j = 0,
        dummyData = [],
        newData = {};

    for (i = 0; i < settings.numOfPop; i++) {
        allSpecies.push(new species(settings.popSize));
        dummyData.push(i + 1);
        if (settings.init > 1) {
            allSpecies[i].mate(settings.init - 1);
        }
    };
    
    
        newData.labels = dummyData;
        
        newData.datasets = [];
    
    for (i = 0; i < settings.numOfAlleles; i++) {
        newData.datasets.push({
            label: alleles.pool[i],
            data: dummyData,
            backgroundColor: alleles.colours[i]
        });
    };
    
        ctx[0].height = 400;
        ctx[0].width = 800;
        simGraph = new Chart(ctx, {
            type: 'bar',
            data: newData,
            options: {
                scales: {
                    xAxes: [{
                        stacked: true   
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                },
                responsive: false
            }

        });
        
            simGraphUpdate();
}