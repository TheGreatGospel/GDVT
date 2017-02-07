/*===================================================================================*/
/* allelePool() is an object which allows the other functions to interface with the  */
/* allele type pool. The functionality included relies on setting the upper bound of */
/* the pool size before starting the simulation routine.                             */
/*                                                                                   */
/* These are the public methods available within the allelePool() object:            */
/* - .setUprBound(): Sets the upper bound of the allele type pool size to            */
/*      parameters.numOfAlleles.                                                     */
/* - .getUprBound(): Returns the upper bound of the allele type pool size.           */
/* - .getLabels(): Returns the labels of the allele type pool.                       */
/* - .getColours(): Returns the colours of the allele type pool.                     */
/* - .mutate(i = getRandomInt()): Returns an integer of a successful allele type     */
/*      mutation under the one-step mutation model respecting boundaries.            */
/*===================================================================================*/
function allelePool() {
    var labelPool = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        colourPool = ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', 
                      '#386cb0', '#f0027f', '#bf5b17', '#666666'],
        uprBound = parameters.numOfAlleles,
        uprBound_Zero = parameters.numOfAlleles - 1; // Zero-indexed version of the 
            // 'uprBound' private variable. This is to prevent .mutate() from doing 
            // unnecessary arithmetic.
    
    this.setUprBound = function() {
        uprBound = parameters.numOfAlleles;
        uprBound_Zero = parameters.numOfAlleles - 1;
    };

    this.getUprBound = function() {
        return uprBound;
    };

    this.getLabels = function() {
        return labelPool.slice(0, uprBound);
    };

    this.getColours = function() {
        return colourPool.slice(0, uprBound);
    };

    this.mutate = function(i = getRandomInt(0, uprBound_Zero)) {
        if (i == uprBound_Zero) {
            i--; // 100% probability to go from state 'uprBound_Zero' to 
                    // state 'uprBound_Zero - 1'.
        } else if (i == 0) {
            i++; // 100% probability to go from state '0' to state '1'.
        } else {
            i += (1 - 2 * rngBin.get()); // 50% probability for the current state to go
                                            // one-step either direction.
        };
        return i;
    };
};

/*===================================================================================*/
/* species() is an object which stores a population's current generation in a        */
/* detailed form and the allele type frequencies of previous generations. The        */
/* methods for the species() object are implemented with the .prototype keyword in   */
/* order to minimise the browser's memeory usage.                                    */
/*                                                                                   */
/* These are the public variables available within the species() object:             */
/* - .popSize: The population size as determined by parameters.popSize.              */
/* - .mutaRate: The population's allele type mutation rate deteremined by            */
/*      '1/parameters.mutationDenom'. Stored as a 'math.fraction' to avoid problems  */
/*      with Javascript's lack of precision for small numbers.                       */
/* - .numOfMigrants: The number of migrants this population should send each         */
/*      generation.                                                                  */
/* - .currentPop: The detailed makeup of the population's current generation.        */
/* - .freq: An object which contains up to '.getUprBound()' arrays to store general  */
/*      allele type frequency information. (Retrieve with                            */
/*      '.freq[alleleType][generation]')                                             */
/* - .freq2Up: An object which contains up to '.getUprBound()' arrays to store       */
/*      double-up allele type frequency information (for example, a member has two   */
/*      'A' alleles). (Retrieve with '.freq2Up[alleleType][generation]')             */
/*                                                                                   */
/* These are the public methods available within the species() object:               */
/* - .allelesPack(toPack = [i, j]): Compresses the allele type information of a      */
/*      member into a singular number with bitwise operators. Note that Javascript   */
/*      always prints numbers in base 10.                                            */
/* - .allelesUnpack(toUnpack = i): Takes a number and uncompresses the allele type   */
/*      information of a member into an array of length 2.                           */
/* - .create(): Creates a population and loads it into '.currentPop'. Also, it       */
/*      initialises the '.freq' and '.freq2Up' objects.                              */
/* - .mate(): Mates the current population to sire a new population to load into     */
/*      '.currentPop'.                                                               */
/*===================================================================================*/
function species() {
    this.popSize = parameters.popSize,
    this.mutaRate = -1,
    this.numOfMigrants = parameters.numOfMigrants,
    this.currentPop = [],
    this.freq = {},
    this.freq2Up = {};

    if (parameters.mutationDenom != 0) {
        this.mutaRate = math.fraction(1, parameters.mutationDenom)
    };
};

