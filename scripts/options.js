function options_Initialise() {
    $('#paraMag_numOfPop').val(settings.numOfPop);
    $('#paraMag_popSize').val(settings.popSize);
    $('#paraMag_numOfAlleles').val(settings.numOfAlleles);
    $('#paraMag_mutaRate').val(settings.mutationRate);
        $('#paraMag_mutaRateChild').val(settings.mutationRate);
        $('#paraMag_mutaRateChildToo').text("1 in a "+ settings.mutationRate);
    $('#paraMag_numOfMigrants').val(settings.numOfMigrants);
        $('#paraMag_numOfMigrantsChild').text(settings.popSize);
    $('#paraMag_init').val(settings.init);
    $('#paraMag_simRate').val(settings.simRate/100);
        $('#paraMag_simRateChild').val(settings.simRate/100);
};

$(document).ready(function(){

    /* jQuery event listener fopr the "Submit Parameters" button */
    $("#paraMag_submit").click(function () {
        $("#dummy_Output").click(); // Forces a click on the toolbar's Output button

    });

    /* jQuery event listener for the "Show Detailed Information" checkbox */
    $('#paraMag_show').change(function() {
        if ($('#paraMag_show').is(':checked')) {
            $('.paraMag_Info').css({display: 'block'});
        } else {
            $('.paraMag_Info').css({display: 'none'});   
        };
    });

    /* jQuery event listener for the "Number of Populations" input */
     $('#paraMag_numOfPop').change(function() {
        var x = $(this).val();
        if (x < 1 || x > 10 ) {
            $('#paraMag_numOfPop').val(settings.numOfPop);
        } else {
            settings.numOfPop = x;
        };
    });

    /* jQuery event listener for the "Population Size" input */
     $('#paraMag_popSize').change(function() {
        var x = $(this).val();
        if (x < 1 || x > 500 ) {
            $('#paraMag_popSize').val(settings.popSize);
        } else {
            settings.popSize = x;
            $('#paraMag_numOfMigrantsChild').text(settings.popSize);

            /* Double check if settings.numOfMigrants < settings.popSize */
            if (settings.numOfMigrants > settings.popSize) {
                settings.numOfMigrants = settings.popSize
                $('#paraMag_numOfMigrants').val(settings.numOfMigrants);
            };
        };
    });

    /* jQuery event listener for the "Number of Allele Types" input */
     $('#paraMag_numOfAlleles').change(function() {
        var x = $(this).val();
        if (x < 1 || x > 8 ) {
            $('#paraMag_numOfAlleles').val(settings.numOfAlleles);
        } else {
            settings.numOfAlleles = x;
        };
    });

    /* jQuery event listener for the "Mutation Rate" input */
     $('#paraMag_mutaRate').change(function() {
        var x = $(this).val();
        if (x < 1 || x > 1000) {
            $('#paraMag_mutaRate').val(settings.mutationRate);
        } else {
            settings.mutationRate = x;
            $('#paraMag_mutaRateChild').val(x);
            /* if/else statement to detect when Mutation Rate == 0 to change the message accordingly */
            if (x == 0) {
                $('#paraMag_mutaRateChildToo').text("no");
            } else {
                $('#paraMag_mutaRateChildToo').text("1 in a "+x);
            };
        };
    });
    
    /* jQuery event listener for the "Mutation Rate" slider */
    $('#paraMag_mutaRateChild').change(function() {
        var x = $(this).val();
        settings.mutationRate = x;
        $('#paraMag_mutaRate').val(x);
        /* if/else statement to detect when Mutation Rate == 0 to change the message accordingly */
        if (x == 0) {
            $('#paraMag_mutaRateChildToo').text("no");
        } else {
            $('#paraMag_mutaRateChildToo').text("1 in  a "+x);
        };
    });

    /* jQuery event listener for the "Number of Migrants" input */
    /* #paraMag_numOfMigrantsChild is handled by the jQuery event listener for the "Population Size" input */
     $('#paraMag_numOfMigrants').change(function() {
        var x = $(this).val();
        if (x < 0 || x > settings.popSize) {
            $('#paraMag_numOfMigrants').val(settings.numOfMigrants);
        } else {
           settings.numOfMigrants = x;
        };
    });

    /* jQuery event listener for the "Initial Number of Simulations" input */
     $('#paraMag_init').change(function() {
        var x = $(this).val();
        if (x < 1 || x > 1000) {
            $('#paraMag_init').val(settings.init);
        } else {
            settings.init = x;
        };
    });

    /* jQuery event listener for the "Simulation Rate" input */
     $('#paraMag_simRate').change(function() {
        var x = $(this).val();
        if (x < 0.01 || x > 5) {
            $('#paraMag_simRate').val(settings.simRate/100);
        } else {
            settings.simRate = x*100;
            $('#paraMag_simRateChild').val(x);
        };
    });

    /* jQuery event listener for the "Simulation Rate" slider */
    $('#paraMag_simRateChild').change(function() {
        var x = $(this).val();
        settings.simRate = x*100; // NB: Stored as an integer to prevent JS's precision error
        $('#paraMag_simRate').val(x);
    });

});