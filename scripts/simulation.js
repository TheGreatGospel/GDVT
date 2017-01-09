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

function calculateFST() {
    var current = statsMaster["FST"].length,
        fstTemp = 0,
        s1 = [], s2 = [], s3 = [],
        n_bar = 0, n_c = [], arrayTemp = [0, 0, 0], abcdefg = [0, 0, 0, 0, 0, 0],
        n_u = [], n_uu = [], sSq_u = 0, H_uBar = 0,
        p_u = [], P_uu = [], p_bar = 0, rMinusOne = settings.numOfPop - 1,

        i = 0,
        j = 0;

    for (j = 0; j < settings.numOfPop; j++) {
        n_bar += allSpecies[j].genSize;
        arrayTemp[0] += allSpecies[j].genSize;
        arrayTemp[1] += allSpecies[j].genSize*allSpecies[j].genSize;
    };
    n_bar /= settings.numOfPop;
    n_c = (1/(rMinusOne)) * (arrayTemp[0] - arrayTemp[1]/arrayTemp[0]);

    while (allSpecies[0].genNumber > current) {
        s1 = [], s2 = [], s3 = [];

        for (i = 0; i < alleles.pool.length; i++) {
            abcdefg = [0, 0, 0, 0, 0, 0],
            n_u = [], n_uu = [], sSq_u = 0, H_uBar = 0,
            p_u = [], P_uu = [], p_bar = 0,
            arrayTemp[1] = 0, arrayTemp[2] = 0;

            for (j = 0; j < settings.numOfPop; j++) {
                n_u.push(allSpecies[j].freq[current][i]);
                n_uu.push(allSpecies[j].freq2Up[current][i]);

                p_u.push(n_u[j]/(2 * allSpecies[j].genSize));
                P_uu.push(n_uu[j]/(allSpecies[j].genSize));

                p_bar += p_u[j];
            };
            
            p_bar /= settings.numOfPop;
            
            for (j = 0; j < settings.numOfPop; j++) {
                arrayTemp[1] += allSpecies[j].genSize*((p_u[j] - p_bar)*(p_u[j] - p_bar));
                arrayTemp[2] += 2*allSpecies[j].genSize*((p_u[j] - P_uu[j]));
            };
            
            sSq_u = arrayTemp[1]/(rMinusOne*n_bar);
            H_uBar = (1/arrayTemp[0])*arrayTemp[2];
            
            abcdefg[0] = p_bar*(1 - p_bar);
            abcdefg[1] = n_bar/(settings.numOfPop*(n_bar - 1));
            abcdefg[2] = (settings.numOfPop*(n_bar - n_c))/(n_bar);
            abcdefg[3] = n_bar - 1;
            abcdefg[4] = rMinusOne*(n_bar - n_c)
            abcdefg[5] = (1/n_bar)*(abcdefg[3] + abcdefg[4])*sSq_u;
            abcdefg[6] = (n_bar - n_c)/(4*n_c*n_c)*H_uBar;

            s1.push(sSq_u - (1/(n_bar - 1))*(abcdefg[0] - (rMinusOne/settings.numOfPop)*sSq_u - (1/4)*H_uBar));
            s2.push(abcdefg[0] - abcdefg[1]*(abcdefg[2]*abcdefg[0] - abcdefg[5] - abcdefg[6]));
            s3.push((n_c/n_bar)*H_uBar);
        };

        fstTemp = 0;

        for (i = 0; i < alleles.pool.length; i++) {
            fstTemp += s1[i]/s2[i];
        };
        
        statsMaster["FST"].push(fstTemp);
        current++;
    };
}