species.prototype.allelesPack = function(toPack) {
    var toReturn = 0;
    toReturn |= toPack[0];
    toReturn <<= 3; // Since the user can only use up to eight alleles, we only need to 
                        // shift by three bits.
    toReturn |= toPack[1];
    return toReturn;
};

species.prototype.allelesUnpack = function(toUnpack) {
    var toReturn = [];
    toReturn.unshift(toUnpack & 7); // 7 = 111 in binary and is required bitwise mask.
    toUnpack >>= 3;
    toReturn.unshift(toUnpack & 7);
    return toReturn;
};

species.prototype.create = function() {
    // Declare the local variables 'allelePool' and 'poolSize'
    var allelePool = [],
        poolSize = alleles.getUprBound();

    // Objects can use numbers as indices with the array indexing notation.
    for (var i = 0; i < poolSize; i++) {
        this.freq[i] = [0];
        this.freq2Up[i] = [0];
    };

    this.currentPop.push([]) // Pushes an empty array into '.currentPop' to store 
                                // membership information. The implementation is to 
                                // assist future updates to the tool.
    poolSize--; // Subtract 'poolSize' by one to make it a zero-indexed number.

    for (i = 0; i < this.popSize; i++) {
        // Assign two alleles to 'allelePool'.
        allelePool.push(getRandomInt(0, poolSize));
        allelePool.push(getRandomInt(0, poolSize));

        // Compress 'allelePool' and add the member to the population.
        this.currentPop[0].push(this.allelesPack(allelePool));
            
        // Increase the corresponding frequencies.
        this.freq[allelePool[0]][0]++;
        this.freq[allelePool[1]][0]++;
        if (allelePool[0] === allelePool[1]) {
            this.freq2Up[allelePool[0]][0]++;
        };
            
        allelePool.length = 0; // Ensure that the 'allelePool' array has been cleaned.
    };
};

species.prototype.mate = function () {
    var parentGen = this.currentPop.shift(), // Remove the oldest population from the 
                                                // '.currentPop' array to be the parent 
                                                // generation.
        parentSize = parentGen.length - 1, // The parent generation could be 
                                                // bigger or smaller than '.popSize' 
                                                //  due to migration.
        parents = [], parentAPool = [], // The last set of local variables to declare.
        parentBPool = [], allelePool = [];

    // Increase the length of the allele frequencies arrays by one.
    for (var i = 0; i < alleles.getUprBound(); i++) {
        this.freq[i].push(0);
        this.freq2Up[i].push(0);
    };
    this.currentPop.push([]); // Pushes an empty array into '.currentPop' to store 
                                // membership information. The implementation is to 
                                // assist future updates to the tool.                         

    for (i = 0; i < this.popSize; i++) {
        // Acquire some uniquely indexed parents with SRS.
        parents.push(getRandomInt(0, parentSize));
        parents.push(getRandomInt(0, parentSize));
        while (parents[0] === parents[1]) {
            parents[rngBin.get()] = getRandomInt(0, parentSize);
        };

        // Uncompress the parents' alleles.
        parentAPool = this.allelesUnpack(parentGen[parents[0]]);
        parentBPool = this.allelesUnpack(parentGen[parents[1]]);

        // The child inherits one random allele from each parent and each inhreited
            // allele will have a chance to mutate.                               
        allelePool.push(parentAPool[rngBin.get()]);
        if (math.random() <= this.mutaRate) {
            allelePool[0] = alleles.mutate(allelePool[0]);
        };
        allelePool.push(parentBPool[rngBin.get()]);
        if (math.random() <= this.mutaRate) {
            allelePool[1] = alleles.mutate(allelePool[1]);
        };
        
        // Add in some additional variation to the member's possible allele structure.
        if (rngBin.get() === 0) {
            allelePool.reverse();
        };

        // Compress 'allelePool' and add the member to the population.
        this.currentPop[0].push(this.allelesPack(allelePool));

        // Increase the corresponding frequencies.
        this.freq[allelePool[0]][allSpecies.genNumber]++;
        this.freq[allelePool[1]][allSpecies.genNumber]++;
        if (allelePool[0] === allelePool[1]) {
            this.freq2Up[allelePool[0]][allSpecies.genNumber]++;
        };

        // Ensure that the local arrays have been cleaned.
        allelePool.length = 0;
        parents.length = 0;
        parentAPool.length = 0;
        parentBPool.length = 0;
    };

    // Ensure that the 'parentGen' array has been cleaned.
    parentGen.length = 0;
};

