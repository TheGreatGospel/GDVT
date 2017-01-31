/* A 'struct' which allows the other scripts to interface with the most current allele pool */
function allelePool() {
    /* The following variables are private to 'struct':              */
    /* fullPool contains the labels and colours for each allele type */
    /* uprBound restricts the number of alleles types made available */
    /*      within the code. Note that the uprBound zero-indexed     */
    /* ones is an utility array which contains -1 and 1 for use with */
    /*      the mutate() method                                      */
    var fullPool = [
            {label: "A", colour: "#7fc97f"},
            {label: "B", colour: "#beaed4"},
            {label: "C", colour: "#fdc086"},
            {label: "D", colour: "#ffff99"},
            {label: "E", colour: "#386cb0"},
            {label: "F", colour: "#f0027f"},
            {label: "G", colour: "#bf5b17"},
            {label: "H", colour: "#666666"}
        ],
        uprBound = 4,
        ones = [-1, 1];
    
    this.setUprBound = function (i = 5) {
        /* setUprBound() allows the user to interface with uprBound  */
        /* and as mentioned earlier, uprBound is _zero-indexed_      */
        uprBound = i - 1;
    };

    this.currentLabels = function () {
        /* currentLabels() returns the current type allele labels    */
        var labelPool = [], 
        i = 0;
        while (i <= uprBound) {
            labelPool.push(fullPool[i].label);
            i++;
        };
        return labelPool;
    };

    this.currentColours = function() {
        /* currentColours() returns the current allele type colours  */
        var colourPool = []
        i = 0;
        while (i <= uprBound) {
            colourPool.push(fullPool[i].colour);
            i++;
        };
        return colourPool;
    };

    this.mutate = function(i = getRandomInt(0, uprBound)) {
        /* mutate() uses a one-step mutation model respecting       */
        /* boundaries.                                              */
        if (i == uprBound) {
            i--; // 100% probability to go from uprBound -> uprBound - 1
        } else if (i == 0) {
            i++; // 100% probability to go from 0 -> 1
        } else {
            i += ones[rngBin.get()]; // 50% probability to go either direction
        };
        return i;
    };
};

/*  */
function species() {
    this.genNumber = 1, 
    this.genSize = parameters.popSize,
    this.tree = [],
    this.freq = {},
    this.freq2Up = {};
};

/* Launches a new simulation routine with the current parameters */
function output_Initialise() {

};

/* jQuery event listeners for the Output Tab */
$(document).ready(function(){

    /* jQuery event listener to operate the plot toolbar */
	$('ul.output_ulL li').click(function(){
		var tab_id = $(this).attr('data-tab'); // Returns the tab to swap to

        /* Removes the visibility of the current tab */
		$('ul.output_ulL li').removeClass('current');
	    $('.output_chartDim').removeClass('current');

        /* Gives visibility to the tab to swap to */
		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	})

    /* jQuery event listener for the "n =" input */
     $('#output_simInput').change(function() {
        var x = Math.floor($(this).val());
        if (x < 1 || x > 1000 ) {
            $('#output_simInput').val(parameters.simInput);
        } else {
            parameters.simInput = x;
            if (x != $(this).val()) {
                $('#output_simInput').val(parameters.simInput);
            };
        };
    });

})

/*
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
    for (var rowIndex = 0; rowIndex < parameters.numOfPop; rowIndex++) {
        temp = allSpecies[rowIndex].freqSummary(allSpecies[rowIndex].genNumber);
        for (y = 1; y <= parameters.numOfAlleles; y++) {
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
    for (var i = 0; i < parameters.numOfAlleles; i++) {
        alleleFreq_Data.addColumn("number", alleles.labels[i]);
    };

    for (i = 0; i < parameters.numOfPop; i++) {
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
    var j = parameters.init - 1;

    alleles.create();
    for (var i = 0; i < parameters.numOfPop; i++) {
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
    for (var i = 0; i < parameters.numOfPop; i++) {
        allSpecies[i].mate(howMany);
    };
    calculateFST();

    processFlag = false;
    $("#displayCurrentGen").html(allSpecies[0].genNumber);
    google.charts.setOnLoadCallback(drawAlleleFreq);
    google.charts.setOnLoadCallback(drawFST);
};

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
});*/