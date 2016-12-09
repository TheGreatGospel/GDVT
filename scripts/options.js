function options_Validate() {
    var errorMsg = "";
    var inpObj = {
        popSize: parseInt($("#options_popSize").val(), 10),
        numOfPop: parseInt($("#options_numOfPop").val(), 10),
        init: parseInt($("#options_init").val(), 10)
    };

    errorMsg += conditionHack(isNaN(inpObj.popSize),
        "The \"Population Size\" has an invalid input! <br>",
        inpObj.popSize < 50 || inpObj.popSize > 500,
        "The \"Population Size\" has an invalid input! <br>");
    
    errorMsg += conditionHack(isNaN(inpObj.numOfPop),
        "The \"Number of Populations\" has an invalid input! <br>",
        inpObj.numOfPop < 1 || inpObj.numOfPop > 10,
        "The \"Number of Populations\" has an invalid input! <br>");
    
    errorMsg += conditionHack(isNaN(inpObj.init),
        "The \"Initial Number of Simulations\" has an invalid input! <br>",
        inpObj.init < 1,
        "The \"Initial Number of Simulations\" has an invalid input! <br>");

    if (errorMsg === "") {
        settings = inpObj;
        loadSimulation();
    } else {
        alert(errorMsg);
    }
}

/*
document.getElementById("demo").innerHTML =  typeof inpObj.popSize + " " +
    typeof inpObj.numOfPop + " " + typeof inpObj.init + "<br>" + 
    inpObj.popSize + " " + inpObj.numOfPop + " " + inpObj.init;
document.getElementById("demo2").innerHTML = "hi <br>" + errorMsg;
*/