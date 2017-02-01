/* A 'struct' which allows the other scripts to interface with the most current allele pool */
function allelePool() {
    /* The following variables are private to 'struct':              */
    /* fullPool contains the labels and colours for each allele type */
    /* uprBound restricts the number of alleles types made available */
    /*      within the code. Note that the uprBound zero-indexed     */
    /* ones is an utility array which contains -1 and 1 for use with */
    /*      the mutate() method                                      */
    var fullPool = [
            {label: 'A', colour: '#7fc97f'},
            {label: 'B', colour: '#beaed4'},
            {label: 'C', colour: '#fdc086'},
            {label: 'D', colour: '#ffff99'},
            {label: 'E', colour: '#386cb0'},
            {label: 'F', colour: '#f0027f'},
            {label: 'G', colour: '#bf5b17'},
            {label: 'H', colour: '#666666'}
        ],
        uprBound = 4,
        ones = [-1, 1];
    
    this.setUprBound = function () {
        /* setUprBound() allows the user to interface with uprBound  */
        /* and as mentioned earlier, uprBound is _zero-indexed_      */
        uprBound = parameters.numOfAlleles - 1;
    };

    this.getUprBound = function () {
        /* curUprBound() returns the current value of uprBound in _one-indexed_  form */
        return uprBound + 1;
    }

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

/* An object which stores a species's most current generation and the frequencies of */
/* all generations. The methods for this object are implemented with the prototype   */
/* keyword to optimise the browser memory usage                                      */
function species() {
    /* Load in population specific parameters into the species object */
    this.genSize = parameters.popSize,
    this.mutaRate = parameters.mutationRate,
    this.numOfMigrants = parameters.numOfMigrants,

    /* Data storage variables */
    this.currentPop = [],
    this.freq = {},
    this.freq2Up = {};
};

/* The following methods are unique to the species object: */
/*     - allelesPack(toPack)                               */
/*     - allelesUnpack(toUnpack)                           */

species.prototype.allelesPack = function(toPack) {
    /* toPack takes an array of size two and compresses it */
    /* into a single number encoded in binary. Note that   */ 
    /* Javascript will still print the number in base 10   */
    var toReturn = 0;
    toReturn |= toPack[0];
    toReturn <<= 3; // Since the user can only use up to eight alleles, 
                    // we only need to shift by three bits
    toReturn |= toPack[1];
    return toReturn;
};

species.prototype.allelesUnpack = function(toUnpack) {
    /* toUnpack takes a single number and uncompresses */
    /* it into an array of size two                    */ 
    var toReturn = [];
    toReturn.unshift(toUnpack & 7); // Note that 7 in binary is 111, 
                                    // which is the mask we require
    toUnpack >>= 3;
    toReturn.unshift(toUnpack & 7);
    return toReturn;
};

species.prototype.create = function() {
    /* Setup two local variables, allelePool a temporary array and      */
    /* poolSize which is the current number of allele types in the pool */
    var allelePool = [],
        poolSize = alleles.getUprBound();
    
    /* Note that objects can use numbers as indices by using the array indexing notation  */
    /* The objects which stores poolSize number of arrays to store the allele frequencies */
    for (var i = 0; i < poolSize; i++) {
        this.freq[i] = [0];
        this.freq2Up[i] = [0];
    };

    poolSize--; // Subtract poolSize by one to get it back as a zero-indexed number

    for (i = 0; i < this.genSize; i++) {
        /* Load into allelePool two alleles (represented with the numbers 0-poolSize) */
        allelePool.push(getRandomInt(0, poolSize));
        allelePool.push(getRandomInt(0, poolSize));

        /* Add the compressed allelePool (which represents a member) to the population */
        this.currentPop.push(this.allelesPack(allelePool));
            
        /* Increase the corresponding frequencies */
        /* Note that the first index corresponds to the allele type and */
        /* the second index corresponds to which generation             */
        this.freq[allelePool[0]][0]++;
        this.freq[allelePool[1]][0]++;
        if (allelePool[0] === allelePool[1]) {
            this.freq2Up[allelePool[0]][0]++;
        };
            
        allelePool.length = 0; // Clean the array
    };
};

function output_TimerManagement() {
    if (timerVars.stage == 0) {
        allSpecies.push(new species());
        allSpecies[timerVars.index].create();
        timerVars.index++;

        if (timerVars.index >= parameters.numOfPop) {
            timerVars.stage = 1;
        };
        
    } else if (timerVars.stage == 1) {
        timerVars.stage = 2
                //if (j > 0) {
        //    allSpecies[i].mate(j);
        //};
    } else if (timerVars.stage == 2) {
        //calculateFST();
        timerVars.toEnd = true;
    };

    if (timerVars.toEnd) {
        console.log("hi");
        //google.charts.setOnLoadCallback(drawCharts_Init);
        //google.charts.setOnLoadCallback(drawFST);

        $('#output_genNum').html(allSpecies.genNumber);
        //$('#output_fst').html(0.123456789);

        $('.output_simButton').prop('disabled', false);
        $('#output_interrupt').prop('disabled', true);
        $('#paraMag_submit').prop('disabled', false);

        clearInterval(timerVars.tickTock);
    };
};

/* Launches a new simulation routine with the current parameters */
function output_Initialise(webpageLoaded = true) {
    var j = parameters.init - 1;

    $('.output_simButton').prop('disabled', true);
    $('#output_interrupt').prop('disabled', false);
    $('#paraMag_submit').prop('disabled', true);

    if (webpageLoaded) {
        allSpecies.length = 0;
    };

    alleles.setUprBound();
    allSpecies.genNumber = 1;
    allSpecies.simRate = parameters.simRate;

    $('#output_genNum').html(allSpecies.genNumber);
    $('#output_fst').html('. . .');

    $('#output_numOfPop').text(parameters.numOfPop);
    $('#output_popSize').text(parameters.popSize);
    $('#output_numOfAlleles').text(parameters.numOfAlleles);
    $('#output_mutaRate').text(parameters.mutationRate);
    $('#output_numOfMigrants').text(parameters.numOfMigrants);
    $('#output_init').text(parameters.init);
    $('#output_simRate').text(parameters.simRate/1000);
    
    timerVars.index = 0;
    timerVars.stage = 0;
    timerVars.toEnd = false;
    timerVars.tickTock = setInterval(output_TimerManagement, allSpecies.simRate);
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
		$('#'+tab_id).addClass('current');
	})

    /* jQuery event listener for the 'n =' input */
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

