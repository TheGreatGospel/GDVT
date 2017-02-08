/*===================================================================================*/
/* allelePool() is an object which allows the other functions to interface with the  */
/* allele type pool. The functionality included relies on setting the upper bound of */
/* the pool size before starting the simulation routine.                             */
/*                                                                                   */
/* These are the public methods available within the allelePool() object:            */
/* - .setUprBound(): Sets the upper bound of the allele type pool size to            */
/*      parameters.numOfAlleles.                                                     */
/* - .getUprBound(): Returns the upper bound of the allele type pool size.           */
/* - .getLabels(all = false): Returns the labels of the allele type pool.            */
/* - .getColours(all = false): Returns the colours of the allele type pool.          */
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

    this.getLabels = function(all = false) {
        if (all == true) {
            return labelPool;
        };
        return labelPool.slice(0, uprBound);
    };

    this.getColours = function(all = false) {
        if (all == true) {
            return colourPool;
        };
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
/* Debugging functionality that isn't used in the actual web-app itself.             */
/*===================================================================================*/
/*
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
*/

/*===================================================================================*/
/* migrate() is a function that is hooked onto the 'allSpecies' global array.        */
/* Members of a population will migrate to another population via SRS (excluding     */
/* their origin population. As a side effect of this migration scheme, population    */
/* sizes will fluctuate about the stated population size before mating.              */
/*===================================================================================*/
migrate = function(){
    var toMigrate = [], // An array to store the migration information.
        x = 0, numOfMigrants = 0. // Local variables to work with.
        numOfPop = this.length, // 'this.length' == 'allSpecies.length' (the number of 
                                    // populations in the simulation routine).
        numOfPop_Zero = numOfPop - 1; // Zero-indexed version of 'numOfPop'.
    
    for (var i = 0; i < numOfPop; i++) {
        numOfMigrants = this[i].numOfMigrants; // 'this[i].numOfMigrants' == 
                                                   // 'allSpecies[i].numOfMigrants'.
        for (var j = 0; j < numOfMigrants; j++) {
            // Remove a member from population 'i' 
            x = getRandomInt(0, this[i].currentPop[0].length - 1);
            toMigrate.push(this[i].currentPop[0].splice(x, 1)[0]);

            // Store indice information.
            toMigrate.push(x);

            // Store destination population information.
            x = getRandomInt(0, numOfPop_Zero);
            while (x === i) {
                x = getRandomInt(0, numOfPop_Zero);
            };
            toMigrate.push(x);
        };
    };

    numOfMigrants = toMigrate.length;
    for (i = 0; i < numOfMigrants; i += 3) { // Increments of three due to the way 
                                                 // 'toMigrate'is structured.
        // 'i': member information; 'i + 1': indice information; 'i + 2': destination.
        this[toMigrate[i + 2]].currentPop[0].splice(toMigrate[i + 1], 0, toMigrate[i]);
    };

    toMigrate.length = 0; // Ensure taht the 'toMigrate' array has been cleaned.
};

fstCalc = function(){
    var s1 = [], s2 = [], w = [];
        
    for (var i = 0; i < alleles.getUprBound(); i++) {
        var x = 0, y = 0, z = 0;

        for (var j = 0; j < allSpecies.length; j++) {
            w.push(math.fraction(allSpecies[j].freq[i][allSpecies.genNumber], scope.twoNi));
            
            x = math.fraction(w[j] * scope.ni);
            y = math.add(x, y);

            x = math.subtract(w[j], math.fraction(allSpecies[j].freq2Up[i][allSpecies.genNumber], scope.ni));
            x = math.multiply(scope.twoNi, x);
            z = math.add(x, z);
        };

        var pDot = math.divide(y, scope.g);
        var hDot = math.divide(z, scope.g);

        var x = 0, y = 0, z = 0;
        for (var j = 0; j < allSpecies.length; j++) {
            x = math.subtract(w[j], pDot);
            y = math.multiply(scope.ni, math.square(x));

            z = math.add(y, z);
        };
        
        var sSq = math.divide(z, scope.h);
        s1.push(math.fraction(0)), s2.push(math.fraction(0));

        var aSec = math.fraction(math.multiply(pDot, math.subtract(1, pDot)));
        s1[i] = math.fraction(math.multiply(10000000,
            sSq - (aSec - scope.b*sSq - hDot/4)/scope.a
        ));
        
        s2[i] = math.fraction(math.multiply(10000000,
            aSec - scope.nBar*(scope.d*aSec - sSq*scope.e/scope.nBar - scope.f*hDot)/scope.c
        ));
        
        w.length = 0;
    };

    var x = 0, y = 0, z = 0;

    for (var i = 0; i < alleles.getUprBound(); i++) {
        x = math.add(x, s1[i]);
        y = math.add(y, s2[i]);
    };
    if (y != 0) {
        z = math.divide(x, y);
    } else {
        z = math.number(1);
    };
    
    fst.data.addRow([allSpecies.genNumber + 1, math.number(math.round(z, 6))]);
    s1.length = 0, s2.length = 0;
};

function output_Interval() {
    clearTimeout(timerVars.tickTock);
    if (allSpecies.genNumber >= timerVars.toGenNum) {
        var genNumber_Zero = allSpecies.genNumber - 1;
        $('#output_genNum').html(allSpecies.genNumber);
        $('#output_fst').html(fst.data.getValue(allSpecies.genNumber - 1, 1));

        for (var x = 0; x < allSpecies.length; x++) {
            for (var y = 1; y <= alleles.getUprBound(); y++) {
                alleleFreq.data.setValue(x, y, allSpecies[x].freq[y - 1][genNumber_Zero]);
            };
        };

        alleleFreq.chart.draw(alleleFreq.view, alleleFreq.options);
        fst.chart.draw(fst.data, fst.options);

        $('.output_simButton').prop('disabled', false);
        $('#output_interrupt').prop('disabled', true);
        $('#paraMag_submit').prop('disabled', false);
    } else {
        if (allSpecies.genNumber == 0) {
            for (var i = 0; i < parameters.numOfPop; i++) {
                allSpecies.push(new species());
                allSpecies[i].create();
            };
        } else {
            allSpecies.migrate();
            for (var i = 0; i < allSpecies.length; i++) {
                allSpecies[i].mate();
            };
        };
        allSpecies.fstCalc();
        
        allSpecies.genNumber++;
        timerVars.tickTock = setTimeout(output_Interval, allSpecies.simRate);
    };
};

// Launches a new simulation routine with the current parameters.
function output_Initialise() {
    // Disable the buttons which can begin the timer.
    $('.output_simButton').prop('disabled', true);
    $('#paraMag_submit').prop('disabled', true);
    
    // Initialise independent parts of the simulation routine.
    alleles.setUprBound();
    allSpecies.genNumber = 0;
    allSpecies.simRate = parameters.simRate;

    if (webpageLive) {
        // Clean up previous simulation routine.
        allSpecies.length = 0;
        fst.data.removeRows(0, fst.data.getNumberOfRows());
    } else {
        // Setup functionality for the simulation route.
        allSpecies.migrate = migrate;
        allSpecies.fstCalc = fstCalc;

        // Create the DataTable, Chart, and DataView for the maximum number 
            // of populations and allele types.
        alleleFreq.data = new google.visualization.DataTable();
            alleleFreq.data.addColumn('string', 'Population');
            var initLabels = alleles.getLabels(true);
            for (var i = 0; i < initLabels.length; i++) {
                alleleFreq.data.addColumn('number', initLabels[i]);
            };
            var fill = [];
                for (i = 0; i < 10; i++) {
                    fill.push([]);
                    fill[i].push('#' + (i + 1));
                    for (var j = 0; j < initLabels.length; j++) {
                        fill[i].push(0);
                    };
                };
            alleleFreq.data.addRows(fill);

        alleleFreq.view = new google.visualization.DataView(alleleFreq.data);

        alleleFreq.chart = new google.visualization.ColumnChart(
            document.getElementById('output_alleleFreqChart')
        );

        // Create the DataTable, and Chart for the fst calculations
        fst.data = new google.visualization.DataTable();
        fst.data.addColumn('number', 'Generation');
        fst.data.addColumn('number', 'FST');

        fst.chart = new google.visualization.LineChart(
            document.getElementById('output_fstChart')
        );

        webpageLive = true; // The webpage has loaded, so no more initilisation code
                                // is required.
        fill.length = 0; // Ensure that the 'fill' array has been cleaned. We don't
                             // to clean the 'initLabels' array as it is a 
                             // link to a private variable.
    };

    // Subset the DataTable in 'alleleFreq.data' to visualise what is in the 
        // simulation routine. We load in the columns in reverse order to 
        // work around the native functionality of Google Charts.
    var toView = [0], absUprBnd = alleles.getLabels().length;
        for (var k = 0; k < absUprBnd; k++) {
            toView.push(absUprBnd - k);
        };
        alleleFreq.view.setColumns(toView);
        alleleFreq.view.setRows(0, parameters.numOfPop - 1);
    alleleFreq.options.colors = alleles.getColours().reverse(); // Update the colour
                                                                    // palette.

    // Draw the charts.
    alleleFreq.chart.draw(alleleFreq.view, alleleFreq.options); 
    fst.chart.draw(fst.data, fst.options); 
    
    toView.length = 0; // Ensure that the 'toView' array has been cleaned.

    // Setup the Fst constants to reduce the number of math operations in the timer.
        // This can be done because the population sizes are fixed throughout the 
        // simulation routine.
    var x = 0, y = 0;
    for (var l = 0; l < parameters.numOfPop; l++) {
        x += parameters.popSize;
        y += parameters.popSize * parameters.popSize;
    };

    var
    // r
        r = parameters.numOfPop,
    // r - 1
        rMinusOne = r - 1,
    // (n_1 + . . . + n_r - [n_1^2 + . . . + n_r^2]/[n_1 + . . . + n_r])/(r - 1)
        nC = math.fraction(x - y/x, rMinusOne);

    // n_i
        scope.ni = parameters.popSize;
    // 2*n_i
        scope.twoNi = 2*parameters.popSize;
    // (n_1 + n_2 + . . . + n_r)/r
        scope.nBar = math.fraction(x, parameters.numOfPop);

    // nBar - 1
        scope.a = math.fraction(scope.nBar - 1); 
    // (r - 1)/1
        scope.b = math.fraction(rMinusOne, r); 
    // r*(nBar - 1)
        scope.c = math.fraction(r * scope.a); 
    // r*(nBar - nC)/nBar
        scope.d = math.fraction(r * (scope.nBar - nC) / scope.nBar); 
    // (nBar - 1)  + (r - 1)*(nBar - nC)        
        scope.e = math.fraction(scope.a + rMinusOne*(scope.nBar - nC));
    // (nBar - nC)/(4*nC^2)
        scope.f = math.fraction((scope.nBar - nC)/(4*math.square(nC)));
    // n_1 + n_2 + . . . + n_r
        scope.g = x; 
    // (r - 1)*nBar
        scope.h = math.fraction(rMinusOne * scope.nBar); 

    // Load into the simulation parameters into the corresponding <span>s.
    $('#output_numOfPop').text(parameters.numOfPop);
    $('#output_popSize').text(parameters.popSize);
    $('#output_numOfAlleles').text(parameters.numOfAlleles);
    $('#output_mutaDenom').text(parameters.mutationDenom);
    $('#output_numOfMigrants').text(parameters.numOfMigrants);
    $('#output_init').text(parameters.init);
    $('#output_simRate').text(parameters.simRate/1000);

    // Start the timer to run the 'output_Interval()' function.
    timerVars.toGenNum = parameters.init;
    timerVars.tickTock = setTimeout(output_Interval, allSpecies.simRate);

    // Enable the interruption button.
    $('#output_interrupt').prop('disabled', false);
};


// jQuery event listeners for the Output Tab.
$(document).ready(function(){

    // jQuery event listener to operate the plot toolbar.
    $('ul.output_ulL li').click(function(){
		var tab_id = $(this).attr('data-tab'); // Returns the tab to swap to.

        // Removes the visibility of the current tab.
		$('ul.output_ulL li').removeClass('current');
	    $('.output_chartDim').removeClass('current');

        // Gives visibility to the tab to swap to.
		$(this).addClass('current');
		$('#'+tab_id).addClass('current');
	});

    // jQuery event listeners for the 'n =' buttons.
    $('.output_simButton').click(function(){
        // Disable the buttons which can begin the timer.
        $('.output_simButton').prop('disabled', true);
        $('#paraMag_submit').prop('disabled', true);

        // Figure out how many generations to we need to simulate to.
        var howMany = $(this).attr('howMany');
        if (howMany == 'output_simInput') {
            howMany = $('#output_simInput').val();
        };

        // Start the timer to run the 'output_Interval()' function.
        timerVars.toGenNum = parseInt(howMany) + allSpecies.genNumber;
        timerVars.tickTock = setTimeout(output_Interval, allSpecies.simRate);

        // Enable the interruption button.
        $('#output_interrupt').prop('disabled', false);
    });

    // jQuery event listener for the 'n =' input
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

});