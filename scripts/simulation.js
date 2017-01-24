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
    this.freq = {},
    this.freq2Up = {};
};

species.prototype.allelesPack = function(toPack) {
    var toReturn = 0;
    toReturn |= toPack[0];
    toReturn <<= 7;
    toReturn |= toPack[1];
    return toReturn;
};

species.prototype.allelesUnpack = function(toUnpack) {
    var toReturn = [];
    toReturn.unshift(toUnpack & 127);
    toUnpack >>= 7;
    toReturn.unshift(toUnpack & 127);
    return toReturn;
};
    
species.prototype.freqSummary = function(whichGen = 1) {
    var toReturn = [];
    if (whichGen < 1 || whichGen > this.genNumber) {
        whichGen = this.genNumber;
    }
    for (var i = 0; i < alleles.pool.length; i++) {
        toReturn.push(this.freq[i][whichGen - 1]);
    };
    return toReturn;
};

species.prototype.freq2UpSummary = function(whichGen = 1) {
    var toReturn = [];
    if (whichGen < 1 || whichGen > this.genNumber) {
        whichGen = this.genNumber;
    }
    for (var i = 0; i < alleles.pool.length; i++) {
        toReturn.push(this.freq2Up[i][whichGen - 1]);
    };
    return toReturn;
};

species.prototype.create = function() {
        var allelePool = [];
        
        this.tree.push([]);

        for (var i = 0; i < alleles.pool.length; i++) {
            this.freq[i] = [0];
            this.freq2Up[i] = [0];
        };
        
        for (i = 0; i < this.genSize; i++) {
            allelePool.push(alleles.pool[getRandomInt(0, alleles.pool.length - 1)]);
            allelePool.push(alleles.pool[getRandomInt(0, alleles.pool.length - 1)]);

            this.tree[0].push(this.allelesPack(allelePool));
            
            this.freq[allelePool[0]][0]++;
            this.freq[allelePool[1]][0]++;
            if (allelePool[0] === allelePool[1]) {
                this.freq2Up[allelePool[0]][0]++;
            };
            
            allelePool.length = 0;
        };
};

species.prototype.mate = function(numOfTimes = 1) {
    var i = 1, j = 0, 
        parentGen, 
        parents = [], parentAPool = [], parentBPool = [], allelePool = [];

    if (numOfTimes < 1) {
        numOfTimes = 1;
    };

    while (i <= numOfTimes) {
        
        parentGen = this.tree.shift();
        this.tree.push([]);

        for (j = 0; j < alleles.pool.length; j++) {
            this.freq[j].push(0);
            this.freq2Up[j].push(0);
        };

        for (j = 0; j < this.genSize; j++) {
            parents.push(getRandomInt(0, this.genSize - 1));
            parents.push(getRandomInt(0, this.genSize - 1));
            while (parents[0] === parents[1]) {
                parents[rng.bop()] = getRandomInt(0, this.genSize - 1);
            };

            parentAPool = this.allelesUnpack(parentGen[parents[0]]);
            parentBPool = this.allelesUnpack(parentGen[parents[1]]);

            allelePool.push(parentAPool[rng.bop()]);
            allelePool.push(parentBPool[rng.bop()]);
            
            if (rng.bop() === 0) {
                allelePool.reverse();
            };

            this.tree[0].push(this.allelesPack(allelePool));

            this.freq[allelePool[0]][this.genNumber]++;
            this.freq[allelePool[1]][this.genNumber]++;
            if (allelePool[0] === allelePool[1]) {
                this.freq2Up[allelePool[0]][this.genNumber]++;
            };

            allelePool.length = 0;
            parents.length = 0;
            parentAPool.length = 0;
            parentBPool.length = 0;
        };

        parentGen.length = 0;
        i++;
        this.genNumber++;
    }
};

var allelFreq_Chart,
    alleleFreq_Data,
    alleleFreq_Options,
    FST_Chart,
    FST_Data,
    FST_Options,
    FST_DataCurrent = 1;

