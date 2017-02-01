/* Plugs in the initial parameters into the corresponding spans */
function parameters_Initialise() {
    $('#paraMag_numOfPop').val(parameters.numOfPop);
    $('#paraMag_popSize').val(parameters.popSize);
    $('#paraMag_numOfAlleles').val(parameters.numOfAlleles);
    $('#paraMag_mutaRate').val(parameters.mutationRate);
        $('#paraMag_mutaRateChild').val(parameters.mutationRate);
        $('#paraMag_mutaRateChildToo').text('1 in a '+ parameters.mutationRate);
    $('#paraMag_numOfMigrants').val(parameters.numOfMigrants);
        $('#paraMag_numOfMigrantsChild').text(parameters.popSize);
    $('#paraMag_init').val(parameters.init);
    $('#paraMag_simRate').val(parameters.simRate/1000);
        $('#paraMag_simRateChild').val(parameters.simRate/1000);
    
    // Setup parameters.simInput as well
    $('#output_simInput').val(parameters.simInput);
};

/* jQuery event listeners for the Parameters Tab */
$(document).ready(function(){

    /* jQuery event listener fopr the 'Submit Parameters' button */
    $('#paraMag_submit').click(function () {
        $('#dummy_Output').click(); // Forces a click on the toolbar's Output button
        output_Initialise(); // Starts a new simulation routine
    });

    /* jQuery event listener for the 'Show Detailed Information' checkbox */
    $('#paraMag_show').change(function() {
        if ($('#paraMag_show').is(':checked')) {
            $('.paraMag_Info').css({display: 'block'});
        } else {
            $('.paraMag_Info').css({display: 'none'});   
        };
    });

    /* jQuery event listener for the 'Number of Populations' input */
     $('#paraMag_numOfPop').change(function() {
        var x = Math.floor($(this).val());
        if (x < 1 || x > 10 ) {
            $('#paraMag_numOfPop').val(parameters.numOfPop);
        } else {
            parameters.numOfPop = x;
            if (x != $(this).val()) {
                $('#paraMag_numOfPop').val(parameters.numOfPop);
            };
        };
    });

    /* jQuery event listener for the 'Population Size' input */
     $('#paraMag_popSize').change(function() {
        var x = Math.floor($(this).val());
        if (x < 1 || x > 500 ) {
            $('#paraMag_popSize').val(parameters.popSize);
        } else {
            parameters.popSize = x;
            if (x != $(this).val()) {
                $('#paraMag_popSize').val(parameters.popSize);
            };
            $('#paraMag_numOfMigrantsChild').text(parameters.popSize);

            /* Double check if parameters.numOfMigrants < parameters.popSize */
            if (parameters.numOfMigrants > parameters.popSize) {
                parameters.numOfMigrants = parameters.popSize
                $('#paraMag_numOfMigrants').val(parameters.numOfMigrants);
            };
        };
    });

    /* jQuery event listener for the 'Number of Allele Types' input */
     $('#paraMag_numOfAlleles').change(function() {
        var x = Math.floor($(this).val());
        if (x < 1 || x > 8 ) {
            $('#paraMag_numOfAlleles').val(parameters.numOfAlleles);
        } else {
            parameters.numOfAlleles = x;
            if (x != $(this).val()) {
                $('#paraMag_numOfAlleles').val(parameters.numOfAlleles);
            };
        };
    });

    /* jQuery event listener for the 'Mutation Rate' input */
     $('#paraMag_mutaRate').change(function() {
        var x = Math.floor($(this).val());
        if (x < 1 || x > 1000) {
            $('#paraMag_mutaRate').val(parameters.mutationRate);
        } else {
            parameters.mutationRate = x;
            if (x != $(this).val()) {
                $('#paraMag_mutaRate').val(parameters.mutationRate);
            };
            $('#paraMag_mutaRateChild').val(x);
            /* if/else statement to detect when Mutation Rate == 0 to change the message accordingly */
            if (x == 0) {
                $('#paraMag_mutaRateChildToo').text('no');
            } else {
                $('#paraMag_mutaRateChildToo').text('1 in a '+x);
            };
        };
    });
    
    /* jQuery event listener for the 'Mutation Rate' slider */
    $('#paraMag_mutaRateChild').change(function() {
        var x = Math.floor($(this).val());
        parameters.mutationRate = x;
        $('#paraMag_mutaRate').val(x);
        /* if/else statement to detect when Mutation Rate == 0 to change the message accordingly */
        if (x == 0) {
            $('#paraMag_mutaRateChildToo').text('no');
        } else {
            $('#paraMag_mutaRateChildToo').text('1 in  a '+x);
        };
    });

    /* jQuery event listener for the 'Number of Migrants' input */
    /* #paraMag_numOfMigrantsChild is handled by the jQuery event listener for the 'Population Size' input */
     $('#paraMag_numOfMigrants').change(function() {
        var x = Math.floor($(this).val());
        if (x < 0 || x > parameters.popSize) {
            $('#paraMag_numOfMigrants').val(parameters.numOfMigrants);
        } else {
           parameters.numOfMigrants = x;
           if (x != $(this).val()) {
                $('#paraMag_numOfMigrants').val(parameters.numOfMigrants);
           };
        };
    });

    /* jQuery event listener for the 'Initial Number of Simulations' input */
     $('#paraMag_init').change(function() {
        var x = Math.floor($(this).val());
        if (x < 1 || x > 1000) {
            $('#paraMag_init').val(parameters.init);
        } else {
            parameters.init = x;
            if (x != $(this).val()) {
                $('#paraMag_init').val(parameters.init);
            };
        };
    });

    /* jQuery event listener for the 'Simulation Rate' input */
     $('#paraMag_simRate').change(function() {
        var x = $(this).val();
        if (x < 0.001 || x > 5) {
            $('#paraMag_simRate').val(parameters.simRate/1000);
        } else {
            parameters.simRate = x*1000;
            $('#paraMag_simRateChild').val(x);
        };
    });

    /* jQuery event listener for the 'Simulation Rate' slider */
    $('#paraMag_simRateChild').change(function() {
        var x = $(this).val();
        parameters.simRate = x*1000; // NB: Stored as an integer to prevent JS's precision error
        $('#paraMag_simRate').val(x);
    });

});