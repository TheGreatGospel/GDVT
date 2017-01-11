function alleleMaster() {
    var fullPool = [
        {label: "A", colour: "rgba(127, 201, 127, 1)"}, 
        {label: "B", colour: "rgba(190, 174, 212, 1)"}, 
        {label: "C", colour: "rgba(253, 192, 134, 1)"}, 
        {label: "D", colour: "rgba(255, 255, 153, 1)"}, 
        {label: "E", colour: "rgba(56, 108, 176, 1)"}, 
        {label: "F", colour: "rgba(240, 2, 127, 1)"}, 
        {label: "G", colour: "rgba(191, 91, 23, 1)"}, 
        {label: "H", colour: "rgba(102, 102, 102 ,1)"}
    ];

    this.pool = [],
        this.labels = [],
        this.colours = [];

    this.create = function() {
        for (var i = 0; i < settings.numOfAlleles; i++) {
            this.pool.push(i);
            this.labels.push(fullPool[i].label);
            this.colours.push(fullPool[i].colour);
        };
    };
};

function species() {
    this.genNumber = 1, 
        this.genSize = settings.popSize,
        this.tree = [],
        this.freq = [],
        this.freq2Up = [];;

    this.mate = function(numOfTimes = 1) {
        var parentGen = [],
            childGen = [],
            freqTemp = [],
            freq2UpTemp = [],
            parents = [],
            allelePool = [],
            parentPool = [];
            j = 0;

        if (numOfTimes < 1) {
            numOfTimes = 1;
        };

        for (var i = this.genNumber; i <= this.genNumber + numOfTimes; i++) {
            parentGen = this.tree[i - 1];

            for (j = 0; j < alleles.pool.length; j++) {
                freqTemp.push(0);
                freq2UpTemp.push(0);
            };

            for (j = 0; j < this.genSize; j++) {
                parents.push(getRandomInt(0, this.genSize - 1));
                parents.push(getRandomInt(0, this.genSize - 1));
                while (parents[0] === parents[1]) {
                    parents[rng.bop()] = getRandomInt(0, this.genSize - 1);
                };

                parentPool.push(this.allelesUnpack(parentGen[parents[0]]));
                parentPool.push(this.allelesUnpack(parentGen[parents[1]]));
                
                allelePool.push(parentPool[0][rng.bop()]);
                allelePool.push(parentPool[1][rng.bop()]);

                if (rng.bop() == 0) {
                    allelePool.reverse();
                }

                childGen.push(this.allelesPack(allelePool));

                freqTemp[allelePool[0]]++;
                freqTemp[allelePool[1]]++;
                if (allelePool[0] === allelePool[1]) {
                    freq2UpTemp[allelePool[0]]++;
                };

                allelePool = [];
                parents = [];
                parentPool = [];
            };
            
            this.tree.push(childGen);
            this.freq.push(freqTemp);
            this.freq2Up.push(freq2UpTemp);
            
            childGen = [];
            freqTemp = [];
            freq2UpTemp = [];
        };

        this.genNumber += numOfTimes;
    };

    this.create = function() {
        var genTemp = [],
            freqTemp = [],
            freq2UpTemp = [],
            allelePool = [];

        for (var i = 0; i < alleles.pool.length; i++) {
            freqTemp.push(0);
            freq2UpTemp.push(0);
        };

        for (i = 0; i < this.genSize; i++) {
            allelePool.push(alleles.pool[getRandomInt(0, alleles.pool.length - 1)]);
            allelePool.push(alleles.pool[getRandomInt(0, alleles.pool.length - 1)]);

            genTemp.push(this.allelesPack(allelePool));
            
            freqTemp[allelePool[0]]++;
            freqTemp[allelePool[1]]++;
            if (allelePool[0] === allelePool[1]) {
                freq2UpTemp[allelePool[0]]++;
            };
            
            allelePool = [];
        };
        
        this.tree.push(genTemp);
        this.freq.push(freqTemp);
        this.freq2Up.push(freq2UpTemp);
    };

};

species.prototype.allelesPack = function(toPack) {
    var toReturn = 0,
        x = toPack.slice();
    toReturn |= x.shift();
    toReturn <<= 7;
    toReturn |= x.shift();
    return toReturn;
};

species.prototype.allelesUnpack = function(toUnpack) {
    var toReturn = [],
        x = toUnpack;
    toReturn.unshift(x & 127);
    x >>= 7;
    toReturn.unshift(x & 127);
    return toReturn;
};
    
species.prototype.freqSummary = function(whichGen = 1) {
    if (whichGen < 1 || whichGen > this.genNumber) {
        whichGen = this.genNumber;
    }
    return this.freq[whichGen - 1];
};

species.prototype.freq2UpSummary = function(whichGen = 1) {
    if (whichGen < 1 || whichGen > this.genNumber) {
        whichGen = this.genNumber;
    }
    return this.freq2Up[whichGen - 1];
};

function drawAlleleFreq() {
    var data = new google.visualization.DataTable(),
        temp = [];

    data.addColumn("string", "Population");
    for (var i = 0; i < settings.numOfAlleles; i++) {
        data.addColumn("number", alleles.labels[i]);
    };

    for (i = 0; i < settings.numOfPop; i++) {
        temp.push(allSpecies[i].freq[allSpecies[i].genNumber - 1].slice());
        temp[i].unshift("Population " + (i+1));
    };
    data.addRows(temp);

    var options = {
        title: 'Allele Frequencies',
        subtitle: 'by Population',
        isStacked: 'percent' 
    };
    
    var material = new google.visualization.ColumnChart(document.getElementById('alleleFreq'));
    material.draw(data, options);
}

function simulation_Load() {
    var j = settings.init - 1;
    alleles.create();
    for (var i = 0; i < settings.numOfPop; i++) {
        allSpecies.push(new species());
        allSpecies[i].create();
        if (j > 0) {
            allSpecies[i].mate(j);
        };
    };

    //calculateFST();

    //google.charts.setOnLoadCallback(drawAlleleFreq);
}    

$("#alleleFreq_Show").click(function () {
    $("#fst").css({display: "none"});
    $("#alleleFreq").css({display: "inline"});
});

$("#fst_Show").click(function () {
    $("#alleleFreq").css({display: "none"});
    $("#fst").css({display: "inline"});
});