/*===================================================================================*/
/* migrate() is a funciton that is hooked onto the 'allSpecies' global array. 
/**/
migrate = function(){
    var toMigrate = [], 
        x, 
        numOfPop = this.length, 
        numOfPop_Zero = numOfPop - 1,
        numOfMigrants = 0;
    
    for (var i = 0; i < numOfPop; i++) {
        numOfMigrants = this[i].numOfMigrants;
        for (var j = 0; j < numOfMigrants; j++) {
            x = getRandomInt(0, this[i].currentPop[0].length - 1);
            toMigrate.push(this[i].currentPop[0].splice(x, 1)[0]);
            toMigrate.push(x);
            x = getRandomInt(0, numOfPop_Zero);
            while (x === i) {
                x = getRandomInt(0, numOfPop_Zero);
            };
            toMigrate.push(x);
        };
    };

    numOfMigrants = toMigrate.length;
    for (i = 0; i < numOfMigrants; i += 3) {
        this[toMigrate[i+2]].currentPop[0].splice(toMigrate[i+1], 0, toMigrate[i]);
    };

    toMigrate.length = 0;
};

species.prototype.freqSummary = function(whichGen = 1) {
    var toReturn = [];
    if (whichGen < 1 || whichGen > allSpecies.genNumber) {
        whichGen = allSpecies.genNumber;
    }
    for (var i = 0; i < alleles.getUprBound(); i++) {
        toReturn.push(this.freq[i][whichGen - 1]);
    };
    return toReturn;
};

species.prototype.freq2UpSummary = function(whichGen = 1) {
    var toReturn = [];
    if (whichGen < 1 || whichGen > allSpecies.genNumber) {
        whichGen = allSpecies.genNumber;
    }
    for (var i = 0; i < alleles.getUprBound(); i++) {
        toReturn.push(this.freq2Up[i][whichGen - 1]);
    };
    return toReturn;
};

function output_TimerManagementChild() {
    var temp = [], y = 0;
    for (var rowIndex = 0; rowIndex < allSpecies.length; rowIndex++) {
        temp = allSpecies[rowIndex].freqSummary(allSpecies.genNumber).reverse();
        for (y = 1; y <= alleles.getUprBound(); y++) {
            alleleFreq.data.setValue(rowIndex, y, temp[y-1]);
        }
        temp.length = 0;
    };
    alleleFreq.chart.draw(alleleFreq.data, alleleFreq.options);
};

function output_TimerManagement() {
    if (timerVars.stage == 0) {
        allSpecies.push(new species());
        allSpecies[timerVars.index].create();
        timerVars.index++;

        if (timerVars.index >= parameters.numOfPop) {
            timerVars.stage = 1;
            timerVars.index = 0;
            //console.log(allSpecies[0].freqSummary(allSpecies.genNumber));
        };
    } else if (timerVars.stage == 1) {
        if (allSpecies.genNumber >= timerVars.toGenNum) {
            timerVars.stage = 2;
            timerVars.index = 0;
        } else {
            allSpecies.migrate();
            for (i = 0; i < allSpecies.length; i++) {
                allSpecies[i].mate();
            };
            //calculateFST();
            allSpecies.genNumber++;
            //console.log(allSpecies[0].freqSummary(allSpecies.genNumber));
        };
    } else if (timerVars.stage == 2) {
        //output_TimerManagementChild();
        timerVars.toEnd = true;
    };

    if (timerVars.toEnd) {
        //console.log("hi");
        //google.charts.setOnLoadCallback(drawFST);

        $('#output_genNum').html(allSpecies.genNumber);
        //$('#output_fst').html(0.123456789);

        $('.output_simButton').prop('disabled', false);
        $('#output_interrupt').prop('disabled', true);
        $('#paraMag_submit').prop('disabled', false);

        clearInterval(timerVars.tickTock);
    };
};

