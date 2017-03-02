/* Setup global variables to refer to the <span>s and other HTML DOM elements for the Parameters tab. */
var paraMag_numOfPop = $('#paraMag_numOfPop'),
	paraMag_popSize = $('#paraMag_popSize'),
	paraMag_numOfAlleles = $('#paraMag_numOfAlleles'),
	paraMag_mutaDenom = $('#paraMag_mutaDenom'),
		paraMag_mutaDenomChild = $('#paraMag_mutaDenomChild'),
		paraMag_mutaDenomChildToo = $('#paraMag_mutaDenomChildToo'),
	paraMag_numOfMigrants = $('#paraMag_numOfMigrants'),
		paraMag_numOfMigrantsChild = $('#paraMag_numOfMigrantsChild'),
	paraMag_init = $('#paraMag_init'),
	paraMag_simRate = $('#paraMag_simRate'),
		paraMag_simRateChild = $('#paraMag_simRateChild'),
		
	dummy_output = $('#dummy_Output'),
	paraMag_info = $('.paraMag_Info'),
	paraMag_show = $('#paraMag_show'),
	paraMag_submit = $('#paraMag_submit'),
	output_simInput = $('#output_simInput');

/* Plugs in the initial parameters into the corresponding <span>s. */
function parameters_Initialise() {
    paraMag_numOfPop.val(parameters.numOfPop);
    paraMag_popSize.val(parameters.popSize);
    paraMag_numOfAlleles.val(parameters.numOfAlleles);
    paraMag_mutaDenom.val(parameters.mutationDenom);
        paraMag_mutaDenomChild.val(parameters.mutationDenom);
        paraMag_mutaDenomChildToo.html('1 in a '+ parameters.mutationDenom);
    paraMag_numOfMigrants.val(parameters.numOfMigrants);
        paraMag_numOfMigrantsChild.html(parameters.popSize - 2);
    paraMag_init.val(parameters.init);
    paraMag_simRate.val(parameters.simRate/1000);
        paraMag_simRateChild.val(parameters.simRate/1000);
    
    // Setup 'parameters.simInput' as well.
    output_simInput.val(parameters.simInput);
};