function drawAlleleFreq() {
    var temp = [], y = 0;
    for (var rowIndex = 0; rowIndex < settings.numOfPop; rowIndex++) {
        temp = allSpecies[rowIndex].freqSummary(allSpecies[rowIndex].genNumber);
        for (y = 1; y <= settings.numOfAlleles; y++) {
            alleleFreq_Data.setValue(rowIndex, y, temp[y-1]);
        }
        temp.length = 0;
    };

    alleleFreq_Chart.draw(alleleFreq_Data, alleleFreq_Options);
};

function drawFST() {
    while (allSpecies[0].genNumber >= FST_DataCurrent) {
        FST_Data.addRow([FST_DataCurrent, statsMaster["FST"][FST_DataCurrent - 1]]);
        FST_DataCurrent++;
    };
    FST_Chart.draw(FST_Data, FST_Options);
};

function drawCharts_Init() {
    alleleFreq_Data = new google.visualization.DataTable();
    alleleFreq_Chart = new google.visualization.ColumnChart(document.getElementById('alleleFreq'));
    alleleFreq_Options = {
        title: 'Allele Frequencies',
        height: 400,
        width: 800,
        hAxis: {
            title: 'Population'
        },
        vAxis: {
            title: 'Allele Frequency (%)'
        },
        isStacked: 'percent' 
    };

    var temp = [];

    alleleFreq_Data.addColumn("string", "Population");
    for (var i = 0; i < settings.numOfAlleles; i++) {
        alleleFreq_Data.addColumn("number", alleles.labels[i]);
    };

    for (i = 0; i < settings.numOfPop; i++) {
        temp.push(allSpecies[i].freqSummary(allSpecies[i].genNumber));
        temp[i].unshift("#" + (i+1));
    };
    
    alleleFreq_Data.addRows(temp);
    alleleFreq_Chart.draw(alleleFreq_Data, alleleFreq_Options);

    FST_Data = new google.visualization.DataTable();
    FST_Chart = new google.visualization.LineChart(document.getElementById('fst'));
    FST_Options = {
        title: 'FST over Time',
        height: 400,
        width: 800,
        hAxis: {
            title: 'Generation'
        },
        vAxis: {
            title: 'Coancestry Coefficient (FST)'
        },
        legend: {
            position: 'none'
        }
    };

    FST_Data.addColumn("number", "Generation");
    FST_Data.addColumn("number", "FST");

    alleleFreq_Chart.draw(alleleFreq_Data, alleleFreq_Options);
};

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
    $("#displayCurrentGen").html(allSpecies[0].genNumber);

    calculateFST();
    google.charts.setOnLoadCallback(drawCharts_Init);
    google.charts.setOnLoadCallback(drawFST);
}

function simulation_Update(howMany) {
    for (var i = 0; i < settings.numOfPop; i++) {
        allSpecies[i].mate(howMany);
    };
    calculateFST();

    processFlag = false;
    $("#displayCurrentGen").html(allSpecies[0].genNumber);
    google.charts.setOnLoadCallback(drawAlleleFreq);
    google.charts.setOnLoadCallback(drawFST);
};

$("#alleleFreq_Show").click(function () {
    $("#fst").css({display: "none"});
    $("#alleleFreq").css({display: "inline"});
});

$("#fst_Show").click(function () {
    $("#alleleFreq").css({display: "none"});
    $("#fst").css({display: "inline"});
});

$("#sim_1").click(function () {
    if (processFlag === false) {
        processFlag = true;
        simulation_Update(1);
    };
});

$("#sim_10").click(function () {
    if (processFlag === false) {
        processFlag = true;
        simulation_Update(10);
    };
});

$("#sim_X").click(function () {
    if (processFlag === false) {
        processFlag = true;
        simulation_Update(parseInt($("#sim_input").val()));
    };
});

$('#sim_input').on("focusout", function() {
    var x = $(this);
    if (x.val() < 1 || x.val() > 1000) {
        x.val(settings.simInput);
        x.css({backgroundColor: "#ffff99"});
        x.animate({backgroundColor: "#fffff0"}, 1000);
    } else {
        settings.simInput = x.val();
    }
});