function output_InitialiseChild() {
    alleleFreq.data = new google.visualization.DataTable();
    alleleFreq.data.addColumn('string', 'Population');
    
    alleleFreq.chart = new google.visualization.ColumnChart(document.getElementById('output_alleleFreqChart'));

    fst.data = new google.visualization.DataTable();
    fst.data.addColumn('number', 'Generation');
    fst.data.addColumn('number', 'FST');

    fst.chart = new google.visualization.LineChart(document.getElementById('output_fstChart'));
};

function output_InitialiseChildToo() {
    alleleFreq.data.removeColumns(1, alleleFreq.data.getNumberOfColumns() - 1);
    alleleFreq.data.removeRows(0, alleleFreq.data.getNumberOfRows());

    fst.data.removeRows(0, fst.data.getNumberOfRows());
};

function output_InitialiseChildTrois() {
    var temp = alleles.getLabels();
    for (var i = alleles.getUprBound() - 1; i >= 0; i--) {
        alleleFreq.data.addColumn('number', temp[i]);
    };

    temp.length = 0;
    for (var j = 0; j < parameters.numOfPop; j++) {
        temp.push([]);
        temp[j].push('#' + (j+1))
        for (i = 0; i < alleles.getUprBound(); i++) {
            temp[j].push(0);
        };
    };

    alleleFreq.data.addRows(temp);
    alleleFreq.options.colors = alleles.getColours();

};

/* Launches a new simulation routine with the current parameters */
function output_Initialise(webpageLoaded = true) {
    /* Disable the 'simulation next n generations buttons', */
    /* submit parameters and enable the interruption button */
    $('.output_simButton').prop('disabled', true);
    $('#output_interrupt').prop('disabled', false);
    $('#paraMag_submit').prop('disabled', true);

    if (webpageLoaded) {
        allSpecies.length = 0;
        //output_InitialiseChildToo();
    } else {
        //output_InitialiseChild();
        allSpecies.migrate = migrate;
    };
    
    /* Set up some  */
    alleles.setUprBound();
    allSpecies.genNumber = 1;
    allSpecies.simRate = parameters.simRate;

    /* Load up any additional setup for the google.DataTables */
    //output_InitialiseChildTrois(); 

    $('#output_genNum').html(allSpecies.genNumber);
    $('#output_fst').html('. . .');

    $('#output_numOfPop').text(parameters.numOfPop);
    $('#output_popSize').text(parameters.popSize);
    $('#output_numOfAlleles').text(parameters.numOfAlleles);
    $('#output_mutaRate').text(parameters.mutationDenom);
    $('#output_numOfMigrants').text(parameters.numOfMigrants);
    $('#output_init').text(parameters.init);
    $('#output_simRate').text(parameters.simRate/1000);

    /* Refresh the timerVars object */
    timerVars.index = 0;
    timerVars.stage = 0;
    timerVars.toGenNum = parameters.init;
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
	});

    /* jQuery event listeners for the 'n =' buttons */
    $('.output_simButton').click(function(){
        /* Disable the 'simulation next n generations buttons', */
        /* submit parameters and enable the interruption button */
        $('.output_simButton').prop('disabled', true);
        $('#output_interrupt').prop('disabled', false);
        $('#paraMag_submit').prop('disabled', true);

        /* Refresh the timerVars object, however unlike the output_Initialise(), we want to only  */
        /* migrate/mate for each population, therefore setting timerVars.stage to 1 rather than 0 */
        timerVars.index = 0;
        timerVars.stage = 1;
        /* Code to read which button was pressed. */
        var howMany = $(this).attr('howMany');
        if (howMany == 'output_simInput') {
            howMany = $('#output_simInput').val();
        };
        timerVars.toGenNum = parseInt(howMany) + allSpecies.genNumber;
        timerVars.toEnd = false;
        timerVars.tickTock = setInterval(output_TimerManagement, allSpecies.simRate);
    });

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

/*var FST_Chart,
    FST_Data,
    FST_Options,
    FST_DataCurrent = 1;

function drawFST() {
    while (allSpecies[0].genNumber >= FST_DataCurrent) {
        FST_Data.addRow([FST_DataCurrent, statsMaster['FST'][FST_DataCurrent - 1]]);
        FST_DataCurrent++;
    };
    FST_Chart.draw(FST_Data, FST_Options);
};

function drawCharts_Init() {
    var temp = [];

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
};*/