/* jQuery event listeners for the Parameters Tab. */
$(document).ready(function() {

    // jQuery event listener fopr the 'Submit Parameters' button.
    paraMag_submit.click(function () {
        setTimeout(function () {dummy_output.click();}, 50); // Forces a click on the toolbar's Output button.
        output_Initialise(); // Starts a new simulation routine.
    });

    // jQuery event listener for the 'Show Detailed Information' checkbox.
    paraMag_show.change(function() {
        if (paraMag_show.is(':checked')) {
            paraMag_info.css({display: 'block'});
        } else {
            paraMag_info.css({display: 'none'});   
        };
    });

    // jQuery event listener for the 'Number of Populations' input.
     paraMag_numOfPop.change(function() {
        var x = Math.floor(paraMag_numOfPop.val());
        if (x < 1 || x > 10 ) { // Current interval: [1, 10].
            paraMag_numOfPop.val(parameters.numOfPop);
        } else {
            parameters.numOfPop = x;
            if (x != paraMag_numOfPop.val()) {
                paraMag_numOfPop.val(parameters.numOfPop);
            };
        };

        x = null;
    });

    // jQuery event listener for the 'Population Size' input.
     paraMag_popSize.change(function() {
        var x = Math.floor(paraMag_popSize.val());
        if (x < 1 || x > 500 ) { // Current interval: [1, 500].
            paraMag_popSize.val(parameters.popSize);
        } else {
            parameters.popSize = x;
            if (x != paraMag_popSize.val()) {
                paraMag_popSize.val(parameters.popSize);
            };
            paraMag_numOfMigrantsChild.html(parameters.popSize - 2);

            // Double check if 'parameters.numOfMigrants' < 'parameters.popSize'.
            if (parameters.numOfMigrants > parameters.popSize - 2) {
                parameters.numOfMigrants = parameters.popSize - 2;
                paraMag_numOfMigrants.val(parameters.numOfMigrants);
            };
        };

        x = null;
    });

    // jQuery event listener for the 'Number of Allele Types' input.
    paraMag_numOfAlleles.change(function() {
        var x = Math.floor(paraMag_numOfAlleles.val());
        if (x < 1 || x > 8 ) { // Current interval: [1, 8]
            paraMag_numOfAlleles.val(parameters.numOfAlleles);
        } else {
            parameters.numOfAlleles = x;
            if (x != paraMag_numOfAlleles.val()) {
                paraMag_numOfAlleles.val(parameters.numOfAlleles);
            };
        };

        x = null;
    });

    // jQuery event listener for the 'Mutation Denominator' input.
    paraMag_mutaDenom.change(function() {
        var x = Math.floor(paraMag_mutaDenom.val());
        if (x < 0 || x > 1000) { // Current interval: [0, 1000]
            paraMag_mutaDenom.val(parameters.mutationDenom);
        } else {
            parameters.mutationDenom = x;
            if (x != paraMag_mutaDenom.val()) {
                paraMag_mutaDenom.val(parameters.mutationDenom);
            };
            paraMag_mutaDenomChild.val(x);
            // if/else statement to detect when Mutation Denominator == 0 to change the 
                // message accordingly.
            if (x == 0) {
                paraMag_mutaDenomChildToo.html('no');
            } else {
                paraMag_mutaDenomChildToo.html('1 in a ' + x);
            };
        };

        x = null;
    });
    
    // jQuery event listener for the 'Mutation Denominator' slider.
    paraMag_mutaDenomChild.change(function() {
        var x = Math.floor(paraMag_mutaDenomChild.val());
        parameters.mutationDenom = x;
        paraMag_mutaDenom.val(x);
        // if/else statement to detect when Mutation Denominator == 0 to change the 
            // message accordingly.
        if (x == 0) {
            paraMag_mutaDenomChildToo.html('no');
        } else {
            paraMag_mutaDenomChildToo.html('1 in a ' + x);
        };

        x = null;
    });

    // jQuery event listener for the 'Number of Migrants' input.
    // '#paraMag_numOfMigrantsChild' is handled by the jQuery event listener for the 
        // 'Population Size' input.
     paraMag_numOfMigrants.change(function() {
        var x = Math.floor(paraMag_numOfMigrants.val());
        if (x < 0 || x > parameters.popSize - 2) { // Current interval: [0, popSize - 2]
            paraMag_numOfMigrants.val(parameters.numOfMigrants);
        } else {
           parameters.numOfMigrants = x;
           if (x != paraMag_numOfMigrants.val()) {
                paraMag_numOfMigrants.val(parameters.numOfMigrants);
           };
        };

        x = null;
    });

    // jQuery event listener for the 'Initial Number of Simulations' input.
    paraMag_init.change(function() {
        var x = Math.floor(paraMag_init.val());
        if (x < 1 || x > 1000) { // Current interval: [1, 1000]
            paraMag_init.val(parameters.init);
        } else {
            parameters.init = x;
            if (x != paraMag_init.val()) {
                paraMag_init.val(parameters.init);
            };
        };

        x = null;
    });

    // jQuery event listener for the 'Simulation Rate' input.
    paraMag_simRate.change(function() {
        var x = paraMag_simRate.val();
        if (x < 0.01 || x > 2) { // Current interval: [0.01, 2]
            paraMag_simRate.val(parameters.simRate / 1000);
        } else {
            parameters.simRate = x * 1000; // NB: Stored as an integer to prevent JS's 
                                               // precision  error.
            paraMag_simRateChild.val(x);
        };

        x = null;
    });

    // jQuery event listener for the 'Simulation Rate' slider/
    paraMag_simRateChild.change(function() {
        var x = paraMag_simRateChild.val();
        parameters.simRate = x * 1000; // NB: Stored as an integer to prevent JS's 
                                           // precision  error.
        paraMag_simRate.val(x);

        x = null;
    });

});