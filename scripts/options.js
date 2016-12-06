function loadOptions() {
    $("#jsBody").load("dynamicPages/options.html");
}

function options_Validate() {
    var inpObj = {
        popSize: $("#options_popSize").val(),
        numOfPop: $("#options_numOfPop").val(),
        init: $("#options_init").val()
    };

    document.getElementById("demo").innerHTML =  JSON.stringify(inpObj);
}
