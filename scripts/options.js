function options_Load() {
    $("#option_popSize").val(settings.popSize);
    $("#option_numOfPop").val(settings.numOfPop);
    $("#option_numOfAlleles").val(settings.numOfAlleles);
    $("#option_init").val(settings.init);
};

$('#option_popSize').on("focusout", function() {
    var x = $(this);
    if (x.val() < 50 || x.val() > 500) {
        x.val(settings.popSize);
        x.css({backgroundColor: "#ffff99"});
        x.animate({backgroundColor: "#fffff0"}, 1000);
    } else {
        settings.popSize = parseInt(x.val());
    }
});

$('#option_numOfPop').on("focusout", function() {
    var x = $(this);
    if (x.val() < 1 || x.val() > 10) {
        x.val(settings.numOfPop);
        x.css({backgroundColor: "#ffff99"});
        x.animate({backgroundColor: "#fffff0"}, 1000);
    } else {
        settings.numOfPop = parseInt(x.val());
    }
});

$('#option_numOfAlleles').on("focusout", function() {
    var x = $(this);
    if (x.val() < 2 || x.val() > 8) {
        x.val(settings.numOfAlleles);
        x.css({backgroundColor: "#ffff99"});
        x.animate({backgroundColor: "#fffff0"}, 1000);
    } else {
        settings.numOfAlleles = parseInt(x.val());
    }
});

$('#option_init').on("focusout", function() {
    var x = $(this);
    if (x.val() < 1 || x.val() > 1000) {
        x.val(settings.init);
        x.css({backgroundColor: "#ffff99"});
        x.animate({backgroundColor: "#fffff0"}, 1000);
    } else {
        settings.init = parseInt(x.val());
    }
});

$("#options_simStart").click(function () {
    $("#jsBody_Options").css({display: "none"});
    $("#jsBody_Simulation").css({display: "inline"});

    simulation_Load();    
});