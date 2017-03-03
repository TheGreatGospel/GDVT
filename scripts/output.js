/*===================================================================================*/
/* allelePool() is an object which allows the other functions to interface with the  */
/* allele pool. The functionality included relies on setting the upper bound of      */
/* the pool size before starting the simulation routine.                             */
/*                                                                                   */
/* These are the public methods available within the allelePool() object:            */
/* - .setUprBound(): Sets the upper bound of the allele pool size to                 */
/*      parameters.numOfAlleles.                                                     */
/* - .getUprBound(): Returns the upper bound of the allele pool size.                */
/* - .getUprBound_Zero(): Returns the upper bound of the allele pool size in         */
/*		zero-indexed form.                                                           */
/* - .getLabels(all = false): Returns the labels of the allele type pool.            */
/* - .getColours(all = false): Returns the colours of the allele type pool.          */
/* - .mutate(i = getRandomInt()): Returns an integer of a successful allele type     */
/*      mutation under the one-step mutation model respecting boundaries.            */
/*===================================================================================*/
function allelePool() {
    var labelPool = [
			['A'],
			['A', 'B'],
			['A', 'B', 'C'],
			['A', 'B', 'C', 'D'],
			['A', 'B', 'C', 'D', 'E'],
			['A', 'B', 'C', 'D', 'E', 'F'],
			['A', 'B', 'C', 'D', 'E', 'F', 'G'],
			['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
		],
		colorPool = [
			['#7fc97f'],
			['#beaed4', '#7fc97f'],
			['#fdc086', '#beaed4', '#7fc97f'],
			['#ffff99', '#fdc086', '#beaed4', '#7fc97f'],
			['#386cb0', '#ffff99', '#fdc086', '#beaed4', '#7fc97f'],
			['#f0027f', '#386cb0', '#ffff99', '#fdc086', '#beaed4', '#7fc97f'],
			['#bf5b17', '#f0027f', '#386cb0', '#ffff99', '#fdc086', '#beaed4', '#7fc97f'],
			['#666666', '#bf5b17', '#f0027f', '#386cb0', '#ffff99', '#fdc086', '#beaed4', '#7fc97f']
		],
		uprBound = parameters.numOfAlleles,
		uprBound_Zero = parameters.numOfAlleles - 1; // Zero-indexed version of the 'uprBound' 
			// private variable. This is to prevent '.mutate()' from doing unnecessary arithmetic.
			
	this.setUprBound = function() {
		uprBound = parameters.numOfAlleles;
		uprBound_Zero = parameters.numOfAlleles - 1;
	};
	
	this.getUprBound = function() {
		return uprBound;
	};
	
	this.getUprBound_Zero = function() {
		return uprBound_Zero;
	};

	this.getLabels = function(all = false) {
		if (all === true) {
			return labelPool[7];
		};
		return labelPool[uprBound_Zero];
	};

	this.getColors = function(all = false) {
		if (all === true) {
			return colorPool[7];
		};
		return colorPool[uprBound_Zero];
	};

	this.mutate = function(i = getRandomInt(0, uprBound_Zero)) {
		if (i === uprBound_Zero) {
			i -= 1; // 100% probability to go from state 'uprBound_Zero' to 
				// state 'uprBound_Zero - 1'.
		} else if (i === 0) {
			i += 1; // 100% probability to go from state '0' to state '1'.
		} else {
			i += (1 - 2 * rngBin.get()); // 50% probability for the current state to go
				// one-step either direction.
		};
		return i;
	};
};

/*===================================================================================*/
/* - allelesPack(toPack = [i, j]): Compresses the allele type information of a       */
/*      member into a singular number with bitwise operators. Note that Javascript   */
/*      always prints numbers in base 10.                                            */
/* - allelesUnpack(toUnpack = i): Takes a number and uncompresses the allele type    */
/*      information of a member into an array of length 2.                           */
/*===================================================================================*/

allelesPack = function(toPack) {
    var toReturn = 0;
    toReturn |= toPack[0];
    toReturn <<= 3; // Since the user can only use up to eight alleles, we only need to 
                        // shift by three bits.
    toReturn |= toPack[1];
    return toReturn;
};

allelesUnpack = function(toUnpack) {
    var toReturn = [];
    toReturn.unshift(toUnpack & 7); // 7 = 111 in binary and is required bitwise mask.
    toUnpack >>= 3;
    toReturn.unshift(toUnpack & 7);
    return toReturn;
};

/*===================================================================================*/
/* species() is an object which stores a population's current generation in a        */
/* detailed form and the allele frequencies. The 	         						 */
/* methods for the species() object are implemented with the .prototype keyword in   */
/* order to minimise the browser's memeory usage.                                    */
/*                                                                                   */
/* These are the public methods available within the species() object:               */
/* - .create(): Creates a population and loads it into '.populations'. Also, it      */
/*      initialises the '.alleleFreq' and '.homozygousFreq' objects.                 */
/* - .mate(): Mates the current population to sire a new population to load into     */
/*      '.populations'.                                                              */
/* - .recycle(): Recycles the species object.                                        */
/*===================================================================================*/
function species() {
    this.popSize = 0, // Save the specified parameter size with the object
    this.mutaRate = -1, // ...and the specified mutation rate with the object...
    this.numOfMigrants = 0, // ...and the number of migrants.
	
	this.toMutate = false, // A set of booleans to minimise the number of computing operations.
	this.toMigrate = false,
	
	this.populations = {0: [], 1: []}, // Note the binary indices.
	this.alleleFreq = {0: [], 1: []}, // ' '.
	this.homozygousFreq = {0: [], 1: []}; // ' '.
};

species.prototype.create = function() {
    var indivAllelePool = []; // Create a local variable 'indivAllelePool' 
			// to store a member's alleles.
	
	// Load in the parameters that are specific to a population.
	if (parameters.mutationDenom != 0) {
        this.mutaRate = math.fraction(1, parameters.mutationDenom);
    };
	
	this.popSize = parameters.popSize,
	this.numOfMigrants = parameters.numOfMigrants,
	this.toMutate = this.mutaRate > 0,
	this.toMigrate = this.numOfMigrants > 0;
	
    // Expand the frequency arrays.
    for (var i = 0; i < alleles.getUprBound(); i++) {
		this.alleleFreq[0].push(0);
		this.alleleFreq[1].push(0);
		this.homozygousFreq[0].push(0);
		this.homozygousFreq[1].push(0);
    };

    for (i = 0; i < this.popSize; i++) {
        // Assign two alleles to 'allelePool'.
        indivAllelePool[0] = getRandomInt(0, alleles.getUprBound_Zero());
        indivAllelePool[1] = getRandomInt(0, alleles.getUprBound_Zero());

        // Compress 'allelePool' and add the member to the population.
        this.populations[allSpecies.currentIndex].push(allelesPack(indivAllelePool));
            
        // Increase the corresponding frequencies.
        this.alleleFreq[allSpecies.currentIndex][indivAllelePool[0]]++;
        this.alleleFreq[allSpecies.currentIndex][indivAllelePool[1]]++;
        if (indivAllelePool[0] === indivAllelePool[1]) {
            this.homozygousFreq[allSpecies.currentIndex][indivAllelePool[0]]++;
        };
    };
	
	indivAllelePool.length = 0; // Flush the 'indivAllelePool' array.

    indivAllelePool = null, i = null;
};

species.prototype.mate = function () {
    var parentGen = this.populations[allSpecies.currentIndex].splice(0), // Load in the parent
			// generation into a local variable. The '.splice()' method flushes the
			// embedded array.
        parentSize = parentGen.length - 1, // The parent generation could be 
             // bigger or smaller than '.popSize' due to migration. Also, this is in
			 // zero-indexed form!
        parents = [0, 0], // Local array for storing the parent indexes.
		parentAPool, // Local array variables to store parents' alleles.
        parentBPool, 
		indivAllelePool = [0, 0]; // Local variable 'indivAllelePool' to store a
			// member's alleles.

    // Reset the allele frequencies arrays.
    for (var i = 0; i < alleles.getUprBound(); i++) {
        this.alleleFreq[allSpecies.currentIndex][i] = 0;
        this.homozygousFreq[allSpecies.currentIndex][i] = 0;
    };

    for (i = 0; i < this.popSize; i++) {
        // Select some parents with simple random sampling.
        parents[0] = getRandomInt(0, parentSize);
        parents[1] = getRandomInt(0, parentSize);
        while (parents[0] === parents[1]) {
            parents[rngBin.get()] = getRandomInt(0, parentSize);
        };

        // Uncompress the parents' alleles.
        parentAPool = allelesUnpack(parentGen[parents[0]]);
        parentBPool = allelesUnpack(parentGen[parents[1]]);

        // The child inherits one random allele from each parent...                    
        indivAllelePool[0] = parentAPool[rngBin.get()];
        indivAllelePool[1] = parentBPool[rngBin.get()];
		
		// ...and each inherited allele will have a chance to mutate.           
		if (this.toMutate) {
			if (Math.random() <= this.mutaRate) {
				indivAllelePool[0] = alleles.mutate(indivAllelePool[0]);
			};
			if (Math.random() <= this.mutaRate) {
				indivAllelePool[1] = alleles.mutate(indivAllelePool[1]);
			};
		};
		
        // Allow the order of the alleles to vary with the following if/else statment.
        if (rngBin.get() === 0) {
            indivAllelePool.reverse();
        };

        // Compress 'allelePool' and add the member to the population.
        this.populations[allSpecies.currentIndex].push(allelesPack(indivAllelePool));

        // Increase the corresponding frequencies.
        this.alleleFreq[allSpecies.currentIndex][indivAllelePool[0]]++;
        this.alleleFreq[allSpecies.currentIndex][indivAllelePool[1]]++;
        if (indivAllelePool[0] === indivAllelePool[1]) {
            this.homozygousFreq[allSpecies.currentIndex][indivAllelePool[0]]++;
        };

        // Flush both of the parent's alleles arrays.
        parentAPool.length = 0, parentBPool.length = 0;
    };
	
	// Flush the local arrays.
	parentGen.length = 0, parents.length = 0, indivAllelePool.length = 0;

    parentGen = null, parentSize = null, parents = null, parentAPool = null,
	parentBPool = null, indivAllelePool = null, i = null;
};

species.prototype.recycle = function() {
	// Flush the embedded arrays.
	this.alleleFreq[0].length = 0,
	this.alleleFreq[1].length = 0,
	this.homozygousFreq[0].length = 0,
	this.homozygousFreq[1].length = 0,
	this.populations[0].length = 0,
	this.populations[1].length = 0;
	
	// Reset the '.mutaRate' variable to -1.
	this.mutaRate = -1;
};

/*===================================================================================*/
/* migrate() is a function that is hooked onto the 'allSpecies' global array.        */
/* Members of a population will migrate to another population via SRS (excluding     */
/* their origin population. As a side effect of this migration scheme, population    */
/* sizes will fluctuate about the stated population size before mating.              */
/*===================================================================================*/
migrate = function(){
    var toMigrate = [], // An array to store the migration information.
        indice = 0, // Local variable to temporarily store indice information and
			// population information.
        numOfPop_Zero = this.numOfPop - 1; // Zero-indexed version of '.numOfPop'.
    
    for (var i = 0; i < this.numOfPop; i++) {
		// 'this[i].numOfMigrants' == 'allSpecies[i].numOfMigrants'.
        for (var j = 0; j < this[i].numOfMigrants; j++) {
            // Remove a random member from population 'i'.
            indice = getRandomInt(0, this[i].populations[allSpecies.currentIndex].length - 1);
            toMigrate.push(this[i].populations[allSpecies.currentIndex].splice(indice, 1)[0]);

            // Store indice information for when we insert the member into a new population.
            toMigrate.push(indice);

            // Store destination population information.
            indice = getRandomInt(0, numOfPop_Zero);
            while (indice === i) { // Prevent the member from returning back to it's
					// population of origin.
                indice = getRandomInt(0, numOfPop_Zero);
            };
            toMigrate.push(indice);
        };
    };

    for (i = 0; i < toMigrate.length; i += 3) { // The variable 'i' increases in by three because 
		// the array 'toMigrate' is structured to hold three pieces of information for each migrant.
        
		// 'i': member information; 'i + 1': indice information; 'i + 2': destination.
        this[toMigrate[i + 2]].populations[allSpecies.currentIndex].splice(toMigrate[i + 1], 0, toMigrate[i]);
    };

    // Flush the 'toMigrate' array.
    toMigrate.length = 0; 
	
	toMigrate = null, indice = null, numOfPop_Zero = null, i = null, j = null;
};

/*===================================================================================*/
/* fstCalc() is a funciton that is hooked onto the 'allSpecies' global array.        */
/* This function calculates the coancestry coefficient using the methodology found   */
/* in pages 176-179 of 'Genetic Data Analysis II' by Bruce S. Weir. Due to the       */
/* implementation of 'output_Interval()', this calculates the coancestry coefficient */
/* of the most recent generation.                                                    */
/*===================================================================================*/

fstCalc = function(){
    var s1 = [], s2 = [], w = [], // Local arrays to work with.
	x, y, z, // Local variables to store temporary numbers.
	i, j, // Local variables to index the for loops with.
	pDot, hDot, sSq, aSec; // Local variables to store parts of the equation.
        
    for (i = 0; i < alleles.getUprBound(); i++) { // For each allele type 'i'...
        x = 0, y = 0, z = 0; // Refresh variables x, y, and z.

        for (j = 0; j < allSpecies.numOfPop; j++) { // within each population...
            // Calculate the population's p_i.
			if (w[j] == null) {
				w.push(math.fraction(allSpecies[j].alleleFreq[allSpecies.currentIndex][i], scope.twoNi));
			} else {
				w[j] = math.fraction(allSpecies[j].alleleFreq[allSpecies.currentIndex][i], scope.twoNi);
			};

            // Rescale p_i with the population size.
            x = math.fraction(w[j] * scope.ni);
            // 'y' is the sum of p_is.
            y = math.add(x, y);
            
            // Calculate the frequency of heterozygous individuals that have allele type 'i'
                // within the population (H_i).
            x = math.subtract(
                w[j], math.fraction(allSpecies[j].homozygousFreq[allSpecies.currentIndex][i], scope.ni)
            );
            x = math.multiply(scope.twoNi, x);

            // 'z' is the sum of H_is.
            z = math.add(x, z);
        };

        // 'pDot_i' is the average of the sample allele type 'i' frequencies over all samples.
        pDot = math.divide(y, scope.g);
        // 'hDot_i' is the frequency of heterozygous individuals that have allele type 'i',
            // averaged over all samples.
        hDot = math.divide(z, scope.g);

        x = 0, y = 0, z = 0;  // Refresh the local variables to work with.

        // Calculate the sample variance of allele type 'i'.
        for (j = 0; j < allSpecies.numOfPop; j++) {
            x = math.subtract(w[j], pDot); // p_i - pDot.
            y = math.multiply(scope.ni, math.square(x)); // n_i * (p_i - pDot)^2

            z = math.add(y, z);
        };
        sSq = math.divide(z, scope.h);

        
        // Push '0' into the 's1' and 's2' local arrays.
        s1.push(math.fraction(0)), s2.push(math.fraction(0));

        // Calculate 'pDot * (1 - pDot)'
        aSec = math.fraction(math.multiply(pDot, math.subtract(1, pDot)));

        // In order to get around Javascript's lack of precision with small numbers and
            // the library math.js inability to do it with incredibly small numbers.
            // We must multiply each s1 and s2 component by 10000000.

        s1[i] = math.fraction(math.multiply(10000000,
            // Refer to 'output_Initialise()' on which scope variable is what.
            sSq - (aSec - scope.b*sSq - hDot/4)/scope.a 
        ));
        
        s2[i] = math.fraction(math.multiply(10000000,
            // Refer to 'output_Initialise()' on which scope variable is what.
            aSec - scope.nBar*(scope.d*aSec - sSq*scope.e/scope.nBar - scope.f*hDot)/scope.c
        ));
    };

    x = 0, y = 0, z = 0; // Refresh the local variables to work with.

    // Calculate the coancestry coefficient.
    for (i = 0; i < alleles.getUprBound(); i++) {
        x = math.add(x, s1[i]);
        y = math.add(y, s2[i]);
    };
    if (y != 0) {
        z = math.divide(x, y);
    } else {
        // Note that a ratio of zeroes does imply that fixation has happened.
            // Hence why the Fst is set to 1.
        z = math.number(1);
    };
    
    // Add the fst into the corresponding DataTable.
    if (fst.data.getNumberOfRows() > allSpecies.genNumber) {
        fst.data.setValue(
            allSpecies.genNumber, 1, math.number(math.round(z, 6))
        );
    } else {
        fst.data.addRow(
            [allSpecies.genNumber + 1, math.number(math.round(z, 6))]
        );
    };
	
	// Flush the local arrays.
    s1.length = 0, s2.length = 0, w.length = 0;
	
    s1 = null, s2 = null, w = null, x = null, y = null, z = null, i = null,
	j = null, pDot = null, hDot = null, sSq = null, aSec = null;
};

// Timeout functionality to run the simulation routine.
function output_Interval() {
    if (allSpecies.genNumber >= timerVars.toGenNum || timerVars.toStop) {
        timerVars.toStop = false;
        timerVars.tickTock.stop();
        
        // Update the UI with the current generation information.
        output_genNum.html(allSpecies.genNumber - 1);
        output_fst.html(fst.data.getValue(allSpecies.genNumber - 2, 1));

        for (var x = 0; x < allSpecies.numOfPop; x++) {
            for (var y = 1; y <= alleles.getUprBound(); y++) {
                alleleFreq.data.setValue(x, y, allSpecies[x].alleleFreq[allSpecies.previousIndex][y - 1]);
                  alleleFreqChild.data.setValue(x, y, allSpecies[x].alleleFreq[allSpecies.currentIndex][y - 1]);
            };
        };
        alleleFreq.chart.draw(alleleFreq.view, alleleFreq.options);
          alleleFreqChild.chart.draw(alleleFreqChild.view, alleleFreqChild.options);

        // Draw the fst chart...
        fst.view.setRows(0, allSpecies.genNumber - 2);
        fst.dashboard.draw(fst.view);

        // Draw the indivAllele chart...
        indivAllele.chart.draw(allSpecies.previousIndex);

        // Manipulate the controls here to include the most recent FST calculations.
        fst.control.getState().range.end = allSpecies.genNumber - 1;

        // Re-enable UI buttons and disable the interruption button.
        output_simButtons.prop('disabled', false);
        output_interrupt.prop('disabled', true);
        paraMag_submit.prop('disabled', false);
		output_reset.prop('disabled', false);

        x = null, y = null;
    } else {
        if (allSpecies.genNumber == 0) { // Check if there is a new simulation routine.
            for (var i = 0; i < allSpecies.numOfPop; i++) {
				if (allSpecies[i] == null) { // If there isn't a species object, create one.
					allSpecies.push(new species()); 
				} else {
					allSpecies[i].recycle(); // If there is a species object, recycle it.
				};
                allSpecies[i].create(); // Initialise the species object.
            };
            allSpecies.fstCalc(); // Calculate the coancestry coefficient.
            allSpecies.genNumber += 1; // Increment which the generation number

            i = null;
        };

        // Shift the binary switch foward and copy and paste the generation at the previous index into the 
            // current index.
        allSpecies.previousIndex = allSpecies.currentIndex;
        allSpecies.currentIndex += 1;
	    allSpecies.currentIndex %= 2;
        for (var j = 0; j < allSpecies.numOfPop; j++) {
            allSpecies[j].populations[allSpecies.currentIndex] = allSpecies[j].populations[allSpecies.previousIndex].slice();
        };

        allSpecies.migrate();
        for ( j = 0; j < allSpecies.numOfPop; j++) {
            allSpecies[j].mate();
        };
		allSpecies.fstCalc(); // Calculate the coancestry coefficient.
        allSpecies.genNumber += 1; // Increment which the generation number

        // Update the progress bar and indicator.
        timerVars.progress = timerVars.progress + timerVars.increment;
        var a = Math.round(100 * timerVars.progress, 0),
            b = Math.round(timerVars.progressMax * timerVars.progress, 0);
        output_progressNumberChild.html(a);
        output_progressBar.css('width', b);

        a = null, b = null, j = null;
    };
};

// Launches a new simulation routine with the current parameters.
function output_Initialise(resetTrue = false) {
    // Disable the buttons which can begin the timer.
    output_simButtons.prop('disabled', true);
    paraMag_submit.prop('disabled', true);
	output_reset.prop('disabled', true);

    // Initialise independent parts of the simulation routine.
    alleles.setUprBound();
    allSpecies.genNumber = 0;
    allSpecies.numOfPop = parameters.numOfPop;
	allSpecies.currentIndex = 0; // Probably better noted as a binary switch variable. Allows
		// us to keep track on where generations are visulised in the app.
    allSpecies.previousIndex = 0;

    if (webpageLive) {
        // Clear the alleleFreq and the alleleFreqChild charts.
        alleleFreq.chart.clearChart();
        alleleFreqChild.chart.clearChart();

        fst.view.setRows(0, 0);

        if (!resetTrue) {
            // Only clear the fst chart if it is resetted with the 'Submit Parameters' button.
            fst.chart.getChart().clearChart();
        };
    } else {
        // Setup functionality for the simulation routine.
        allSpecies.migrate = migrate;
        allSpecies.fstCalc = fstCalc;

        // Create the DataTable, Chart, and DataView for the maximum number 
            // of populations and alleles. Do this for both the parent and child generations...
        alleleFreq.data = new google.visualization.DataTable();
          alleleFreqChild.data = new google.visualization.DataTable();
        alleleFreq.data.addColumn('string', 'Population');
          alleleFreqChild.data.addColumn('string', 'Population');
        for (var i = 0; i < alleles.getLabels(true).length; i++) {
            alleleFreq.data.addColumn('number', alleles.getLabels(true)[i]);
              alleleFreqChild.data.addColumn('number', alleles.getLabels(true)[i]);
        };
        var fill = [];
        for (i = 0; i < 10; i++) {
            fill.push([]);
            fill[i].push('#' + (i + 1));
            for (var j = 0; j < alleles.getLabels(true).length; j++) {
                fill[i].push(0);
            };
        };
        alleleFreq.data.addRows(fill);
          alleleFreqChild.data.addRows(fill);

        alleleFreq.view = new google.visualization.DataView(alleleFreq.data);
          alleleFreqChild.view = new google.visualization.DataView(alleleFreqChild.data);

        alleleFreq.chart = new google.visualization.ColumnChart(
            document.getElementById('output_alleleFreqChart')
        );
          alleleFreqChild.chart = new google.visualization.ColumnChart(
              document.getElementById('output_alleleFreqChartToo')
          );

        fill.length = 0; // Flush the local array.

        // Create the DataTable, DataView, Dashboard, Chart, Controls
            //and event triggers for the fst calculations
        fst.data = new google.visualization.DataTable();
        fst.data.addColumn('number', 'Generation');
        fst.data.addColumn('number', 'FST');

        fst.view = new google.visualization.DataView(fst.data);

        fst.chart = new google.visualization.ChartWrapper({
            chartType: 'LineChart',
            containerId: 'output_fstChart',
            options: fst.optionsChart
        });

        fst.dashboard = new google.visualization.Dashboard(
            document.getElementById('output_fstDashboard')
        );

        fst.control = new google.visualization.ControlWrapper({
            controlType: 'ChartRangeFilter',
            containerId: 'output_fstControl',
            options: fst.optionsControl
        });

        google.visualization.events.addListener(fst.control, 'statechange', controlAdjustment);

        function controlAdjustment(obj) {
            if (!obj.inProgress) {
                // Adjust the view window of fst.chart once the user has settled on a range to view.
                var bounds = fst.control.getState();
                fst.chart.setOption('hAxis.minValue', bounds.range.start);
                fst.chart.setOption('hAxis.maxValue', bounds.range.end);
                bounds = null;
            };
        };

        fst.dashboard.bind(fst.control, fst.chart);

        // Call the initialisation function to visualise the individual alleles and set up the
            // DataTable and DataView.
        indivAllele.chart = new indivAlleleChart(
          $('#output_iacBackground'), 
          $('#output_iacMidground'), 
          $('#output_iacForeground')
        );
        indivAllele.data = new google.visualization.DataTable();
        indivAllele.data.addColumn('number', 'MemberNo');
        indivAllele.data.addColumn('number', 'PopNo');
        indivAllele.data.addColumn('number', 'AllelePositionOne');
        indivAllele.data.addColumn('number', 'AllelePositionTwo');
        for (i = 0; i < 5000; i++) {
            fill.push([0, 0, 0, 0]);
        };
        indivAllele.data.addRows(fill);

        webpageLive = true; // The webpage has loaded, so no more initilisation code
                                // is required.

        fill.length = 0; // Flush the local array.

        fill = null, i = null, j = null;
    };

    // Subset the DataTable in 'alleleFreq.data' to visualise what is in the 
        // simulation routine. We load in the columns in reverse order to 
        // work around the native functionality of Google Charts.
    var toView = [0];
        for (var k = 0; k < alleles.getUprBound(); k++) {
            toView.push(alleles.getUprBound() - k);
        };
        alleleFreq.view.setColumns(toView);
          alleleFreqChild.view.setColumns(toView);
        alleleFreq.view.setRows(0, parameters.numOfPop - 1);
          alleleFreqChild.view.setRows(0, parameters.numOfPop - 1);
        
    toView.length = 0; //Flush the 'toView' array.

    // Draw the charts.
    alleleFreq.options.colors = alleles.getColors();
    alleleFreq.chart.draw(alleleFreq.view, alleleFreq.options);
      alleleFreqChild.options.colors = alleles.getColors();
      alleleFreqChild.chart.draw(alleleFreqChild.view, alleleFreqChild.options);
    fst.dashboard.draw(fst.view);
    indivAllele.chart.refresh();

    // Setup the Fst constants to reduce the number of math operations in the timer.
        // This can be done because the population sizes are fixed throughout the 
        // simulation routine.
    var x = 0, y = 0;
    for (var l = 0; l < parameters.numOfPop; l++) {
        x += parameters.popSize;
        y += parameters.popSize * parameters.popSize;
    };
	
    var
    // r = allSpecies.numOfPop
    // r - 1
        rMinusOne = allSpecies.numOfPop - 1,
    // (n_1 + . . . + n_r - [n_1^2 + . . . + n_r^2]/[n_1 + . . . + n_r])/(r - 1)
        nC = math.fraction(x - y/x, rMinusOne);

    // n_i
        scope.ni = parameters.popSize;
    // 2*n_i
        scope.twoNi = 2*parameters.popSize;
    // (n_1 + n_2 + . . . + n_r)/r
        scope.nBar = math.fraction(x, allSpecies.numOfPop);

    // nBar - 1
        scope.a = math.fraction(scope.nBar - 1); 
    // (r - 1)/1
        scope.b = math.fraction(rMinusOne, allSpecies.numOfPop); 
    // r*(nBar - 1)
        scope.c = math.fraction(allSpecies.numOfPop * scope.a); 
    // r*(nBar - nC)/nBar
        scope.d = math.fraction(allSpecies.numOfPop * (scope.nBar - nC) / scope.nBar); 
    // (nBar - 1)  + (r - 1)*(nBar - nC)        
        scope.e = math.fraction(scope.a + rMinusOne*(scope.nBar - nC));
    // (nBar - nC)/(4*nC^2)
        scope.f = math.fraction((scope.nBar - nC)/(4*math.square(nC)));
    // n_1 + n_2 + . . . + n_r
        scope.g = x; 
    // (r - 1)*nBar
        scope.h = math.fraction(rMinusOne * scope.nBar); 

    // Load into the simulation parameters into the corresponding <span>s.
    output_numOfPop.html(parameters.numOfPop);
    output_popSize.html(parameters.popSize);
    output_numOfAlleles.html(parameters.numOfAlleles);
    output_mutaDenom.html(parameters.mutationDenom);
    output_numOfMigrants.html(parameters.numOfMigrants);
    output_init.html(parameters.init);
    output_simRate.html(parameters.simRate/1000);

    // Start the timer to run the 'output_Interval()' function.
    timerVars.toGenNum = parameters.init;
    timerVars.tickTock.clear();
    timerVars.tickTock.bind(parameters.simRate, output_Interval);
    timerVars.tickTock.start();

    // Refresh the progress bar.
    timerVars.progress = 0;
        output_progressNumberChild.html(0);
        output_progressBar.css('width', 0);
    timerVars.increment = timerVars.progressMax / parameters.init / timerVars.progressMax;

    // Enable the interruption button.
    output_interrupt.prop('disabled', false);

    toView = null, k = null, x = null, y = null, l = null, rMinusOne = null, nC = null;
};

/* Setup global variables to refer to the HTML DOM elements for the Output Tab. */
var output_numOfPop = $('#output_numOfPop'),
	output_popSize = $('#output_popSize'),
	output_numOfAlleles = $('#output_numOfAlleles'),
	output_mutaDenom = $('#output_mutaDenom'),
	output_numOfMigrants = $('#output_numOfMigrants'),
	output_init = $('#output_init'),
	output_simRate = $('#output_simRate'),

	output_interrupt = $('#output_interrupt'),
	output_naviLBar = $('ul.output_ulL li'),
	output_naviLContent = $('.output_chartDim'),
	output_naviRBar = $('ul.output_ulR li'),
	output_naviRContent = $('.output_chartDimToo'),
	output_progressBar = $('#output_progressBar'),
	output_progressNumberChild = $('#output_progressNumberChild'),
	output_reset = $('#output_reset'),
	output_simButtons = $('.output_simButton'),
	
	output_genNum = $('#output_genNum'),
    output_fst = $('#output_fst'),
    output_fstDashboard = $('#output_fstDashboard');

/* jQuery event listeners for the Output Tab. */
$(document).ready(function(){

    // jQuery event listener to operate the left window toolbar.
    output_naviLBar.click(function(){
		var output_naviLItem = $(this),
			tab_id = output_naviLItem.attr('data-tab'); // Returns the tab to swap to.

        // Removes the visibility of the current tab.
		output_naviLBar.removeClass('current');
	    output_naviLContent.removeClass('current');

        // Gives visibility to the tab to swap to.
		output_naviLItem.addClass('current');
		$('#' + tab_id).addClass('current');

        output_naviLItem = null, tab_id = null;
	});

    // jQuery event listener to operate the right window toolbar.
    output_naviRBar.click(function(){
		var output_naviRItem = $(this),
			tab_id = output_naviRItem.attr('data-tab'); // Returns the tab to swap to.

        // Removes the visibility of the current tab.
		output_naviRBar.removeClass('current');
	    output_naviRContent.removeClass('current');

        // Gives visibility to the tab to swap to.
		output_naviRItem.addClass('current');
		$('#' + tab_id).addClass('current');

        output_naviRItem = null, tab_id = null;
	});


    // jQuery event listeners for the 'n =' buttons.
    output_simButtons.click(function() {
		var whichButton = $(this);
		
        // Disable the buttons which can begin the timer.
        output_simButtons.prop('disabled', true);
        paraMag_submit.prop('disabled', true);

        // Figure out how many generations to we need to simulate to.
        var howMany = whichButton.attr('howMany');
        if (howMany == 'output_simInput') {
            howMany = output_simInput.val();
        };

        var howManyChild = parseInt(howMany, 10);

        // Start the timer to run the 'output_Interval()' function.
        timerVars.toGenNum = howManyChild + allSpecies.genNumber;
        timerVars.tickTock.start();

        // Refresh the progress bar.
        timerVars.progress = 0;
            output_progressNumberChild.html(0);
            output_progressBar.css('width', 0);
        timerVars.increment = timerVars.progressMax / howMany / timerVars.progressMax;

        // Enable the interruption button.
        output_interrupt.prop('disabled', false);

        howMany = null, howManyChild = null, whichButton = null;
    });
	
	// jQuery event listener for the 'Reset' button.
	output_reset.click(function() {
        // First save the parameters specified in the parameters tab.
        var holdingPen = [parameters.numOfPop, parameters.popSize, parameters.numOfAlleles,
                parameters.mutationDenom, parameters.numOfMigrants, parameters.init,
                parameters.simRate];

		// Load in the current parameters before triggering output_Initialise.
		parameters.numOfPop = Number(output_numOfPop.html());
		parameters.popSize = Number(output_popSize.html());
		parameters.numOfAlleles = Number(output_numOfAlleles.html());
		parameters.mutationDenom = Number(output_mutaDenom.html());
		parameters.numOfMigrants = Number(output_numOfMigrants.html());
		parameters.init = Number(output_init.html());
		parameters.simRate = Number(output_simRate.html())*1000;
		
        // Starts a new simulation routine.
		output_Initialise(resetTrue = true); 

        // Reload the parameters specified in the parameters tab into the object.
        parameters.numOfPop = holdingPen[0];
		parameters.popSize = holdingPen[1];
		parameters.numOfAlleles = holdingPen[2];
		parameters.mutationDenom = holdingPen[3];
		parameters.numOfMigrants = holdingPen[4];
		parameters.init = holdingPen[5];
		parameters.simRate = holdingPen[6];

        // Flush the local array.
        holdingPen.length = 0;

        holdingPen = null;
	});

    // jQuery event listener for the 'n =' input.
    output_simInput.change(function() {
        var x = Math.floor(output_simInput.val());
        if (x < 1 || x > 1000 ) { // Current interval: [1, 1000]
            output_simInput.val(parameters.simInput);
        } else {
            parameters.simInput = x;
            if (x !=  output_simInput.val()) {
                output_simInput.val(parameters.simInput);
            };
        };

        x = null;
    });

    // jQuery event listener for the 'Interrupt Simulation' button.
    output_interrupt.click(function(){
        // Disable the interruption button to prevent multiple clicks.
        output_interrupt.prop('disabled', true);

        // Set the flag off to stop the simulation routine.
        timerVars.toStop = true; 
    });

});