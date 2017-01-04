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
        this.maxTreeSize = settings.track - 1;

    this.allelesPack = function(toPack) {
        var toReturn = 0,
            x = toPack.slice();
        toReturn |= x.shift();
        toReturn <<= 7;
        toReturn |= x.shift();
        return toReturn;
    };

    this.allelesUnpack = function(toUnpack) {
        var toReturn = [];
        toReturn.unshift(toUnpack & 127);
        toUnpack >>= 7;
        toReturn.unshift(toUnpack & 127);
        return toReturn;
    };
    
    this.freqSummary = function(whichGen = 1) {
        if (whichGen < 1 || whichGen > this.genNumber) {
            whichGen = this.genNumber;
        }
        return this.freq[whichGen - 1];
    };

    this.mate = function(numOfTimes = 1) {
        var parentGen = [],
            childGen = [],
            freqTemp = [],
            allelePool = [],
            parentsTemp = [],
            current = this.tree.length - 1,
            x = 0,
            j = 0;

        if (numOfTimes < 1) {
            numOfTimes = 1;
        };

        for (var i = 0; i < numOfTimes; i++) {
            current = this.tree.length - 1;
            parentGen = this.tree[current];
            childGen.splice(0, this.genSize);
            freqTemp.splice(0, alleles.pool.length);

            for (j = 0; j < alleles.pool.length; j++) {
                freqTemp.push(0);
            };

            for (j = 0; j < this.genSize; j++) {
                parentsTemp.push(getRandomInt(0, this.genSize - 1));
                parentsTemp.push(getRandomInt(0, this.genSize - 1));
                while (parentsTemp[0] == parentsTemp[1]) {
                    parentsTemp.pop();
                    parentsTemp.push(getRandomInt(0, this.genSize - 1));
                };

                x = a.tree[current][parentsTemp[0]] >> 7*rng.bop();
                allelePool.push(x &= 127);
                x = a.tree[current][parentsTemp[1]] >> 7*rng.bop();
                allelePool.push(x &= 127);
                
                childGen.push(this.allelesPack(allelePool)); 
            
                freqTemp[allelePool[0]]++;
                freqTemp[allelePool[1]]++;
               
                allelePool.splice(0, 2);
                parentsTemp.splice(0, 2);
            };

            this.tree.push(childGen);
            this.freq.push(freqTemp);
            this.genNumber++;
        };
    };

    this.create = function() {
        var genTemp = [],
            freqTemp = [],
            allelePool = [];

        for (var i = 0; i < alleles.pool.length; i++) {
            freqTemp.push(0);
        };

        for (i = 0; i < this.genSize; i++) {
            allelePool.push(alleles.pool[getRandomInt(0, alleles.pool.length - 1)]);
            allelePool.push(alleles.pool[getRandomInt(0, alleles.pool.length - 1)]);

            genTemp.push(this.allelesPack(allelePool)); 
            
            freqTemp[allelePool[0]]++;
            freqTemp[allelePool[1]]++;

            allelePool.splice(0, 2);
        };
        
        this.tree.push(genTemp);
        this.freq.push(freqTemp);
    };

};