/* species.prototype.mate = function(numOfTimes = 1) {
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
        FST_Data.addRow([FST_DataCurrent, statsMaster['FST'][FST_DataCurrent - 1]]);
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

    alleleFreq_Data.addColumn('string', 'Population');
    for (var i = 0; i < parameters.numOfAlleles; i++) {
        alleleFreq_Data.addColumn('number', alleles.labels[i]);
    };

    for (i = 0; i < parameters.numOfPop; i++) {
        temp.push(allSpecies[i].freqSummary(allSpecies[i].genNumber));
        temp[i].unshift('#' + (i+1));
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

    FST_Data.addColumn('number', 'Generation');
    FST_Data.addColumn('number', 'FST');

    alleleFreq_Chart.draw(alleleFreq_Data, alleleFreq_Options);
};

function simulation_Update(howMany) {
    for (var i = 0; i < parameters.numOfPop; i++) {
        allSpecies[i].mate(howMany);
    };
    calculateFST();

    processFlag = false;
    $('#displayCurrentGen').html(allSpecies[0].genNumber);
    google.charts.setOnLoadCallback(drawAlleleFreq);
    google.charts.setOnLoadCallback(drawFST);
};

$('#sim_1').click(function () {
    if (processFlag === false) {
        processFlag = true;
        simulation_Update(1);
    };
});

$('#sim_10').click(function () {
    if (processFlag === false) {
        processFlag = true;
        simulation_Update(10);
    };
});

$('#sim_X').click(function () {
    if (processFlag === false) {
        processFlag = true;
        simulation_Update(parseInt($('#sim_input').val()));
    };
});*/